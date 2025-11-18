import asyncHandler from 'express-async-handler';
import Testimonial from '../models/testimonial.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.json(testimonials);
});

// @desc    Fetch single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404);
    throw new Error('Testimonial not found');
  }
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = asyncHandler(async (req, res) => {
  const { name, position, rating, review } = req.body;

  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    testimonial.name = name || testimonial.name;
    testimonial.position = position || testimonial.position;
    testimonial.rating = rating || testimonial.rating;
    testimonial.review = review || testimonial.review;

    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (testimonial.image) {
        const oldImagePath = path.join(__dirname, '..', testimonial.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      testimonial.image = `/uploads/testimonials/${req.file.filename}`;
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } else {
    res.status(404);
    throw new Error('Testimonial not found');
  }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    // Delete the image file if it exists
    if (testimonial.image) {
      const imagePath = path.join(__dirname, '..', testimonial.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Testimonial.deleteOne({ _id: testimonial._id });
    res.json({ message: 'Testimonial removed' });
  } else {
    res.status(404);
    throw new Error('Testimonial not found');
  }
});

export {
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};