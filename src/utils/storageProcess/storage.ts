import { diskStorage } from 'multer';
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storeLocalFile = (subPath: string) => {
  return {
    storage: diskStorage({
      destination: './public/assets/' + subPath,
      filename: (req, file, cb) => {
        const filename: string = 'image-' + uuidv4();
        const extension: string = parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      },
    }),
  };
};
