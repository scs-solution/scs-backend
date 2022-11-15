import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: 'Register User' })
  @ApiCreatedResponse({ description: '' })
  async createRegister(
    @Body() dto: UserRegisterDTO,
  ): Promise<{ ok: boolean; error?: string }> {
    return await this.userService.registerUser(dto);
  }

  @Get('/pk')
  @UseGuards(AccessTokenGuard)
  async getPrivateKey(@CurrentUser() currentUser: User): Promise<string> {
    return await this.userService.getPrivateKey(currentUser);
  }
}
