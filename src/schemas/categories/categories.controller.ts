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
import { ApiQuery } from '@nestjs/swagger';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { categoryBody } from './dto/category-body';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';

@ControllerWrapper('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getCategories(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.categoriesService.getCategories(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  @Public()
  async getCategoryById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.getCategoryById(id);

    return res.status(response.status).json(response);
  }

  @Get('assets/:imageName')
  @Public()
  async downloadImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(this.categoriesService.downloadImage(imageName).data);
  }

  @Post()
  @CreateUpdateWrapper(CreateCategoryDto, categoryBody)
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const { title } = createCategoryDto;
    const response: CustomResponseDto =
      await this.categoriesService.createCategory({
        title,
        image,
      });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @CreateUpdateWrapper(CreateCategoryDto, categoryBody)
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { title } = updateCategoryDto;
    const response: CustomResponseDto =
      await this.categoriesService.updateCategory(id, {
        title,
        image,
      });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllCategories(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.deleteAllCategories();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.categoriesService.deleteCategory(id);

    return res.status(response.status).json(response);
  }
}
