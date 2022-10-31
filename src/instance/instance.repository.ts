import { Injectable } from '@nestjs/common';
import { Infra } from 'src/infra/entities/infra.entity';
import { DataSource, Repository } from 'typeorm';
import { Instance } from './entities/instance.entity';

@Injectable()
export class InstanceRepository extends Repository<Instance> {
  constructor(private dataSource: DataSource) {
    super(Instance, dataSource.createEntityManager());
  }

  async createInstance(infra: Infra, instanceId: string): Promise<Instance> {
    const instance = this.create({ infra, instanceId });
    try {
      await this.save(instance);
      return instance;
    } catch (error) {
      throw new Error(error);
    }
  }
}
