import express from 'express';
import {
  createOrUpdateChatNumber,
  getChatNumbers,
  getChatNumber,
  markChatAsRead,
  deleteChatNumber
} from '../controllers/chatNumberController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrUpdateChatNumber);

// Protected routes (Admin only)
router.get('/', protect, getChatNumbers);
router.get('/:id', protect, getChatNumber);
router.put('/:id/read', protect, markChatAsRead);
router.delete('/:id', protect, deleteChatNumber);

export default router;