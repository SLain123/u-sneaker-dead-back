import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class ShoeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @Min(0)
  @Max(9999)
  initDurability: number;

  @IsNumber()
  @Min(100)
  @Max(10000)
  totalDurability: number;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}

export class ShoeDtoFull extends ShoeDto {
  @IsNumber()
  @Min(0)
  @Max(9999)
  currentDurability: number;
}

export class UpdateShoeDTO extends PartialType(ShoeDtoFull) {}