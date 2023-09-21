import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RunService } from './run.service';
import { Run, RunSchema } from './run.model';

import { User, UserSchema } from '../user/user.model';
import { Shoe, ShoeSchema } from '../shoe/shoe.model';

@Module({
  providers: [RunService],
  imports: [
    MongooseModule.forFeature([
      { name: Run.name, schema: RunSchema },
      { name: User.name, schema: UserSchema },
      { name: Shoe.name, schema: ShoeSchema },
    ]),
  ],
})
export class RunModule {}
