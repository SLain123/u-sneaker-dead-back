import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'User email', default: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', default: '' })
  @Length(6, 20)
  @IsString()
  password: string;
}

export class GoogleUserData {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  nick: string;
}
