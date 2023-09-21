import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { Shoe } from '../shoe/shoe.model';
import { User } from '../user/user.model';

export type RunDocument = HydratedDocument<Run>;

@Schema()
export class Run {
  @Prop({ required: true })
  trDate: Date;

  @Prop({ required: true })
  trDistance: number;

  @Prop({ type: MSchema.Types.ObjectId, ref: Shoe.name })
  shoe: Shoe;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RunSchema = SchemaFactory.createForClass(Run);
