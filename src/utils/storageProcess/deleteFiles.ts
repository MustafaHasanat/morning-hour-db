import { existsSync, unlinkSync, readdir } from 'fs';

/**
 * delete the file specified by the path
 *
 * @param filePath
 */
export const deleteFile = (filePath: string) => {
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath);
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * delete all files in the path
 *
 * @param dirPath
 */
export const deleteFiles = (dirPath: string) => {
  readdir(dirPath, (error, images) => {
    if (error) {
      console.error('Error reading directory:', error);
      return;
    }

    images.forEach((imageName) => {
      deleteFile(dirPath + imageName);
    });
  });
};
