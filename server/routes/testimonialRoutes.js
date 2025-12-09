import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, admin } from '../middleware/authMiddleware.js';
import Testimonial from '../models/testimonial.js';
import {
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { convertHeicToJpeg, isHeicFile, getConvertedFilename } from '../utils/heicConverter.js';

const router = express.Router();

// Ensure multer is properly configured
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'testimonials');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
      'image/webp', 'image/svg+xml', 'image/tiff', 'image/ico', 'image/avif',
      'image/heic', 'image/heif'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico', '.avif', '.heic', '.heif'];
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, ICO, AVIF, HEIC)'), false);
    }
  }
});

// Get all testimonials (public)
router.get('/', getTestimonials);

// Get single testimonial
router.get('/:id', getTestimonialById);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Create a new testimonial (admin only)
router.post('/', protect, admin, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    // Position is now optional
    const position = req.body.position || '';
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    // Convert HEIC to JPEG if needed
    if (isHeicFile(req.file.filename)) {
      const inputPath = req.file.path;
      const convertedFilename = getConvertedFilename(req.file.filename);
      const outputPath = path.join(path.dirname(inputPath), convertedFilename);
      await convertHeicToJpeg(inputPath, outputPath);
      req.file.filename = convertedFilename;
      req.file.path = outputPath;
    }
    
    const image = `/uploads/testimonials/${req.file.filename}`;

    const testimonial = await Testimonial.create({
      name,
      position, // This will be empty string if not provided
      image,
      rating: Number(rating),
      review,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to create testimonial' });
  }
});

// Update a testimonial (admin only)
router.put('/:id', protect, admin, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // Convert HEIC to JPEG if needed
    if (req.file && isHeicFile(req.file.filename)) {
      const inputPath = req.file.path;
      const convertedFilename = getConvertedFilename(req.file.filename);
      const outputPath = path.join(path.dirname(inputPath), convertedFilename);
      await convertHeicToJpeg(inputPath, outputPath);
      req.file.filename = convertedFilename;
      req.file.path = outputPath;
    }
    await updateTestimonial(req, res);
  } catch (error) {
    console.error('Testimonial update error:', error);
    res.status(400).json({ message: error.message || 'Failed to update testimonial' });
  }
});

// Delete a testimonial (admin only)
router.delete('/:id', protect, admin, deleteTestimonial);

export default router;




