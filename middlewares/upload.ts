import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tempDir = path.resolve('tmp');

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const { originalname } = file;
    const filename = `${uuidv4()}_${originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerConfig,
});

export default upload;
