import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

import { RunService } from '../run/run.service';
import { Run, RunSchema } from '../run/run.model';
import { User, UserSchema } from '../user/user.model';
import { Shoe, ShoeSchema } from '../shoe/shoe.model';
import { ShoeService } from '../shoe/shoe.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [StatisticService, RunService, ShoeService, UserService],
  imports: [
    MongooseModule.forFeature([
      { name: Run.name, schema: RunSchema },
      { name: User.name, schema: UserSchema },
      { name: Shoe.name, schema: ShoeSchema },
    ]),
  ],
  controllers: [StatisticController],
})
export class StatisticModule {}
