import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { Shoe } from '../shoe/shoe.model';

export type RunDocument = HydratedDocument<Run>;

@Schema()
export class Run {
  @Prop({ required: true })
  trDate: Date;

  @Prop({ required: true })
  trDistance: number;

  @Prop({ type: MSchema.Types.ObjectId, ref: Shoe.name })
  shoeId: Shoe;
}

export const RunSchema = SchemaFactory.createForClass(Run);
