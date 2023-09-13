import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({ required: true })
  sneakerIdList: string[];

  @Prop({ required: true })
  runIdList: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
