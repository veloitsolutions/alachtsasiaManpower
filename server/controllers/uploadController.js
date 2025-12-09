import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { fileURLToPath } from 'url';
import { convertHeicToJpeg, isHeicFile, getConvertedFilename } from '../utils/heicConverter.js';

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

  let finalFilename = req.file.filename;
  
  // Check if the uploaded file is HEIC and convert it
  if (isHeicFile(req.file.filename)) {
    try {
      const inputPath = req.file.path;
      const convertedFilename = getConvertedFilename(req.file.filename);
      const outputPath = path.join(path.dirname(inputPath), convertedFilename);
      
      await convertHeicToJpeg(inputPath, outputPath);
      finalFilename = convertedFilename;
      
      console.log(`Converted HEIC to JPEG: ${finalFilename}`);
    } catch (error) {
      console.error('HEIC conversion error:', error);
      res.status(500);
      throw new Error('Failed to process HEIC image');
    }
  }

  // Return the file path that can be stored in the database
  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${finalFilename}`,
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
