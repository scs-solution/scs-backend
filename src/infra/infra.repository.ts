import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { Infra } from './entities/infra.entity';
import { InfraDescription } from './types/infra.desc';

@Injectable()
export class InfraRepository extends Repository<Infra> {
  constructor(private dataSource: DataSource) {
    super(Infra, dataSource.createEntityManager());
  }

  async isInfraExists(name: string): Promise<boolean> {
    return (
      (await this.findOneBy({
        name,
      })) !== null
    );
  }

  async createInfra(
    dto: InfraCreateDto,
    desc: InfraDescription,
    user: User,
  ): Promise<Infra> {
    const { name } = dto;
    const infra = this.create({ name, desc: JSON.stringify(desc), user });
    try {
      await this.save(infra);
      return infra;
    } catch (error) {
      throw new Error(error);
    }
  }
}
