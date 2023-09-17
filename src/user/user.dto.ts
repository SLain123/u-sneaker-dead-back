import { IsEmail, IsNumber, IsString, Length, Min, Max } from 'class-validator';

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

  nick?: string;
}
