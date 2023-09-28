import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
  HttpCode,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';

import { RunService } from './run.service';
import { RunDto, UpdateRunDTO } from './run.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';

@Controller('run')
export class RunController {
  constructor(private readonly runService: RunService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() dto: RunDto,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    return this.runService.createRun(userEmail, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('')
  async getAllUserRuns(@UserData() { userId }: UserIndentifaer) {
    return this.runService.findAllUserRuns(userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async updateRun(
    @Body() dto: UpdateRunDTO,
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.runService.updateRun(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async removeRun(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.runService.removeRun(userId, id);
  }
}
