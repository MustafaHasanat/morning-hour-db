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
import { AuthorDto, authorBody } from 'src/dtos/author.dto';
import { AuthorService } from 'src/services/author.service';
import { storeLocalFile } from 'src/utils/storage';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(id);
  }

  @Get('assets/:imageName')
  downloadImage(@Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(this.authorService.downloadImage(imageName));
  }

  @Post()
  @ApiOkResponse({ type: AuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  createAuthor(
    @UploadedFile() image: Express.Multer.File,
    @Body() createAuthorDto: AuthorDto,
  ) {
    const { name, brief } = createAuthorDto;
    return this.authorService.createAuthor({
      name,
      brief,
      image: image.filename,
    });
  }

  @Patch(':id')
  @ApiOkResponse({ type: AuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: AuthorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { name, brief } = updateAuthorDto;
    return this.authorService.updateAuthor(id, {
      name,
      brief,
      image: image.filename,
    });
  }

  @Delete('wipe')
  deleteAllAuthors() {
    return this.authorService.deleteAllAuthors();
  }

  @Delete(':id')
  deleteAuthor(@Param('id') id: string) {
    return this.authorService.deleteAuthor(id);
  }
}
