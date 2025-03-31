import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// === 📁 Тимчасова директорія ===
const tempDir = path.resolve('tmp');

// Якщо tmp не існує — створюємо
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// === 🧠 Налаштування сховища ===
const multerConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const filename = `${uuidv4()}_${base}${ext}`;
    cb(null, filename);
  },
});

// === 🛡️ Фільтр для зображень ===
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// === 📦 Основний upload middleware ===
const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

export default upload;
