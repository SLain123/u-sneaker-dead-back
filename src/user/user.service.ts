import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

import { User, ProviderType } from './user.model';
import { UserDto, UpdateUserDTO } from './user.dto';

import { USER_ERRS } from '../global/errors';
import { Run } from '../run/run.model';
import { Shoe } from '../shoe/shoe.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: UserDto, provider: ProviderType = 'local') {
    const { email, password, weight, nick = '' } = dto;
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email,
      password: await hash(password, salt),
      weight,
      nick,
      provider,
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
    list: Shoe | Run,
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
    itemIdForRemoving: string,
    listName: 'shoeList' | 'runList',
  ) {
    const currentList = (await this.userModel.findById(_id))[listName];
    const updatedList = currentList.filter(
      (item) => item.toString() !== itemIdForRemoving,
    );
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id }, { [listName]: updatedList }, { new: true })
      .exec();
    if (!updatedUser) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    return updatedUser;
  }
}
