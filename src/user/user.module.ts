import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { customUserRepositoryMethods, UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        // Override default repository for User with a custom one
        return dataSource
          .getRepository(User)
          .extend(customUserRepositoryMethods);
      },
    },
    UserService,
  ],
})
export class UserModule {}
