import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'title' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
  })
  image: Express.Multer.File;
}
