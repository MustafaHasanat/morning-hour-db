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
  Res,
  UploadedFiles,
  UseFilters,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storeLocalFile } from 'src/utils/storage';
import { Response } from 'express';
import { itemBody } from './dto/item-body';
import { CustomBadRequestFilter } from 'src/decorators/custom-bad-request-filter.decorator';
import { CreateItemDto } from './dto/create-item.dto';

@ApiTags('Items')
@Controller('items')
@UseFilters(CustomBadRequestFilter)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
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
  @ApiBody(itemBody)
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
    } = createItemDto;

    const response: CustomResponseDto = await this.itemsService.createItem({
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
      image: image[0],
      screenshots,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CreateItemDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @ApiBody(itemBody)
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
    } = updateItemDto;

    const response: CustomResponseDto = await this.itemsService.updateItem(id, {
      title,
      description,
      currentPrice,
      oldPrice,
      isBestSelling,
      primaryColor,
      authorId,
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
