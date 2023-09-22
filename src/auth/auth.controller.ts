import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AUTH_ERRS } from '../global/errors';
import { AuthDto } from './auth.dto';

import { UserService } from '../user/user.service';
import { UserIndentifaer, UserDto } from '../user/user.dto';
import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: UserDto) {
    const oldUser = await this.userService.findUser(dto.email, true);
    if (oldUser) {
      throw new BadRequestException(AUTH_ERRS.userExists);
    }

    return this.userService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { email, password } = dto;
    const { userId, userEmail } = await this.userService.validateUser(
      email,
      password,
    );

    return await this.authService.login({ userId: String(userId), userEmail });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('check')
  async check(@UserData() userData: UserIndentifaer) {
    return userData;
  }
}
