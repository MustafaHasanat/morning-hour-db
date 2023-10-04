/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { existsSync, readdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

@Injectable()
export class AssetsService {
  constructor() {}

  private readdirAsync = promisify(readdir);

  downloadImage = (subPath: string, imageName: string) => {
    try {
      const fileDir = join(
        process.cwd(),
        `public/assets/${subPath}/${imageName}`,
      );

      if (!existsSync(fileDir)) {
        return {
          message: "Image doesn't exist",
          data: fileDir,
          status: 404,
        };
      }

      return {
        message: 'Image returned successfully',
        data: fileDir,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  };

  getImagesNames = async (subPath: string) => {
    try {
      const dirPath = `./public/assets/${subPath}/`;
      const response = { path: dirPath };

      const images = await this.readdirAsync(dirPath);
      response['images'] = images || [];

      return {
        message: 'Images returned successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  };
}
