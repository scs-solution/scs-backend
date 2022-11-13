import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { InfraRepository } from 'src/infra/infra.repository';

@Module({
  providers: [MonitorService, InfraRepository],
  controllers: [MonitorController],
})
export class MonitorModule {}
