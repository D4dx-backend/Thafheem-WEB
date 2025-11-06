// Environment-based API configuration
const isDevelopment = import.meta.env.DEV;
// Prefer explicit env base; default to remote API if not set
const ENV_BASE = import.meta.env.VITE_API_BASE_URL;
// Our backend serves under /api (see Thafheem-API server)
// Default to remote API - only use proxy/localhost if explicitly set
export const API_BASE_URL = ENV_BASE
  ? `${ENV_BASE}/api`
  : 'https://thafheemapi.thafheem.net/api';
export const QURAN_API_BASE = isDevelopment ? '/api/quran' : 'https://api.quran.com/api/v4';
export const DIRECTUS_BASE_URL = isDevelopment ? '/api/directus' : 'https://directus.d4dx.co';
// Legacy Thafheem public API (Malayalam + blockwise + pageranges)
export const LEGACY_TFH_BASE = isDevelopment ? '/api/thafheem' : 'https://thafheem.net/thafheem-api';
// Debug logging (only in development)
if (isDevelopment) {
}
// export const SURA_NAMES_API = `${API_BASE_URL}/suranames/all`;
// export const PAGE_RANGES_API = `${API_BASE_URL}/pageranges/all`;
// export const AYAH_AUDIO_TRANSLATION_API = `${API_BASE_URL}/ayaaudiotransl`;
// export const AYA_RANGES_API = `${API_BASE_URL}/ayaranges`;
// export const QURAN_TEXT_API = `${API_BASE_URL}/qurantext`;
// export const QURAN_API_BASE_URL = QURAN_API_BASE;
// export const INTERPRETATION_API = `${API_BASE_URL}/interpret`;
// export const QUIZ_API = `${API_BASE_URL}/quizquests`;
// export const NOTES_API = `${API_BASE_URL}/notes`;
// export const API_BASE_URL = "/api/thafheem";
// export const QURAN_API_BASE = "/api/quran";
// export const DIRECTUS_BASE_URL = "/api/directus";
// // Debug logging
// console.log("API Configuration:", {
//   isDevelopment,
//   API_BASE_URL,
//   QURAN_API_BASE,
//   DIRECTUS_BASE_URL,
//   currentPort: window.location.port,
//   importMetaEnv: import.meta.env,
//   SURA_NAMES_API: `${API_BASE_URL}/suranames/all`,
// });
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
export const TAJWEED_RULES_API = `${API_BASE_URL}/thajweedrules`;
// Word meanings is a legacy endpoint
export const WORD_MEANINGS_API = `${LEGACY_TFH_BASE}/wordmeanings`;
export const MALARTICLES_API = "https://old.thafheem.net/thaf-api/malarticles";
export const ENGARTICLES_API = "https://old.thafheem.net/thaf-api/engarticles";
export const ARTICLES_API = "https://old.thafheem.net/thaf-api/articles";