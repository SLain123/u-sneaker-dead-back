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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { RunService } from './run.service';
import { RunDto, UpdateRunDTO } from './run.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';
import { ShoeService } from '../shoe/shoe.service';
import {
  PaginationParams,
  Pagination,
} from '../global/pipes/pagination-params.pipe';
import { PaginationDTO } from '../global/dto/pagination.dto';

@ApiTags('Runs')
@Controller('run')
export class RunController {
  constructor(
    private readonly runService: RunService,
    private readonly shoeService: ShoeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creates run and returns it' })
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
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns all user runs' })
  @ApiQuery({ type: PaginationDTO })
  @ApiQuery({
    name: 'shoe',
    required: false,
    description: 'Shoe id used on workout',
  })
  async getAllUserRuns(
    @UserData() { userId }: UserIndentifaer,
    @PaginationParams() paginationParams: Pagination,
    @Query('shoe') shoe?: string,
  ) {
    return this.runService.findAllUserRunsWithPaginate(
      userId,
      paginationParams,
      shoe,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns run data by id' })
  async getRun(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    const run = await this.runService.findRun(id);
    await this.runService.checkRunOwner(userId, String(run.user));

    return run;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Allows change run data' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Removes run by id and return it' })
  async removeRun(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    const removedRun = await this.runService.removeRun(userId, id);
    await this.shoeService.calculateDurability(String(removedRun.shoe));

    return removedRun;
  }
}
