import express from 'express';
import {
  getClientLogos,
  getClientLogoById,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
} from '../controllers/clientLogoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClientLogos)
  .post(protect, admin, createClientLogo);

router.route('/:id')
  .get(getClientLogoById)
  .put(protect, admin, updateClientLogo)
  .delete(protect, admin, deleteClientLogo);

export default router;
