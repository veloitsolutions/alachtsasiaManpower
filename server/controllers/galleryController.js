import asyncHandler from 'express-async-handler';
import Gallery from '../models/galleryModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = asyncHandler(async (req, res) => {
  const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
  res.json(galleryItems);
});

// @desc    Fetch single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryItemById = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (galleryItem) {
    res.json(galleryItem);
  } else {
    res.status(404);
    throw new Error('Gallery item not found');
  }
});

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = asyncHandler(async (req, res) => {
  const { type, src, caption, thumbnail } = req.body;

  const galleryItem = new Gallery({
    type,
    src,
    caption,
    thumbnail: type === 'video' ? thumbnail : undefined,
  });

  const createdItem = await galleryItem.save();
  res.status(201).json(createdItem);
});

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = asyncHandler(async (req, res) => {
  const { type, src, caption, thumbnail } = req.body;

  const galleryItem = await Gallery.findById(req.params.id);

  if (galleryItem) {
    galleryItem.type = type || galleryItem.type;
    galleryItem.src = src || galleryItem.src;
    galleryItem.caption = caption || galleryItem.caption;
    
    if (type === 'video') {
      galleryItem.thumbnail = thumbnail || galleryItem.thumbnail;
    }

    const updatedItem = await galleryItem.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Gallery item not found');
  }
});

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (galleryItem) {
    // Delete the file from the server if it's stored locally
    if (galleryItem.src && galleryItem.src.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', galleryItem.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete thumbnail if it exists and is stored locally
    if (galleryItem.thumbnail && galleryItem.thumbnail.startsWith('/uploads')) {
      const thumbnailPath = path.join(__dirname, '..', galleryItem.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await Gallery.deleteOne({ _id: galleryItem._id });
    res.json({ message: 'Gallery item removed' });
  } else {
    res.status(404);
    throw new Error('Gallery item not found');
  }
});

export {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
