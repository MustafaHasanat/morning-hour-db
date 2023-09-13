import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({
    example: 'comment here',
  })
  text: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 3,
  })
  rating: number;

  @IsNotEmpty()
  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  userId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  itemId: string;
}
