import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShoeService } from './shoe.service';
import { Shoe, ShoeSchema } from './shoe.model';
import { ShoeController } from './shoe.controller';

import { User, UserSchema } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Run, RunSchema } from '../run/run.model';

@Module({
  providers: [ShoeService, UserService],
  imports: [
    MongooseModule.forFeature([
      { name: Shoe.name, schema: ShoeSchema },
      { name: User.name, schema: UserSchema },
      { name: Run.name, schema: RunSchema },
    ]),
  ],
  controllers: [ShoeController],
})
export class ShoeModule {}
