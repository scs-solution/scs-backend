import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { MonitorPostDto } from './dtos/monitor-post.dtos';
import { MonitorResDto } from './dtos/monitor-res.dtos';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async monitor(
    @CurrentUser() currentUser: User,
    @Body() dto: MonitorPostDto,
  ): Promise<MonitorResDto> {
    return await this.monitorService.monitor(dto);
  }
}
