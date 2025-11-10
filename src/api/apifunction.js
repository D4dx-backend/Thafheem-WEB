// import { PAGE_RANGES_API, AYAH_AUDIO_TRANSLATION_API, AYA_RANGES_API, AYA_TRANSLATION_API, QURAN_TEXT_API, QURAN_API_BASE_URL, INTERPRETATION_API,QUIZ_API, NOTES_API, DIRECTUS_BASE_URL, API_BASE_URL } from "./apis";

import {
  SURA_NAMES_API,
  PAGE_RANGES_API,
  AYAH_AUDIO_TRANSLATION_API,
  AYA_RANGES_API,
  QURAN_TEXT_API,
  QURAN_API_BASE_URL,
  INTERPRETATION_API,
  QUIZ_API,
  NOTES_API,
  DIRECTUS_BASE_URL,
  API_BASE_URL,
  AYAH_TRANSLATION_API,
  MALARTICLES_API,
  ENGARTICLES_API,
  ARTICLES_API,
  AYA_TRANSLATION_API,
  LEGACY_TFH_BASE,
  LEGACY_TFH_REMOTE_BASE,
  WORD_MEANINGS_API,
  TAJWEED_RULES_API,
  API_BASE_PATH,
} from "./apis";
import { API_BASE_PATH as CONFIG_API_BASE_PATH } from "../config/apiConfig.js";
import { getFallbackTajweedData } from "../data/tajweedFallback";

const isDevelopment = import.meta.env.DEV;

// Session-level tracking to reduce console noise
const apiAvailabilityState = {
  thafheemApiUnavailable: false,
  warningsLogged: new Set(),
  tajweedApiUnavailable: false,
};

// Helper function to log warnings only once per session
const logWarningOnce = (key, message, ...args) => {
  if (!apiAvailabilityState.warningsLogged.has(key)) {
    apiAvailabilityState.warningsLogged.add(key);
    console.warn(message, ...args);
  }
};

// Helper function to add timeout to fetch requests
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors', // Explicitly set CORS mode
    });
    clearTimeout(timeoutId);
    
    // Check if response is HTML (likely an error page)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error(`Received HTML response instead of JSON from ${url}. This usually indicates a CORS or server error.`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout - API took too long to respond");
    }
    // Handle network errors gracefully
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("ERR_CONNECTION_CLOSED") ||
      error.message?.includes("ERR_NETWORK") ||
      error.message?.includes("CORS")
    ) {
      throw new Error("Network error - API server may be unavailable or CORS blocked");
    }
    throw error;
  }
};

// (duplicate import block removed)
const normalizeTranslationLanguage = (language) => {
  const raw = (language ?? '').toString().trim();
  if (!raw) {
    return { apiCode: 'mal', isMalayalam: true, original: 'mal' };
  }

  const lower = raw.toLowerCase();

  if (lower === 'mal' || lower === 'ml' || lower === 'malayalam') {
    return { apiCode: 'mal', isMalayalam: true, original: raw };
  }

  if (lower === 'e' || lower === 'en' || lower === 'eng' || lower === 'english') {
    return { apiCode: 'english', isMalayalam: false, original: raw };
  }

  return { apiCode: lower, isMalayalam: false, original: raw };
};

const getLanguageVariantsForEndpoint = (languageCode) => {
  const variants = [languageCode];

  switch (languageCode) {
    case 'english':
      variants.push('E', 'e', 'en', 'EN');
      break;
    case 'bangla':
      variants.push('bn', 'BN');
      break;
    case 'hindi':
      variants.push('hi', 'HI');
      break;
    case 'tamil':
      variants.push('ta', 'TA');
      break;
    case 'urdu':
      variants.push('ur', 'UR');
      break;
    default:
      break;
  }

  return Array.from(new Set(variants));
};

const blockwiseEndpointState = {
  unsupported: new Set(),
  unsupportedCanonical: new Set(),
};

const getEndpointKey = (base, variant) => `${base}|${variant || ''}`;
const getCanonicalEndpointKey = (base, canonicalLanguage) => `${base}::${canonicalLanguage}`;

const normalizeBlockTranslationPayload = (payload) => {
  if (!payload) return payload;

  const normalizeItem = (item) => {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const translationText =
      item.TranslationText ??
      item.translation_text ??
      item.translationText ??
      item.text ??
      '';

    return {
      ...item,
      TranslationText: translationText,
    };
  };

  if (Array.isArray(payload)) {
    return payload.map(normalizeItem);
  }

  if (Array.isArray(payload.translations)) {
    return payload.translations.map(normalizeItem);
  }

  if (payload.translation_text || payload.translationText || payload.text) {
    return normalizeItem(payload);
  }

  return payload;
};

