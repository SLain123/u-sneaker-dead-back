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
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ThemeType, LangType } from './user.model';

import { Shoe } from '../shoe/shoe.model';
import { Run } from '../run/run.model';

export class UserIndentifaer {
  userId: string;
  userEmail: string;
}

export class UserDto {
  @ApiProperty({ description: 'User email', default: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', default: '' })
  @Length(6, 20)
  @IsString()
  password: string;

  @ApiProperty({ description: 'User weight in kg', default: 50 })
  @IsNumber()
  @Min(40)
  @Max(200)
  weight: number;

  @ApiPropertyOptional({ description: 'User nick', default: '' })
  @IsString()
  @IsOptional()
  nick?: string;
}

export class UserFullDto extends UserDto {
  @ApiPropertyOptional({
    description: 'User theme',
    enum: ThemeType,
    default: 'light',
  })
  @IsEnum(ThemeType)
  theme: ThemeType;

  @ApiPropertyOptional({
    description: 'User lang',
    enum: LangType,
    default: 'rus',
  })
  @IsEnum(LangType)
  lang: LangType;

  @ApiProperty({ description: 'User shoes', type: () => [Shoe], default: [] })
  @Type(() => Shoe)
  shoeList: Shoe[];

  @ApiProperty({ description: 'User runs', type: () => [Run], default: [] })
  @Type(() => Run)
  runList: Run[];
}

export class UpdateUserDTO extends PartialType(UserFullDto) {}
