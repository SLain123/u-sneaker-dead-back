import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ShoeDto, UpdateShoeDTO } from './shoe.dto';
import { Shoe } from './shoe.model';

import { UserService } from '../user/user.service';
import { SHOE_ERRS } from '../global/errors';

@Injectable()
export class ShoeService {
  constructor(
    @InjectModel(Shoe.name) private readonly shoeModel: Model<Shoe>,
    private readonly userService: UserService,
  ) {}

  async createShoe(email: string, dto: ShoeDto) {
    const user = await this.userService.findUser(email);
    const newShoe = new this.shoeModel({ ...dto, user });
    this.userService.updateUserDataList(email, 'shoeList', newShoe);

    return newShoe.save();
  }

  async findShoe(_id: string) {
    const shoe = await this.shoeModel.findOne({ _id }).exec();
    if (!shoe) {
      throw new BadRequestException(SHOE_ERRS.shoeNotExist);
    }

    return shoe;
  }

  async checkShoeOwner(userId: string, shoeOwnerId: string) {
    if (userId !== shoeOwnerId) {
      throw new UnauthorizedException(SHOE_ERRS.shoeNoBelongUser);
    }
  }

  async updateShoe(userId: string, shoeId: string, dto: UpdateShoeDTO) {
    const shoe = await this.findShoe(shoeId);
    await this.checkShoeOwner(userId, String(shoe.user));

    return this.shoeModel.findByIdAndUpdate(shoeId, dto, { new: true }).exec();
  }
}