export const fetchAyaTranslation = async (surahId, range, language = 'mal', retries = 2) => {
  // Malayalam uses legacy base; others use new backend
  const { apiCode: resolvedLanguage, isMalayalam } = normalizeTranslationLanguage(language);
  const apiBase = CONFIG_API_BASE_PATH || API_BASE_PATH;

  const primaryBases = isMalayalam
    ? Array.from(new Set([LEGACY_TFH_BASE, LEGACY_TFH_REMOTE_BASE].filter(Boolean)))
    : [];

  const fallbackBases = [];

  if (!isMalayalam) {
    // For English, skip the hosted API (it doesn't support blockwise yet)
    if (resolvedLanguage === 'english') {
      if (isDevelopment) {
        primaryBases.push('http://localhost:5000/api');
      }
      primaryBases.push(LEGACY_TFH_BASE, LEGACY_TFH_REMOTE_BASE);
    } else {
      // For other languages, try hosted API first
      primaryBases.push(apiBase);
      if (isDevelopment) {
        fallbackBases.push('http://localhost:5000/api');
      }
    }
  }

  const baseCandidates = Array.from(new Set([...primaryBases, ...fallbackBases].filter(Boolean)));
  const languageVariants = isMalayalam ? [''] : getLanguageVariantsForEndpoint(resolvedLanguage);

  // Increase timeout for block translations (15 seconds)
  const timeout = 15000;

  let lastError = null;

  for (let baseIndex = 0; baseIndex < baseCandidates.length; baseIndex++) {
    const base = baseCandidates[baseIndex];
    const canonicalKey = getCanonicalEndpointKey(base, resolvedLanguage);

    for (let langIndex = 0; langIndex < languageVariants.length; langIndex++) {
      const variant = languageVariants[langIndex];
      const langSuffix = isMalayalam ? '' : `/${variant}`;
      const endpointKey = getEndpointKey(base, variant);

      if (!isMalayalam) {
        if (blockwiseEndpointState.unsupportedCanonical.has(canonicalKey)) {
          continue;
        }
        if (blockwiseEndpointState.unsupported.has(endpointKey)) {
          continue;
        }
      }

      // Prefer skipping remote APIs that already failed for the canonical language
      if (!isMalayalam && blockwiseEndpointState.unsupportedCanonical.has(canonicalKey)) {
        continue;
      }

      let shouldSkipVariant = false;
      const url = `${base}/ayatransl/${surahId}/${range}${langSuffix}`;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await fetchWithTimeout(url, {}, timeout);
          if (!response.ok) {
            if (!isMalayalam && response.status === 404) {
              blockwiseEndpointState.unsupportedCanonical.add(canonicalKey);
              languageVariants.forEach((variantValue) => {
                blockwiseEndpointState.unsupported.add(getEndpointKey(base, variantValue));
              });
              logWarningOnce(
                `blockwise-unsupported-${canonicalKey}`,
                `⚠️ Block translation not available for '${variant}' at ${base}. Falling back to legacy source.`
              );
              lastError = new Error(`Block translation endpoint not available for language '${variant}' at ${base}`);
              shouldSkipVariant = true;
              break;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return normalizeBlockTranslationPayload(data);
        } catch (error) {
          if (shouldSkipVariant) {
            break;
          }

          lastError = error;
          const isLastAttemptForVariant = attempt === retries;
          const isTimeout = error.message?.includes('timeout');

          // Only log errors on the last attempt or if not a timeout (to reduce spam)
          if (isLastAttemptForVariant || !isTimeout) {
            console.error(`Error fetching translation from ${url} for ${surahId}:${range}${language ? ':' + language : ''}${retries > 0 ? ` (attempt ${attempt + 1}/${retries + 1})` : ''}:`, error.message);
          }

          if (isLastAttemptForVariant) {
            const hasMoreVariants = langIndex < languageVariants.length - 1;
            const hasAnotherBase = baseIndex < baseCandidates.length - 1;

            if (isMalayalam && hasAnotherBase) {
              logWarningOnce(
                'malayalam-legacy-fallback',
                '⚠️ Malayalam translation proxy unavailable, retrying direct legacy API.'
              );
            }

            if (!hasMoreVariants && !hasAnotherBase) {
              // Exhausted variants and bases for this request
              break;
            }
          }

          // Exponential backoff: wait 1s, then 2s before retries
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      if (shouldSkipVariant) {
        continue;
      }
      if (lastError === null) {
        break;
      }
    }
  }

  throw lastError || new Error('Failed to fetch translation');
};
export const fetchSurahs = async () => {
  try {
    // Skip Thafheem API if endpoint doesn't exist (default prod backend)
    const shouldSkipThafheemAPI = !import.meta.env.VITE_API_BASE_URL && 
                                   !import.meta.env.DEV && 
                                   SURA_NAMES_API.includes('thafheemapi.thafheem.net');
    
    let surahResponse = null;
    let surahData = null;
    
    if (!shouldSkipThafheemAPI) {
      try {
        // Fetch both surah names and page ranges to get accurate ayah counts
        surahResponse = await fetchWithTimeout(SURA_NAMES_API, {}, 8000);
        
        // Check if response is HTML (likely 404 error page)
        const contentType = surahResponse.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Received HTML response, endpoint likely unavailable');
        }
        
        if (!surahResponse.ok) {
          throw new Error(`HTTP error! status: ${surahResponse.status}`);
        }
        
        surahData = await surahResponse.json();
        // Reset availability state on success
        apiAvailabilityState.thafheemApiUnavailable = false;
      } catch (apiError) {
        // If API fails, fall through to Quran.com fallback below
        apiAvailabilityState.thafheemApiUnavailable = true;
        logWarningOnce(
          'surahs-api-unavailable',
          '⚠️ Thafheem API unavailable, using fallback.',
          apiError.message
        );
        surahResponse = null;
      }
    }
    
    // If we got data from API, use it; otherwise fallback
    if (surahData && Array.isArray(surahData) && surahData.length > 0) {
      const pageRangesResponse = await fetchPageRanges().catch(() => []); // Don't fail if page ranges unavailable

      // Create a function to get accurate ayah count from page ranges
      const getAyahCountFromPageRanges = (surahId, pageRanges) => {
        const surahRanges = pageRanges.filter(
          (range) => range.SuraId === surahId
        );
        if (surahRanges.length === 0) return null;

        // Find the maximum ayato value for this surah
        return Math.max(...surahRanges.map((range) => range.ayato));
      };

      const result = surahData.map((surah) => {
        // Get ayah count from page ranges API if available, otherwise use original data
        const ayahCountFromPageRanges = getAyahCountFromPageRanges(
          surah.SuraID,
          pageRangesResponse
        );
        const ayahCount = ayahCountFromPageRanges || surah.TotalAyas;

        return {
          number: surah.SuraID,
          arabic: surah.ASuraName?.trim(),
          name: surah.ESuraName?.trim(),
          ayahs: ayahCount,
          type: surah.SuraType === "Makkan" ? "Makki" : "Madani",
        };
      });

      // Successfully fetched surahs with accurate ayah counts
      return result;
    }

    // Fallback to Quran.com API
    logWarningOnce(
      'surahs-fallback',
      '📡 Using Quran.com API as fallback for surah data'
    );
    try {
      const fallbackResponse = await fetchWithTimeout(
        `${QURAN_API_BASE_URL}/chapters`,
        {},
        8000
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const result = fallbackData.chapters.map((chapter) => ({
          number: chapter.id,
          arabic: chapter.name_arabic,
          name: chapter.name_simple,
          ayahs: chapter.verses_count,
          type: chapter.revelation_place === "makkah" ? "Makki" : "Madani",
        }));

        // Successfully fetched surahs from Quran.com fallback API
        return result;
      }
    } catch (fallbackError) {
      logWarningOnce(
        'surahs-fallback-failed',
        '❌ Quran.com fallback also failed:',
        fallbackError.message
      );
    }
  } catch (error) {
    logWarningOnce(
      'surahs-error',
      '⚠️ Error fetching surahs, trying fallback:',
      error.message
    );

    // Try Quran.com API as fallback
    try {
      const fallbackResponse = await fetchWithTimeout(
        `${QURAN_API_BASE_URL}/chapters`,
        {},
        8000
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const result = fallbackData.chapters.map((chapter) => ({
          number: chapter.id,
          arabic: chapter.name_arabic,
          name: chapter.name_simple,
          ayahs: chapter.verses_count,
          type: chapter.revelation_place === "makkah" ? "Makki" : "Madani",
        }));

        // Successfully fetched surahs from Quran.com fallback API
        return result;
      }
    } catch (fallbackError) {
      logWarningOnce(
        'surahs-fallback-error',
        '❌ Quran.com fallback also failed:',
        fallbackError.message
      );
    }
  }
  
  // Return comprehensive fallback data when all APIs are unavailable
  logWarningOnce(
    'surahs-hardcoded-fallback',
    '📋 Using hardcoded fallback data for all 114 Surahs'
  );
  return [
      { number: 1, arabic: "الفاتحة", name: "Al-Fatiha", ayahs: 7, type: "Makki" },
      { number: 2, arabic: "البقرة", name: "Al-Baqarah", ayahs: 286, type: "Madani" },
      { number: 3, arabic: "آل عمران", name: "Ali 'Imran", ayahs: 200, type: "Madani" },
      { number: 4, arabic: "النساء", name: "An-Nisa", ayahs: 176, type: "Madani" },
      { number: 5, arabic: "المائدة", name: "Al-Ma'idah", ayahs: 120, type: "Madani" },
      { number: 6, arabic: "الأنعام", name: "Al-An'am", ayahs: 165, type: "Makki" },
      { number: 7, arabic: "الأعراف", name: "Al-A'raf", ayahs: 206, type: "Makki" },
      { number: 8, arabic: "الأنفال", name: "Al-Anfal", ayahs: 75, type: "Madani" },
      { number: 9, arabic: "التوبة", name: "At-Tawbah", ayahs: 129, type: "Madani" },
      { number: 10, arabic: "يونس", name: "Yunus", ayahs: 109, type: "Makki" },
      { number: 11, arabic: "هود", name: "Hud", ayahs: 123, type: "Makki" },
      { number: 12, arabic: "يوسف", name: "Yusuf", ayahs: 111, type: "Makki" },
      { number: 13, arabic: "الرعد", name: "Ar-Ra'd", ayahs: 43, type: "Madani" },
      { number: 14, arabic: "إبراهيم", name: "Ibrahim", ayahs: 52, type: "Makki" },
      { number: 15, arabic: "الحجر", name: "Al-Hijr", ayahs: 99, type: "Makki" },
      { number: 16, arabic: "النحل", name: "An-Nahl", ayahs: 128, type: "Makki" },
      { number: 17, arabic: "الإسراء", name: "Al-Isra", ayahs: 111, type: "Makki" },
      { number: 18, arabic: "الكهف", name: "Al-Kahf", ayahs: 110, type: "Makki" },
      { number: 19, arabic: "مريم", name: "Maryam", ayahs: 98, type: "Makki" },
      { number: 20, arabic: "طه", name: "Taha", ayahs: 135, type: "Makki" },
      { number: 21, arabic: "الأنبياء", name: "Al-Anbiya", ayahs: 112, type: "Makki" },
      { number: 22, arabic: "الحج", name: "Al-Hajj", ayahs: 78, type: "Madani" },
      { number: 23, arabic: "المؤمنون", name: "Al-Mu'minun", ayahs: 118, type: "Makki" },
      { number: 24, arabic: "النور", name: "An-Nur", ayahs: 64, type: "Madani" },
      { number: 25, arabic: "الفرقان", name: "Al-Furqan", ayahs: 77, type: "Makki" },
      { number: 26, arabic: "الشعراء", name: "Ash-Shu'ara", ayahs: 227, type: "Makki" },
      { number: 27, arabic: "النمل", name: "An-Naml", ayahs: 93, type: "Makki" },
      { number: 28, arabic: "القصص", name: "Al-Qasas", ayahs: 88, type: "Makki" },
      { number: 29, arabic: "العنكبوت", name: "Al-Ankabut", ayahs: 69, type: "Makki" },
      { number: 30, arabic: "الروم", name: "Ar-Rum", ayahs: 60, type: "Makki" },
      { number: 31, arabic: "لقمان", name: "Luqman", ayahs: 34, type: "Makki" },
      { number: 32, arabic: "السجدة", name: "As-Sajdah", ayahs: 30, type: "Makki" },
      { number: 33, arabic: "الأحزاب", name: "Al-Ahzab", ayahs: 73, type: "Madani" },
      { number: 34, arabic: "سبأ", name: "Saba", ayahs: 54, type: "Makki" },
      { number: 35, arabic: "فاطر", name: "Fatir", ayahs: 45, type: "Makki" },
      { number: 36, arabic: "يس", name: "Ya-Sin", ayahs: 83, type: "Makki" },
      { number: 37, arabic: "الصافات", name: "As-Saffat", ayahs: 182, type: "Makki" },
      { number: 38, arabic: "ص", name: "Sad", ayahs: 88, type: "Makki" },
      { number: 39, arabic: "الزمر", name: "Az-Zumar", ayahs: 75, type: "Makki" },
      { number: 40, arabic: "غافر", name: "Ghafir", ayahs: 85, type: "Makki" },
      { number: 41, arabic: "فصلت", name: "Fussilat", ayahs: 54, type: "Makki" },
      { number: 42, arabic: "الشورى", name: "Ash-Shura", ayahs: 53, type: "Makki" },
      { number: 43, arabic: "الزخرف", name: "Az-Zukhruf", ayahs: 89, type: "Makki" },
      { number: 44, arabic: "الدخان", name: "Ad-Dukhan", ayahs: 59, type: "Makki" },
      { number: 45, arabic: "الجاثية", name: "Al-Jathiyah", ayahs: 37, type: "Makki" },
      { number: 46, arabic: "الأحقاف", name: "Al-Ahqaf", ayahs: 35, type: "Makki" },
      { number: 47, arabic: "محمد", name: "Muhammad", ayahs: 38, type: "Madani" },
      { number: 48, arabic: "الفتح", name: "Al-Fath", ayahs: 29, type: "Madani" },
      { number: 49, arabic: "الحجرات", name: "Al-Hujurat", ayahs: 18, type: "Madani" },
      { number: 50, arabic: "ق", name: "Qaf", ayahs: 45, type: "Makki" },
      { number: 51, arabic: "الذاريات", name: "Adh-Dhariyat", ayahs: 60, type: "Makki" },
      { number: 52, arabic: "الطور", name: "At-Tur", ayahs: 49, type: "Makki" },
      { number: 53, arabic: "النجم", name: "An-Najm", ayahs: 62, type: "Makki" },
      { number: 54, arabic: "القمر", name: "Al-Qamar", ayahs: 55, type: "Makki" },
      { number: 55, arabic: "الرحمن", name: "Ar-Rahman", ayahs: 78, type: "Madani" },
      { number: 56, arabic: "الواقعة", name: "Al-Waqi'ah", ayahs: 96, type: "Makki" },
      { number: 57, arabic: "الحديد", name: "Al-Hadid", ayahs: 29, type: "Madani" },
      { number: 58, arabic: "المجادلة", name: "Al-Mujadila", ayahs: 22, type: "Madani" },
      { number: 59, arabic: "الحشر", name: "Al-Hashr", ayahs: 24, type: "Madani" },
      { number: 60, arabic: "الممتحنة", name: "Al-Mumtahanah", ayahs: 13, type: "Madani" },
      { number: 61, arabic: "الصف", name: "As-Saff", ayahs: 14, type: "Madani" },
      { number: 62, arabic: "الجمعة", name: "Al-Jumu'ah", ayahs: 11, type: "Madani" },
      { number: 63, arabic: "المنافقون", name: "Al-Munafiqun", ayahs: 11, type: "Madani" },
      { number: 64, arabic: "التغابن", name: "At-Taghabun", ayahs: 18, type: "Madani" },
      { number: 65, arabic: "الطلاق", name: "At-Talaq", ayahs: 12, type: "Madani" },
      { number: 66, arabic: "التحريم", name: "At-Tahrim", ayahs: 12, type: "Madani" },
      { number: 67, arabic: "الملك", name: "Al-Mulk", ayahs: 30, type: "Makki" },
      { number: 68, arabic: "القلم", name: "Al-Qalam", ayahs: 52, type: "Makki" },
      { number: 69, arabic: "الحاقة", name: "Al-Haqqah", ayahs: 52, type: "Makki" },
      { number: 70, arabic: "المعارج", name: "Al-Ma'arij", ayahs: 44, type: "Makki" },
      { number: 71, arabic: "نوح", name: "Nuh", ayahs: 28, type: "Makki" },
      { number: 72, arabic: "الجن", name: "Al-Jinn", ayahs: 28, type: "Makki" },
      { number: 73, arabic: "المزمل", name: "Al-Muzzammil", ayahs: 20, type: "Makki" },
      { number: 74, arabic: "المدثر", name: "Al-Muddaththir", ayahs: 56, type: "Makki" },
      { number: 75, arabic: "القيامة", name: "Al-Qiyamah", ayahs: 40, type: "Makki" },
      { number: 76, arabic: "الإنسان", name: "Al-Insan", ayahs: 31, type: "Madani" },
      { number: 77, arabic: "المرسلات", name: "Al-Mursalat", ayahs: 50, type: "Makki" },
      { number: 78, arabic: "النبأ", name: "An-Naba", ayahs: 40, type: "Makki" },
      { number: 79, arabic: "النازعات", name: "An-Nazi'at", ayahs: 46, type: "Makki" },
      { number: 80, arabic: "عبس", name: "Abasa", ayahs: 42, type: "Makki" },
      { number: 81, arabic: "التكوير", name: "At-Takwir", ayahs: 29, type: "Makki" },
      { number: 82, arabic: "الانفطار", name: "Al-Infitar", ayahs: 19, type: "Makki" },
      { number: 83, arabic: "المطففين", name: "Al-Mutaffifin", ayahs: 36, type: "Makki" },
      { number: 84, arabic: "الانشقاق", name: "Al-Inshiqaq", ayahs: 25, type: "Makki" },
      { number: 85, arabic: "البروج", name: "Al-Buruj", ayahs: 22, type: "Makki" },
      { number: 86, arabic: "الطارق", name: "At-Tariq", ayahs: 17, type: "Makki" },
      { number: 87, arabic: "الأعلى", name: "Al-A'la", ayahs: 19, type: "Makki" },
      { number: 88, arabic: "الغاشية", name: "Al-Ghashiyah", ayahs: 26, type: "Makki" },
      { number: 89, arabic: "الفجر", name: "Al-Fajr", ayahs: 30, type: "Makki" },
      { number: 90, arabic: "البلد", name: "Al-Balad", ayahs: 20, type: "Makki" },
      { number: 91, arabic: "الشمس", name: "Ash-Shams", ayahs: 15, type: "Makki" },
      { number: 92, arabic: "الليل", name: "Al-Layl", ayahs: 21, type: "Makki" },
      { number: 93, arabic: "الضحى", name: "Ad-Duha", ayahs: 11, type: "Makki" },
      { number: 94, arabic: "الشرح", name: "Ash-Sharh", ayahs: 8, type: "Makki" },
      { number: 95, arabic: "التين", name: "At-Tin", ayahs: 8, type: "Makki" },
      { number: 96, arabic: "العلق", name: "Al-Alaq", ayahs: 19, type: "Makki" },
      { number: 97, arabic: "القدر", name: "Al-Qadr", ayahs: 5, type: "Makki" },
      { number: 98, arabic: "البينة", name: "Al-Bayyinah", ayahs: 8, type: "Madani" },
      { number: 99, arabic: "الزلزلة", name: "Az-Zalzalah", ayahs: 8, type: "Madani" },
      { number: 100, arabic: "العاديات", name: "Al-Adiyat", ayahs: 11, type: "Makki" },
      { number: 101, arabic: "القارعة", name: "Al-Qari'ah", ayahs: 11, type: "Makki" },
      { number: 102, arabic: "التكاثر", name: "At-Takathur", ayahs: 8, type: "Makki" },
      { number: 103, arabic: "العصر", name: "Al-Asr", ayahs: 3, type: "Makki" },
      { number: 104, arabic: "الهمزة", name: "Al-Humazah", ayahs: 9, type: "Makki" },
      { number: 105, arabic: "الفيل", name: "Al-Fil", ayahs: 5, type: "Makki" },
      { number: 106, arabic: "قريش", name: "Quraysh", ayahs: 4, type: "Makki" },
      { number: 107, arabic: "الماعون", name: "Al-Ma'un", ayahs: 7, type: "Makki" },
      { number: 108, arabic: "الكوثر", name: "Al-Kawthar", ayahs: 3, type: "Makki" },
      { number: 109, arabic: "الكافرون", name: "Al-Kafirun", ayahs: 6, type: "Makki" },
      { number: 110, arabic: "النصر", name: "An-Nasr", ayahs: 3, type: "Madani" },
      { number: 111, arabic: "المسد", name: "Al-Masad", ayahs: 5, type: "Makki" },
      { number: 112, arabic: "الإخلاص", name: "Al-Ikhlas", ayahs: 4, type: "Makki" },
      { number: 113, arabic: "الفلق", name: "Al-Falaq", ayahs: 5, type: "Makki" },
      { number: 114, arabic: "الناس", name: "An-Nas", ayahs: 6, type: "Makki" }
    ];
    
    // Return comprehensive fallback data when all APIs are unavailable
    console.warn('Using comprehensive hardcoded fallback data for all 114 Surahs');
    return [
      {
        number: 1,
        arabic: "الفاتحة",
        name: "Al-Fatiha",
        ayahs: 7,
        type: "Makki",
      },
      {
        number: 2,
        arabic: "البقرة",
        name: "Al-Baqarah",
        ayahs: 286,
        type: "Madani",
      },
      {
        number: 3,
        arabic: "آل عمران",
        name: "Ali 'Imran",
        ayahs: 200,
        type: "Madani",
      },
      {
        number: 4,
        arabic: "النساء",
        name: "An-Nisa",
        ayahs: 176,
        type: "Madani",
      },
      {
        number: 5,
        arabic: "المائدة",
        name: "Al-Ma'idah",
        ayahs: 120,
        type: "Madani",
      },
      {
        number: 6,
        arabic: "الأنعام",
        name: "Al-An'am",
        ayahs: 165,
        type: "Makki",
      },
      {
        number: 7,
        arabic: "الأعراف",
        name: "Al-A'raf",
        ayahs: 206,
        type: "Makki",
      },
      {
        number: 8,
        arabic: "الأنفال",
        name: "Al-Anfal",
        ayahs: 75,
        type: "Madani",
      },
      {
        number: 9,
        arabic: "التوبة",
        name: "At-Tawbah",
        ayahs: 129,
        type: "Madani",
      },
      { number: 10, arabic: "يونس", name: "Yunus", ayahs: 109, type: "Makki" },
      { number: 11, arabic: "هود", name: "Hud", ayahs: 123, type: "Makki" },
      { number: 12, arabic: "يوسف", name: "Yusuf", ayahs: 111, type: "Makki" },
      {
        number: 13,
        arabic: "الرعد",
        name: "Ar-Ra'd",
        ayahs: 43,
        type: "Madani",
      },
      {
        number: 14,
        arabic: "إبراهيم",
        name: "Ibrahim",
        ayahs: 52,
        type: "Makki",
      },
      {
        number: 15,
        arabic: "الحجر",
        name: "Al-Hijr",
        ayahs: 99,
        type: "Makki",
      },
      {
        number: 16,
        arabic: "النحل",
        name: "An-Nahl",
        ayahs: 128,
        type: "Makki",
      },
      {
        number: 17,
        arabic: "الإسراء",
        name: "Al-Isra",
        ayahs: 111,
        type: "Makki",
      },
      {
        number: 18,
        arabic: "الكهف",
        name: "Al-Kahf",
        ayahs: 110,
        type: "Makki",
      },
      { number: 19, arabic: "مريم", name: "Maryam", ayahs: 98, type: "Makki" },
      { number: 20, arabic: "طه", name: "Taha", ayahs: 135, type: "Makki" },
      {
        number: 21,
        arabic: "الأنبياء",
        name: "Al-Anbiya",
        ayahs: 112,
        type: "Makki",
      },
      {
        number: 22,
        arabic: "الحج",
        name: "Al-Hajj",
        ayahs: 78,
        type: "Madani",
      },
      {
        number: 23,
        arabic: "المؤمنون",
        name: "Al-Mu'minun",
        ayahs: 118,
        type: "Makki",
      },
      {
        number: 24,
        arabic: "النور",
        name: "An-Nur",
        ayahs: 64,
        type: "Madani",
      },
      {
        number: 25,
        arabic: "الفرقان",
        name: "Al-Furqan",
        ayahs: 77,
        type: "Makki",
      },
      {
        number: 26,
        arabic: "الشعراء",
        name: "Ash-Shu'ara",
        ayahs: 227,
        type: "Makki",
      },
      {
        number: 27,
        arabic: "النمل",
        name: "An-Naml",
        ayahs: 93,
        type: "Makki",
      },
      {
        number: 28,
        arabic: "القصص",
        name: "Al-Qasas",
        ayahs: 88,
        type: "Makki",
      },
      {
        number: 29,
        arabic: "العنكبوت",
        name: "Al-Ankabut",
        ayahs: 69,
        type: "Makki",
      },
      { number: 30, arabic: "الروم", name: "Ar-Rum", ayahs: 60, type: "Makki" },
      { number: 31, arabic: "لقمان", name: "Luqman", ayahs: 34, type: "Makki" },
      {
        number: 32,
        arabic: "السجدة",
        name: "As-Sajdah",
        ayahs: 30,
        type: "Makki",
      },
      {
        number: 33,
        arabic: "الأحزاب",
        name: "Al-Ahzab",
        ayahs: 73,
        type: "Madani",
      },
      { number: 34, arabic: "سبأ", name: "Saba", ayahs: 54, type: "Makki" },
      { number: 35, arabic: "فاطر", name: "Fatir", ayahs: 45, type: "Makki" },
      { number: 36, arabic: "يس", name: "Ya-Sin", ayahs: 83, type: "Makki" },
      {
        number: 37,
        arabic: "الصافات",
        name: "As-Saffat",
        ayahs: 182,
        type: "Makki",
      },
      { number: 38, arabic: "ص", name: "Sad", ayahs: 88, type: "Makki" },
      {
        number: 39,
        arabic: "الزمر",
        name: "Az-Zumar",
        ayahs: 75,
        type: "Makki",
      },
      { number: 40, arabic: "غافر", name: "Ghafir", ayahs: 85, type: "Makki" },
      {
        number: 41,
        arabic: "فصلت",
        name: "Fussilat",
        ayahs: 54,
        type: "Makki",
      },
      {
        number: 42,
        arabic: "الشورى",
        name: "Ash-Shura",
        ayahs: 53,
        type: "Makki",
      },
      {
        number: 43,
        arabic: "الزخرف",
        name: "Az-Zukhruf",
        ayahs: 89,
        type: "Makki",
      },
      {
        number: 44,
        arabic: "الدخان",
        name: "Ad-Dukhan",
        ayahs: 59,
        type: "Makki",
      },
      {
        number: 45,
        arabic: "الجاثية",
        name: "Al-Jathiyah",
        ayahs: 37,
        type: "Makki",
      },
      {
        number: 46,
        arabic: "الأحقاف",
        name: "Al-Ahqaf",
        ayahs: 35,
        type: "Makki",
      },
      {
        number: 47,
        arabic: "محمد",
        name: "Muhammad",
        ayahs: 38,
        type: "Madani",
      },
      {
        number: 48,
        arabic: "الفتح",
        name: "Al-Fath",
        ayahs: 29,
        type: "Madani",
      },
      {
        number: 49,
        arabic: "الحجرات",
        name: "Al-Hujurat",
        ayahs: 18,
        type: "Madani",
      },
      { number: 50, arabic: "ق", name: "Qaf", ayahs: 45, type: "Makki" },
      {
        number: 51,
        arabic: "الذاريات",
        name: "Adh-Dhariyat",
        ayahs: 60,
        type: "Makki",
      },
      { number: 52, arabic: "الطور", name: "At-Tur", ayahs: 49, type: "Makki" },
      {
        number: 53,
        arabic: "النجم",
        name: "An-Najm",
        ayahs: 62,
        type: "Makki",
      },
      {
        number: 54,
        arabic: "القمر",
        name: "Al-Qamar",
        ayahs: 55,
        type: "Makki",
      },
      {
        number: 55,
        arabic: "الرحمن",
        name: "Ar-Rahman",
        ayahs: 78,
        type: "Madani",
      },
      {
        number: 56,
        arabic: "الواقعة",
        name: "Al-Waqi'ah",
        ayahs: 96,
        type: "Makki",
      },
      {
        number: 57,
        arabic: "الحديد",
        name: "Al-Hadid",
        ayahs: 29,
        type: "Madani",
      },
      {
        number: 58,
        arabic: "المجادلة",
        name: "Al-Mujadila",
        ayahs: 22,
        type: "Madani",
      },
      {
        number: 59,
        arabic: "الحشر",
        name: "Al-Hashr",
        ayahs: 24,
        type: "Madani",
      },
      {
        number: 60,
        arabic: "الممتحنة",
        name: "Al-Mumtahanah",
        ayahs: 13,
        type: "Madani",
      },
      {
        number: 61,
        arabic: "الصف",
        name: "As-Saff",
        ayahs: 14,
        type: "Madani",
      },
      {
        number: 62,
        arabic: "الجمعة",
        name: "Al-Jumu'ah",
        ayahs: 11,
        type: "Madani",
      },
      {
        number: 63,
        arabic: "المنافقون",
        name: "Al-Munafiqun",
        ayahs: 11,
        type: "Madani",
      },
      {
        number: 64,
        arabic: "التغابن",
        name: "At-Taghabun",
        ayahs: 18,
        type: "Madani",
      },
      {
        number: 65,
        arabic: "الطلاق",
        name: "At-Talaq",
        ayahs: 12,
        type: "Madani",
      },
      {
        number: 66,
        arabic: "التحريم",
        name: "At-Tahrim",
        ayahs: 12,
        type: "Madani",
      },
      {
        number: 67,
        arabic: "الملك",
        name: "Al-Mulk",
        ayahs: 30,
        type: "Makki",
      },
      {
        number: 68,
        arabic: "القلم",
        name: "Al-Qalam",
        ayahs: 52,
        type: "Makki",
      },
      {
        number: 69,
        arabic: "الحاقة",
        name: "Al-Haqqah",
        ayahs: 52,
        type: "Makki",
      },
      {
        number: 70,
        arabic: "المعارج",
        name: "Al-Ma'arij",
        ayahs: 44,
        type: "Makki",
      },
      { number: 71, arabic: "نوح", name: "Nuh", ayahs: 28, type: "Makki" },
      { number: 72, arabic: "الجن", name: "Al-Jinn", ayahs: 28, type: "Makki" },
      {
        number: 73,
        arabic: "المزمل",
        name: "Al-Muzzammil",
        ayahs: 20,
        type: "Makki",
      },
      {
        number: 74,
        arabic: "المدثر",
        name: "Al-Muddaththir",
        ayahs: 56,
        type: "Makki",
      },
      {
        number: 75,
        arabic: "القيامة",
        name: "Al-Qiyamah",
        ayahs: 40,
        type: "Makki",
      },
      {
        number: 76,
        arabic: "الإنسان",
        name: "Al-Insan",
        ayahs: 31,
        type: "Madani",
      },
      {
        number: 77,
        arabic: "المرسلات",
        name: "Al-Mursalat",
        ayahs: 50,
        type: "Makki",
      },
      {
        number: 78,
        arabic: "النبأ",
        name: "An-Naba",
        ayahs: 40,
        type: "Makki",
      },
      {
        number: 79,
        arabic: "النازعات",
        name: "An-Nazi'at",
        ayahs: 46,
        type: "Makki",
      },
      { number: 80, arabic: "عبس", name: "Abasa", ayahs: 42, type: "Makki" },
      {
        number: 81,
        arabic: "التكوير",
        name: "At-Takwir",
        ayahs: 29,
        type: "Makki",
      },
      {
        number: 82,
        arabic: "الانفطار",
        name: "Al-Infitar",
        ayahs: 19,
        type: "Makki",
      },
      {
        number: 83,
        arabic: "المطففين",
        name: "Al-Mutaffifin",
        ayahs: 36,
        type: "Makki",
      },
      {
        number: 84,
        arabic: "الانشقاق",
        name: "Al-Inshiqaq",
        ayahs: 25,
        type: "Makki",
      },
      {
        number: 85,
        arabic: "البروج",
        name: "Al-Buruj",
        ayahs: 22,
        type: "Makki",
      },
      {
        number: 86,
        arabic: "الطارق",
        name: "At-Tariq",
        ayahs: 17,
        type: "Makki",
      },
      {
        number: 87,
        arabic: "الأعلى",
        name: "Al-A'la",
        ayahs: 19,
        type: "Makki",
      },
      {
        number: 88,
        arabic: "الغاشية",
        name: "Al-Ghashiyah",
        ayahs: 26,
        type: "Makki",
      },
      {
        number: 89,
        arabic: "الفجر",
        name: "Al-Fajr",
        ayahs: 30,
        type: "Makki",
      },
      {
        number: 90,
        arabic: "البلد",
        name: "Al-Balad",
        ayahs: 20,
        type: "Makki",
      },
      {
        number: 91,
        arabic: "الشمس",
        name: "Ash-Shams",
        ayahs: 15,
        type: "Makki",
      },
      {
        number: 92,
        arabic: "الليل",
        name: "Al-Layl",
        ayahs: 21,
        type: "Makki",
      },
      {
        number: 93,
        arabic: "الضحى",
        name: "Ad-Duha",
        ayahs: 11,
        type: "Makki",
      },
      {
        number: 94,
        arabic: "الشرح",
        name: "Ash-Sharh",
        ayahs: 8,
        type: "Makki",
      },
      { number: 95, arabic: "التين", name: "At-Tin", ayahs: 8, type: "Makki" },
      {
        number: 96,
        arabic: "العلق",
        name: "Al-Alaq",
        ayahs: 19,
        type: "Makki",
      },
      { number: 97, arabic: "القدر", name: "Al-Qadr", ayahs: 5, type: "Makki" },
      {
        number: 98,
        arabic: "البينة",
        name: "Al-Bayyinah",
        ayahs: 8,
        type: "Madani",
      },
      {
        number: 99,
        arabic: "الزلزلة",
        name: "Az-Zalzalah",
        ayahs: 8,
        type: "Madani",
      },
      {
        number: 100,
        arabic: "العاديات",
        name: "Al-Adiyat",
        ayahs: 11,
        type: "Makki",
      },
      {
        number: 101,
        arabic: "القارعة",
        name: "Al-Qari'ah",
        ayahs: 11,
        type: "Makki",
      },
      {
        number: 102,
        arabic: "التكاثر",
        name: "At-Takathur",
        ayahs: 8,
        type: "Makki",
      },
      { number: 103, arabic: "العصر", name: "Al-Asr", ayahs: 3, type: "Makki" },
      {
        number: 104,
        arabic: "الهمزة",
        name: "Al-Humazah",
        ayahs: 9,
        type: "Makki",
      },
      { number: 105, arabic: "الفيل", name: "Al-Fil", ayahs: 5, type: "Makki" },
      { number: 106, arabic: "قريش", name: "Quraysh", ayahs: 4, type: "Makki" },
      {
        number: 107,
        arabic: "الماعون",
        name: "Al-Ma'un",
        ayahs: 7,
        type: "Makki",
      },
      {
        number: 108,
        arabic: "الكوثر",
        name: "Al-Kawthar",
        ayahs: 3,
        type: "Makki",
      },
      {
        number: 109,
        arabic: "الكافرون",
        name: "Al-Kafirun",
        ayahs: 6,
        type: "Makki",
      },
      {
        number: 110,
        arabic: "النصر",
        name: "An-Nasr",
        ayahs: 3,
        type: "Madani",
      },
      {
        number: 111,
        arabic: "المسد",
        name: "Al-Masad",
        ayahs: 5,
        type: "Makki",
      },
      {
        number: 112,
        arabic: "الإخلاص",
        name: "Al-Ikhlas",
        ayahs: 4,
        type: "Makki",
      },
      {
        number: 113,
        arabic: "الفلق",
        name: "Al-Falaq",
        ayahs: 5,
        type: "Makki",
      },
      { number: 114, arabic: "الناس", name: "An-Nas", ayahs: 6, type: "Makki" }
    ];
};

/**
 * List surah names with minimal fields for UI dropdowns or lists
 * Returns: [{ id, arabic, english, ayahs }]
 */
export const listSurahNames = async () => {
  try {

    const response = await fetchWithTimeout(SURA_NAMES_API, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const result = data.map((surah) => ({
      id: surah.SuraID,
      arabic: surah.ASuraName?.trim(),
      english: surah.ESuraName?.trim(),
    }));
    return result;
  } catch (error) {
    apiAvailabilityState.thafheemApiUnavailable = true;
    logWarningOnce(
      'surah-names-api-unavailable',
      '⚠️ Thafheem API unavailable for surah names, using fallback',
      error.message
    );
    
    // Try Quran.com API as fallback
    try {
      const fallbackResponse = await fetchWithTimeout(
        `${QURAN_API_BASE_URL}/chapters`,
        {},
        8000
      );
    
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const result = fallbackData.chapters.map((chapter) => ({
          id: chapter.id,
          arabic: chapter.name_arabic,
          english: chapter.name_simple,
          ayahs: chapter.verses_count,
        }));
    
        return result;
      }
    } catch (fallbackError) {
      logWarningOnce(
        'surah-names-fallback-failed',
        '❌ Quran.com fallback also failed for surah names:',
        fallbackError.message
      );
    }
    
    // Return basic fallback data when all APIs are unavailable
    logWarningOnce(
      'surah-names-hardcoded-fallback',
      '📋 Using hardcoded fallback data for surah names'
    );
    return [
      { id: 1, arabic: "الفاتحة", english: "Al-Fatiha", ayahs: 7 },
      { id: 2, arabic: "البقرة", english: "Al-Baqarah", ayahs: 286 },
      { id: 3, arabic: "آل عمران", english: "Ali 'Imran", ayahs: 200 },
      { id: 4, arabic: "النساء", english: "An-Nisa", ayahs: 176 },
      { id: 5, arabic: "المائدة", english: "Al-Ma'idah", ayahs: 120 },
      { id: 6, arabic: "الأنعام", english: "Al-An'am", ayahs: 165 },
      { id: 7, arabic: "الأعراف", english: "Al-A'raf", ayahs: 206 },
      { id: 8, arabic: "الأنفال", english: "Al-Anfal", ayahs: 75 },
      { id: 9, arabic: "التوبة", english: "At-Tawbah", ayahs: 129 },
      { id: 10, arabic: "يونس", english: "Yunus", ayahs: 109 },
    ];
  }
};
/**
 * Get a single surah's names by id
 * Returns: { id, arabic, english } | null
 */
export const getSurahNameById = async (surahId) => {
  const names = await listSurahNames();
  return names.find((s) => s.id === parseInt(surahId)) || null;
};

/**
 * Build a flattened verse index from Surah data
 * Returns: [{ id: "<surah>-<verse>", surahId, arabic, english, verse }]
 */
export const listSurahVerseIndex = async () => {
  const surahs = await fetchSurahs();
  const result = surahs.flatMap((s) =>
    Array.from({ length: s.ayahs }, (_, i) => ({
      id: `${s.number}-${i + 1}`,
      surahId: s.number,
      arabic: s.arabic,
      english: s.name,
      verse: i + 1,
    }))
  );
  return result;
};

// Fetch page ranges with fallback
export const fetchPageRanges = async () => {
  try {
    // Avoid CORS by skipping external /all requests when using absolute URLs
    if (/^https?:\/\//i.test(PAGE_RANGES_API)) {
      return [];
    }
    // Try fetching all ranges via dev proxy (rewritten by Vite)
    const response = await fetchWithTimeout(`${PAGE_RANGES_API}/all`, {}, 8000);
    
    // Double-check content type before parsing (fetchWithTimeout should catch this, but be safe)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON - endpoint likely unavailable');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
      // Handle HTML parsing errors specifically
      if (error.message?.includes('HTML') || error.message?.includes('Unexpected token')) {
        logWarningOnce(
          'page-ranges-html',
          '⚠️ Page ranges API returned HTML (likely CORS/404), using empty array'
        );
      } else {
        logWarningOnce(
          'page-ranges-api-unavailable',
          '⚠️ Page ranges API unavailable:',
          error.message
        );
      }
    // Return empty array when API is unavailable
    return [];
  }
};

// Fetch a single page range by pageId from the public endpoint
export const fetchPageRangeByPageId = async (pageId) => {
  try {
    const response = await fetchWithTimeout(`${PAGE_RANGES_API}/${pageId}`, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // API returns an array like [{ PageId, SuraId, ayafrom, ayato, juzid }]
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  } catch (error) {
    logWarningOnce(
      'page-range-by-id-unavailable',
      '⚠️ Failed to fetch page range by pageId:',
      error.message
    );
    return null;
  }
};


// Get accurate ayah count for a specific surah using page ranges API
export const getSurahAyahCount = async (surahId) => {
  try {
    const pageRanges = await fetchPageRanges();
    const surahRanges = pageRanges.filter(
      (range) => range.SuraId === parseInt(surahId)
    );

    if (surahRanges.length === 0) {
      console.warn(`No page ranges found for surah ${surahId}, using fallback`);
      return null; // Will fallback to other methods
    }

    // Find the maximum ayato value for this surah
    const maxAyah = Math.max(...surahRanges.map((range) => range.ayato));
return maxAyah;
  } catch (error) {
    console.error("Error getting surah ayah count from page ranges:", error);
    return null;
  }
};


export const fetchJuzData = async () => {
  try {
    // 🧩 Fetch both APIs concurrently, but handle failures gracefully
    const [pageRangesData, surahsData] = await Promise.allSettled([
      fetchPageRanges().catch((error) => {
        // Handle HTML response errors (CORS/404 pages)
        if (error.message?.includes('HTML') || error.message?.includes('Unexpected token')) {
          console.warn("⚠️ Page ranges API returned HTML (likely CORS/404), skipping");
        } else {
          console.warn("⚠️ Failed to fetch page ranges:", error.message);
        }
        return []; // Return empty array on failure
      }),
      fetchSurahs().catch((error) => {
        // Handle HTML response errors
        if (error.message?.includes('HTML') || error.message?.includes('Unexpected token')) {
          console.warn("⚠️ Surahs API returned HTML (likely CORS/404), using fallback");
        } else {
          console.warn("⚠️ Failed to fetch surahs:", error.message);
        }
        return []; // Return empty array on failure
      }),
    ]);

    // ✅ Extract the actual data from Promise.allSettled results
    let pageRanges = pageRangesData.status === "fulfilled" ? pageRangesData.value : [];
    let surahs = surahsData.status === "fulfilled" ? surahsData.value : [];
    
    // Ensure arrays are valid (not HTML strings)
    if (!Array.isArray(pageRanges)) pageRanges = [];
    if (!Array.isArray(surahs)) surahs = [];

    // 🕌 Create surah names mapping
    const surahNamesMap = {};
    surahs.forEach((surah) => {
      surahNamesMap[surah.number] = {
        name: surah.name,
        arabic: surah.arabic,
        type: surah.type, // Makki or Madani
        totalAyas: surah.ayahs,
      };
    });

    // 📖 Group page ranges by Juz and Surah
    const juzMap = {};

    pageRanges.forEach((range) => {
      const juzId = range.juzid;
      const suraId = range.SuraId;

      if (!juzMap[juzId]) juzMap[juzId] = {};
      if (!juzMap[juzId][suraId]) juzMap[juzId][suraId] = [];

      juzMap[juzId][suraId].push({
        ayaFrom: range.ayafrom,
        ayaTo: range.ayato,
        pageId: range.PageId,
      });
    });

    // 🧩 Transform to final structured Juz data
    const transformedJuzData = [];

    Object.keys(juzMap).forEach((juzId) => {
      const juzSurahs = [];

      Object.keys(juzMap[juzId]).forEach((suraId) => {
        const ranges = juzMap[juzId][suraId];
        const surahInfo = surahNamesMap[parseInt(suraId)];

        if (surahInfo) {
          const verseRanges = ranges
            .map((range) =>
              range.ayaFrom === range.ayaTo
                ? `${range.ayaFrom}`
                : `${range.ayaFrom}-${range.ayaTo}`
            )
            .join(", ");

          juzSurahs.push({
            number: parseInt(suraId),
            name: surahInfo.name,
            arabic: surahInfo.arabic,
            verses: verseRanges,
            type: surahInfo.type,
            ayahs: surahInfo.totalAyas,
          });
        }
      });

      juzSurahs.sort((a, b) => a.number - b.number);

      if (juzSurahs.length > 0) {
        transformedJuzData.push({
          id: parseInt(juzId),
          title: `Juz ${juzId}`,
          surahs: juzSurahs,
        });
      }
    });

    // Sort all Juz in ascending order
    transformedJuzData.sort((a, b) => a.id - b.id);

    // ✅ Final return
    return {
      juzData: transformedJuzData,
      surahNames: surahNamesMap,
    };
  } catch (error) {
    console.error("❌ Failed to fetch Juz data:", error.message);
    throw new Error(`Failed to fetch Juz data: ${error.message}`);
  }
};

// Fetch audio translations for a specific Surah or Ayah
export const fetchAyahAudioTranslations = async (suraId, ayahNumber = null) => {

    try {
      const url = ayahNumber
        ? `${AYAH_AUDIO_TRANSLATION_API}/${suraId}/${ayahNumber}`
        : `${AYAH_AUDIO_TRANSLATION_API}/${suraId}`;
    
      const response = await fetchWithTimeout(url, {}, 5000); // 5 second timeout
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to fetch translation from primary API, trying fallback:', error.message);
      
      // Try fallback translation from Quran.com API
      try {
        const fallbackUrl = `${QURAN_API_BASE_URL}/quran/translations/131?chapter_number=${suraId}&verse_number=${ayahNumber}`;
        const fallbackResponse = await fetchWithTimeout(fallbackUrl, {}, 5000);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.translations && fallbackData.translations.length > 0) {
            return [{
              contiayano: ayahNumber,
              AudioText: fallbackData.translations[0].text
            }];
          }
        }
      } catch (fallbackError) {
        console.warn('Fallback translation also failed:', fallbackError.message);
      }
      
      // Return empty array instead of null to prevent null reference errors
      console.warn('All translation APIs failed, returning empty array');
      return [];
  try {
    const url = ayahNumber
      ? `${AYAH_AUDIO_TRANSLATION_API}/${suraId}/${ayahNumber}`
      : `${AYAH_AUDIO_TRANSLATION_API}/${suraId}`;

    const response = await fetchWithTimeout(url, {}, 5000); // 5 second timeout
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      "Failed to fetch translation from primary API, trying fallback:",
      error.message
    );

    // Try fallback translation from Quran.com API
    try {
      const fallbackUrl = `${QURAN_API_BASE_URL}/quran/translations/131?chapter_number=${suraId}&verse_number=${ayahNumber}`;
      const fallbackResponse = await fetchWithTimeout(fallbackUrl, {}, 5000);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.translations && fallbackData.translations.length > 0) {
          return [
            {
              contiayano: ayahNumber,
              AudioText: fallbackData.translations[0].text,
            },
          ];
        }
      }
    } catch (fallbackError) {
      console.warn("Fallback translation also failed:", fallbackError.message);
    }

    // Return empty array instead of null to prevent null reference errors
    console.warn("All translation APIs failed, returning empty array");
    return [];
  }
};
}
// Fetch Arabic verses in Uthmani script from Quran.com API
export const fetchArabicVerses = async (surahId) => {
  try {
    const url = `${QURAN_API_BASE_URL}/quran/verses/uthmani?chapter_number=${surahId}`;

    const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.warn(
      "Failed to fetch Arabic verses from API, using fallback:",
      error.message
    );
    // Return basic fallback data when API is unavailable
    return [
      {
        id: 1,
        verse_number: 1,
        text_uthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      },
      {
        id: 2,
        verse_number: 2,
        text_uthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      },
    ];
  }
};

