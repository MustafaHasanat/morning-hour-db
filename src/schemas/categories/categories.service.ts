import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(conditions: Record<string, any>) {
    try {
      const response = await this.categoryRepository.findBy(conditions);

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

  downloadImage(imageName: string) {
    try {
      const response = join(
        process.cwd(),
        'public/assets/categories/' + imageName,
      );
      return {
        message: response
          ? 'Image returned successfully'
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
        image: createCategoryDto.image.filename,
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
        data: !createCategoryDto.image?.filename
          ? 'You must provide a valid image'
          : error,
        status: 500,
      };
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const response = await this.categoryRepository.update(
        {
          id,
        },
        {
          ...updateCategoryDto,
          image: updateCategoryDto.image.filename,
        },
      );

      const isCategoryExist = response.affected !== 0;

      return {
        message: isCategoryExist
          ? 'Category has been updated successfully'
          : "Category doesn't exist",
        data: response,
        status: isCategoryExist ? 200 : 404,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: !updateCategoryDto.image?.filename
          ? 'You must provide a valid image'
          : error,
        status: 500,
      };
    }
  }

  async deleteAllCategories() {
    try {
      const response = await this.categoryRepository.query(
        'TRUNCATE TABLE category CASCADE;',
      );
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
      const response = await this.categoryRepository.delete(id);
      return {
        message: response
          ? 'Category has been deleted successfully'
          : "Category doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
