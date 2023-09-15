import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

import { User } from '../user/user.model';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: AuthDto) {
    const { email, password, weight, nick = '' } = dto;
    const salt = genSaltSync(10);
    const newUser = new this.userModel({
      email,
      password: hashSync(password, salt),
      weight,
      nick,
    });
    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
