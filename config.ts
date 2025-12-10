// API Configuration
// In production, API requests go through Nginx reverse proxy at /api/
// In development, you can set VITE_API_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  parse: `${API_BASE_URL}/parse`,
  download: `${API_BASE_URL}/download`,
} as const;
