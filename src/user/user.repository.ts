import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(dto: UserRegisterDTO, privateKey: string): Promise<User> {
    const { userId, password } = dto;

    const checkUser = await this.findOneBy({ userId });
    if (checkUser) throw new UnauthorizedException('user id already exists');

    const user = this.create({ userId, password, privateKey });
    try {
      await this.save(user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
