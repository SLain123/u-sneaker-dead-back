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

import { ThemeType, LangType } from './user.model';

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

export class UserChangeDto {
  @IsNumber()
  @Min(40)
  @Max(200)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  nick?: string;

  @IsEnum(ThemeType)
  @IsOptional()
  theme?: ThemeType;

  @IsEnum(LangType)
  @IsOptional()
  lang?: LangType;
}
