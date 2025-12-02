import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  trackAnalyticsEvents,
  getWorkerStats
} from '../controllers/analyticsController.js';

const router = express.Router();

// Track analytics events (public)
router.post('/save', trackAnalyticsEvents);

// Get worker stats (admin only)
router.post('/worker-data', protect, admin, getWorkerStats);

export default router;
