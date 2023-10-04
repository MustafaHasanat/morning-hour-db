import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';
import { MinLength } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @MinLength(0)
  @ApiProperty({ required: false })
  name?: string;

  @MinLength(0)
  @ApiProperty({ required: false })
  brief?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
    required: false,
  })
  image?: Express.Multer.File;
}
