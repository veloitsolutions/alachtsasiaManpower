import path from 'path';
import crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10MB

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return { valid: false, error: 'Invalid file extension' };
  }
  
  return { valid: true };
};

export const validateResumeFile = (file) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  if (!ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Only PDF and Word documents are allowed' };
  }
  
  if (file.size > MAX_RESUME_SIZE) {
    return { valid: false, error: 'Resume size must be less than 10MB' };
  }
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.pdf', '.doc', '.docx'].includes(ext)) {
    return { valid: false, error: 'Invalid file extension' };
  }
  
  return { valid: true };
};

export const generateSecureFilename = (originalname) => {
  const ext = path.extname(originalname);
  const randomString = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${randomString}-${timestamp}${ext}`;
};

export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};
