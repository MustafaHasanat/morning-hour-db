import { Item } from 'src/schemas/items/entities/item.entity';

export type Cart = {
  items: Item;
  quantity: number;
};
