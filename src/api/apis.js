export const SURA_NAMES_API = `${
  import.meta.env.VITE_API_BASE_URL
}/suranames/all`;
export const PAGE_RANGES_API = `${
  import.meta.env.VITE_API_BASE_URL
}/pageranges/all`;
export const AYAH_AUDIO_TRANSLATION_API = `${
  import.meta.env.VITE_API_BASE_URL
}/ayaaudiotransl`;
export const AYA_RANGES_API = `${import.meta.env.VITE_API_BASE_URL}/ayaranges`;
export const QURAN_TEXT_API = `${import.meta.env.VITE_API_BASE_URL}/qurantext`;
export const QURAN_API_BASE = import.meta.env.VITE_QURAN_API_BASE;
export const INTERPRETATION_API = `${import.meta.env.VITE_API_BASE_URL}/interpret`;
export const QUIZ_API = `${import.meta.env.VITE_API_BASE_URL}/quizquests`;

// Directus CMS API endpoints
export const DIRECTUS_BASE_URL = import.meta.env.VITE_DIRECTUS_BASE_URL || 'https://directus.d4dx.co';
export const DIRECTUS_HOME_BANNER_API = `${DIRECTUS_BASE_URL}/items/thafheem_homebanner`;
export const DIRECTUS_APP_SETTINGS_API = `${DIRECTUS_BASE_URL}/items/thafheem_app_settings`;
export const DIRECTUS_AI_API_CONFIG = `${DIRECTUS_BASE_URL}/items/thafheem_ai_api`;