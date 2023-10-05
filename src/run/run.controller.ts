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
import { Types } from 'mongoose';

import { RunService } from './run.service';
import { RunDto, UpdateRunDTO } from './run.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';
import { ShoeService } from '../shoe/shoe.service';

@Controller('run')
export class RunController {
  constructor(
    private readonly runService: RunService,
    private readonly shoeService: ShoeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() dto: RunDto,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    const createdRun = await this.runService.createRun(userEmail, dto);
    await this.shoeService.calculateDurability(dto.shoeId);

    return createdRun;
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
    const updatedRun = await this.runService.updateRun(userId, id, dto);
    await this.shoeService.calculateDurability(String(updatedRun.shoe));

    return updatedRun;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async removeRun(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    const removedRun = await this.runService.removeRun(userId, id);
    await this.shoeService.calculateDurability(String(removedRun.shoe));

    return removedRun;
  }
}
