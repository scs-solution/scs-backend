import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';

@Module({
  providers: [InstanceService],
  controllers: [InstanceController]
})
export class InstanceModule {}
