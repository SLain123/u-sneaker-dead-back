import { IsNumber, IsString, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

import { Shoe } from '../shoe/shoe.model';

export class RunDto {
  @IsDate()
  @Type(() => Date)
  trDate: Date;

  @IsNumber()
  @Min(0)
  @Max(999)
  trDistance: number;

  @IsString()
  shoeId: string;
}

export class RunDtoFull extends RunDto {
  @IsString()
  shoe: Shoe;
}

export class UpdateRunDTO extends PartialType(RunDtoFull) {}
