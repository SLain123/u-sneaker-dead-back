import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RunService } from './run.service';
import { Run, RunSchema } from './run.model';
import { RunController } from './run.controller';

import { User, UserSchema } from '../user/user.model';
import { Shoe, ShoeSchema } from '../shoe/shoe.model';
import { ShoeService } from '../shoe/shoe.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [RunService, ShoeService, UserService],
  imports: [
    MongooseModule.forFeature([
      { name: Run.name, schema: RunSchema },
      { name: User.name, schema: UserSchema },
      { name: Shoe.name, schema: ShoeSchema },
    ]),
  ],
  controllers: [RunController],
})
export class RunModule {}
