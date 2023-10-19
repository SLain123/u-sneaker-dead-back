import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({
    name: 'page',
    description: 'Page number of workout/shoe',
    default: 1,
    required: true,
  })
  page: number;
  @ApiProperty({
    name: 'size',
    description: 'Count of workouts/shoes on page',
    default: 1,
    required: true,
  })
  size: number;
}
