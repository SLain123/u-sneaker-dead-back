import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { Shoe } from '../shoe/shoe.model';
import { Run } from '../run/run.model';

export type UserDocument = HydratedDocument<User>;

export enum ThemeType {
  'light',
  'dark',
}
export enum LangType {
  'en',
  'rus',
}

export type ProviderType = 'local' | 'google';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nick?: string;

  @Prop({ required: true, min: 40, max: 200 })
  weight: number;

  @Prop()
  theme?: ThemeType;

  @Prop()
  lang?: LangType;

  @Prop([{ type: MSchema.Types.ObjectId, ref: 'Shoe' }])
  shoeList: Shoe[];

  @Prop([{ type: MSchema.Types.ObjectId, ref: 'Run' }])
  runList: Run[];

  @Prop({ required: true })
  provider: ProviderType;
}

export const UserSchema = SchemaFactory.createForClass(User);
