/**
 * API Configuration
 * Centralized configuration for API services
 * All data now comes from MySQL database via API (no fallbacks)
 */
const isDevelopment = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_DEV_API_URL = 'http://localhost:5000';
const DEFAULT_PROD_API_URL = 'https://thafheemapi.thafheem.net';

// Prefer explicit env override; otherwise auto-pick dev vs prod default
const API_BASE_URL = envApiUrl
  ? envApiUrl.trim()
  : (isDevelopment ? DEFAULT_DEV_API_URL : DEFAULT_PROD_API_URL);
// API version (optional) - falls back to unversioned /api when not provided
const envApiVersion = import.meta.env.VITE_API_VERSION;
const API_VERSION = envApiVersion && envApiVersion.trim() !== '' ? envApiVersion.trim() : '';
// Complete API base path
const API_BASE_PATH = `${API_BASE_URL}/api${API_VERSION ? `/${API_VERSION}` : ''}`;

export {
  API_BASE_URL,
  API_BASE_PATH,
  API_VERSION
};