// Fetch Arabic verses with page information from Quran.com API
export const fetchArabicVersesWithPage = async (surahId, page = 1) => {
  const url = `${QURAN_API_BASE_URL}/quran/verses/uthmani?chapter_number=${surahId}&page=${page}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    verses: data.verses,
    pagination: data.pagination || null,
  };
};

// Fetch verses for a specific page based on page ranges
export const fetchVersesForPage = async (surahId, pageId) => {
  try {
    // Prefer fetching just the required page's range
    let pageRange = await fetchPageRangeByPageId(pageId);
    if (!pageRange) {
      // Fallback: fetch all ranges (if available) and locate the match
      const pageRanges = await fetchPageRanges();
      pageRange = pageRanges.find(
        (range) => range.PageId === pageId && range.SuraId === parseInt(surahId)
      );
    }

    if (!pageRange) {
      throw new Error(
        `No page range found for page ${pageId} in surah ${surahId}`
      );
    }

    // Fetch verses from Quran.com API for the specific verse range
    const verseStart = pageRange.ayafrom;
    const verseEnd = pageRange.ayato;

    // Fetch all verses for the surah and then filter by verse range
    const url = `${QURAN_API_BASE_URL}/quran/verses/uthmani?chapter_number=${surahId}`;

const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Filter verses to only include the ones in our page range
    const filteredVerses = data.verses.filter((verse) => {
      const verseNumber = parseInt(verse.verse_key.split(":")[1]);
      return verseNumber >= verseStart && verseNumber <= verseEnd;
    });

return {
      verses: filteredVerses || [],
      pageRange: pageRange,
      verseStart: verseStart,
      verseEnd: verseEnd,
    };
  } catch (error) {
    console.error("Error fetching verses for page:", error);
    throw error;
  }
};

// Get all pages for a specific surah
export const getSurahPages = async (surahId) => {
  try {
    const pageRanges = await fetchPageRanges();
    const surahPages = pageRanges
      .filter((range) => range.SuraId === parseInt(surahId))
      .sort((a, b) => a.PageId - b.PageId);

    return surahPages;
  } catch (error) {
    console.error("Error getting surah pages:", error);
    throw error;
  }
};

// Add these functions to your existing apifunction.js file

// Fetch basic chapter info from Quran.com API
export const fetchCompleteSurahInfo = async (surahId, language = "en") => {
  try {
    const [basicChapter, detailedInfo, thafheemInfo, surahsData] =
      await Promise.all([
        fetchBasicChapterData(surahId, language),
        fetchChapterInfo(surahId, language).catch(() => null),
        fetchThafheemPreface(surahId).catch(() => null),
        fetchSurahs().then((surahs) =>
          surahs.find((s) => s.number === parseInt(surahId))
        ),
      ]);

    return {
      basic: basicChapter,
      detailed: detailedInfo,
      thafheem: thafheemInfo,
      surah: surahsData,
    };
  } catch (error) {
    console.error("Error fetching complete surah info:", error);
    throw error;
  }
};

// Example of dependent functions you may already have in apifunctions.js
export const fetchBasicChapterData = async (chapterId, language = "en") => {
  try {
    const response = await fetch(
      `${QURAN_API_BASE_URL}/chapters?language=${language}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Find and return the chapter matching the given ID
    const chapter = data.chapters.find(
      (chapter) => chapter.id === parseInt(chapterId)
    );

    if (!chapter) {
      throw new Error(`Chapter with ID ${chapterId} not found`);
    }

    return chapter;
  } catch (error) {
    console.error("Error fetching basic chapter data:", error.message);
    return null; // Return null or fallback data if needed
  }
};


