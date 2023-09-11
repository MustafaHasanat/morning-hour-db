import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthorDto {
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
  image: Express.Multer.File;
}
