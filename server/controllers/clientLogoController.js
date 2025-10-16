import asyncHandler from 'express-async-handler';
import ClientLogo from '../models/clientLogoModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all client logos
// @route   GET /api/clients
// @access  Public
const getClientLogos = asyncHandler(async (req, res) => {
  const clientLogos = await ClientLogo.find({}).sort({ createdAt: -1 });
  res.json(clientLogos);
});

// @desc    Fetch single client logo
// @route   GET /api/clients/:id
// @access  Public
const getClientLogoById = asyncHandler(async (req, res) => {
  const clientLogo = await ClientLogo.findById(req.params.id);

  if (clientLogo) {
    res.json(clientLogo);
  } else {
    res.status(404);
    throw new Error('Client logo not found');
  }
});

// @desc    Create a client logo
// @route   POST /api/clients
// @access  Private/Admin
const createClientLogo = asyncHandler(async (req, res) => {
  const { name, logo } = req.body;

  const clientLogo = new ClientLogo({
    name,
    logo,
  });

  const createdLogo = await clientLogo.save();
  res.status(201).json(createdLogo);
});

// @desc    Update a client logo
// @route   PUT /api/clients/:id
// @access  Private/Admin
const updateClientLogo = asyncHandler(async (req, res) => {
  const { name, logo } = req.body;

  const clientLogo = await ClientLogo.findById(req.params.id);

  if (clientLogo) {
    clientLogo.name = name || clientLogo.name;
    clientLogo.logo = logo || clientLogo.logo;

    const updatedLogo = await clientLogo.save();
    res.json(updatedLogo);
  } else {
    res.status(404);
    throw new Error('Client logo not found');
  }
});

// @desc    Delete a client logo
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClientLogo = asyncHandler(async (req, res) => {
  const clientLogo = await ClientLogo.findById(req.params.id);

  if (clientLogo) {
    // Delete the file from the server if it's stored locally
    if (clientLogo.logo && clientLogo.logo.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', clientLogo.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await ClientLogo.deleteOne({ _id: clientLogo._id });
    res.json({ message: 'Client logo removed' });
  } else {
    res.status(404);
    throw new Error('Client logo not found');
  }
});

export {
  getClientLogos,
  getClientLogoById,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
};
