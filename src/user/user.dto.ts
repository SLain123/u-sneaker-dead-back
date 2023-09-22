import {
  IsEmail,
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ThemeType, LangType } from './user.model';

import { Shoe } from '../shoe/shoe.model';
import { Run } from '../run/run.model';

export class UserIndentifaer {
  userId: string;
  userEmail: string;
}

export class UserDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  @IsString()
  password: string;

  @IsNumber()
  @Min(40)
  @Max(200)
  weight: number;

  @IsString()
  @IsOptional()
  nick?: string;
}

export class UserFullDto extends UserDto {
  @IsEnum(ThemeType)
  theme: ThemeType;

  @IsEnum(LangType)
  lang: LangType;

  @Type(() => Shoe)
  shoeList: Shoe[];

  @Type(() => Run)
  runList: Run[];
}

export class UpdateUserDTO extends PartialType(UserFullDto) {}
