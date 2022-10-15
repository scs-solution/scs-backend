import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { InfraUpdateDto } from './dtos/infra-update.dtos';
import { InfraService } from './infra.service';

@Controller('infra')
export class InfraController {
  constructor(private readonly infraService: InfraService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createInfra(
    @CurrentUser() currentUser: User,
    @Body() dto: InfraCreateDto,
  ): Promise<{ ok: boolean; error?: string }> {
    return await this.infraService.createInfra(currentUser, dto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getInfraList(
    @CurrentUser() currentUser: User,
  ): Promise<{ ok: boolean; error?: string; result?: string[] }> {
    return await this.infraService.listInfra(currentUser);
  }

  @Put()
  updateInfra(@Body() dto: InfraUpdateDto) {
    this.infraService.updateInfra(dto);
  }
}
