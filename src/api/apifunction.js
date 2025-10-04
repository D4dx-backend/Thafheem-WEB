
import { SURA_NAMES_API, PAGE_RANGES_API, AYAH_AUDIO_TRANSLATION_API, AYA_RANGES_API, AYA_TRANSLATION_API, QURAN_TEXT_API, QURAN_API_BASE_URL, INTERPRETATION_API,QUIZ_API, NOTES_API, DIRECTUS_BASE_URL, API_BASE_URL } from "./apis";

// Helper function to add timeout to fetch requests
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond');
    }
    // Handle network errors gracefully
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('ERR_CONNECTION_CLOSED') ||
        error.message?.includes('ERR_NETWORK')) {
      throw new Error('Network error - API server may be unavailable');
    }
    throw error;
  }
};

// (duplicate import block removed)

export const fetchSurahs = async () => {
  try {
    const response = await fetchWithTimeout(SURA_NAMES_API, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const result = data.map((surah) => ({
      number: surah.SuraID,
      arabic: surah.ASuraName?.trim(),
      name: surah.ESuraName?.trim(),
      ayahs: surah.TotalAyas,
      type: surah.SuraType === "Makkan" ? "Makki" : "Madani",
    }));
    return result;
  } catch (error) {
    console.warn('Failed to fetch surahs from Thafheem API, trying fallback');
    
    // Try Quran.com API as fallback
    try {
      const fallbackResponse = await fetchWithTimeout(`${QURAN_API_BASE_URL}/chapters`, {}, 8000);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const result = fallbackData.chapters.map((chapter) => ({
          number: chapter.id,
          arabic: chapter.name_arabic,
          name: chapter.name_simple,
          ayahs: chapter.verses_count,
          type: chapter.revelation_place === "makkah" ? "Makki" : "Madani",
        }));
        console.log('Successfully fetched surahs from Quran.com fallback API');
        return result;
      }
    } catch (fallbackError) {
      console.warn('Quran.com fallback also failed:', fallbackError.message);
    }
    
    // Return comprehensive fallback data when all APIs are unavailable
    console.warn('Using comprehensive hardcoded fallback data for all 114 Surahs');
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
  }
};

