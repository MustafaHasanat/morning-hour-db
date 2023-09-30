import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { UpdateItemDto } from '../items/dto/update-item.dto';
import { AuthorsService } from '../authors/authors.service';
import { deleteFile, deleteFiles } from 'src/utils/storageProcess/deleteFiles';
import { CategoriesService } from '../categories/categories.service';
import {
  filterNullsArray,
  filterNullsObject,
} from 'src/utils/helpers/filterNulls';
import { mergeWithoutDups } from 'src/utils/helpers/mergeWithoutDups';
import {
  FilterOperator,
  ItemFields,
  SortDirection,
} from 'src/enums/sorting-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';
import { CustomResponseType } from 'src/types/custom-response.type';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly appService: AppService,

    @Inject(forwardRef(() => AuthorsService))
    private readonly authorsService: AuthorsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getItems({
    field = ItemFields.TITLE,
    filteredTerm = '',
    filterOperator = FilterOperator.CONTAINS,
    sortDirection = SortDirection.ASC,
    conditions = null,
  }: { field: ItemFields } & GetAllProps): Promise<CustomResponseType<Item[]>> {
    try {
      const findQuery = this.appService.getFilteredQuery({
        field,
        filteredTerm,
        filterOperator,
        sortDirection,
        conditions,
      });

      if (!findQuery) {
        return {
          message:
            'The inputs (field, filterOperator, filteredTerm) must be consistent',
          data: null,
          status: 400,
        };
      }

      const response = await this.itemRepository.find(findQuery);

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

  async getItemsByIds(ids: string[]): Promise<CustomResponseType<Item[]>> {
    try {
      const response = await this.itemRepository.findBy({ id: In(ids) });

      return {
        message: response ? 'Items has been found' : "Items doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getItemsByAuthorId(author: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { author: { id: author } },
    });
  }

  async getItemsByOrderId(order: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { orders: { id: In([order]) } },
    });
  }

  async getItemById(id: string): Promise<CustomResponseType<Item>> {
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

  async createItem(
    createItemDto: CreateItemDto,
  ): Promise<CustomResponseType<Item>> {
    try {
      // check the author and category
      const author = await this.authorsService.getAuthorById(
        createItemDto.authorId,
      );
      const category = await this.categoriesService.getCategoryById(
        createItemDto.categoryId,
      );
      if (!author || !category) {
        return {
          message: `Provided ${!author ? 'author' : 'category'} does not exist`,
          data: null,
          status: 400,
        };
      }

      // create the item
      const newItem = this.itemRepository.create({
        ...createItemDto,
        image: createItemDto?.image?.filename || '',
        screenshots: createItemDto?.screenshots?.map(
          (screenshot) => screenshot?.filename || '',
        ),
      });
      const response = await this.itemRepository.save(newItem);

      return {
        message: 'Item has been created successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async updateItem(
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      const item = await this.getItemById(id);
      const author = await this.authorsService.getAuthorById(
        updateItemDto.authorId,
      );
      const category = await this.categoriesService.getCategoryById(
        updateItemDto.categoryId,
      );

      if (!item || !author || !category) {
        return {
          message: `Provided ${
            !item ? 'item' : !author ? 'author' : 'category'
          } does not exist`,
          data: null,
          status: 404,
        };
      }

      const oldArray: string[] = item.data.screenshots;

      const newArray = filterNullsArray(updateItemDto?.screenshots).map(
        (screenshot: { filename: string }) => screenshot.filename,
      );

      const newObject = filterNullsObject({
        ...updateItemDto,
        image: updateItemDto.image.filename,
      });

      if (newArray.length > 0) {
        newObject['screenshots'] = mergeWithoutDups([oldArray, newArray]);
      }

      const response = await this.itemRepository.update(
        {
          id,
        },
        newObject,
      );

      return {
        message: 'Item has been updated successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async deleteAllItems(): Promise<CustomResponseType<DeleteResult>> {
    try {
      const response = await this.itemRepository.query(
        'TRUNCATE TABLE item CASCADE;',
      );

      // delete all files in the dir
      deleteFiles('./public/assets/items/');

      return {
        message: 'Items data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteItem(id: string): Promise<CustomResponseType<DeleteResult>> {
    try {
      const item = await this.getItemById(id);
      if (item.status === 404) {
        return {
          message: `Item ${id} doesn't exist`,
          data: null,
          status: 404,
        };
      }

      const screenshotsNames: string[] = item?.data?.screenshots;
      const response = await this.itemRepository.delete(id);

      // delete the images related to the file
      item?.data?.image &&
        deleteFile('./public/assets/items/' + item?.data?.image);

      screenshotsNames.forEach((screenshot) => {
        screenshot && deleteFile('./public/assets/items/' + screenshot);
      });

      return {
        message: 'Item has been deleted successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
