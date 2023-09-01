// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { join } from 'path';
// import { ItemDto } from 'src/dtos/item.dto';
// import { Item } from 'src/entities';
// import { Repository } from 'typeorm';

// @Injectable()
// export class ItemService {
//   constructor(
//     @InjectRepository(Item)
//     private readonly itemRepository: Repository<Item>,
//   ) {}

//   getAllItems() {
//     return this.itemRepository.find();
//   }

//   getItemById(id: string) {
//     return this.itemRepository.findOneBy({ id });
//   }

//   downloadImage(imageName: string) {
//     return join(process.cwd(), 'uploads/items/' + imageName);
//   }

//   createItem(createItemDto: ItemDto) {
//     const newItem = this.itemRepository.create(createItemDto);
//     return this.itemRepository.save(newItem);
//   }

//   updateItem(id: string, updateItemDto: ItemDto) {
//     return this.itemRepository.update(
//       {
//         id,
//       },
//       {
//         ...updateItemDto,
//       },
//     );
//   }

//   deleteAllItems() {
//     return this.itemRepository.clear();
//   }

//   deleteItem(id: string) {
//     return this.itemRepository.delete(id);
//   }
// }
