import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

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
