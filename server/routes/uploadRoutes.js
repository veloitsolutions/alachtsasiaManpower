import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
    'image/webp', 'image/svg+xml', 'image/tiff', 'image/ico', 'image/avif',
    'video/mp4', 'video/webm', 'video/mov', 'video/avi'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb('Error: Only image files (JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, ICO, AVIF) and video files are allowed!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

router.post('/', protect, admin, upload.single('file'), uploadFile);
router.delete('/:filename', protect, admin, deleteFile);

export default router;
