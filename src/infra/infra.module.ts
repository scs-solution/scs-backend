import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstanceRepository } from 'src/instance/instance.repository';
import { Infra } from './entities/infra.entity';
import { InfraController } from './infra.controller';
import { InfraRepository } from './infra.repository';
import { InfraService } from './infra.service';

@Module({
  imports: [TypeOrmModule.forFeature([Infra])],
  controllers: [InfraController],
  providers: [InfraRepository, InfraService, InstanceRepository],
})
export class InfraModule {}
