/**
 * API Configuration
 * Centralized configuration for hybrid mode services
 */
// Environment variables with defaults
const USE_API = import.meta.env.VITE_USE_API === 'true' || false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CACHE_ENABLED = import.meta.env.VITE_CACHE_ENABLED !== 'false'; // Default to true
const CACHE_TTL = parseInt(import.meta.env.VITE_CACHE_TTL) || 300000; // 5 minutes default
// API version
const API_VERSION = 'v1';
// Complete API base path
const API_BASE_PATH = `${API_BASE_URL}/api/${API_VERSION}`;
export {
  USE_API,
  API_BASE_URL,
  API_BASE_PATH,
  CACHE_ENABLED,
  CACHE_TTL,
  API_VERSION
};
// Log current configuration
