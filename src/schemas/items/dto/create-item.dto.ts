import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'item title' })
  title: string;

  @IsNotEmpty()
  @MinLength(20)
  @ApiProperty({ example: 'short description' })
  description: string;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  currentPrice: number;

  @IsNotEmpty()
  @ApiProperty({ example: 0 })
  oldPrice: number;

  @IsNotEmpty()
  @ApiProperty({ example: false })
  isBestSelling: boolean;

  @IsNotEmpty()
  @ApiProperty({ example: '#000' })
  primaryColor: string;

  @ApiProperty({
    type: 'file',
    format: 'binary',
    example: 'url',
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['url'],
  })
  screenshots: Express.Multer.File[];

  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  author: string;

  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  category: string;
}
