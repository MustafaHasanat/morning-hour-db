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
import { CategoryDto, categoryBody } from 'src/dtos/category.dto';
import { CategoryService } from 'src/services/category.service';
import { storeLocalFile } from 'src/utils/storage';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Get('assets/:imageName')
  downloadImage(@Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(this.categoryService.downloadImage(imageName));
  }

  @Post()
  @ApiOkResponse({ type: CategoryDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('categories')))
  @ApiBody(categoryBody)
  createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CategoryDto,
  ) {
    const { title } = createCategoryDto;
    return this.categoryService.createCategory({
      title,
      image: image.filename,
    });
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(categoryBody)
  updateCategory(
    @Param('id') id: string,
    @Body() updateAuthorDto: CategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { title } = updateAuthorDto;
    return this.categoryService.updateCategory(id, {
      title,
      image: image.filename,
    });
  }

  @Delete('wipe')
  deleteAllCategories() {
    return this.categoryService.deleteAllCategories();
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
