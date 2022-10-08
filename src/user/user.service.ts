import { Injectable } from '@nestjs/common';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(
    userRegisterDTO: UserRegisterDTO,
  ): Promise<{ ok: boolean }> {
    return { ok: true };
  }
}
