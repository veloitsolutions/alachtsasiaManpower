import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload file
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Return the file path that can be stored in the database
  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
const deleteFile = asyncHandler(async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404);
    throw new Error('File not found');
  }
});

export { uploadFile, deleteFile };
