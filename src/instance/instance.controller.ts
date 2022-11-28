import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { InstanceCreateDto } from './dtos/instance-create.dtos';
import { ReceiveSnsEventDto } from './dtos/receive-sns-event.dtos';
import { InstanceService } from './instance.service';
import { Logger } from '@nestjs/common';
import { InstanceAMIUpdateDto } from './dtos/instance-update.dto';

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

  @Put('/ami')
  async updateAMIId(@Body() dto: InstanceAMIUpdateDto): Promise<void> {
    await this.instanceService.updateInstancAMI(dto);
  }

  @Delete('/:infra/:name')
  @UseGuards(AccessTokenGuard)
  async removeInstance(
    @CurrentUser() currentUser: User,
    @Param('infra') infraName: string,
    @Param('name') instanceName: string,
  ): Promise<{ ok: boolean; error?: string }> {
    return await this.instanceService.removeInstance(
      currentUser,
      infraName,
      instanceName,
    );
  }
}
