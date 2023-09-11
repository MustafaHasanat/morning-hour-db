import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

export class AuthorDto extends PartialType(CreateAuthorDto) {
  id: string;
}
