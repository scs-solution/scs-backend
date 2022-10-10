import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Infra } from './entities/infra.entity';
import { InfraController } from './infra.controller';
import { InfraService } from './infra.service';

@Module({
  imports: [TypeOrmModule.forFeature([Infra])],
  controllers: [InfraController],
  providers: [InfraService],
})
export class InfraModule {}
