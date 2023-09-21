import {
  Body,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseInterceptors,
  Res,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiQuery } from '@nestjs/swagger';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { Response } from 'express';
import { itemBody } from './dto/item-body';
import { CreateItemDto } from './dto/create-item.dto';
import { Public } from 'src/decorators/public.decorator';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';

@ControllerWrapper('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getItems(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.itemsService.getItems(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  @Public()
  async getItemById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.getItemById(id);

    return res.status(response.status).json(response);
  }

  @Get('assets/:imageName')
  @Public()
  async downloadImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(this.itemsService.downloadImage(imageName).data);
  }

  @Post()
  @CreateUpdateWrapper(CreateItemDto, itemBody)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'screenshots', maxCount: 5 },
      ],
      storeLocalFile('items'),
    ),
  )
  async createItem(
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      screenshots: Express.Multer.File[];
    },
    @Body() createItemDto: CreateItemDto,
    @Res() res: Response,
  ) {
    const { image, screenshots } = files;

    const {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      categoryId,
    } = createItemDto;

    const response: CustomResponseDto = await this.itemsService.createItem({
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      categoryId,
      image: image[0],
      screenshots,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @CreateUpdateWrapper(CreateItemDto, itemBody)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'screenshots', maxCount: 5 },
      ],
      storeLocalFile('items'),
    ),
  )
  async updateItem(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      screenshots: Express.Multer.File[];
    },
    @Body() updateItemDto: CreateItemDto,
    @Res() res: Response,
  ) {
    const { image, screenshots } = files;

    const {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      categoryId,
    } = updateItemDto;

    const response: CustomResponseDto = await this.itemsService.updateItem(id, {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      categoryId,
      image: image[0],
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
