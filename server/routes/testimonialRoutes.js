import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, admin } from '../middleware/authMiddleware.js';
import Testimonial from '../models/testimonial.js';

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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Delete a testimonial (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




