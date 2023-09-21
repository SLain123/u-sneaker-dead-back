import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
} from '@nestjs/common';

import { ShoeDto } from './shoe.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
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
}
