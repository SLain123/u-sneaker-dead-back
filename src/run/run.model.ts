import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Shoe } from '../shoe/shoe.model';
import { User } from '../user/user.model';

export type RunDocument = HydratedDocument<Run>;

@Schema()
export class Run {
  @ApiProperty({
    description: 'Date when user had workout',
    default: '2023-11-30',
  })
  @Prop({ required: true })
  trDate: Date;

  @ApiProperty({
    description: 'Distance of workout in km',
    default: 0,
  })
  @Prop({ required: true })
  trDistance: number;

  @ApiProperty({
    description: 'Shoe that workout was in',
    type: () => Shoe,
  })
  @Prop({ type: MSchema.Types.ObjectId, ref: Shoe.name })
  shoe: Shoe;

  @ApiProperty({
    description: 'User who owns workout',
    type: () => User,
  })
  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RunSchema = SchemaFactory.createForClass(Run);
