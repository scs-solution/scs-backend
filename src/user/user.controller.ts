import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserRegisterDTO } from './dtos/user-register.dtos';
import { UserService } from './user.service';
import { Request, Response } from 'express';

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
}
