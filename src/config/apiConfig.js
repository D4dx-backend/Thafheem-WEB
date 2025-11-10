/**
 * API Configuration
 * Centralized configuration for hybrid mode services
 */
// Environment variables with defaults
// Default to true (use API) - set VITE_USE_API=false to use SQL.js fallback
const USE_API = import.meta.env.VITE_USE_API !== 'false';
// Default to remote API - only use localhost if explicitly set to localhost:5000
// This allows the app to work with the remote API by default
const isDevelopment = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;
// If VITE_API_BASE_URL is explicitly set, use it; otherwise default to remote API
const API_BASE_URL = envApiUrl || 'https://thafheemapi.thafheem.net';
const CACHE_ENABLED = import.meta.env.VITE_CACHE_ENABLED !== 'false'; // Default to true
const CACHE_TTL = parseInt(import.meta.env.VITE_CACHE_TTL) || 300000; // 5 minutes default
// API version (optional) - falls back to unversioned /api when not provided
const envApiVersion = import.meta.env.VITE_API_VERSION;
const API_VERSION = envApiVersion && envApiVersion.trim() !== '' ? envApiVersion.trim() : '';
// Complete API base path
const API_BASE_PATH = `${API_BASE_URL}/api${API_VERSION ? `/${API_VERSION}` : ''}`;
export {
  USE_API,
  API_BASE_URL,
  API_BASE_PATH,
  CACHE_ENABLED,
  CACHE_TTL,
  API_VERSION
};
