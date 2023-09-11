import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class ItemDto extends PartialType(CreateItemDto) {
  id: string;
}
