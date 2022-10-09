import { Injectable } from '@nestjs/common';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserRepository } from './user.repository';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';

const s3 = new AWS.S3({ useAccelerateEndpoint: true });

@Injectable()
export class UserService {
  private keyPairS3Buket: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.keyPairS3Buket = this.configService.get<string>('S3_KEYPAIR_BUCKET');
  }

  async registerUser(
    dto: UserRegisterDTO,
  ): Promise<{ ok: boolean; err?: string }> {
    try {
      const { fn, url } = await this.getPresignedUrl();

      await this.userRepository.createUser(dto, fn);

      this.appendCreatePrivateKey(dto.userId, fn, url);
      return { ok: true };
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  private async getPresignedUrl(): Promise<{ fn: string; url: string }> {
    const fileName = `${uuid()}.key`;

    const params = {
      Bucket: this.keyPairS3Buket,
      Key: fileName,
      Expires: 3600,
      ContentType: 'text/plain',
      ACL: 'private',
    };

    const s3Url = await s3.getSignedUrlPromise('putObject', params);

    return { fn: fileName, url: s3Url };
  }

  private appendCreatePrivateKey(userId: string, fn: string, url: string) {
    exec(`./script/create-ssh-keypair ${userId} ${fn} ${url}`);
  }
}
