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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserIndentifaer, UpdateUserDTO } from './user.dto';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns user profile data by token' })
  async getUser(@UserData() { userEmail }: UserIndentifaer) {
    const user = await this.userService.findUser(userEmail);

    return {
      _id: user._id,
      email: user.email,
      nick: user.nick,
      weight: user.weight,
      runList: user.runList,
      shoeList: user.shoeList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Allows change user profile data by token' })
  async updateUser(
    @Body() dto: UpdateUserDTO,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    return this.userService.updateUser(userEmail, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Removes user profile and returns email of deleted user',
  })
  async userRemove(@UserData() { userEmail }: UserIndentifaer) {
    return this.userService.removeUser(userEmail);
  }
}
