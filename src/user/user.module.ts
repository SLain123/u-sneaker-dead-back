import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { User, UserSchema } from './user.model';

import { Shoe, ShoeSchema } from '../shoe/shoe.model';
import { Run, RunSchema } from '../run/run.model';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Run.name, schema: RunSchema },
      { name: Shoe.name, schema: ShoeSchema },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}
