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
} from '@nestjs/common';

import { ShoeDto, UpdateShoeDTO } from './shoe.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import { UserIndentifaer } from '../user/user.dto';
import { ShoeService } from './shoe.service';

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
  @Patch(':id')
  async updateUser(
    @Body() dto: UpdateShoeDTO,
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.shoeService.updateShoe(userId, id, dto);
  }
}
