import {
  Body,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { createAuthorBody } from './dto/create-author.body';
import { updateAuthorBody } from './dto/update-author.body';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { AuthorFields } from 'src/enums/tables-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('authors')
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: AuthorFields,
  })
  async getAuthors(
    @Query()
    query: GetQueryProps<AuthorFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<AuthorFields>[] =
      this.appService.validateGetConditions<AuthorFields>(conditions);

    const response: CustomResponseDto = await this.authorsService.getAuthors({
      sortBy: sortBy || AuthorFields.NAME,
      reverse: reverse === 'true',
      page: Number(page),
      conditions: parsed || [],
    });
    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getAuthorById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.getAuthorById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @AdminsOnly()
  @CreateUpdateWrapper(CreateAuthorDto, createAuthorBody)
  async createAuthor(
    @UploadedFile() image: Express.Multer.File,
    @Body() createAuthorDto: CreateAuthorDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.authorsService.createAuthor({
      ...createAuthorDto,
      image,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateAuthorDto, updateAuthorBody)
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.authorsService.updateAuthor(
      id,
      {
        ...updateAuthorDto,
        image,
      },
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  async deleteAllAuthors(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.deleteAllAuthors();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @AdminsOnly()
  async deleteAuthor(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.authorsService.deleteAuthor(id);

    return res.status(response.status).json(response);
  }
}
