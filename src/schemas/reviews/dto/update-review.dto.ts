import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { Max, Min, MinLength } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @MinLength(10)
  @ApiProperty({
    example: 'comment here',
    required: false,
  })
  text?: string;

  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 3,
    required: false,
  })
  rating?: number;

  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  itemId?: string;
}
