import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthorDto {
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'username' })
  name: string;

  @ApiProperty({ example: 'brief about him/her' })
  brief: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
  })
  image: string;
}

export const authorBody = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      brief: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
