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

  getAllCategories() {
    return this.categoryRepository.find();
  }

  getCategoryById(id: string) {
    return this.categoryRepository.findOneBy({ id });
  }

  downloadImage(imageName: string) {
    return join(process.cwd(), 'public/assets/categories/' + imageName);
  }

  createCategory(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(
      {
        id,
      },
      {
        ...updateCategoryDto,
      },
    );
  }

  deleteAllCategories() {
    return this.categoryRepository.clear();
  }

  deleteCategory(id: string) {
    return this.categoryRepository.delete(id);
  }
}
