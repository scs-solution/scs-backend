import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InstanceCreateDto } from './dtos/instance-create.dtos';
import { ReceiveSnsEventDto } from './dtos/receive-sns-event.dtos';
import { InstanceService } from './instance.service';
import { Logger } from '@nestjs/common';

@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewInstance(
    @CurrentUser() currentUser: User,
    @Body() dto: InstanceCreateDto,
  ): Promise<{ ok: boolean; error?: string }> {
    return await this.instanceService.createNewInstance(currentUser, dto);
  }

  @Post('/receiveSnsEvent')
  async receiveSnsEvent(@Body() e: ReceiveSnsEventDto): Promise<void> {
    Logger.log('receive sns event', JSON.stringify(e));
    await this.instanceService.receiveSnsEvent(e);
  }
}
