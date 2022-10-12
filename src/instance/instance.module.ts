import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Infra } from 'src/infra/entities/infra.entity';
import { InfraRepository } from 'src/infra/infra.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Infra])],
  providers: [InfraRepository, InstanceService],
  controllers: [InstanceController],
})
export class InstanceModule {}
