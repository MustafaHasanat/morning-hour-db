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
  UploadedFiles,
  UseFilters,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storeLocalFile } from 'src/utils/storage';
import { Response } from 'express';
import { UpdateItemDto } from './dto/update-item.dto';
import { itemBody } from './dto/item-body';
import { CustomBadRequestFilter } from 'src/decorators/custom-bad-request-filter.decorator';

@ApiTags('Items')
@Controller('items')
@UseFilters(CustomBadRequestFilter)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getAllItems(@Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.getAllItems();

    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getItemById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.getItemById(id);

    return res.status(response.status).json(response);
  }

  @Get('assets/:imageName')
  async downloadImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(this.itemsService.downloadImage(imageName).data);
  }

  @Post()
  @ApiOkResponse({ type: CreateItemDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('items')))
  @UseInterceptors(FilesInterceptor('screenshots', 5, storeLocalFile('items')))
  @ApiBody(itemBody)
  async createItem(
    @UploadedFile() image: Express.Multer.File,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
    @Body() createItemDto: CreateItemDto,
    @Res() res: Response,
  ) {
    const {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
    } = createItemDto;

    console.log(screenshots);

    const response: CustomResponseDto = await this.itemsService.createItem({
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      image,
      screenshots: [],
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateItemDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('items')))
  @UseInterceptors(FilesInterceptor('screenshots', 10, storeLocalFile('items')))
  @ApiBody(itemBody)
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() image: Express.Multer.File,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
    } = updateItemDto;
    const response: CustomResponseDto = await this.itemsService.updateItem(id, {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      image,
      screenshots,
    });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllItems(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.itemsService.deleteAllItems();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.deleteItem(id);

    return res.status(response.status).json(response);
  }
}
