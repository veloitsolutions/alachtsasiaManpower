import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';
import Manpower from '../models/manpower.js';
import {
  getManpower,
  getManpowerById,
  createManpower,
  updateManpower,
  deleteManpower,
  getFilterOptions,
} from '../controllers/manpowerController.js';

const router = express.Router();

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'manpower');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `worker-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'manpower', 'resumes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Configure multer for multiple file types
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
      if (file.fieldname === 'resume') {
        uploadPath = path.join(process.cwd(), 'uploads', 'manpower', 'resumes');
      } else {
        uploadPath = path.join(process.cwd(), 'uploads', 'manpower');
      }
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const prefix = file.fieldname === 'resume' ? 'resume' : 'worker';
      cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' || file.fieldname === 'photo') {
      const allowedImageTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
        'image/webp', 'image/svg+xml', 'image/tiff', 'image/ico', 'image/avif'
      ];
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for profile picture'), false);
      }
    } else if (file.fieldname === 'resume') {
      const allowedResumeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', // for .txt files
        'application/rtf', // for .rtf files
      ];
      if (allowedResumeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, DOC, DOCX, TXT, and RTF files are allowed for resume'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Get filter options (public)
router.get('/filters/options', getFilterOptions);

// Get all manpower (public with filters)
router.get('/', getManpower);

// Get single manpower (public)
router.get('/:id', getManpowerById);

// Create a new manpower (admin only)
router.post('/', protect, admin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    // Use the controller function instead of duplicating logic
    req.body.photo = req.files?.photo || req.files?.image;
    req.body.resume = req.files?.resume;
    
    await createManpower(req, res);
  } catch (error) {
    console.error('Manpower creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to create worker' });
  }
});

// Update a manpower (admin only)
router.put('/:id', protect, admin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    // Use the controller function instead of duplicating logic
    await updateManpower(req, res);
  } catch (error) {
    console.error('Manpower update error:', error);
    res.status(400).json({ message: error.message || 'Failed to update worker' });
  }
});

// Delete a manpower (admin only)
router.delete('/:id', protect, admin, deleteManpower);

export default router;
