import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Infra } from 'src/infra/entities/infra.entity';
import { InfraRepository } from 'src/infra/infra.repository';
import { InfraDescription } from 'src/infra/types/infra.desc';
import { InfraInstance } from 'src/infra/types/infra.instance';
import { User } from 'src/user/entities/user.entity';
import { InstanceCreateDto } from './dtos/instance-create.dtos';
import { ReceiveSnsEventDto } from './dtos/receive-sns-event.dtos';
import { InstanceRepository } from './instance.repository';
import { AWSEventBridgeEvent } from './model/aws-event.model';

@Injectable()
export class InstanceService {
  private infraUpdateKey: string;

  constructor(
    private readonly infraRespository: InfraRepository,
    private readonly configService: ConfigService,
    private readonly instanceRepository: InstanceRepository,
  ) {
    this.infraUpdateKey = this.configService.get<string>('INFRA_UPDATE_KEY');
  }

  async createNewInstance(
    user: User,
    dto: InstanceCreateDto,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      Logger.log(
        `create-new-instance\nuser: ${JSON.stringify(
          user,
        )}\ndto: ${JSON.stringify(dto)}`,
      );

      // TODO: apply redis distributed lock
      const { name, infraName, instanceSpec, instanceType, initialDesc } = dto;

      const infra = await this.getAndCheckInfra(user, infraName);
      const infraDesc: InfraDescription = JSON.parse(infra.desc);

      if (
        infraDesc.instances &&
        infraDesc.instances.some((e) => e.name === dto.name)
      ) {
        throw new BadRequestException('Instance name is already exists!');
      }

      const instance: InfraInstance = {
        name,
        instanceSpec,
        instanceType,
        initialDesc: JSON.stringify(initialDesc),
        status: 'pending',
      };

      if (!infraDesc.instances) {
        infraDesc.instances = [];
      }

      infraDesc.instances.push(instance);

      infra.desc = JSON.stringify(infraDesc);

      await this.infraRespository.save(infra);

      this.applyInfra(user.privateKey, infraDesc);

      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  async getAndCheckInfra(user: User, infraName: string): Promise<Infra> {
    const infra = await this.infraRespository.findOneBy({
      name: infraName,
    });

    if (!infra || infra.userId !== user.id) {
      throw new UnauthorizedException(
        'Infra does not exist or different owner',
      );
    }

    return infra;
  }

  private async applyInfra(
    privateKey: string,
    desc: InfraDescription,
  ): Promise<void> {
    Logger.log(
      `apply-infra\ndesc: ${JSON.stringify(desc)}\nprivateKey: ${
        privateKey.split('.')[0]
      }\nupdateKey: ${this.infraUpdateKey}`,
    );
    await axios
      .create({
        timeout: 30000,
      })
      .post('http://172.17.0.1:3001/apply-infra', {
        desc: desc,
        privateKey: privateKey.split('.')[0],
        updateKey: this.infraUpdateKey,
      })
      .catch(function (err) {
        Logger.error(`apply-infra\n${err}`);
      });
  }

  async receiveSnsEvent(e: ReceiveSnsEventDto) {
    const message = JSON.parse(e.Message) as AWSEventBridgeEvent;

    // We are only handle EC2 Spot Instance Interruption Warning
    if (!message['detail-type'].includes('Interruption')) return;
    if (message.detail['instance-action'] != 'terminate') return;

    const targetInstanceId = message.detail['instance-id'];

    // handle will terminated instance
    const instance = await this.instanceRepository.findOne({
      where: {
        instanceId: targetInstanceId,
      },
      relations: {
        infra: {
          user: true,
        },
      },
    });

    const infra = instance.infra;
    const infraDesc: InfraDescription = JSON.parse(infra.desc);

    await axios
      .create({
        timeout: 30000,
      })
      .post('http://172.17.0.1:3001/handle-spot-termination', {
        target: targetInstanceId,
        desc: infraDesc,
        privateKey: infra.user.privateKey.split('.')[0],
        updateKey: this.infraUpdateKey,
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}
