import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { Shoe } from '../../shoe/model/shoe.model';
import { Run } from '../../run/model/run.model';

export type UserDocument = HydratedDocument<User>;

export enum ThemeType {
  'light',
  'dark',
}
export enum LangType {
  'en',
  'rus',
}

@Schema()
export class User {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nick?: string;

  @Prop({ required: true })
  weight: number;

  @Prop()
  theme?: ThemeType;

  @Prop()
  lang?: LangType;

  @Prop({ type: MSchema.Types.ObjectId, ref: Shoe.name })
  shoeList: Shoe[];

  @Prop({ type: MSchema.Types.ObjectId, ref: Run.name })
  runList: Run[];
}

export const UserSchema = SchemaFactory.createForClass(User);
