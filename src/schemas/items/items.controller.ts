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
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { Response } from 'express';
import { createItemBody } from './dto/create-item.body';
import { CreateItemDto } from './dto/create-item.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { UpdateItemDto } from './dto/update-item.dto';
import { updateItemBody } from './dto/update-item.body';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { ItemFields } from 'src/enums/sorting-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: ItemFields,
  })
  async getItems(
    @Query()
    query: GetQueryProps<ItemFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<ItemFields>[] =
      this.appService.validateGetConditions<ItemFields>(conditions);

    const response: CustomResponseDto = await this.itemsService.getItems({
      sortBy: sortBy || ItemFields.TITLE,
      reverse: reverse === 'true',
      page: Number(page),
      conditions: parsed || [],
    });
    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getItemById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.getItemById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @AdminsOnly()
  @CreateUpdateWrapper(CreateItemDto, createItemBody)
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

    const response: CustomResponseDto = await this.itemsService.createItem({
      ...createItemDto,
      image: image[0],
      screenshots,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateItemDto, updateItemBody)
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
    @Body() updateItemDto: UpdateItemDto,
    @Res() res: Response,
  ) {
    const { image, screenshots } = files;

    const response: CustomResponseDto = await this.itemsService.updateItem(id, {
      ...updateItemDto,
      image: image[0],
      screenshots,
    });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  async deleteAllItems(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.itemsService.deleteAllItems();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @AdminsOnly()
  async deleteItem(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.itemsService.deleteItem(id);

    return res.status(response.status).json(response);
  }
}
