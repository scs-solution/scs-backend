import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
import { InfraUpdateDto } from './dtos/infra-update.dtos';
import { InfraService } from './infra.service';
import { InfraDescription } from './types/infra.desc';

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

  @Get('/detail/:name')
  @UseGuards(AccessTokenGuard)
  async getInfraDetail(
    @Param('name') infraName: string,
  ): Promise<InfraDescription> {
    const infraDesc = await this.infraService.getInfraDetail(infraName);
    return plainToClass(InfraDescription, infraDesc);
  }

  @Put()
  updateInfra(@Body() dto: InfraUpdateDto) {
    this.infraService.updateInfra(dto);
  }
}
