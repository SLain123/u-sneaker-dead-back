import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Shoe } from '../shoe/shoe.model';
import { Run } from '../run/run.model';

export type UserDocument = HydratedDocument<User>;

export enum ThemeType {
  light = 'light',
  dark = 'dark',
}
export enum LangType {
  en = 'en',
  rus = 'rus',
}

export enum ProviderType {
  local = 'local',
  google = 'google',
}

@Schema()
export class User {
  @ApiProperty({ description: 'User email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'User password' })
  @Prop({ required: true })
  password: string;

  @ApiPropertyOptional({ description: 'User nick' })
  @Prop()
  nick?: string;

  @ApiProperty({ description: 'User weight in kg', default: 50 })
  @Prop({ required: true, min: 40, max: 200 })
  weight: number;

  @ApiPropertyOptional({
    description: 'User theme',
    enum: ThemeType,
    default: 'light',
  })
  @Prop()
  theme?: ThemeType;

  @ApiPropertyOptional({
    description: 'User lang',
    enum: LangType,
    default: 'rus',
  })
  @Prop()
  lang?: LangType;

  @ApiProperty({ description: 'User shoes', type: () => [Shoe] })
  @Prop([{ type: MSchema.Types.ObjectId, ref: 'Shoe' }])
  shoeList: Shoe[];

  @ApiProperty({ description: 'User runs', type: () => [Run] })
  @Prop([{ type: MSchema.Types.ObjectId, ref: 'Run' }])
  runList: Run[];

  @ApiPropertyOptional({
    description: 'Platform of user registration',
    enum: ProviderType,
  })
  @Prop({ required: true })
  provider: ProviderType;
}

export const UserSchema = SchemaFactory.createForClass(User);
