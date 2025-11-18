import express from 'express';
import { createChatNumber, getChatNumbers, deleteChatNumber } from '../controllers/chatNumberController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createChatNumber);
router.get('/', protect, getChatNumbers);
router.delete('/:id', protect, deleteChatNumber);

export default router;