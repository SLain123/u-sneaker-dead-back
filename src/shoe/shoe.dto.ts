import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShoeDto {
  @ApiProperty({ description: 'Shoe name', default: '' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Shoe description', default: '' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ description: 'Initial durability at start', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(9999)
  initDurability: number;

  @ApiProperty({
    description: 'Total durability laid down by the manufacturer',
    default: 100,
  })
  @IsNumber()
  @Min(100)
  @Max(10000)
  totalDurability: number;

  @ApiProperty({
    description: 'Date when user purched shoe',
    default: '2023-11-30',
  })
  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}

export class ShoeDtoFull extends ShoeDto {
  @ApiPropertyOptional({
    description: 'Shoe status, functioning or not',
    default: '',
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ description: 'Current durability at this moment' })
  @IsNumber()
  @Min(0)
  @Max(9999)
  currentDurability: number;
}

export class UpdateShoeDTO extends PartialType(ShoeDtoFull) {}
