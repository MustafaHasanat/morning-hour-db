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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { storeLocalFile } from 'src/utils/storage';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { authorBody } from './dto/author-body';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  getAllAuthors() {
    return this.authorsService.getAllAuthors();
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string) {
    return this.authorsService.getAuthorById(id);
  }

  @Get('assets/:imageName')
  downloadImage(@Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(this.authorsService.downloadImage(imageName));
  }

  @Post()
  @ApiOkResponse({ type: CreateAuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  createAuthor(
    @UploadedFile() image: Express.Multer.File,
    @Body() createAuthorDto: CreateAuthorDto,
  ) {
    const { name, brief } = createAuthorDto;
    return this.authorsService.createAuthor({
      name,
      brief,
      image: image.filename,
    });
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateAuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { name, brief } = updateAuthorDto;
    return this.authorsService.updateAuthor(id, {
      name,
      brief,
      image: image.filename,
    });
  }

  @Delete('wipe')
  deleteAllAuthors() {
    return this.authorsService.deleteAllAuthors();
  }

  @Delete(':id')
  deleteAuthor(@Param('id') id: string) {
    return this.authorsService.deleteAuthor(id);
  }
}
