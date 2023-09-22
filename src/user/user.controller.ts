import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  Delete,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserIndentifaer, UserChangeDto } from './user.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('')
  async getUser(@UserData() { userEmail }: UserIndentifaer) {
    return this.userService.findUser(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch('')
  async updateUser(
    @Body() dto: UserChangeDto,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    return this.userService.updateUser(userEmail, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete('')
  async userRemove(@UserData() { userEmail }: UserIndentifaer) {
    return this.userService.removeUser(userEmail);
  }
}
