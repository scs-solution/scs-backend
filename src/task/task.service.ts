import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InstanceRepository } from 'src/instance/instance.repository';

@Injectable()
export class TaskService {
  constructor(private readonly instanceRepository: InstanceRepository) {}

  @Cron('*/5 * * * *')
  async createAMIJob() {
    Logger.log('[CRON] Create AMI');

    const instances = await this.instanceRepository.find();

    for (const instance of instances) {
      Logger.log(`[CRON] AMI Target ${instance.instanceId}`);
    }
  }
}
