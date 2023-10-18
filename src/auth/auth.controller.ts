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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AUTH_ERRS } from '../global/errors';
import { AuthDto, GoogleUserData } from './auth.dto';

import { UserService } from '../user/user.service';
import { UserIndentifaer, UserDto } from '../user/user.dto';
import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { ProviderType } from '../user/user.model';

@ApiTags('Auth')
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

    return this.userService.createUser(dto, ProviderType.local);
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

  @Get('gauth')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('gredirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: { user?: GoogleUserData }) {
    const googleUser = await this.authService.googleLogin(req);

    let currentUser = await this.userService.findUser(
      googleUser.user.email,
      true,
    );
    if (!currentUser) {
      const userDto = {
        email: googleUser.user.email,
        password: String(new Types.ObjectId()),
        weight: 60,
        nick: googleUser.user.nick,
      };
      await this.userService.createUser(userDto, ProviderType.google);
    }

    currentUser = await this.userService.findUser(googleUser.user.email);
    const token = await this.authService.login({
      userId: String(currentUser._id),
      userEmail: currentUser.email,
    });

    return token;
  }
}
