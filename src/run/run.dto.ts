import { IsNumber, IsString, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty } from '@nestjs/swagger';

import { Shoe } from '../shoe/shoe.model';

export class RunDto {
  @ApiProperty({
    description: 'Date when user had workout',
    default: '2023-11-30',
  })
  @IsDate()
  @Type(() => Date)
  trDate: Date;

  @ApiProperty({
    description: 'Distance of workout in km',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(999)
  trDistance: number;

  @ApiProperty({
    description: 'Shoe id that workout was in',
    default: '',
  })
  @IsString()
  shoeId: string;
}

export class RunDtoFull extends RunDto {
  @IsString()
  shoe: Shoe;
}

export class UpdateRunDTO extends PartialType(RunDtoFull) {}
