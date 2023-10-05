import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ShoeDto, UpdateShoeDTO } from './shoe.dto';
import { Shoe } from './shoe.model';

import { UserService } from '../user/user.service';
import { SHOE_ERRS } from '../global/errors';
import { Run } from '../run/run.model';

@Injectable()
export class ShoeService {
  constructor(
    @InjectModel(Shoe.name) private readonly shoeModel: Model<Shoe>,
    @InjectModel(Run.name) private readonly runModel: Model<Run>,
    private readonly userService: UserService,
  ) {}

  async createShoe(email: string, dto: ShoeDto) {
    const user = await this.userService.findUser(email);
    const newShoe = new this.shoeModel({
      ...dto,
      currentDurability: dto.initDurability,
      user,
    });
    this.userService.extendUserDataList(String(user._id), newShoe, 'shoeList');

    return newShoe.save();
  }

  async findShoe(_id: string) {
    const shoe = await this.shoeModel.findOne({ _id }).exec();
    if (!shoe) {
      throw new BadRequestException(SHOE_ERRS.shoeNotExist);
    }

    return shoe;
  }

  async findAllUserShoes(userId: string) {
    const shoeList = await this.shoeModel.find({ user: userId });
    return shoeList;
  }

  async checkShoeOwner(userId: string, shoeOwnerId: string) {
    if (userId !== shoeOwnerId) {
      throw new UnauthorizedException(SHOE_ERRS.shoeNoBelongUser);
    }
  }

  async updateShoe(userId: string, shoeId: string, dto: UpdateShoeDTO) {
    if (dto.currentDurability) {
      throw new BadRequestException(SHOE_ERRS.shoeDurability);
    }

    const shoe = await this.findShoe(shoeId);
    await this.checkShoeOwner(userId, String(shoe.user));

    const updatedShoe = await this.shoeModel
      .findByIdAndUpdate(shoeId, dto, { new: true })
      .exec();

    return updatedShoe;
  }

  async removeShoe(userId: string, shoeId: string) {
    const shoe = await this.findShoe(shoeId);
    await this.checkShoeOwner(userId, String(shoe.user));

    await this.userService.reduceUserDataList(userId, shoeId, 'shoeList');
    const removedShoe = await this.shoeModel.findByIdAndRemove(shoeId).exec();

    return removedShoe;
  }

  async calculateDurability(shoeId: string) {
    const shoe = await this.findShoe(shoeId);
    const calculatedRuns = (
      await this.runModel.aggregate([
        {
          $match: { shoe: new Types.ObjectId(shoeId) },
        },
        {
          $group: {
            _id: '$shoe',
            currentDurability: {
              $sum: '$trDistance',
            },
          },
        },
      ])
    )[0] as { currentDurability: number };

    const currentDurability = calculatedRuns?.currentDurability
      ? calculatedRuns.currentDurability + shoe.initDurability
      : shoe.initDurability;
    const recalculatedShoe = await this.shoeModel
      .findOneAndUpdate(
        { _id: shoeId },
        {
          currentDurability,
        },
      )
      .exec();
    if (!recalculatedShoe) {
      throw new BadRequestException(SHOE_ERRS.shoeCalculateError);
    }

    return { currentDurability };
  }
}
