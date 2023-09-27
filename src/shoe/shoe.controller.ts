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

import { ShoeDto, UpdateShoeDTO } from './shoe.dto';
import { ShoeService } from './shoe.service';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() dto: ShoeDto,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    return this.shoeService.createShoe(userEmail, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('')
  async getAllUserShoes(@UserData() { userId }: UserIndentifaer) {
    return this.shoeService.findAllUserShoe(userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async updateShoe(
    @Body() dto: UpdateShoeDTO,
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.shoeService.updateShoe(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async removeShoe(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.shoeService.removeShoe(userId, id);
  }
}
