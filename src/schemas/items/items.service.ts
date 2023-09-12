import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { UpdateItemDto } from '../items/dto/update-item.dto';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @Inject(forwardRef(() => AuthorsService))
    private readonly authorsService: AuthorsService,
  ) {}

  async getItems(conditions: Record<string, any>) {
    try {
      const response = await this.itemRepository.findBy(conditions);

      return {
        message: response.length
          ? 'Items have been found'
          : 'Items list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getItemById(id: string) {
    try {
      const response = await this.itemRepository.findOneBy({ id });
      return {
        message: response ? 'Item has been found' : "Item doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  downloadImage(imageName: string) {
    try {
      const response = join(process.cwd(), 'public/assets/items/' + imageName);
      return {
        message: response
          ? 'Image returned successfully'
          : "Item doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createItem(createItemDto: CreateItemDto) {
    try {
      // check the author
      const author = await this.authorsService.getAuthorById(
        createItemDto.authorId,
      );
      if (!author) {
        return {
          message: 'Error occurred',
          data: 'Provided author does not exist',
          status: 400,
        };
      }

      // create the item
      const newItem = this.itemRepository.create({
        ...createItemDto,
        image: createItemDto.image.filename,
        screenshots: createItemDto.screenshots.map(
          (screenshot) => screenshot.filename,
        ),
      });
      const response = await this.itemRepository.save(newItem);

      // append the item to author
      // this.authorsService.appendItem(newItem.id, newItem.screenshots);

      return {
        message: 'Item has been created successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: !createItemDto.image?.filename
          ? 'You must provide a valid image'
          : error,
        status: 500,
      };
    }
  }

  async updateItem(id: string, updateItemDto: UpdateItemDto) {
    try {
      const item = await this.getItemById(updateItemDto.authorId);
      const author = await this.authorsService.getAuthorById(
        updateItemDto.authorId,
      );

      if (!item || !author) {
        return {
          message: 'Invalid data',
          data: `Provided ${!item ? 'item' : 'author'} does not exist`,
          status: 400,
        };
      }

      const response = await this.itemRepository.update(
        {
          id,
        },
        {
          ...updateItemDto,
          image: updateItemDto.image.filename,
          screenshots: updateItemDto.screenshots.map(
            (screenshot) => screenshot.filename,
          ),
        },
      );

      const isItemExist = response.affected !== 0;

      return {
        message: isItemExist
          ? 'Item has been updated successfully'
          : "Item doesn't exist",
        data: response,
        status: isItemExist ? 200 : 404,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async deleteAllItems() {
    try {
      const response = await this.itemRepository.query(
        'TRUNCATE TABLE item CASCADE;',
      );
      return {
        message: 'Items data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteItem(id: string) {
    try {
      const response = await this.itemRepository.delete(id);
      return {
        message: response
          ? 'Item has been deleted successfully'
          : "Item doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
