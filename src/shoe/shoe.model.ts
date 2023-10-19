import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model';

export type ShoeDocument = HydratedDocument<Shoe>;

@Schema()
export class Shoe {
  @ApiProperty({ description: 'Shoe name', default: '' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Date when user purched shoe',
    default: '2023-11-30',
  })
  @Prop({ required: true })
  purchaseDate: Date;

  @ApiPropertyOptional({ description: 'Shoe description', default: '' })
  @Prop()
  desc?: string;

  @ApiProperty({
    description: 'Shoe status, functioning or not',
    default: '',
  })
  @Prop({ required: true })
  active: boolean;

  @ApiProperty({ description: 'Initial durability at start', default: 0 })
  @Prop({ required: true })
  initDurability: number;

  @ApiProperty({ description: 'Current durability at this moment', default: 0 })
  @Prop({ required: true })
  currentDurability: number;

  @ApiProperty({
    description: 'Total durability laid down by the manufacturer',
    default: 100,
  })
  @Prop({ required: true })
  totalDurability: number;

  @ApiProperty({
    description: 'User who owns shoe',
    type: () => User,
  })
  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ShoeSchema = SchemaFactory.createForClass(Shoe);
