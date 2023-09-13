import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShoeDocument = HydratedDocument<Shoe>;

@Schema()
export class Shoe {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop()
  desc?: string;

  @Prop({ required: true })
  durability: number;

  @Prop({ required: true })
  totalDurability: number;
}

export const ShoeSchema = SchemaFactory.createForClass(Shoe);
