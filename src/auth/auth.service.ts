import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GoogleUserData } from './auth.dto';

import { UserIndentifaer } from '../user/user.dto';
import { USER_ERRS } from '../global/errors';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserIndentifaer) {
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async googleLogin(req: { user?: GoogleUserData }) {
    if (!req.user) {
      throw new BadRequestException(USER_ERRS.googleUserNotFound);
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
