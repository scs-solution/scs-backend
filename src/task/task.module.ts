import { Module } from '@nestjs/common';
import { InstanceRepository } from 'src/instance/instance.repository';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, InstanceRepository],
})
export class TaskModule {}
