import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

import { User } from './user.model';
import { UserDto, UpdateUserDTO } from './user.dto';

import { USER_ERRS } from '../global/errors';
import { ShoeDto } from '../shoe/shoe.dto';
import { RunDto } from '../run/run.dto';

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

  async findUser(email: string, ignoreExisting = false) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user && !ignoreExisting) {
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

  async updateUser(email: string, dto: UpdateUserDTO) {
    if (dto.email || dto.password || dto.shoeList || dto.runList) {
      throw new BadRequestException(USER_ERRS.prohibitedData);
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, dto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return updatedUser;
  }

  async extendUserDataList(
    _id: string,
    list: ShoeDto | RunDto,
    listName: 'shoeList' | 'runList',
  ) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        { _id },
        { $push: { [listName]: list } },
        { new: true },
      )
      .exec();
    if (!updatedUser) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return updatedUser;
  }

  async reduceUserDataList(
    _id: string,
    listIdForRemoving: string,
    listName: 'shoeList' | 'runList',
  ) {
    const currentShoeList = (await this.userModel.findById(_id)).shoeList;
    const updatedShoeList = currentShoeList.filter(
      (shoe) => shoe.toString() !== listIdForRemoving,
    );
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id }, { [listName]: updatedShoeList }, { new: true })
      .exec();
    if (!updatedUser) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return updatedUser;
  }
}
