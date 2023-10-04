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
import { CategoryFields } from 'src/enums/tables-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: CategoryFields,
  })
  async getCategories(
    @Query()
    query: GetQueryProps<CategoryFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<CategoryFields>[] =
      this.appService.validateGetConditions<CategoryFields>(conditions);

    const response: CustomResponseDto =
      await this.categoriesService.getCategories({
        sortBy: sortBy || CategoryFields.TITLE,
        reverse: reverse === 'true',
        page: Number(page),
        conditions: parsed || [],
      });
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
