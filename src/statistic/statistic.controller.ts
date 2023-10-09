import {
  Controller,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';

import { StatisticService } from './statistic.service';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';

import { UserIndentifaer } from '../user/user.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('')
  async getStatistic(@UserData() { userId }: UserIndentifaer) {
    return this.statisticService.getStatistic(userId);
  }
}
