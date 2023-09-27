import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { MinLength } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @MinLength(3)
  @ApiProperty({ example: 'item title', required: false })
  title?: string;

  @MinLength(20)
  @ApiProperty({ example: 'short description', required: false })
  description?: string;

  @ApiProperty({ example: 1, required: false })
  currentPrice?: number;

  @ApiProperty({ example: 0, required: false })
  oldPrice?: number;

  @ApiProperty({ example: false, required: false })
  isBestSelling?: boolean;

  @ApiProperty({ example: '#000', required: false })
  primaryColor?: string;

  @ApiProperty({
    type: 'file',
    format: 'binary',
    example: 'url',
    required: false,
  })
  image?: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['url'],
    required: false,
  })
  screenshots?: Express.Multer.File[];

  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  authorId?: string;

  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  categoryId?: string;
}
