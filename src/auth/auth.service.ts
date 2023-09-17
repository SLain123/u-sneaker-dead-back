import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserIndentifaer } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserIndentifaer) {
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
