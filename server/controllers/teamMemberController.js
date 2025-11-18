import asyncHandler from 'express-async-handler';
import TeamMember from '../models/teamMember.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all team members
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.find({}).sort({ createdAt: -1 });
  res.json(teamMembers);
});

// @desc    Fetch single team member
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMemberById = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (teamMember) {
    res.json(teamMember);
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

// @desc    Create a team member
// @route   POST /api/team-members
// @access  Private/Admin
const createTeamMember = asyncHandler(async (req, res) => {
  // const { name, role, bio } = req.body;
  const { name, role } = req.body;

  const teamMember = new TeamMember({
    name,
    role,
    // bio: bio || '',
  });

  const createdMember = await teamMember.save();
  res.status(201).json(createdMember);
});

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private/Admin
const updateTeamMember = asyncHandler(async (req, res) => {
  const { name, role } = req.body;

  const teamMember = await TeamMember.findById(req.params.id);

  if (teamMember) {
    teamMember.name = name || teamMember.name;
    teamMember.role = role || teamMember.role;

    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (teamMember.image) {
        const oldImagePath = path.join(__dirname, '..', teamMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      teamMember.image = `/uploads/team-members/${req.file.filename}`;
    }

    const updatedMember = await teamMember.save();
    res.json(updatedMember);
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private/Admin
const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (teamMember) {
    // Delete the image file if it exists
    if (teamMember.image) {
      const imagePath = path.join(__dirname, '..', teamMember.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await TeamMember.deleteOne({ _id: teamMember._id });
    res.json({ message: 'Team member removed' });
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

export {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
