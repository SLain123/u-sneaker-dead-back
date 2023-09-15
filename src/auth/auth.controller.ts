import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AUTH_ERRORS } from './auth.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.email);

    if (oldUser) {
      throw new BadRequestException(AUTH_ERRORS.userExists);
    }
    return this.authService.createUser(dto);
  }
}
