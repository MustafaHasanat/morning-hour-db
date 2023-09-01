import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'title' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
  })
  image: string;
}

export const categoryBody = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
