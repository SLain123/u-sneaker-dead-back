import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

import { User } from './user.model';
import { UserDto, UserChangeDto } from './user.dto';

import { USER_ERRS } from '../global/errors';
import { ShoeDto } from '../shoe/shoe.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: UserDto) {
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

  async removeUser(email: string) {
    const user = await this.userModel.findOneAndRemove({ email }).exec();
    if (!user) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return user;
  }

  async findUser(email: string, ignore = false) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user && !ignore) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return user;
  }

  async getFullUserData(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .populate(['shoeList', 'runList']);
    if (!user) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return user; //TODO: check runList
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

  async updateUser(email: string, dto: UserChangeDto) {
    return this.userModel
      .findOneAndUpdate({ email }, dto, { new: true })
      .exec();
  }

  async updateUserDataList(
    email: string,
    listName: 'shoeList' | 'runList',
    list: ShoeDto,
  ) {
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $push: { [listName]: list } },
        { new: true },
      )
      .exec();
  }
}
