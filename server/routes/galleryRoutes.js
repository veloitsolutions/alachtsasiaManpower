import express from 'express';
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGalleryItems)
  .post(protect, admin, createGalleryItem);

router.route('/:id')
  .get(getGalleryItemById)
  .put(protect, admin, updateGalleryItem)
  .delete(protect, admin, deleteGalleryItem);

export default router;