export const fetchChapterInfo = async (chapterId, language = "en") => {
  const response = await fetch(
    `${QURAN_API_BASE_URL}/chapters/${chapterId}/info?language=${language}`
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.chapter_info;
};

export const fetchThafheemPreface = async (suraId) => {
  try {
    const apiBase = CONFIG_API_BASE_PATH || API_BASE_PATH;
    const response = await fetch(`${apiBase}/preface/${suraId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No preface data found");
    }

    return data[0]; // Return first element
  } catch (error) {
    console.error("Error fetching Thafheem preface:", error.message);
    return null; // Return null or fallback data
  }
};


// Block-wise reading API functions

// Fetch ayah ranges for block-based reading structure
const normalizeLanguageCode = (language = 'mal') => {
  const raw = (language ?? 'mal').toString().trim();
  if (!raw) return 'mal';
  const lower = raw.toLowerCase();
  if (lower === 'english' || lower === 'en') return 'e';
  return lower;
};

const englishRangeEndpointState = {
  unsupported: new Set(),
};

export const fetchAyaRanges = async (surahId, language = 'mal') => {
  const normalizedLang = normalizeLanguageCode(language);

  // English has dedicated backend endpoint; try that first
  if (normalizedLang === 'e') {
    const apiBase = CONFIG_API_BASE_PATH || API_BASE_PATH;
    const candidates = [];

    const isRemoteThafheemApi =
      typeof apiBase === 'string' &&
      apiBase.includes('thafheemapi.thafheem.net');

    if (apiBase && !isRemoteThafheemApi && !englishRangeEndpointState.unsupported.has(apiBase)) {
      candidates.push(`${apiBase}/english/ayaranges/${surahId}`);
    }

    if (import.meta.env?.DEV && !englishRangeEndpointState.unsupported.has('http://localhost:5000/api')) {
      candidates.push(`http://localhost:5000/api/english/ayaranges/${surahId}`);
    }

    // Final fallback to legacy public API
    candidates.push(`${LEGACY_TFH_BASE}/ayaranges/${surahId}/E`);

    let lastError = null;
    for (const url of Array.from(new Set(candidates))) {
      try {
        const response = await fetchWithTimeout(url, {}, 8000);
        if (!response.ok) {
          if (response.status === 404 && !url.includes(LEGACY_TFH_BASE)) {
            const base = url.replace(/\/english\/ayaranges\/.+$/, '');
            englishRangeEndpointState.unsupported.add(base);
            logWarningOnce(
              `english-range-unsupported-${base}`,
              `⚠️ English ayah ranges not available at ${base}. Falling back to legacy source.`
            );
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        if (!url.includes(LEGACY_TFH_BASE)) {
          console.debug(`English ayah range fetch attempt failed at ${url}: ${error.message}`);
        } else {
          console.warn(`Failed to fetch English ayah ranges from ${url}:`, error.message);
        }
      }
    }

    if (lastError) {
      throw lastError;
    }
  }

  // Default behaviour: use legacy base for other languages
  const base = LEGACY_TFH_BASE;
  const langSuffix = normalizedLang && normalizedLang !== 'mal' ? `/${language}` : '';
  const response = await fetch(`${base}/ayaranges/${surahId}${langSuffix}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Fetch translation for a specific ayah range
// Fetch translations for specified ayah range using the new API
export const fetchAyahTranslations = async (surahId, range, language = "E") => {
  try {
    const url = `${AYAH_TRANSLATION_API}/${surahId}/${range}/${language}`;

    const response = await fetchWithTimeout(url, {}, 8000);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching translation for ${surahId}:${range}:`, error.message);
    return null; // return fallback or null instead of throwing
  }
};

// Fetch structured Quranic text with audio URLs for block-wise reading
export const fetchQuranTextWithStructure = async (surahId, range = null) => {
  const url = range
    ? `${QURAN_TEXT_API}/${surahId}/${range}`
    : `${QURAN_TEXT_API}/${surahId}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

// Fetch complete block-wise data for a surah
export const fetchBlockWiseData = async (surahId) => {
  try {
    const [ayaRanges, quranText, surahsData] = await Promise.all([
      fetchAyaRanges(surahId).catch(() => null),
      fetchQuranTextWithStructure(surahId).catch(() => null),
      fetchSurahs().then((surahs) =>
        surahs.find((s) => s.number === parseInt(surahId))
      ),
    ]);

    return {
      ayaRanges: ayaRanges || [],
      quranText: quranText || [],
      surahInfo: surahsData || {
        number: parseInt(surahId),
        arabic: "Unknown Surah",
      },
    };
  } catch (error) {
    console.error("Error fetching block-wise data:", error);
    throw error;
  }
};

// Fetch word-by-word meaning from Quran.com API
export const fetchWordByWordMeaning = async (
  surahId,
  verseId,
  language = "en"
) => {
  // Map language codes to translation IDs
  const getTranslationId = (langCode) => {
    switch (langCode) {
      case 'mal': return '131'; // Malayalam translation ID
      case 'E': return '131';   // English translation ID
      case 'ta': return '131';  // Tamil translation ID (using English as fallback)
      case 'hi': return '131';  // Hindi translation ID (using English as fallback)
      case 'ur': return '131';  // Urdu translation ID (using English as fallback)
      case 'ar': return '131';  // Arabic translation ID (using English as fallback)
      default: return '131';    // Default to English
    }
  };

  // Map language codes to API language codes
  const getApiLanguageCode = (langCode) => {
    switch (langCode) {
      case 'mal': return 'ml';  // Malayalam
      case 'E': return 'en';    // English
      case 'ta': return 'ta';   // Tamil
      case 'hi': return 'hi';   // Hindi
      case 'ur': return 'ur';   // Urdu
      case 'ar': return 'ar';   // Arabic
      default: return 'en';     // Default to English
    }
  };

  const verseKey = `${surahId}:${verseId}`;
  const apiLanguageCode = getApiLanguageCode(language);
  const translationId = getTranslationId(language);
  
  const url = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_indopak,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs,translation&translation_fields=resource_name,language_name&language=${apiLanguageCode}&translations=${translationId}`;

try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
return data.verse;
  } catch (error) {
    console.error("Error fetching word-by-word meaning:", error);
    throw error;
  }
};

// Fetch word meanings from Thafheem API
export const fetchThafheemWordMeanings = async (surahId, verseId) => {
  // Use legacy API for word meanings
  const url = `${WORD_MEANINGS_API}/${surahId}/${verseId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Thafheem word meanings:", error);
    throw error;
  }
};

// Fetch a note by id from Thafheem API
export const fetchNoteById = async (noteId) => {
  const id = String(noteId).trim();
  const url = `${NOTES_API}/${encodeURIComponent(id)}`;

  
// Fetching note by ID
  try {
    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          Accept: "application/json",
        },
      },
      5000
    ); // 5 second timeout
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
return data;
  } catch (error) {
    console.warn("Error fetching note by id:", error.message);
    // Return a fallback note when API is unavailable
    return {
      id: id,
      note_text: `Note ${id} is currently unavailable. The API server may be down. Please try again later.`,
      surah_id: null,
      verse_id: null,
      interpretation_no: null,
    };
  }
};

// Fetch interpretation for specific verse from Thafheem API
export const fetchInterpretation = async (
  surahId,
  verseId,
  interpretationNo = 1,
  language = "en"
) => {
  // Normalize language to API expectation
  const langParam = (() => {
    if (!language) return undefined;
    const l = String(language).trim();
    if (l.toLowerCase() === 'en' || l === 'E') return 'E';
    if (l.toLowerCase() === 'mal') return undefined; // default Malayalam, no suffix
    return l;
  })();
  // Build endpoint: Malayalam uses default path, other languages append lang suffix
  const interpretUrl = langParam
    ? `${INTERPRETATION_API}/${surahId}/${verseId}/${interpretationNo}/${langParam}`
    : `${INTERPRETATION_API}/${surahId}/${verseId}/${interpretationNo}`;

  try {
const response = await fetch(interpretUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
return data;
  } catch (error) {
    console.warn("Interpretation fetch failed:", error.message);

    // Fallback: retry without language suffix for languages that may not have localized data
    if (langParam) {
      try {
        const fallbackUrl = `${INTERPRETATION_API}/${surahId}/${verseId}/${interpretationNo}`;
const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
        }
        const fallbackData = await fallbackResponse.json();
return fallbackData;
      } catch (fallbackError) {
        console.warn("Interpretation fallback also failed:", fallbackError.message);
      }
    }

    return null;
  }
};


// Fetch interpretation for verse range from Thafheem API
export const fetchInterpretationRange = async (
  surahId,
  range,
  interpretationNo = 1,
  language = "en"
) => {
  // Normalize language to API expectation
  const langParam = (() => {
    if (!language) return undefined;
    const l = String(language).trim();
    if (l.toLowerCase() === 'en' || l === 'E') return 'E';
    if (l.toLowerCase() === 'mal') return undefined; // default Malayalam, no suffix
    return l;
  })();

  // For ranges, use the range-based endpoint; append lang only if needed
  const url = langParam
    ? `${INTERPRETATION_API}/${surahId}/${range}/${interpretationNo}/${langParam}`
    : `${INTERPRETATION_API}/${surahId}/${range}/${interpretationNo}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching interpretation range:", error);

    // Fallback: Try without language parameter
    try {
      const noLangUrl = `${INTERPRETATION_API}/${surahId}/${range}/${interpretationNo}`;
      const noLangResponse = await fetch(noLangUrl);
      if (!noLangResponse.ok) {
        throw new Error(`HTTP error! status: ${noLangResponse.status}`);
      }
      const noLangData = await noLangResponse.json();
return noLangData;
    } catch (noLangError) {
      console.error("Range interpretation fallback also failed:", noLangError);
      throw error;
    }
  }
};

