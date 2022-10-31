import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Infra } from 'src/infra/entities/infra.entity';
import { InfraRepository } from 'src/infra/infra.repository';
import { InstanceRepository } from './instance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Infra])],
  providers: [InfraRepository, InstanceRepository, InstanceService],
  controllers: [InstanceController],
})
export class InstanceModule {}
