import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { User, UserSchema } from './model/user.model';

import { Shoe, ShoeSchema } from '../shoe/model/shoe.model';
import { Run, RunSchema } from '../run/model/run.model';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Run.name, schema: RunSchema },
      { name: Shoe.name, schema: ShoeSchema },
    ]),
  ],
})
export class UserModule {}