// Additional helper function to fetch multiple interpretations for a verse
// Updated: v2.5 - Fixed to use correct verse-specific interpretation endpoints
// Cache for interpretations to prevent redundant API calls
const interpretationCache = new Map();
const INTERPRETATION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getInterpretationCacheKey = (surahId, verseId, language) => {
  const langKey = String(language ?? "default").toLowerCase();
  return `${langKey}|${surahId}|${verseId}`;
};

export const fetchAllInterpretations = async (
  surahId,
  verseId,
  language = "E"
) => {
  const cacheKey = getInterpretationCacheKey(surahId, verseId, language);
  const now = Date.now();

  const cachedEntry = interpretationCache.get(cacheKey);
  if (cachedEntry) {
    if (cachedEntry.data && now - cachedEntry.timestamp < INTERPRETATION_CACHE_DURATION) {
      return cachedEntry.data;
    }

    if (cachedEntry.promise) {
      return cachedEntry.promise;
    }

    interpretationCache.delete(cacheKey);
  }

  const fetchPromise = (async () => {
// For Malayalam, determine the correct number of interpretations from the translation
    let maxInterpretations = 20;
    if (language === 'mal') {
      try {
        // Fetch the translation to count footnote markers
        const translationUrl = `${LEGACY_TFH_BASE}/ayatransl/${surahId}/${verseId}`;
        const translationResponse = await fetch(translationUrl);

        if (translationResponse.ok) {
          const translationData = await translationResponse.json();

          if (Array.isArray(translationData) && translationData.length > 0) {
            const translationText = translationData[0].TranslationText || '';

            // Count footnote markers in the translation text
            // They appear as <sup class="f-note"><a>1</a></sup>, <sup class="f-note"><a>2</a></sup>, etc.
            const footnoteMatches = translationText.match(/<sup[^>]*f-note[^>]*>.*?<\/sup>/g) || [];
            maxInterpretations = footnoteMatches.length;

}
        }
      } catch (error) {
        console.warn(`⚠️ Could not determine interpretation count from translation:`, error.message);
        maxInterpretations = 20; // Fallback to trying 20
      }
    }

    const allInterpretations = [];

    // Fetch interpretations up to the determined count
    for (let i = 1; i <= maxInterpretations; i++) {
      try {
        const data = await fetchInterpretation(surahId, verseId, i, language);

        // If we got valid data with interpretation text, add it
        if (data && data.Interpretation && data.Interpretation.trim().length > 0) {
allInterpretations.push(data);
        } else {
          // Empty response means no more interpretations
break;
        }
      } catch (error) {
        // Error means no more interpretations
break;
      }
    }

return allInterpretations;
  })();

  interpretationCache.set(cacheKey, { promise: fetchPromise });

  try {
    const result = await fetchPromise;
    interpretationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });
    return result;
  } catch (error) {
    interpretationCache.delete(cacheKey);
    throw error;
  }
};

