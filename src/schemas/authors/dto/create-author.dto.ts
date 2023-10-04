import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateAuthorDto {
  @MinLength(5)
  @ApiProperty({ example: 'username', required: true })
  name: string;

  @MinLength(50)
  @ApiProperty({ example: 'brief about him/her', required: true })
  brief: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
    required: true,
  })
  image: Express.Multer.File;
}
