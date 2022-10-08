import { Injectable } from '@nestjs/common';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(
    dto: UserRegisterDTO,
  ): Promise<{ ok: boolean; err?: string }> {
    try {
      await this.userRepository.createUser(dto);
      return { ok: true };
    } catch (e) {
      return { ok: false, err: e };
    }
  }
}
