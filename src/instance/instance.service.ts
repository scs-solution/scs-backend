import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class InstanceService {
  private infraUpdateKey: string;

  constructor(
    private readonly infraRespository: InfraRepository,
    private readonly configService: ConfigService,
  ) {
    this.infraUpdateKey = this.configService.get<string>('INFRA_UPDATE_KEY');
  }

  async createNewInstance(
    user: User,
    dto: InstanceCreateDto,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      // TODO: apply redis distributed lock
      const { name, infraName, instanceSpec, instanceType } = dto;

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
    console.log(privateKey);
    console.log(JSON.stringify(desc));
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
        console.log(err);
      });
  }
}
