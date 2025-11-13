// Environment-based API configuration
const isDevelopment = import.meta.env.DEV;

import { 
  API_BASE_URL as CONFIG_API_BASE_URL,
  API_BASE_PATH as CONFIG_API_BASE_PATH
} from '../config/apiConfig.js';

const normalizeBaseUrl = (value, { allowTrailingSlash = false } = {}) => {
  if (!value) return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (allowTrailingSlash) {
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const API_BASE_URL = CONFIG_API_BASE_URL;
export const API_BASE_PATH = CONFIG_API_BASE_PATH;

export const QURAN_API_BASE = isDevelopment ? '/api/quran' : 'https://api.quran.com/api/v4';
export const DIRECTUS_BASE_URL = isDevelopment ? '/api/directus' : 'https://directus.d4dx.co';

const legacyEnvBase = normalizeBaseUrl(import.meta.env.VITE_LEGACY_TFH_BASE_URL);
const DEFAULT_LEGACY_BASE = '/api/thafheem';
const REMOTE_LEGACY_BASE = 'https://thafheem.net/thafheem-api';

// Legacy Thafheem public API (Malayalam + blockwise + pageranges)
export const LEGACY_TFH_BASE = legacyEnvBase || DEFAULT_LEGACY_BASE;
export const LEGACY_TFH_REMOTE_BASE = REMOTE_LEGACY_BASE;

// Legacy endpoints - use LEGACY_TFH_BASE (thafheem.net/thafheem-api)
export const AYA_TRANSLATION_API = `${LEGACY_TFH_BASE}/ayatransl`;
export const SURA_NAMES_API = `${LEGACY_TFH_BASE}/suranames/all`;
// Use legacy public endpoint for page ranges (supports /pageranges/:pageId)
export const PAGE_RANGES_API = `${LEGACY_TFH_BASE}/pageranges`;
export const AYAH_AUDIO_TRANSLATION_API = `${LEGACY_TFH_BASE}/ayaaudiotransl`;
export const AYA_RANGES_API = `${LEGACY_TFH_BASE}/ayaranges`;
export const QURAN_TEXT_API = `${LEGACY_TFH_BASE}/qurantext`;
export const QURAN_API_BASE_URL = QURAN_API_BASE;
export const INTERPRETATION_API = `${LEGACY_TFH_BASE}/interpret`;
export const QUIZ_API = `${LEGACY_TFH_BASE}/quizquests`;
export const NOTES_API = `${LEGACY_TFH_BASE}/notes`;
// Add this new endpoint for block-wise translations
export const AYAH_TRANSLATION_API = `${LEGACY_TFH_BASE}/ayatransl`;
// Directus CMS API endpoints
export const DIRECTUS_HOME_BANNER_API = `${DIRECTUS_BASE_URL}/items/thafheem_homebanner`;
export const DIRECTUS_APP_SETTINGS_API = `${DIRECTUS_BASE_URL}/items/thafheem_app_settings`;
export const DIRECTUS_AI_API_CONFIG = `${DIRECTUS_BASE_URL}/items/thafheem_ai_api`;
// Add this to your existing apis.js file
export const TAJWEED_RULES_API = `${API_BASE_PATH}/thajweedrules`;
// Word meanings is a legacy endpoint
export const WORD_MEANINGS_API = `${LEGACY_TFH_BASE}/wordmeanings`;
export const MALARTICLES_API = "https://old.thafheem.net/thaf-api/malarticles";
export const ENGARTICLES_API = "https://old.thafheem.net/thaf-api/engarticles";
export const ARTICLES_API = "https://old.thafheem.net/thaf-api/articles";