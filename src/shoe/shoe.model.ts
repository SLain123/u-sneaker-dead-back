import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { User } from '../user/user.model';

export type ShoeDocument = HydratedDocument<Shoe>;

@Schema()
export class Shoe {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop()
  desc?: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  initDurability: number;

  @Prop({ required: true })
  currentDurability: number;

  @Prop({ required: true })
  totalDurability: number;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ShoeSchema = SchemaFactory.createForClass(Shoe);
