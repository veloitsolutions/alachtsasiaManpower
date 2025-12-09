import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';
import Manpower from '../models/manpower.js';
import { validateImageFile, validateResumeFile, generateSecureFilename } from '../utils/fileValidation.js';
import { convertHeicToJpeg, isHeicFile, getConvertedFilename } from '../utils/heicConverter.js';
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
      const secureFilename = generateSecureFilename(file.originalname);
      cb(null, secureFilename);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo' || file.fieldname === 'passportPhoto' || file.fieldname === 'fullPhoto') {
      // Check file extension for HEIC files (more reliable than MIME type)
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.heic' || ext === '.heif') {
        // Allow HEIC files regardless of MIME type
        cb(null, true);
      } else {
        const validation = validateImageFile(file);
        if (validation.valid) {
          cb(null, true);
        } else {
          cb(new Error(validation.error), false);
        }
      }
    } else if (file.fieldname === 'resume') {
      const validation = validateResumeFile(file);
      if (validation.valid) {
        cb(null, true);
      } else {
        cb(new Error(validation.error), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
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
  { name: 'photo', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'fullPhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    // Convert HEIC images to JPEG if needed
    if (req.files) {
      for (const fieldName of ['photo', 'passportPhoto', 'fullPhoto']) {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          if (isHeicFile(file.filename)) {
            try {
              const inputPath = file.path;
              const convertedFilename = getConvertedFilename(file.filename);
              const outputPath = path.join(path.dirname(inputPath), convertedFilename);
              await convertHeicToJpeg(inputPath, outputPath);
              req.files[fieldName][0].filename = convertedFilename;
              req.files[fieldName][0].path = outputPath;
            } catch (conversionError) {
              console.error(`HEIC conversion error for ${fieldName}:`, conversionError);
              return res.status(400).json({ 
                message: `Failed to process ${fieldName} image. Please try converting to JPG first.`,
                error: conversionError.message 
              });
            }
          }
        }
      }
    }
    await createManpower(req, res);
  } catch (error) {
    console.error('Manpower creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to create worker' });
  }
});

// Update a manpower (admin only)
router.put('/:id', protect, admin, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'fullPhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    // Convert HEIC images to JPEG if needed
    if (req.files) {
      for (const fieldName of ['photo', 'passportPhoto', 'fullPhoto']) {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          if (isHeicFile(file.filename)) {
            try {
              const inputPath = file.path;
              const convertedFilename = getConvertedFilename(file.filename);
              const outputPath = path.join(path.dirname(inputPath), convertedFilename);
              await convertHeicToJpeg(inputPath, outputPath);
              req.files[fieldName][0].filename = convertedFilename;
              req.files[fieldName][0].path = outputPath;
            } catch (conversionError) {
              console.error(`HEIC conversion error for ${fieldName}:`, conversionError);
              return res.status(400).json({ 
                message: `Failed to process ${fieldName} image. Please try converting to JPG first.`,
                error: conversionError.message 
              });
            }
          }
        }
      }
    }
    await updateManpower(req, res);
  } catch (error) {
    console.error('Manpower update error:', error);
    res.status(400).json({ message: error.message || 'Failed to update worker' });
  }
});

// Delete a manpower (admin only)
router.delete('/:id', protect, admin, deleteManpower);

export default router;
