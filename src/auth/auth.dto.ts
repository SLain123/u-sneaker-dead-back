import { IsEmail, IsString, IsNumber, Min, Max, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  @IsString()
  password: string;

  nick?: string;

  @Min(40)
  @Max(200)
  @IsNumber()
  weight: number;
}
