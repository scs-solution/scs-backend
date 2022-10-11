import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InfraCreateDto } from './dtos/infra-create.dtos';
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
}
