import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { CategoryDto } from 'src/dtos/category.dto';
import { Category } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
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
    return join(process.cwd(), 'uploads/categories/' + imageName);
  }

  createCategory(createCategoryDto: CategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  updateCategory(id: string, updateCategoryDto: CategoryDto) {
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
