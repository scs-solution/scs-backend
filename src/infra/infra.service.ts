import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { InfraRepository } from './infra.repository';
import { InfraDescription } from './types/infra.desc';

@Injectable()
export class InfraService {
  constructor(private readonly infraRepository: InfraRepository) {}

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
}
