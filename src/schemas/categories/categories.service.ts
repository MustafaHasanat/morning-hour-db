import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { deleteFile, deleteFiles } from 'src/utils/storageProcess/deleteFiles';
import {
  CategoryFields,
  FilterOperator,
  SortDirection,
} from 'src/enums/sorting-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories({
    field = CategoryFields.TITLE,
    filteredTerm = '',
    filterOperator = FilterOperator.CONTAINS,
    sortDirection = SortDirection.ASC,
    conditions = null,
  }: { field: CategoryFields } & GetAllProps) {
    try {
      const response = await this.categoryRepository.find({
        where: !!!Object.keys(conditions).length
          ? { [field]: Like(`%${filteredTerm}%`) }
          : conditions,
        order: { [field]: sortDirection },
      });

      return {
        message: response.length
          ? 'Categories have been found'
          : 'Categories list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getCategoryById(id: string) {
    try {
      const response = await this.categoryRepository.findOneBy({ id });
      return {
        message: response
          ? 'Category has been found'
          : "Category doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        image: createCategoryDto.image.filename || '',
      });
      const response = await this.categoryRepository.save(newCategory);

      return {
        message: 'Category has been created successfully',
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

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        return {
          message: 'Invalid data',
          data: `Category '${id}' doesn't exist`,
          status: 404,
        };
      }

      const response = await this.categoryRepository.update(
        {
          id,
        },
        {
          ...filterNullsObject({
            ...updateCategoryDto,
            image: updateCategoryDto?.image?.filename,
          }),
        },
      );

      return {
        message: 'Category has been updated successfully',
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

  async deleteAllCategories() {
    try {
      const response = await this.categoryRepository.query(
        'TRUNCATE TABLE category CASCADE;',
      );

      // delete all files in the dir
      deleteFiles('./public/assets/categories/');

      return {
        message: 'Categories data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await this.getCategoryById(id);
      if (category.status === 404) {
        return {
          message: "Category doesn't exist",
          data: category,
          status: 404,
        };
      }

      const response = await this.categoryRepository.delete(id);

      // delete the image related to the file
      category?.data?.image &&
        deleteFile('./public/assets/categories/' + category?.data?.image);

      return {
        message: 'Category has been deleted successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
