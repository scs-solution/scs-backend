import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Instance } from 'src/instance/entities/instance.entity';
import { InstanceRepository } from 'src/instance/instance.repository';

@Injectable()
export class TaskService {
  private infraUpdateKey: string;

  constructor(
    private readonly instanceRepository: InstanceRepository,
    private readonly configService: ConfigService,
  ) {
    this.infraUpdateKey = this.configService.get<string>('INFRA_UPDATE_KEY');
  }

  @Cron('*/5 * * * *')
  async createAMIJob() {
    Logger.log('[CRON] Create AMI');

    const instances = await this.instanceRepository.find();

    for (const instance of instances) {
      await this.createAMI(instance);
    }
  }

  private async createAMI(instance: Instance): Promise<void> {
    Logger.log(
      `create-ami\ninstance: ${JSON.stringify(instance)}\nupdateKey: ${
        this.infraUpdateKey
      }`,
    );
    await axios
      .create({
        timeout: 30000,
      })
      .post('http://172.17.0.1:3001/create-ami', {
        instanceId: instance.id,
        age: instance.age,
        updateKey: this.infraUpdateKey,
      })
      .catch(function (err) {
        Logger.error(`create-ami\n${err}`);
      });
  }
}
