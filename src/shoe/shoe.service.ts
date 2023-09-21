import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ShoeDto } from './shoe.dto';
import { Shoe } from './shoe.model';

import { UserService } from '../user/user.service';
import { USER_ERRS } from '../global/errors';

@Injectable()
export class ShoeService {
  constructor(
    @InjectModel(Shoe.name) private readonly shoeModel: Model<Shoe>,
    private readonly userService: UserService,
  ) {}

  async createShoe(email: string, dto: ShoeDto) {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_ERRS.userNotExist);
    }

    const newShoe = new this.shoeModel({ ...dto, user });
    this.userService.updateUserDataList(email, 'shoeList', newShoe);
    return newShoe.save();
  }
}
