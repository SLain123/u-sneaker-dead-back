import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShoeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @Min(0)
  @Max(9999)
  durability: number;

  @IsNumber()
  @Min(100)
  @Max(10000)
  totalDurability: number;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}
