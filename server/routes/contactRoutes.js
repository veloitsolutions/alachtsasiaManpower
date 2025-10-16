import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContactReadStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(protect, admin, getContacts);

router.route('/:id')
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContactReadStatus)
  .delete(protect, admin, deleteContact);

export default router;
