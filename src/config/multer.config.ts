import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (_, file, callback) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        `${uniqueName}${extname(file.originalname)}`,
      );
    },
  }),
  fileFilter: (_, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new Error('Only image files are allowed'),
        false,
      );
    }
    callback(null, true);
  },
};
