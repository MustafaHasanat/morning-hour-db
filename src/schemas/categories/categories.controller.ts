import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Delete,
  Patch,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { storeLocalFile } from 'src/utils/storage';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { categoryBody } from './dto/category-body';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Get('assets/:imageName')
  downloadImage(@Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(this.categoriesService.downloadImage(imageName));
  }

  @Post()
  @ApiOkResponse({ type: CreateCategoryDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  @ApiBody(categoryBody)
  createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const { title } = createCategoryDto;
    return this.categoriesService.createCategory({
      title,
      image: image.filename,
    });
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateCategoryDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(categoryBody)
  updateCategory(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { title } = updateAuthorDto;
    return this.categoriesService.updateCategory(id, {
      title,
      image: image.filename,
    });
  }

  @Delete('wipe')
  deleteAllCategories() {
    return this.categoriesService.deleteAllCategories();
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
