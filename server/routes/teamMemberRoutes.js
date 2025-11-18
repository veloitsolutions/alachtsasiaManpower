import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, admin } from '../middleware/authMiddleware.js';
import TeamMember from '../models/teamMember.js';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamMemberController.js';

const router = express.Router();

// Ensure multer is properly configured
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'team-members');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `team-member-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
      'image/webp', 'image/svg+xml', 'image/tiff', 'image/ico', 'image/avif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, ICO, AVIF)'), false);
    }
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

// Get all team members (public)
router.get('/', getTeamMembers);

// Get single team member (public)
router.get('/:id', getTeamMemberById);

// Create a new team member (admin only)
router.post('/', protect, admin, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // const { name, role, bio } = req.body;
    const { name, role } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const image = `/uploads/team-members/${req.file.filename}`;

    const teamMember = await TeamMember.create({
      name,
      role,
      // bio: bio || '',
      image,
    });

    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Team member creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to create team member' });
  }
});

// Update a team member (admin only)
router.put('/:id', protect, admin, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // const { name, role, bio } = req.body;
    const { name, role } = req.body;
    
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Update fields
    teamMember.name = name || teamMember.name;
    teamMember.role = role || teamMember.role;
    // teamMember.bio = bio || teamMember.bio;

    // Update image if new one was uploaded
    if (req.file) {
      // Delete old image
      if (teamMember.image) {
        const oldImagePath = path.join(process.cwd(), teamMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      teamMember.image = `/uploads/team-members/${req.file.filename}`;
    }

    const updatedMember = await teamMember.save();
    res.json(updatedMember);
  } catch (error) {
    console.error('Team member update error:', error);
    res.status(400).json({ message: error.message || 'Failed to update team member' });
  }
});

// Delete a team member (admin only)
router.delete('/:id', protect, admin, deleteTeamMember);

export default router;
