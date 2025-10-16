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
    cb(null, 'uploads/testimonials/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new testimonial (admin only)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    // Position is now optional
    const position = req.body.position || '';
    const image = req.file ? `/uploads/testimonials/${req.file.filename}` : '';

    const testimonial = await Testimonial.create({
      name,
      position, // This will be empty string if not provided
      image,
      rating: Number(rating),
      review,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
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




