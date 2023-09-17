import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

import { User } from './user.model';

import { USER_ERRS } from '../global/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: Omit<User, '_id'>) {
    const { email, password, weight, nick = '' } = dto;
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email,
      password: await hash(password, salt),
      weight,
      nick,
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(USER_ERRS.uncorrectPassword);
    }

    return { userEmail: user.email, userId: user._id };
  }
}
