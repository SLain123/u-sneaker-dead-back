import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShoeService } from './shoe.service';
import { Shoe, ShoeSchema } from './model/shoe.model';

@Module({
  providers: [ShoeService],
  imports: [
    MongooseModule.forFeature([{ name: Shoe.name, schema: ShoeSchema }]),
  ],
})
export class ShoeModule {}
