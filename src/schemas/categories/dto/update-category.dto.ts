import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { MinLength } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @MinLength(0)
  @ApiProperty({ required: false, example: 'title' })
  title?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
    required: false,
  })
  image?: Express.Multer.File;
}
