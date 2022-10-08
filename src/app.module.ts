import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MySQLConfigModule } from './config/config.module';
import { MySQLConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { InfraModule } from './infra/infra.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.dev.env'
          : process.env.NODE_ENV === 'prod'
          ? '.prod.env'
          : '.test.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DB: Joi.string().required(),
        ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [MySQLConfigModule],
      useClass: MySQLConfigService,
      inject: [MySQLConfigService],
    }),

    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'ap-northeast-2',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        signatureVersion: 's3v4',
      },
      services: [S3],
    }),

    UserModule,
    ConfigModule,
    InfraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
