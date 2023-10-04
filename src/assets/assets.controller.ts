import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { AssetsService } from './assets.service';
import { Get, Query, Res } from '@nestjs/common';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { TablesAssets } from 'src/enums/tables-assets.enum';
import { AdminsOnly } from 'src/decorators/admins.decorator';

@ControllerWrapper('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('images')
  @AdminsOnly()
  @ApiQuery({
    name: 'tableName',
    type: 'enum',
    enum: TablesAssets,
    required: true,
  })
  async getImagesNames(
    @Query() query: { tableName: TablesAssets },
    @Res() res: Response,
  ) {
    const { tableName } = query;
    const response: CustomResponseDto =
      await this.assetsService.getImagesNames(tableName);

    return res.status(response.status).json(response);
  }

  @Get('download')
  @AdminsOnly()
  @ApiQuery({ name: 'imageName', type: 'string', required: true })
  @ApiQuery({
    name: 'tableName',
    type: 'enum',
    enum: TablesAssets,
    required: true,
  })
  async downloadImage(
    @Query() query: { imageName: string; tableName: TablesAssets },
    @Res() res: Response,
  ) {
    const { imageName, tableName } = query;
    const response = this.assetsService.downloadImage(tableName, imageName);

    if (response.status !== 200) {
      return res.status(200).json({
        message: 'Error ocurred',
        data: { path: response.data, message: response.message },
        status: 500,
      });
    }

    return res.sendFile(response.data);
  }
}
