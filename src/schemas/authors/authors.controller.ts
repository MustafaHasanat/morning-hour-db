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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { authorBody } from './dto/author-body';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Authors')
@Controller('authors')
@ApiBearerAuth()
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getAuthors(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.authorsService.getAuthors(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  @Public()
  async getAuthorById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.getAuthorById(id);

    return res.status(response.status).json(response);
  }

  @Get('assets/:imageName')
  @Public()
  async downloadImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(this.authorsService.downloadImage(imageName).data);
  }

  @Post()
  @ApiOkResponse({ type: CreateAuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  async createAuthor(
    @UploadedFile() image: Express.Multer.File,
    @Body() createAuthorDto: CreateAuthorDto,
    @Res() res: Response,
  ) {
    const { name, brief } = createAuthorDto;
    const response: CustomResponseDto = await this.authorsService.createAuthor({
      name,
      brief,
      image,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateAuthorDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('authors')))
  @ApiBody(authorBody)
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { name, brief } = updateAuthorDto;
    const response: CustomResponseDto = await this.authorsService.updateAuthor(
      id,
      {
        name,
        brief,
        image,
      },
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllAuthors(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.deleteAllAuthors();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteAuthor(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.deleteAuthor(id);

    return res.status(response.status).json(response);
  }
}
