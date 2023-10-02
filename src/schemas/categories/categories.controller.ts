import {
  Body,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createCategoryBody } from './dto/create-category.body';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { updateCategoryBody } from './dto/update-category.body';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { CategoryFields } from 'src/enums/sorting-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';

@ControllerWrapper('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: [CategoryFields.TITLE],
  })
  async getCategories(
    @Query()
    query: {
      conditions: GetAllProps<CategoryFields>;
    },
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.categoriesService.getCategories(query.conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.getCategoryById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @AdminsOnly()
  @CreateUpdateWrapper(CreateCategoryDto, createCategoryBody)
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.categoriesService.createCategory({
        ...createCategoryDto,
        image,
      });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateCategoryDto, updateCategoryBody)
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.categoriesService.updateCategory(id, {
        ...updateCategoryDto,
        image,
      });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  async deleteAllCategories(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.deleteAllCategories();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @AdminsOnly()
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.deleteCategory(id);

    return res.status(response.status).json(response);
  }
}
