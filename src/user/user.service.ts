import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserRepository } from './user.repository';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import axios from 'axios';

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

      if (await this.userRepository.isUserExists(dto.userId))
        throw new UnauthorizedException('user id already exists');

      await this.appendCreatePrivateKey(dto.userId, fn, url);

      await this.userRepository.createUser(dto, fn);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, err: e };
    }
  }

  private async getPresignedUrl(): Promise<{ fn: string; url: string }> {
    const fileName = `${uuid()}.key`;

    const params = {
      Bucket: 'scs-user-pks',
      Key: fileName,
      Expires: 3600,
      ContentType: 'text/plain',
      ACL: 'private',
    };

    const s3 = new AWS.S3({
      useAccelerateEndpoint: true,
      signatureVersion: 'v4',
      region: 'ap-northeast-2',
    });

    const s3Url = await s3.getSignedUrlPromise('putObject', params);

    return { fn: fileName, url: s3Url };
  }

  private async appendCreatePrivateKey(
    userId: string,
    fn: string,
    url: string,
  ): Promise<void> {
    console.log(userId);
    console.log(fn);
    console.log(url);
    await axios
      .post('http://172.17.0.1:3001/create-ssh-keypair', {
        userId,
        fn,
        url,
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}