// Fetch quiz questions for specific surah and verse range
export const fetchQuizQuestions = async (surahId, range) => {
  const url = `${QUIZ_API}/${surahId}/${range}`;

  try {
    // Fetching quiz questions

    const response = await fetch(url);
if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
if (Array.isArray(data) && data.length > 0) {
} else if (data && typeof data === "object") {
}

    // Add detailed debugging
    debugApiResponse(data);

    return data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

// Fetch random quiz questions for a surah (when range starts with '0')
export const fetchRandomQuizQuestions = async (surahId, count = 5) => {
  const range = `0-${count}`;
  return fetchQuizQuestions(surahId, range);
};

// Fetch random quiz questions from entire Thafheem (all surahs)
export const fetchRandomQuizQuestionsFromAllSurahs = async (count = 10) => {
  try {
    // Get a list of all surahs
    const surahs = await fetchSurahs();

    // Randomly select different surahs and fetch questions from them
    const randomQuestions = [];
    const questionsPerSurah = Math.max(1, Math.floor(count / 5)); // Distribute across ~5 surahs
    const selectedSurahs = [];

    // Randomly select 5 different surahs
    while (selectedSurahs.length < Math.min(5, surahs.length)) {
      const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
      if (!selectedSurahs.find((s) => s.number === randomSurah.number)) {
        selectedSurahs.push(randomSurah);
      }
    }

    // Fetch questions from each selected surah
    for (const surah of selectedSurahs) {
      try {
        const surahQuestions = await fetchRandomQuizQuestions(
          surah.number,
          questionsPerSurah
        );
        if (surahQuestions && surahQuestions.length > 0) {
          randomQuestions.push(...surahQuestions);
        }
      } catch (error) {
        console.warn(
          `Failed to fetch questions from surah ${surah.number}:`,
          error.message
        );
        // Continue with other surahs
      }
    }

    // Shuffle the combined questions and limit to requested count
    const shuffledQuestions = randomQuestions.sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, count);
  } catch (error) {
    console.error("Error fetching random questions from all surahs:", error);
    // Fallback to questions from Al-Fatiha
    return fetchRandomQuizQuestions(1, count);
  }
};

// Fetch quiz questions for specific verse range
export const fetchQuizQuestionsForRange = async (
  surahId,
  startVerse,
  endVerse
) => {
  const range =
    startVerse === endVerse ? `${startVerse}` : `${startVerse}-${endVerse}`;
  return fetchQuizQuestions(surahId, range);
};

// Transform quiz data to expected format based on actual API response
// Transform quiz data to expected format based on actual API response
export const transformQuizData = (rawData) => {
if (!Array.isArray(rawData)) {
rawData = [rawData];
  }

  const transformed = rawData.map((item, index) => {
// Extract question ID
    const questionId =
      item.id ||
      item.questionId ||
      item.question_id ||
      item.QuestionId ||
      item.qid ||
      index + 1;

    // Extract question text with more variations
    const questionText =
      item.question ||
      item.questionText ||
      item.question_text ||
      item.Quest ||
      item.Question ||
      item.QuestionText ||
      item.quest ||
      item.text ||
      "Question not available";

    // Extract correct answer with more variations
    const rawCorrectAnswer =
      item.correctAnswer ||
      item.correct_answer ||
      item.answer ||
      item.Answer ||
      item.CorrectAnswer ||
      item.correct ||
      "A";

// Handle different option formats - COMPREHENSIVE APPROACH
    let options = [];

    // Method 1: Direct options array
    if (item.options && Array.isArray(item.options)) {
options = item.options.map((opt, optIndex) => ({
        id: opt.id || opt.key || opt.letter || ["A", "B", "C", "D"][optIndex],
        text:
          opt.text ||
          opt.option ||
          opt.value ||
          opt.content ||
          (typeof opt === "string" ? opt : `Option ${optIndex + 1}`),
      }));
    }

    // Method 2: Individual option fields - COMPREHENSIVE SEARCH
    if (options.length === 0) {
// Get all possible field names for this item
      const allFields = Object.keys(item);
// Try to extract options from these fields - More comprehensive field matching
      ["A", "B", "C", "D"].forEach((letter) => {
        const possibleFields = [
          // Standard patterns
          `option${letter}`,
          `option_${letter}`,
          `Option${letter}`,
          `OPTION${letter}`,
          letter,
          letter.toLowerCase(),
          `choice${letter}`,
          `Choice${letter}`,
          `ans${letter}`,
          `answer${letter}`,
          `Answer${letter}`,
          // Additional patterns that might be used by the API
          `opt${letter}`,
          `Opt${letter}`,
          `OPT${letter}`,
          `${letter}Option`,
          `${letter}option`,
          `${letter}_option`,
          `${letter.toLowerCase()}Option`,
          `${letter.toLowerCase()}option`,
          `${letter.toLowerCase()}_option`,
          // Numbered alternatives
          `option${["A", "B", "C", "D"].indexOf(letter) + 1}`,
          `Option${["A", "B", "C", "D"].indexOf(letter) + 1}`,
          `choice${["A", "B", "C", "D"].indexOf(letter) + 1}`,
          `Choice${["A", "B", "C", "D"].indexOf(letter) + 1}`,
          // Direct field names that might contain the option text
          `${letter}Text`,
          `${letter}text`,
          `${letter}_text`,
          `text${letter}`,
          `Text${letter}`,
        ];

for (const field of possibleFields) {
          if (
            item.hasOwnProperty(field) &&
            item[field] !== undefined &&
            item[field] !== null &&
            item[field] !== ""
          ) {
            const optionText = String(item[field]).trim();
            if (
              optionText.length > 0 &&
              optionText !== "null" &&
              optionText !== "undefined"
            ) {
options.push({ id: letter, text: optionText });
              break; // Found this option, move to next letter
            }
          }
        }
      });
    }

    // Method 3: Check for nested objects
    if (options.length === 0) {
if (item.choices) {
if (Array.isArray(item.choices)) {
          options = item.choices.map((choice, idx) => ({
            id: ["A", "B", "C", "D"][idx] || idx.toString(),
            text:
              choice.text || choice.option || choice.value || String(choice),
          }));
        } else if (typeof item.choices === "object") {
          Object.keys(item.choices).forEach((key, idx) => {
            const letter = ["A", "B", "C", "D"][idx] || key;
            options.push({ id: letter, text: String(item.choices[key]) });
          });
        }
      }

      if (options.length === 0 && item.alternatives) {
if (Array.isArray(item.alternatives)) {
          options = item.alternatives.map((alt, idx) => ({
            id: ["A", "B", "C", "D"][idx] || idx.toString(),
            text: alt.text || alt.option || alt.value || String(alt),
          }));
        }
      }
    }

    // Method 4: Try to find any field that looks like it contains option text
    if (options.length === 0) {
const allFields = Object.keys(item);

      // Look for fields that might contain options
      const potentialOptionFields = allFields.filter((field) => {
        const lowerField = field.toLowerCase();
        return (
          lowerField.includes("option") ||
          lowerField.includes("choice") ||
          lowerField.includes("answer") ||
          /^[a-d]$/i.test(field) ||
          /option[a-d]/i.test(lowerField) ||
          /choice[a-d]/i.test(lowerField) ||
          /[a-d]option/i.test(lowerField) ||
          /opt[a-d]/i.test(lowerField) ||
          /[a-d]text/i.test(lowerField)
        );
      });

// Try to map these fields to options
      potentialOptionFields.forEach((field, idx) => {
        if (item[field] && String(item[field]).trim().length > 0) {
          const letter =
            ["A", "B", "C", "D"][idx] ||
            (field.match(/[A-D]/i) && field.match(/[A-D]/i)[0].toUpperCase()) ||
            ["A", "B", "C", "D"][options.length];

          if (letter && !options.find((opt) => opt.id === letter)) {
            options.push({
              id: letter,
              text: String(item[field]).trim(),
            });
          }
        }
      });
    }

// Create fallback only if absolutely no options found
    if (options.length === 0) {
      console.error(`NO OPTIONS FOUND for question ${index + 1}!`);
      console.error("Full item data:", JSON.stringify(item, null, 2));

      // Try one more time with a different approach - look at all string values
      const stringValues = [];
      Object.entries(item).forEach(([key, value]) => {
        if (
          typeof value === "string" &&
          value.trim().length > 5 &&
          value !== questionText
        ) {
          stringValues.push({ key, value: value.trim() });
        }
      });

if (stringValues.length >= 2) {
        // Use the string values as options
        options = stringValues.slice(0, 4).map((item, idx) => ({
          id: ["A", "B", "C", "D"][idx],
          text: item.value,
        }));
} else {
        // Final fallback
        options = [
          { id: "A", text: "Option A (No data found)" },
          { id: "B", text: "Option B (No data found)" },
          { id: "C", text: "Option C (No data found)" },
        ];
      }
    }

    // ===== FIX: Convert correct answer to match option ID format =====
    let correctAnswer = rawCorrectAnswer;

    // If correct answer is a number, convert it to corresponding letter
    if (/^\d+$/.test(String(rawCorrectAnswer))) {
      const answerIndex = parseInt(rawCorrectAnswer) - 1; // Convert 1-based to 0-based
      if (answerIndex >= 0 && answerIndex < options.length) {
        correctAnswer = options[answerIndex].id;
}
    }

    // If correct answer is a letter but doesn't match any option ID, try to find it
    if (!options.find((opt) => opt.id === correctAnswer)) {
      console.warn(
        `Correct answer ${correctAnswer} doesn't match any option ID`
      );

      // Try to find the correct answer by content matching
      const matchingOption = options.find(
        (opt) =>
          opt.text
            .toLowerCase()
            .includes(String(rawCorrectAnswer).toLowerCase()) ||
          String(rawCorrectAnswer)
            .toLowerCase()
            .includes(opt.text.toLowerCase())
      );

      if (matchingOption) {
        correctAnswer = matchingOption.id;
} else {
        // Default to first option if no match found
        correctAnswer = options[0]?.id || "A";
        console.warn(
          `No matching option found, defaulting to ${correctAnswer}`
        );
      }
    }

const result = {
      id: questionId,
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
    };

return result;
  });

return transformed;
};

// Add this helper function to debug API response structure
export const debugApiResponse = (data) => {
if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
// Look for option-related fields
    const optionFields = Object.keys(firstItem).filter(
      (key) =>
        key.toLowerCase().includes("option") ||
        key.toLowerCase().includes("choice") ||
        key.toLowerCase().includes("answer") ||
        key.match(/^[A-D]$/) ||
        key.match(/^[a-d]$/)
    );
optionFields.forEach((field) => {
});
  }
return data;
};
// Updated validation function with more flexible checking
export const validateQuizData = (quizData) => {
if (!Array.isArray(quizData)) {
    console.warn("Quiz data is not an array:", quizData);
    return false;
  }

  if (quizData.length === 0) {
    console.warn("Quiz data array is empty");
    return false;
  }

  const isValid = quizData.every((question, index) => {
// Check for basic question structure
    const hasId = question.id !== undefined && question.id !== null;
    const hasQuestion =
      question.question &&
      typeof question.question === "string" &&
      question.question.trim().length > 0;
    const hasOptions =
      question.options &&
      Array.isArray(question.options) &&
      question.options.length > 0;
    const hasCorrectAnswer =
      question.correctAnswer && typeof question.correctAnswer === "string";

if (!hasId) console.warn(`Question ${index} missing ID:`, question);
    if (!hasQuestion)
      console.warn(`Question ${index} missing question text:`, question);
    if (!hasOptions)
      console.warn(`Question ${index} missing or invalid options:`, question);
    if (!hasCorrectAnswer)
      console.warn(`Question ${index} missing correct answer:`, question);

    return hasId && hasQuestion && hasOptions && hasCorrectAnswer;
  });

return isValid;
};

