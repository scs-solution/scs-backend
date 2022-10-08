import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { User } from './entities/user.entity';

export interface UserRepository extends Repository<User> {
  this: Repository<User>;

  createUser(dto: UserRegisterDTO, privateKey: string): Promise<User>;
}

export const customUserRepositoryMethods: Pick<UserRepository, 'createUser'> = {
  async createUser(dto: UserRegisterDTO, privateKey: string): Promise<User> {
    const { userId, password } = dto;

    const checkUser = await this.findOne({ userId });
    if (checkUser) throw new UnauthorizedException('user id already exists');

    const user = this.create({ userId, password, privateKey });
    try {
      await this.save(user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};
