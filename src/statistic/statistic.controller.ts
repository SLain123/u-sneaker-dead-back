import {
  Controller,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { StatisticService } from './statistic.service';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns statustic data by user token' })
  async getStatistic(@UserData() { userId }: UserIndentifaer) {
    return this.statisticService.getStatistic(userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('prediction/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns prediction shoe broken date by shoe id' })
  async getBrokenDate(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.statisticService.getBrokenDate(userId, id);
  }
}