// Fetch quiz questions with data transformation
export const fetchQuizWithSurahInfo = async (surahId, range) => {
  try {
    const [rawQuizData, surahsData] = await Promise.all([
      fetchQuizQuestions(surahId, range),
      fetchSurahs(),
    ]);

// Transform the quiz data to expected format
    const transformedQuestions = transformQuizData(rawQuizData);
const surahInfo = surahsData.find((s) => s.number === parseInt(surahId));

    return {
      questions: transformedQuestions,
      surahInfo: surahInfo || {
        number: parseInt(surahId),
        arabic: "Unknown Surah",
        name: `Surah ${surahId}`,
        ayahs: 0,
        type: "Unknown",
      },
      range: range,
      totalQuestions: transformedQuestions.length,
    };
  } catch (error) {
    console.error("Error fetching quiz with surah info:", error);
    throw error;
  }
};

// Fetch entire surah quiz with transformation
export const fetchEntireSurahQuiz = async (surahId) => {
  try {
    const surahsData = await fetchSurahs();
    const surah = surahsData.find((s) => s.number === parseInt(surahId));

    if (!surah) {
      throw new Error(`Surah ${surahId} not found`);
    }

    const range = `1-${surah.ayahs}`;
    return fetchQuizWithSurahInfo(surahId, range);
  } catch (error) {
    console.error("Error fetching entire surah quiz:", error);
    throw error;
  }
};

// Create fallback quiz data for testing
export const createFallbackQuizData = (surahId) => {
  return {
    questions: [
      {
        id: 1,
        question: "ഖുർആനിലെ ആദ്യ സൂറയുടെ പേര് എന്താണ്?",
        options: [
          { id: "A", text: "അൽ-ഫാതിഹ" },
          { id: "B", text: "അൽ-ബഖറ" },
          { id: "C", text: "ആലി ഇംറാൻ" },
          { id: "D", text: "അൻ-നിസാ" },
        ],
        correctAnswer: "A",
      },
      {
        id: 2,
        question: "ഖുർആനിൽ എത്ര സൂറകൾ ഉണ്ട്?",
        options: [
          { id: "A", text: "113" },
          { id: "B", text: "114" },
          { id: "C", text: "115" },
          { id: "D", text: "116" },
        ],
        correctAnswer: "B",
      },
    ],
    surahInfo: {
      number: parseInt(surahId),
      name: `Surah ${surahId}`,
      arabic: "Sample Surah",
      ayahs: 7,
      type: "Unknown",
    },
    range: "1-7",
    totalQuestions: 2,
  };
};

// Direct API test function to inspect raw response
export const testQuizAPI = async (surahId = 1, range = "1-7") => {
  const url = `${QUIZ_API}/${surahId}/${range}`;
try {
    const response = await fetch(url);
const rawText = await response.text();
let data;
    try {
      data = JSON.parse(rawText);
if (Array.isArray(data) && data.length > 0) {
// Look specifically for option fields
        const firstItem = data[0];
Object.keys(firstItem).forEach((key) => {
          const value = firstItem[key];
});
      }

      return data;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
return null;
    }
  } catch (error) {
    console.error("API test failed:", error);
    throw error;
  }
};

// Search Surahs by name (local search through your Surah data)
export const searchSurahsByName = async (query) => {
  try {
    // Get all surahs from your existing API
    const surahs = await fetchSurahs();

    if (!query || query.trim().length < 1) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    // Search through both English and Arabic names
    const matchingSurahs = surahs.filter((surah) => {
      const englishMatch = surah.name.toLowerCase().includes(searchTerm);
      const arabicMatch = surah.arabic.toLowerCase().includes(searchTerm);
      const numberMatch = surah.number.toString() === searchTerm;

      return englishMatch || arabicMatch || numberMatch;
    });

    // Sort by relevance (exact matches first, then partial matches)
    return matchingSurahs.sort((a, b) => {
      const aExactMatch =
        a.name.toLowerCase() === searchTerm ||
        a.number.toString() === searchTerm;
      const bExactMatch =
        b.name.toLowerCase() === searchTerm ||
        b.number.toString() === searchTerm;

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // If both or neither are exact matches, sort by Surah number
      return a.number - b.number;
    });
  } catch (error) {
    console.error("Error searching surahs by name:", error);
    throw error;
  }
};

// Search verses content using Quran.com API
export const searchQuranContent = async (query, language = "en") => {
  try {
    const response = await fetch(
      `${QURAN_API_BASE_URL}/search?q=${encodeURIComponent(
        query
      )}&language=${language}&size=15`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// Debug log

    // Enhanced results with better formatting
    const results = data.search?.results || [];

    return results.map((result) => ({
      ...result,
      // Ensure we have the translated text
      text:
        result.text ||
        result.translated_text ||
        result.translation?.text ||
        "Translation not available",
      // Add chapter information if available
      chapter: result.chapter || {
        name_simple: `Surah ${result.verse_key.split(":")[0]}`,
      },
      // Highlight matched terms (basic implementation)
      highlighted_text: highlightSearchTerms(
        result.text || result.translated_text || "",
        query
      ),
    }));
  } catch (error) {
    console.error("Error searching Quran content:", error);
    throw error;
  }
};

// Helper function to highlight search terms in text
const highlightSearchTerms = (text, query) => {
  if (!text || !query) return text;

  try {
    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 2);
    let highlightedText = text;

    searchTerms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi");
      highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
    });

    return highlightedText;
  } catch (error) {
    return text; // Return original text if highlighting fails
  }
};

// Search for specific verse reference (e.g., "2:255", "18:10-25")
export const searchVerseReference = async (query) => {
  const versePattern = /^(\d+):(\d+)(?:-(\d+))?$/;
  const match = query.trim().match(versePattern);

  if (!match) return null;

  const surahNumber = parseInt(match[1]);
  const startVerse = parseInt(match[2]);
  const endVerse = match[3] ? parseInt(match[3]) : startVerse;

  try {
    // Get surah info
    const surahs = await fetchSurahs();
    const surah = surahs.find((s) => s.number === surahNumber);

    if (!surah) return null;

    // Create verse reference result
    const verseKey = `${surahNumber}:${startVerse}`;
    const displayText =
      endVerse > startVerse
        ? `Verses ${startVerse}-${endVerse} from ${surah.name}`
        : `Verse ${startVerse} from ${surah.name}`;

    return {
      type: "verse_reference",
      verse_key: verseKey,
      surah_number: surahNumber,
      verse_start: startVerse,
      verse_end: endVerse,
      surah_info: surah,
      display_text: displayText,
    };
  } catch (error) {
    console.error("Error searching verse reference:", error);
    return null;
  }
};

// Enhanced search function with better verse search
export const searchQuranEnhanced = async (query, language = "en") => {
  try {
    // Check if query is a verse reference first
    const verseRef = await searchVerseReference(query);

    const [surahResults, contentResults] = await Promise.all([
      searchSurahsByName(query),
      query.trim().length >= 3 ? searchQuranContent(query, language) : [],
    ]);

    // Get surah names for verse results
    const surahsData = await fetchSurahs();
    const surahNamesMap = {};
    surahsData.forEach((surah) => {
      surahNamesMap[surah.number] = surah;
    });

    // Enhance verse results with surah information
    const enhancedVerses = contentResults.map((verse) => ({
      ...verse,
      surahInfo: surahNamesMap[parseInt(verse.verse_key.split(":")[0])] || null,
    }));

    // Add verse reference result if found
    if (verseRef) {
      enhancedVerses.unshift({
        ...verseRef,
        text: verseRef.display_text,
        verse_key: verseRef.verse_key,
        surahInfo: verseRef.surah_info,
      });
    }

    return {
      surahs: surahResults,
      verses: enhancedVerses,
      hasResults: surahResults.length > 0 || enhancedVerses.length > 0,
      totalResults: surahResults.length + enhancedVerses.length,
      hasVerseReference: !!verseRef,
    };
  } catch (error) {
    console.error("Error in enhanced search:", error);
    throw error;
  }
};

// Combined search function that searches both Surah names and content
export const searchQuran = async (query, language = "en") => {
  try {
    // Use enhanced search if available, fallback to original
    return await searchQuranEnhanced(query, language);
  } catch (error) {
    console.error("Enhanced search failed, using fallback:", error);

    // Fallback to original implementation
    const isLikelyName = /^(al-|an-|as-|\d+\.?\s*)?[a-z\s-]+$/i.test(
      query.trim()
    );
    const isNumber = /^\d+$/.test(query.trim());

    let surahResults = [];
    let contentResults = [];

    surahResults = await searchSurahsByName(query);

    if (
      surahResults.length === 0 ||
      (!isLikelyName && !isNumber && query.trim().length > 3)
    ) {
      contentResults = await searchQuranContent(query, language);
    }

    return {
      surahs: surahResults,
      verses: contentResults,
      hasResults: surahResults.length > 0 || contentResults.length > 0,
    };
  }
};

// Directus CMS API functions

