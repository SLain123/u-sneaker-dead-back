import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Run } from './run.model';
import { RunDto, UpdateRunDTO } from './run.dto';

import { UserService } from '../user/user.service';
import { RUN_ERRS, SHOE_ERRS } from '../global/errors';
import { ShoeService } from '../shoe/shoe.service';

@Injectable()
export class RunService {
  constructor(
    @InjectModel(Run.name) private readonly runModel: Model<Run>,
    private readonly shoeService: ShoeService,
    private readonly userService: UserService,
  ) {}

  async createRun(email: string, dto: RunDto) {
    const user = await this.userService.findUser(email);
    const shoe = await this.shoeService.findShoe(dto.shoeId);
    await this.shoeService.checkShoeOwner(String(user._id), String(shoe.user));

    const newRun = new this.runModel({
      trDistance: dto.trDistance,
      trDate: dto.trDate,
      shoe,
      user,
    });
    this.userService.extendUserDataList(String(user._id), newRun, 'runList');

    return newRun.save();
  }

  async findRun(_id: string) {
    const run = await this.runModel.findOne({ _id }).exec();
    if (!run) {
      throw new BadRequestException(RUN_ERRS.runNotExist);
    }

    return run;
  }

  async findAllUserRuns(userId: string) {
    const runList = await this.runModel
      .find({ user: userId })
      .populate('shoe')
      .exec();
    return runList;
  }

  async checkRunOwner(userId: string, runOwnerId: string) {
    if (userId !== runOwnerId) {
      throw new UnauthorizedException(RUN_ERRS.runNoBelongUser);
    }
  }

  async updateRun(userId: string, runId: string, dto: UpdateRunDTO) {
    const run = await this.findRun(runId);
    await this.checkRunOwner(userId, String(run.user));

    if (dto.shoe) {
      throw new BadRequestException(RUN_ERRS.runShoe);
    }

    const newRun: UpdateRunDTO = { ...dto };
    if (dto.shoeId) {
      if (!Types.ObjectId.isValid(dto.shoeId)) {
        throw new BadRequestException(SHOE_ERRS.shoeIdIncorrect);
      }

      const shoe = await this.shoeService.findShoe(dto.shoeId);
      await this.shoeService.checkShoeOwner(userId, String(shoe.user));
      shoe && (newRun.shoe = shoe);
    }

    return this.runModel
      .findByIdAndUpdate(runId, { ...newRun }, { new: true })
      .exec();
  }

  async removeRun(userId: string, runId: string) {
    const run = await this.findRun(runId);
    await this.checkRunOwner(userId, String(run.user));

    await this.userService.reduceUserDataList(userId, runId, 'runList');
    return this.runModel.findByIdAndRemove(runId).exec();
  }
}
