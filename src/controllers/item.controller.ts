// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   UsePipes,
//   ValidationPipe,
//   Delete,
//   Patch,
//   UseInterceptors,
//   UploadedFile,
//   Res,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { ItemDto, itemBody } from 'src/dtos/item.dto';
// import { ItemService } from 'src/services/item.service';
// import { storeLocalFile } from 'src/utils/storage';

// @ApiTags('Items')
// @Controller('items')
// export class ItemController {
//   constructor(private readonly itemService: ItemService) {}

//   @Get()
//   getAllItems() {
//     return this.itemService.getAllItems();
//   }

//   @Get(':id')
//   getItemById(@Param('id') id: string) {
//     return this.itemService.getItemById(id);
//   }

//   @Get('assets/:imageName')
//   downloadImage(@Param('imageName') imageName: string, @Res() res) {
//     return res.sendFile(this.itemService.downloadImage(imageName));
//   }

//   @Post()
//   @ApiOkResponse({ type: ItemDto })
//   @UsePipes(ValidationPipe)
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('image', storeLocalFile('items')))
//   @ApiBody(itemBody)
//   createItem(
//     @UploadedFile() image: Express.Multer.File,
//     @UploadedFile() screenshots: Express.Multer.File[],
//     @Body() createItemDto: ItemDto,
//   ) {
//     const {
//       title,
//       description,
//       currentPrice,
//       oldPrice,
//       isBestSelling,
//       primaryColor,
//       category,
//       author,
//     } = createItemDto;
//     return this.itemService.createItem({
//       title,
//       description,
//       currentPrice,
//       oldPrice,
//       isBestSelling,
//       primaryColor,
//       category,
//       author,
//       image: image.filename,
//       screenshots: screenshots.map((img) => img.filename),
//     });
//   }

//   @Patch(':id')
//   @ApiOkResponse({ type: ItemDto })
//   @UsePipes(ValidationPipe)
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('image', storeLocalFile('items')))
//   @ApiBody(itemBody)
//   updateItem(
//     @Param('id') id: string,
//     @Body() updateItemDto: ItemDto,
//     @UploadedFile() image: Express.Multer.File,
//     @UploadedFile() screenshots: Express.Multer.File[],
//   ) {
//     const {
//       title,
//       description,
//       currentPrice,
//       oldPrice,
//       isBestSelling,
//       primaryColor,
//       category,
//       author,
//     } = updateItemDto;
//     return this.itemService.updateItem(id, {
//       title,
//       description,
//       currentPrice,
//       oldPrice,
//       isBestSelling,
//       primaryColor,
//       category,
//       author,
//       image: image.filename,
//       screenshots: screenshots.map((img) => img.filename),
//     });
//   }

//   @Delete('wipe')
//   deleteAllItems() {
//     return this.itemService.deleteAllItems();
//   }

//   @Delete(':id')
//   deleteItem(@Param('id') id: string) {
//     return this.itemService.deleteItem(id);
//   }
// }
