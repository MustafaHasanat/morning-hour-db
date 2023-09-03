import fs from 'fs';

const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log('File deleted successfully');
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log('File not found');
  }
};

export default deleteFile;
