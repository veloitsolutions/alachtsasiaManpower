import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Convert HEIC image to JPEG format using Sharp
 * @param {string} inputPath - Path to the HEIC file
 * @param {string} outputPath - Path where the JPEG file should be saved
 * @returns {Promise<string>} - Path to the converted JPEG file
 */
export const convertHeicToJpeg = async (inputPath, outputPath) => {
  try {
    console.log(`Converting HEIC file: ${path.basename(inputPath)}`);
    
    // Read the HEIC file and convert to JPEG
    // Sharp automatically detects HEIC format
    const image = sharp(inputPath);
    
    // Get metadata to verify the image
    const metadata = await image.metadata();
    console.log(`Image format detected: ${metadata.format}, size: ${metadata.width}x${metadata.height}`);
    
    // Convert to JPEG with high quality
    await image
      .jpeg({ 
        quality: 90, 
        mozjpeg: true,
        force: true // Force JPEG output
      })
      .toFile(outputPath);

    console.log(`Successfully converted to JPEG: ${path.basename(outputPath)}`);

    // Delete the original HEIC file after successful conversion
    if (fs.existsSync(inputPath)) {
      await fs.promises.unlink(inputPath);
      console.log(`Deleted original HEIC file: ${path.basename(inputPath)}`);
    }

    return outputPath;
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error);
    console.error('Input path:', inputPath);
    console.error('Output path:', outputPath);
    
    // Clean up output file if it was partially created
    if (fs.existsSync(outputPath)) {
      try {
        await fs.promises.unlink(outputPath);
      } catch (cleanupError) {
        console.error('Error cleaning up output file:', cleanupError);
      }
    }
    
    throw new Error(`Failed to convert HEIC image: ${error.message}`);
  }
};

/**
 * Check if a file is HEIC format
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file is HEIC
 */
export const isHeicFile = (filename) => {
  if (!filename) return false;
  const ext = path.extname(filename).toLowerCase();
  return ext === '.heic' || ext === '.heif';
};

/**
 * Get the output filename for a converted HEIC file
 * @param {string} originalFilename - The original HEIC filename
 * @returns {string} - The new filename with .jpg extension
 */
export const getConvertedFilename = (originalFilename) => {
  const nameWithoutExt = path.basename(originalFilename, path.extname(originalFilename));
  return `${nameWithoutExt}.jpg`;
};