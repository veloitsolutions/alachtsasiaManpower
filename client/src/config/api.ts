// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  TESTIMONIALS: `${API_BASE_URL}/api/testimonials`,
  CLIENTS: `${API_BASE_URL}/api/clients`,
  GALLERY: `${API_BASE_URL}/api/gallery`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  USERS: `${API_BASE_URL}/api/users`,
};

export const ASSETS_CONFIG = {
  BASE_URL: ASSETS_BASE_URL,
  PLACEHOLDER_AVATAR: `${ASSETS_BASE_URL}/placeholder-avatar.png`,
};

export default API_ENDPOINTS;
