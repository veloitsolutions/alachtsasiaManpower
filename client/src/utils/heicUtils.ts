import heic2any from 'heic2any';

/**
 * Check if a file is HEIC/HEIF format
 */
export const isHeicFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return name.endsWith('.heic') || name.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
};

/**
 * Convert HEIC file to JPEG blob for preview
 */
export const convertHeicToJpeg = async (file: File): Promise<Blob> => {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    // heic2any can return Blob or Blob[], handle both cases
    return Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error);
    throw new Error('Failed to convert HEIC image');
  }
};

/**
 * Create a preview URL for any image file, including HEIC
 */
export const createImagePreviewUrl = async (file: File): Promise<string> => {
  if (isHeicFile(file)) {
    const convertedBlob = await convertHeicToJpeg(file);
    return URL.createObjectURL(convertedBlob);
  }
  return URL.createObjectURL(file);
};

/**
 * Convert HEIC file to a File object with JPEG format
 */
export const convertHeicToJpegFile = async (file: File): Promise<File> => {
  if (!isHeicFile(file)) {
    return file;
  }

  const convertedBlob = await convertHeicToJpeg(file);
  const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
  
  return new File([convertedBlob], newFileName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
};