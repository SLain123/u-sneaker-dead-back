import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AUTH_ERRS } from '../global/errors';
import { AuthDto } from './auth.dto';

import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: Omit<User, '_id'>) {
    const oldUser = await this.userService.findUser(dto.email);
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
}
