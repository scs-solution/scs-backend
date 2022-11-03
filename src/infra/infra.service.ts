import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstanceRepository } from 'src/instance/instance.repository';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { InfraUpdateDto } from './dtos/infra-update.dtos';
import { Infra } from './entities/infra.entity';
import { InfraRepository } from './infra.repository';
import { InfraDescription } from './types/infra.desc';
import { InfraInstance } from './types/infra.instance';

@Injectable()
export class InfraService {
  private infraUpdateKey: string;

  constructor(
    private readonly infraRepository: InfraRepository,
    private readonly configService: ConfigService,
    private readonly instanceRepository: InstanceRepository,
  ) {
    this.infraUpdateKey = this.configService.get<string>('INFRA_UPDATE_KEY');
  }

  async createInfra(
    user: User,
    dto: InfraCreateDto,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      if (await this.infraRepository.isInfraExists(dto.name))
        throw new UnauthorizedException('infra name already exists');

      const infraDesc: InfraDescription = {
        name: dto.name,
      };

      await this.infraRepository.createInfra(dto, infraDesc, user);

      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  async listInfra(
    user: User,
  ): Promise<{ ok: boolean; error?: string; result?: string[] }> {
    try {
      const infras = await this.infraRepository.find({
        select: {
          name: true,
        },
        where: [
          {
            user: { id: user.id },
          },
        ],
      });
      const result = infras.map((e) => e.name);

      return { ok: true, result: result };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  async updateInfra(dto: InfraUpdateDto): Promise<void> {
    if (dto.instances === null) return;

    if (dto.updateKey !== this.infraUpdateKey) return;

    const infra = await this.infraRepository.findOneBy({
      name: dto.infraName,
    });

    const infraDesc: InfraDescription = JSON.parse(infra.desc);

    const instanceMap: { [id: string]: InfraInstance } = {};

    infraDesc.instances.forEach((e) => {
      e.status = 'terminated';
      instanceMap[e.name] = e;
    });

    dto.instances.forEach((e) => {
      const name = e.name.split('-', 1)[1];
      instanceMap[name].instanceId = e.instanceId;
      instanceMap[name].privateIp = e.privateIp;
      instanceMap[name].publicIp = e.publicIp;
      instanceMap[name].status = 'start';
    });

    infra.desc = JSON.stringify(infraDesc);

    await this.infraRepository.save(infra);

    await this.updateInstances(dto, infra);
  }

  private async updateInstances(
    dto: InfraUpdateDto,
    infra: Infra,
  ): Promise<void> {
    const instances = await this.instanceRepository.findBy({
      infraId: infra.id,
    });

    const instanceExistsMap = {};

    instances.forEach((value) => {
      instanceExistsMap[value.instanceId] = 1;
    });

    const instanceMustInserted: string[] = [];

    dto.instances.forEach((e) => {
      if (
        instanceExistsMap[e.instanceId] === undefined ||
        instanceExistsMap[e.instanceId] !== 1
      ) {
        instanceMustInserted.push(e.instanceId);
      }
    });

    for (const instanceId of instanceMustInserted) {
      await this.instanceRepository.createInstance(infra, instanceId);
    }
  }
}