// Fetch home banner data from Directus CMS
export const fetchHomeBanner = async () => {
  try {
    const response = await fetch(
      `${DIRECTUS_BASE_URL}/items/thafheem_homebanner`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// Return the data array or empty array if no data
    return data.data || [];
  } catch (error) {
    console.error("Error fetching home banner data:", error);
    // Return empty array on error to prevent app crash
    return [];
  }
};

// Fetch app settings from Directus CMS
export const fetchAppSettings = async () => {
  try {
    const response = await fetch(
      `${DIRECTUS_BASE_URL}/items/thafheem_app_settings`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
return data.data || [];
  } catch (error) {
    console.error("Error fetching app settings:", error);
    return [];
  }
};

// Fetch AI API configuration from Directus CMS
export const fetchAiApiConfig = async () => {
  try {
    const response = await fetch(`${DIRECTUS_BASE_URL}/items/thafheem_ai_api`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// Return inner data if present, otherwise empty object
    return data.data || {};
  } catch (error) {
    console.error("Error fetching AI API config:", error.message);
    return {};
  }
};


// Fetch popular chapters from Quran.com API
export const fetchPopularChapters = async (language = "en") => {
  try {
    // Get all chapters first
    const response = await fetch(
      `${QURAN_API_BASE_URL}/chapters?language=${language}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// Define popular chapters based on common reading patterns
    const popularChapterIds = [67, 2, 1, 18, 36, 55, 56, 78, 112, 113, 114];

    // Filter and map popular chapters
    const popularChapters = popularChapterIds
      .map((id) => {
        const chapter = data.chapters.find((ch) => ch.id === id);
        if (chapter) {
          return {
            id: chapter.id,
            name: chapter.name_simple,
            arabic: chapter.name_arabic,
            verses: `${chapter.verses_count} verses`,
            type: chapter.revelation_place === "makkah" ? "Makki" : "Madani",
            translated_name:
              chapter.translated_name?.name || chapter.name_simple,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null entries

    return popularChapters;
  } catch (error) {
    console.error("Error fetching popular chapters:", error);
    // Return fallback data
    return [
      { id: 67, name: "Al-Mulk", verses: "30 verses", type: "Makki" },
      { id: 2, name: "Al-Baqarah", verses: "286 verses", type: "Madani" },
      { id: 1, name: "Al-Fatiha", verses: "7 verses", type: "Makki" },
      { id: 18, name: "Al-Kahf", verses: "110 verses", type: "Makki" },
      { id: 36, name: "Ya-Sin", verses: "83 verses", type: "Makki" },
    ];
  }
};

// Fetch Tajweed rules
export const fetchTajweedRules = async (ruleNo = "0") => {
  if (apiAvailabilityState.tajweedApiUnavailable) {
    return getFallbackTajweedData(ruleNo?.toString().replace(/\./g, "_") ?? "0");
  }

  // Replace dots with underscores in rule number as per API spec
  const formattedRuleNo = ruleNo?.toString().replace(/\./g, "_") ?? "0";
  const apiBase = CONFIG_API_BASE_PATH || API_BASE_PATH;

  // Build list of candidate endpoints (handles older misspelled route and new route)
  const baseCandidates = Array.from(
    new Set(
      [
        TAJWEED_RULES_API,
        `${apiBase}/tajweedrules`,
        `${apiBase}/thajweedrules`,
        `${LEGACY_TFH_BASE}/tajweedrules`,
        `${LEGACY_TFH_BASE}/thajweedrules`,
      ].filter(Boolean)
    )
  );

  let lastError = null;
  let lastStatus = null;

  for (const baseUrl of baseCandidates) {
    const url = formattedRuleNo ? `${baseUrl}/${formattedRuleNo}` : baseUrl;

    try {
const response = await fetchWithTimeout(url, {}, 8000);

      lastStatus = response.status;

      if (!response.ok) {
        if (response.status === 404) {
          lastError = new Error(`HTTP error! status: ${response.status}`);
          lastStatus = 404;
          // Stop trying other endpoints after the first 404 to avoid noisy retries
          break;
        }

        if (response.status >= 500) {
          // Try the next candidate endpoint
          continue;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
return data;
    } catch (error) {
      lastError = error;
      // Continue trying other candidates if available
      continue;
    }
  }

  if (lastStatus === 404) {
    logWarningOnce(
      `tajweed-rules-${formattedRuleNo}`,
      `Tajweed rule ${formattedRuleNo} returned 404 - using fallback data`
    );
    apiAvailabilityState.tajweedApiUnavailable = true;
    return getFallbackTajweedData(formattedRuleNo);
  }

  console.error("Error fetching Tajweed rules:", lastError);
  if (lastError) {
    apiAvailabilityState.tajweedApiUnavailable = true;
  }
  const fallback = getFallbackTajweedData(formattedRuleNo);
  if (fallback.length > 0) {
    return fallback;
  }

  throw lastError ?? new Error("Failed to fetch Tajweed rules");
};

// Fetch word meanings for drag and drop quiz
export const fetchWordMeanings = async (
  surahId,
  ayahNumber,
  language = "E"
) => {
  try {
    // Use legacy API for word meanings
    const url = language
      ? `${WORD_MEANINGS_API}/${surahId}/${ayahNumber}/${language}`
      : `${WORD_MEANINGS_API}/${surahId}/${ayahNumber}`;

const response = await fetchWithTimeout(url, {}, 8000);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
return data;
  } catch (error) {
    console.error("Error fetching word meanings:", error);
    throw error;
  }
};

// Fetch all main Tajweed rules (ruleno = '0')
export const fetchAllTajweedRules = async () => {
  return fetchTajweedRules("0");
};

// Fetch specific Tajweed rule by rule number
export const fetchSpecificTajweedRule = async (ruleNo) => {
  return fetchTajweedRules(ruleNo);
};

// Fetch Arabic verse text from Quran.com API for Tajweed examples
export const fetchArabicVerseForTajweed = async (verseKey) => {
  try {
    const response = await fetchWithTimeout(
      `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${verseKey}`,
      {},
      5000
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.verses && data.verses.length > 0) {
      return data.verses[0].text_uthmani || "Arabic text not available";
    } else {
      throw new Error("No verse data found");
    }
  } catch (error) {
    console.error("Error fetching Arabic verse for Tajweed:", error);
    return "Arabic text not available";
  }
};

// const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
//   return Promise.race([
//     fetch(url, options),
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error('Request timeout')), timeout)
//     )
//   ]);
// };

// Fetch list of Malarticles
export const fetchMalarticles = async (page = 0, type = "muk") => {
  try {
    const url = `https://old.thafheem.net/thaf-api/malarticles/${page}/${type}`;
const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// API returns array of objects with aid and title
    if (Array.isArray(data)) {
      return data.map((article) => ({
        aid: article.aid,
        title: article.title
      }));
    }
    
    throw new Error("Unexpected API response format");
  } catch (error) {
    console.warn("Failed to fetch malarticles from API:", error.message);

    // Fallback data
    return [
      { aid: 1, title: "കുറിപ്പ്" },
      { aid: 2, title: "ഖുര്‍ആന്‍ പഠനത്തിനൊരു മുഖവുര" },
      { aid: 3, title: "സവിശേഷമായൊരു ഗ്രന്ഥം" },
      { aid: 4, title: "ചില അടിസ്ഥാന വസ്തുതകള്‍" },
      { aid: 5, title: "എങ്ങനെയൊരു ഗ്രന്ഥം?" },
      { aid: 6, title: "ഖുര്‍ആന്‍ തത്ത്വം" },
      { aid: 7, title: "വിഷയവും പ്രമേയവും" },
      { aid: 8, title: "മാലയില്‍ കോര്‍ത്ത മുത്തുകള്‍" },
      { aid: 9, title: "അവതരണ ഘട്ടങ്ങള്‍" },
      { aid: 10, title: "നിര്‍ദ്ദേശപുസ്തകം" },
      { aid: 11, title: "ആവര്‍ത്തനം എന്തിന്?" },
      { aid: 12, title: "ഗ്രന്ഥീകരണം" },
      { aid: 13, title: "ഗ്രന്ഥ ചിത്രീകരണം" },
    ];
  }
};

// Fetch single article by ID
export const fetchMalarticleById = async (articleId) => {
  try {
    const url = `https://old.thafheem.net/thaf-api/malarticles/${articleId}/muk`;
const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// API returns array with single object
    const articleData = Array.isArray(data) ? data[0] : data;
    
    if (!articleData) {
      throw new Error("No article data found");
    }

    return {
      id: articleData.aid,
      title: articleData.title,
      matter: articleData.matter || "",
      audiotext: articleData.audiotext || "",
      audiourl: articleData.audiourl || ""
    };
  } catch (error) {
    console.error("Failed to fetch malarticle by ID:", error.message);

    // Fallback content
    const fallbackContent = {
      1: {
        id: 1,
        title: "കുറിപ്പ്",
        matter: "ഖുര്‍ആന്‍ പഠിക്കുമ്പോള്‍ വായനക്കാരന്റെ മനസ്സില്‍ ഉയര്‍ന്നേക്കാവുന്ന എല്ലാപ്രശ്നങ്ങളെയും സംബന്ധിച്ച് ഇവിടെ പ്രതിപാദിക്കുക എന്നത് എന്റെ ഉദ്ദേശ്യമല്ല. കാരണം അവയില്‍ മിക്കവയും ഖുര്‍ആനിലെ ഏതെങ്കിലും വചനമോ അദ്ധ്യായമോ ദൃഷ്ടിയില്‍ വരുമ്പോഴാണ് ഉയര്‍ന്നു വരുക. അവയ്ക്കുള്ള ഉത്തരങ്ങള്‍ 'തഫ്ഹീമുല്‍ ഖുര്‍ആനി'ല്‍ അതത് സന്ദര്‍ഭങ്ങളില്‍ നല്‍കിയിട്ടുമുണ്ട്.",
        audiotext: "",
        audiourl: ""
      },
    };

    return fallbackContent[articleId] || {
      id: articleId,
      title: "ഉള്ളടക്കം ലഭ്യമല്ല",
      matter: "ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.",
      audiotext: "",
      audiourl: ""
    };
  }
};
// Fetch list of English articles
// Fetch list of English articles
export const fetchEngarticles = async (page = 0, type = "par") => {
  try {
    const url = `https://thafheem.net/thafheem-api/engarticles/${page}/${type}`;
const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// API returns array of objects with aid and title
    if (Array.isArray(data)) {
      return data.map((article) => ({
        aid: article.aid,
        title: article.title
      }));
    }
    
    throw new Error("Unexpected API response format");
  } catch (error) {
    console.warn("Failed to fetch engarticles from API:", error.message);

    // Fallback data
    return [
      { aid: 1, title: "The end of prophethood" },
      { aid: 2, title: "The meaning of Khatamunnabiyyin" },
      { aid: 3, title: "The Prophet's sayings regarding the end of the world" },
      { aid: 4, title: "The consensus of the Companions" },
      { aid: 5, title: "The consensus of religious scholars" },
      { aid: 6, title: "The Promised Messiah" },
    ];
  }
};

// Fetch single English article by ID
export const fetchEngarticleById = async (articleId) => {
  try {
    const url = `https://thafheem.net/thafheem-api/engarticles/${articleId}/par`;
const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// API returns array with single object
    const articleData = Array.isArray(data) ? data[0] : data;
    
    if (!articleData) {
      throw new Error("No article data found");
    }

    return {
      id: articleData.aid,
      title: articleData.title,
      matter: articleData.matter || "",
      audiotext: articleData.audiotext || "",
      audiourl: articleData.audiourl || ""
    };
  } catch (error) {
    console.error("Failed to fetch engarticle by ID:", error.message);

    // Fallback content
    const fallbackContent = {
      1: {
        id: 1,
        title: "The end of prophethood",
        matter: "The party that has created the 'Great Tribulation', which is the new Prophethood in this era, has given the word 'Khatam-un-Nabiyyin' the meaning of 'seal of the prophets'. That is, the prophets who come after Prophet Muhammad (peace be upon Him) become prophets with the seal of that prophethood.",
      },
      2: {
        id: 2,
        title: "The meaning of Khatamunnabiyyin",
        matter: "Content for the meaning of Khatamunnabiyyin section...",
      },
      3: {
        id: 3,
        title: "The Prophet's sayings regarding the end of the world",
        matter: "Content for the Prophet's sayings regarding the end of the world...",
      },
      4: {
        id: 4,
        title: "The consensus of the Companions",
        matter: "Content for the consensus of the Companions section...",
      },
      5: {
        id: 5,
        title: "The consensus of religious scholars",
        matter: "Content for the consensus of religious scholars section...",
      },
      6: {
        id: 6,
        title: "The Promised Messiah",
        matter: "Content for the Promised Messiah section...",
      },
    };

    return fallbackContent[articleId] || {
      id: articleId,
      title: "Article Content",
      matter: "Content not available offline. Please check your internet connection.",
    };
  }
};

// Fetch single article by ID using the new articles API
export const fetchArticleById = async (articleId) => {
  try {
    const url = `${ARTICLES_API}/${articleId}/par`;
const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
// API returns array with single object or single object directly
    const articleData = Array.isArray(data) ? data[0] : data;
    
    if (!articleData) {
      throw new Error("No article data found");
    }

    return {
      id: articleData.aid,
      title: articleData.title,
      matter: articleData.matter || "",
      audiotext: articleData.audiotext || "",
      audiourl: articleData.audiourl || ""
    };
  } catch (error) {
    console.error("Failed to fetch article by ID:", error.message);

    // Fallback content
    const fallbackContent = {
      1: {
        id: 1,
        title: "Introduction",
        matter: "Content for Introduction section...",
      },
      2: {
        id: 2,
        title: "The meaning of Khatamunnabiyyin",
        matter: "Content for the meaning of Khatamunnabiyyin section...",
      },
      3: {
        id: 3,
        title: "The Prophet's sayings regarding the end of the world",
        matter: "Content for the Prophet's sayings regarding the end of the world...",
      },
      4: {
        id: 4,
        title: "The consensus of the Companions",
        matter: "Content for the consensus of the Companions section...",
      },
      5: {
        id: 5,
        title: "The consensus of religious scholars",
        matter: "Content for the consensus of religious scholars section...",
      },
      6: {
        id: 6,
        title: "The Promised Messiah",
        matter: "Content for the Promised Messiah section...",
      },
      7: {
        id: 7,
        title: "The Promised Messiah",
        matter: "Content for The Promised Messiah section...",
      },
      8: {
        id: 8,
        title: "Additional Article 8",
        matter: "Content for Additional Article 8 section...",
      },
    };

    return fallbackContent[articleId] || {
      id: articleId,
      title: "Article Content",
      matter: "Content not available offline. Please check your internet connection.",
    };
  }
};

// Fetch list of articles (for navbar)
export const fetchArticlesList = async () => {
  try {
    // Since we don't have a direct list endpoint, we'll fetch individual articles
    // For now, we'll use a predefined list of article IDs
    const articleIds = [1, 2, 3, 4, 5, 6, 7, 8]; // All available article IDs
    
const articles = await Promise.all(
      articleIds.map(async (id) => {
        try {
          const article = await fetchArticleById(id);
return {
            aid: article.id,
            title: article.title
          };
        } catch (error) {
          console.warn(`Failed to fetch article ${id}:`, error.message);
          return {
            aid: id,
            title: `Article ${id}`
          };
        }
      })
    );
    
return articles;
  } catch (error) {
    console.error("Failed to fetch articles list:", error.message);
    
    // Fallback data
    const fallbackData = [
      { aid: 1, title: "Introduction" },
      { aid: 2, title: "The meaning of Khatamunnabiyyin" },
      { aid: 3, title: "The Prophet's sayings regarding the end of the world" },
      { aid: 4, title: "The consensus of the Companions" },
      { aid: 5, title: "The consensus of religious scholars" },
      { aid: 6, title: "The Promised Messiah" },
      { aid: 7, title: "The Promised Messiah" },
      { aid: 8, title: "Additional Article 8" },
    ];
return fallbackData;
  }
};

// Fetch English interpretations using specific footnote endpoints
export const fetchEnglishInterpretations = async (surahId, verseId) => {
try {
    // For Surah 1, Ayah 5, we know the specific footnote IDs: 177002 and 177003
    // For other verses, we'll need to determine the footnote IDs dynamically
    let footnoteIds = [];
    
    if (parseInt(surahId) === 1 && parseInt(verseId) === 5) {
      // Special case for Al-Fatiha Ayah 5 - we know the footnote IDs
      footnoteIds = ['177002', '177003'];
    } else {
      // For other verses, we need to determine footnote IDs from the translation text
      // This would require parsing the translation to find footnote references
      // For now, we'll return empty array for non-Al-Fatiha verses
return [];
    }
    
    const interpretations = [];
    
    // Fetch each footnote
    for (const footnoteId of footnoteIds) {
      try {
        // Use the correct API endpoint: http://localhost:5000/api/english/footnote/{footnoteId}
        const apiBase = CONFIG_API_BASE_PATH || API_BASE_PATH;
        const response = await fetch(`${apiBase}/english/footnote/${footnoteId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.footnote_text) {
            interpretations.push({
              footnote_id: footnoteId,
              text: data.footnote_text,
              content: data.footnote_text,
              explanation: data.footnote_text
            });
}
        } else {
}
      } catch (error) {
        console.error(`❌ [fetchEnglishInterpretations] Error fetching footnote ${footnoteId}:`, error);
      }
    }
    
return interpretations;
    
  } catch (error) {
    console.error(`❌ [fetchEnglishInterpretations] Error fetching English interpretations:`, error);
    return [];
  }
};