// Development proxy configuration to bypass CORS
const isDevelopment = import.meta.env.DEV;
// Force development mode for now to ensure proxy is used
export const API_BASE_URL = '/api/thafheem';
export const QURAN_API_BASE = '/api/quran';
export const DIRECTUS_BASE_URL = '/api/directus';

// Debug logging (only in development)
if (isDevelopment) {
  console.log('API Configuration:', {
    isDevelopment,
    API_BASE_URL,
    QURAN_API_BASE,
    DIRECTUS_BASE_URL,
    currentPort: window.location.port,
    SURA_NAMES_API: `${API_BASE_URL}/suranames/all`
  });
}

export const SURA_NAMES_API = `${API_BASE_URL}/suranames/all`;
export const PAGE_RANGES_API = `${API_BASE_URL}/pageranges/all`;
export const AYAH_AUDIO_TRANSLATION_API = `${API_BASE_URL}/ayaaudiotransl`;
export const AYA_RANGES_API = `${API_BASE_URL}/ayaranges`;
export const AYA_TRANSLATION_API = `${API_BASE_URL}/ayatransl`;
export const QURAN_TEXT_API = `${API_BASE_URL}/qurantext`;
export const QURAN_API_BASE_URL = QURAN_API_BASE;
export const INTERPRETATION_API = `${API_BASE_URL}/interpret`;
export const QUIZ_API = `${API_BASE_URL}/quizquests`;
export const NOTES_API = `${API_BASE_URL}/notes`;

// Directus CMS API endpoints
export const DIRECTUS_HOME_BANNER_API = `${DIRECTUS_BASE_URL}/items/thafheem_homebanner`;
export const DIRECTUS_APP_SETTINGS_API = `${DIRECTUS_BASE_URL}/items/thafheem_app_settings`;
export const DIRECTUS_AI_API_CONFIG = `${DIRECTUS_BASE_URL}/items/thafheem_ai_api`;