/**
 * List surah names with minimal fields for UI dropdowns or lists
 * Returns: [{ id, arabic, english }]
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
    console.warn('Failed to fetch surah names from Thafheem API, trying Quran.com fallback:', error.message);
    
    // Try Quran.com API as fallback
    try {
      const fallbackResponse = await fetchWithTimeout(`${QURAN_API_BASE_URL}/chapters`, {}, 8000);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const result = fallbackData.chapters.map((chapter) => ({
          id: chapter.id,
          arabic: chapter.name_arabic,
          english: chapter.name_simple,
        }));
        console.log('Successfully fetched surah names from Quran.com fallback API');
        return result;
      }
    } catch (fallbackError) {
      console.warn('Quran.com fallback also failed:', fallbackError.message);
    }
    
    // Return basic fallback data when all APIs are unavailable
    console.warn('Using hardcoded fallback data for surah names');
    return [
      { id: 1, arabic: "الفاتحة", english: "Al-Fatiha" },
      { id: 2, arabic: "البقرة", english: "Al-Baqarah" },
      { id: 3, arabic: "آل عمران", english: "Ali 'Imran" },
      { id: 4, arabic: "النساء", english: "An-Nisa" },
      { id: 5, arabic: "المائدة", english: "Al-Ma'idah" },
      { id: 6, arabic: "الأنعام", english: "Al-An'am" },
      { id: 7, arabic: "الأعراف", english: "Al-A'raf" },
      { id: 8, arabic: "الأنفال", english: "Al-Anfal" },
      { id: 9, arabic: "التوبة", english: "At-Tawbah" },
      { id: 10, arabic: "يونس", english: "Yunus" },
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
    const response = await fetchWithTimeout(PAGE_RANGES_API, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Failed to fetch page ranges from Thafheem API:', error.message);
    // Return empty array when API is unavailable
    return [];
  }
};

export const fetchJuzData = async () => {
  try {
    // Fetch both APIs concurrently, but handle failures gracefully
    const [pageRangesData, surahsData] = await Promise.allSettled([
      fetchPageRanges().catch(error => {
        console.warn('Failed to fetch page ranges:', error.message);
        return []; // Return empty array on failure
      }),
      fetchSurahs().catch(error => {
        console.warn('Failed to fetch surahs:', error.message);
        return []; // Return empty array on failure
      }),
    ]);
    
    // Extract the actual data from Promise.allSettled results
    const pageRanges = pageRangesData.status === 'fulfilled' ? pageRangesData.value : [];
    const surahs = surahsData.status === 'fulfilled' ? surahsData.value : [];

    // Create surah names mapping with correct type classification
    const surahNamesMap = {};
    surahs.forEach((surah) => {
      surahNamesMap[surah.number] = {
        name: surah.name,
        arabic: surah.arabic,
        type: surah.type, // Use the already processed type
        totalAyas: surah.ayahs,
      };
    });

    // Process and group page ranges by Juz
    const juzMap = {};

    pageRanges.forEach((range) => {
      const juzId = range.juzid;
      const suraId = range.SuraId;

      if (!juzMap[juzId]) {
        juzMap[juzId] = {};
      }

      if (!juzMap[juzId][suraId]) {
        juzMap[juzId][suraId] = [];
      }

      juzMap[juzId][suraId].push({
        ayaFrom: range.ayafrom,
        ayaTo: range.ayato,
        pageId: range.PageId,
      });
    });

    // Transform to component format
    const transformedJuzData = [];

    Object.keys(juzMap).forEach((juzId) => {
      const juzSurahs = [];

      Object.keys(juzMap[juzId]).forEach((suraId) => {
        const ranges = juzMap[juzId][suraId];
        const surahInfo = surahNamesMap[parseInt(suraId)];

        if (surahInfo) {
          // Combine ranges for display
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
            type: surahInfo.type, // This will now be "Makki" or "Madani"
            ayahs: surahInfo.totalAyas,
          });
        }
      });

      // Sort surahs by number within each juz
      juzSurahs.sort((a, b) => a.number - b.number);

      if (juzSurahs.length > 0) {
        transformedJuzData.push({
          id: parseInt(juzId),
          title: `Juz ${juzId}`,
          surahs: juzSurahs,
        });
      }
    });

    // Sort by juz id
    transformedJuzData.sort((a, b) => a.id - b.id);

    return {
      juzData: transformedJuzData,
      surahNames: surahNamesMap,
    };
  } catch (error) {
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
    }
  };

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
    console.warn('Failed to fetch Arabic verses from API, using fallback:', error.message);
    // Return basic fallback data when API is unavailable
    return [
      { id: 1, verse_number: 1, text_uthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
      { id: 2, verse_number: 2, text_uthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
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
    const response = await fetch(
      `${QURAN_API_BASE_URL}/chapters?language=${language}`
    );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.chapters.find((chapter) => chapter.id === parseInt(chapterId));
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
  const response = await fetch(
    `${API_BASE_URL}/preface/${suraId}`
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data[0]; // Take first element
};

// Block-wise reading API functions

// Fetch ayah ranges for block-based reading structure
export const fetchAyaRanges = async (surahId) => {
  const response = await fetch(`${AYA_RANGES_API}/${surahId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

// Fetch translation for a specific ayah range
export const fetchAyaTranslation = async (surahId, range) => {
  const url = `${AYA_TRANSLATION_API}/${surahId}/${range}`;
  
  try {
    const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching translation for ${surahId}:${range}:`, error.message);
    throw error;
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
  const verseKey = `${surahId}:${verseId}`;
  const url = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_indopak,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs,translation&translation_fields=resource_name,language_name&language=${language}&translations=131`;

  console.log("Fetching word-by-word data from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Word-by-word API response:", data);
    return data.verse;
  } catch (error) {
    console.error("Error fetching word-by-word meaning:", error);
    throw error;
  }
};

// Fetch word meanings from Thafheem API
export const fetchThafheemWordMeanings = async (surahId, verseId) => {
  const url = `${API_BASE_URL}/wordmeanings/${surahId}/${verseId}`;

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
  
  console.log('🔍 Fetching note:', { noteId: id, url });
  
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/json'
      }
    }, 5000); // 5 second timeout
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('📝 Note API response:', { noteId: id, data });
    return data;
  } catch (error) {
    console.warn('Error fetching note by id:', error.message);
    // Return a fallback note when API is unavailable
    return {
      id: id,
      note_text: `Note ${id} is currently unavailable. The API server may be down. Please try again later.`,
      surah_id: null,
      verse_id: null,
      interpretation_no: null
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
  // Primary endpoint: Use INTERPRETATION_API with interpretation number
  const primaryUrl = `${INTERPRETATION_API}/${surahId}/${verseId}/${interpretationNo}`;

  try {
    console.log("Fetching interpretation from:", primaryUrl);
    const response = await fetch(primaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Interpretation data received:", data);

    // The API returns an array of interpretation objects
    // Filter by interpretation number if multiple interpretations exist
    if (Array.isArray(data) && data.length > 0) {
      const filteredData = data.filter(
        (item) => item.interptn_no === interpretationNo || !item.interptn_no
      );
      return filteredData.length > 0 ? filteredData : data;
    }

    return data;
  } catch (error) {
    console.error("Error fetching interpretation from primary endpoint:", error);

    // Fallback: Try with language parameter
    try {
      const langUrl = `${INTERPRETATION_API}/${surahId}/${verseId}/${interpretationNo}/${language}`;
      console.log("Trying language-specific interpretation URL:", langUrl);
      const langResponse = await fetch(langUrl);
      if (!langResponse.ok) {
        throw new Error(`HTTP error! status: ${langResponse.status}`);
      }
      const langData = await langResponse.json();
      console.log("Language-specific interpretation data received:", langData);
      return langData;
    } catch (langError) {
      console.error("All interpretation endpoints failed:", langError);
      console.warn(`Interpretation not available for Surah ${surahId}, Verse ${verseId}. All API endpoints returned errors.`);
      // Return null instead of throwing error to allow graceful handling
      return null;
    }
  }
};

// Fetch interpretation for verse range from Thafheem API
export const fetchInterpretationRange = async (
  surahId,
  range,
  interpretationNo = 1,
  language = "en"
) => {
  // For ranges, use the range-based endpoint
  const url = `${INTERPRETATION_API}/${surahId}/${range}/${interpretationNo}/${language}`;

  try {
    console.log("Fetching range interpretation from:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Range interpretation data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching interpretation range:", error);

    // Fallback: Try without language parameter
    try {
      const noLangUrl = `${INTERPRETATION_API}/${surahId}/${range}/${interpretationNo}`;
      console.log("Trying range interpretation without language:", noLangUrl);
      const noLangResponse = await fetch(noLangUrl);
      if (!noLangResponse.ok) {
        throw new Error(`HTTP error! status: ${noLangResponse.status}`);
      }
      const noLangData = await noLangResponse.json();
      console.log(
        "Range interpretation without language received:",
        noLangData
      );
      return noLangData;
    } catch (noLangError) {
      console.error("Range interpretation fallback also failed:", noLangError);
      throw error;
    }
  }
};

// Additional helper function to fetch multiple interpretations for a verse
export const fetchAllInterpretations = async (
  surahId,
  verseId,
  language = "en"
) => {
  try {
    const url = `${API_BASE_URL}/audiointerpret/${surahId}/${verseId}`;
    console.log("Fetching all interpretations from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("All interpretations data received:", data);

    // Return all interpretations for the verse
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching all interpretations:", error);
    throw error;
  }
};

// Fetch quiz questions for specific surah and verse range
export const fetchQuizQuestions = async (surahId, range) => {
  const url = `${QUIZ_API}/${surahId}/${range}`;

  try {
    console.log("=== FETCHING QUIZ QUESTIONS ===");
    console.log("URL:", url);
    console.log("Surah ID:", surahId);
    console.log("Range:", range);

    const response = await fetch(url);
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("=== RAW API RESPONSE ===");
    console.log("Response data:", data);
    console.log("Data type:", typeof data);
    console.log("Is array:", Array.isArray(data));

    if (Array.isArray(data) && data.length > 0) {
      console.log("First item keys:", Object.keys(data[0]));
      console.log("First item:", data[0]);
    } else if (data && typeof data === "object") {
      console.log("Single object keys:", Object.keys(data));
      console.log("Single object:", data);
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
  console.log("=== TRANSFORM QUIZ DATA START ===");
  console.log("Raw input data:", rawData);
  console.log("Data type:", typeof rawData);
  console.log("Is array:", Array.isArray(rawData));

  if (!Array.isArray(rawData)) {
    console.log("Converting non-array to array");
    rawData = [rawData];
  }

  const transformed = rawData.map((item, index) => {
    console.log(`\n--- Processing Question ${index + 1} ---`);
    console.log("Raw item:", item);
    console.log("Item keys:", Object.keys(item));

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

    console.log("Extracted question text:", questionText);
    console.log("Raw correct answer:", rawCorrectAnswer);

    // Handle different option formats - COMPREHENSIVE APPROACH
    let options = [];

    // Method 1: Direct options array
    if (item.options && Array.isArray(item.options)) {
      console.log("Found options array:", item.options);
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
      console.log("Searching for individual option fields...");

      // Get all possible field names for this item
      const allFields = Object.keys(item);
      console.log("All available fields:", allFields);

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

        console.log(`Looking for option ${letter} in fields:`, possibleFields);

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
              console.log(
                `Found option ${letter} in field '${field}':`,
                optionText
              );
              options.push({ id: letter, text: optionText });
              break; // Found this option, move to next letter
            }
          }
        }
      });
    }

    // Method 3: Check for nested objects
    if (options.length === 0) {
      console.log("Checking for nested option objects...");

      if (item.choices) {
        console.log("Found choices object:", item.choices);
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
        console.log("Found alternatives object:", item.alternatives);
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
      console.log("Trying pattern matching for option fields...");
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

      console.log("Potential option fields found:", potentialOptionFields);

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

    console.log(`Final extracted options for question ${index + 1}:`, options);

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

      console.log("Found string values that might be options:", stringValues);

      if (stringValues.length >= 2) {
        // Use the string values as options
        options = stringValues.slice(0, 4).map((item, idx) => ({
          id: ["A", "B", "C", "D"][idx],
          text: item.value,
        }));
        console.log("Created options from string values:", options);
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
        console.log(
          `Converted numeric answer ${rawCorrectAnswer} to letter ${correctAnswer}`
        );
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
        console.log(`Found matching option by content: ${correctAnswer}`);
      } else {
        // Default to first option if no match found
        correctAnswer = options[0]?.id || "A";
        console.warn(
          `No matching option found, defaulting to ${correctAnswer}`
        );
      }
    }

    console.log("Final correct answer:", correctAnswer);

    const result = {
      id: questionId,
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
    };

    console.log(`Final transformed question ${index + 1}:`, result);
    return result;
  });

  console.log("=== TRANSFORM QUIZ DATA END ===");
  console.log("Final transformed data:", transformed);
  return transformed;
};

// Add this helper function to debug API response structure
export const debugApiResponse = (data) => {
  console.log("=== API RESPONSE DEBUG ===");
  console.log("Response type:", typeof data);
  console.log("Is array:", Array.isArray(data));
  console.log("Raw response:", data);

  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    console.log("First item keys:", Object.keys(firstItem));
    console.log("First item values:", Object.values(firstItem));
    console.log("First item structure:", firstItem);

    // Look for option-related fields
    const optionFields = Object.keys(firstItem).filter(
      (key) =>
        key.toLowerCase().includes("option") ||
        key.toLowerCase().includes("choice") ||
        key.toLowerCase().includes("answer") ||
        key.match(/^[A-D]$/) ||
        key.match(/^[a-d]$/)
    );
    console.log("Potential option fields:", optionFields);

    optionFields.forEach((field) => {
      console.log(`${field}:`, firstItem[field]);
    });
  }
  console.log("=== END DEBUG ===");

  return data;
};
// Updated validation function with more flexible checking
export const validateQuizData = (quizData) => {
  console.log("Validating quiz data:", quizData);

  if (!Array.isArray(quizData)) {
    console.warn("Quiz data is not an array:", quizData);
    return false;
  }

  if (quizData.length === 0) {
    console.warn("Quiz data array is empty");
    return false;
  }

  const isValid = quizData.every((question, index) => {
    console.log(`Validating question ${index}:`, question);

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

    console.log(`Question ${index} validation:`, {
      hasId,
      hasQuestion,
      hasOptions,
      hasCorrectAnswer,
      optionsCount: question.options ? question.options.length : 0,
    });

    if (!hasId) console.warn(`Question ${index} missing ID:`, question);
    if (!hasQuestion)
      console.warn(`Question ${index} missing question text:`, question);
    if (!hasOptions)
      console.warn(`Question ${index} missing or invalid options:`, question);
    if (!hasCorrectAnswer)
      console.warn(`Question ${index} missing correct answer:`, question);

    return hasId && hasQuestion && hasOptions && hasCorrectAnswer;
  });

  console.log("Quiz data validation result:", isValid);
  return isValid;
};

// Fetch quiz questions with data transformation
export const fetchQuizWithSurahInfo = async (surahId, range) => {
  try {
    const [rawQuizData, surahsData] = await Promise.all([
      fetchQuizQuestions(surahId, range),
      fetchSurahs(),
    ]);

    console.log("Raw quiz data before transformation:", rawQuizData);

    // Transform the quiz data to expected format
    const transformedQuestions = transformQuizData(rawQuizData);
    console.log("Transformed quiz questions:", transformedQuestions);

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
  console.log("=== DIRECT API TEST ===");
  console.log("Testing URL:", url);

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const rawText = await response.text();
    console.log("Raw response text:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
      console.log("Parsed JSON data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));

      if (Array.isArray(data) && data.length > 0) {
        console.log("First item structure:");
        console.log("Keys:", Object.keys(data[0]));
        console.log("Values:", Object.values(data[0]));
        console.log("Full first item:", data[0]);

        // Look specifically for option fields
        const firstItem = data[0];
        console.log("\n=== OPTION FIELD ANALYSIS ===");
        Object.keys(firstItem).forEach((key) => {
          const value = firstItem[key];
          console.log(`${key}: ${value} (type: ${typeof value})`);
        });
      }

      return data;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Response is not valid JSON");
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
    console.log("Search API response:", data); // Debug log
    
    // Enhanced results with better formatting
    const results = data.search?.results || [];
    
    return results.map(result => ({
      ...result,
      // Ensure we have the translated text
      text: result.text || result.translated_text || result.translation?.text || 'Translation not available',
      // Add chapter information if available
      chapter: result.chapter || { name_simple: `Surah ${result.verse_key.split(':')[0]}` },
      // Highlight matched terms (basic implementation)
      highlighted_text: highlightSearchTerms(result.text || result.translated_text || '', query)
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
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
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
    const surah = surahs.find(s => s.number === surahNumber);
    
    if (!surah) return null;
    
    // Create verse reference result
    const verseKey = `${surahNumber}:${startVerse}`;
    const displayText = endVerse > startVerse 
      ? `Verses ${startVerse}-${endVerse} from ${surah.name}`
      : `Verse ${startVerse} from ${surah.name}`;
    
    return {
      type: 'verse_reference',
      verse_key: verseKey,
      surah_number: surahNumber,
      verse_start: startVerse,
      verse_end: endVerse,
      surah_info: surah,
      display_text: displayText
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
      query.trim().length >= 3 ? searchQuranContent(query, language) : []
    ]);

    // Get surah names for verse results
    const surahsData = await fetchSurahs();
    const surahNamesMap = {};
    surahsData.forEach(surah => {
      surahNamesMap[surah.number] = surah;
    });

    // Enhance verse results with surah information
    const enhancedVerses = contentResults.map(verse => ({
      ...verse,
      surahInfo: surahNamesMap[parseInt(verse.verse_key.split(':')[0])] || null
    }));

    // Add verse reference result if found
    if (verseRef) {
      enhancedVerses.unshift({
        ...verseRef,
        text: verseRef.display_text,
        verse_key: verseRef.verse_key,
        surahInfo: verseRef.surah_info
      });
    }

    return {
      surahs: surahResults,
      verses: enhancedVerses,
      hasResults: surahResults.length > 0 || enhancedVerses.length > 0,
      totalResults: surahResults.length + enhancedVerses.length,
      hasVerseReference: !!verseRef
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
    console.log("Home banner data received:", data);

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
    console.log("App settings data received:", data);

    return data.data || [];
  } catch (error) {
    console.error("Error fetching app settings:", error);
    return [];
  }
};

// Fetch AI API configuration from Directus CMS
export const fetchAiApiConfig = async () => {
  try {
    const response = await fetch(
      `${DIRECTUS_BASE_URL}/items/thafheem_ai_api`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI API config data received:", data);

    return data.data || {};
  } catch (error) {
    console.error("Error fetching AI API config:", error);
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
    console.log("Chapters data received:", data);

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
