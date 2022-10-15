import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { InfraUpdateDto } from './dtos/infra-update.dtos';
import { InfraRepository } from './infra.repository';
import { InfraDescription } from './types/infra.desc';
import { InfraInstance } from './types/infra.instance';

@Injectable()
export class InfraService {
  private infraUpdateKey: string;

  constructor(
    private readonly infraRepository: InfraRepository,
    private readonly configService: ConfigService,
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
      instanceMap[e.name] = e;
    });

    dto.instances.forEach((e) => {
      instanceMap[e.name].instanceId = e.instanceId;
      instanceMap[e.name].privateIp = e.privateIp;
      instanceMap[e.name].publicIp = e.publicIp;
    });

    infra.desc = JSON.stringify(infraDesc);

    await this.infraRepository.save(infra);
  }
}
