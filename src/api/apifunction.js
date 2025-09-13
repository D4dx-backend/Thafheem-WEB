import { SURA_NAMES_API, PAGE_RANGES_API, AYAH_AUDIO_TRANSLATION_API, AYA_RANGES_API, QURAN_TEXT_API, QURAN_API_BASE, INTERPRETATION_API } from "./apis";

export const fetchSurahs = async () => {
  const response = await fetch(SURA_NAMES_API);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.map((surah) => ({
    number: surah.SuraID,
    arabic: surah.ASuraName,
    name: surah.ESuraName,
    ayahs: surah.TotalAyas,
    type: surah.SuraType === "Makkan" ? "Makki" : "Madani",
  }));
};


export const fetchJuzData = async () => {
  try {
    // Fetch both APIs concurrently
    const [pageRangesData, surahsData] = await Promise.all([
      fetchPageRanges(),
      fetchSurahs(),
    ]);

    // Create surah names mapping with correct type classification
    const surahNamesMap = {};
    surahsData.forEach(surah => {
      surahNamesMap[surah.number] = {
        name: surah.name,
        arabic: surah.arabic,
        type: surah.SuraType === "Makkan" ? "Makki" : "Madani", // Fixed mapping
        totalAyas: surah.ayahs
      };
    });

    // Process and group page ranges by Juz
    const juzMap = {};

    pageRangesData.forEach(range => {
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
        pageId: range.PageId
      });
    });

    // Transform to component format
    const transformedJuzData = [];

    Object.keys(juzMap).forEach(juzId => {
      const juzSurahs = [];

      Object.keys(juzMap[juzId]).forEach(suraId => {
        const ranges = juzMap[juzId][suraId];
        const surahInfo = surahNamesMap[parseInt(suraId)];

        if (surahInfo) {
          // Combine ranges for display
          const verseRanges = ranges.map(range => 
            range.ayaFrom === range.ayaTo 
              ? `${range.ayaFrom}` 
              : `${range.ayaFrom}-${range.ayaTo}`
          ).join(', ');

          juzSurahs.push({
            number: parseInt(suraId),
            name: surahInfo.name,
            arabic: surahInfo.arabic,
            verses: verseRanges,
            type: surahInfo.type, // This will now be "Makki" or "Madani"
            ayahs: surahInfo.totalAyas
          });
        }
      });

      // Sort surahs by number within each juz
      juzSurahs.sort((a, b) => a.number - b.number);

      if (juzSurahs.length > 0) {
        transformedJuzData.push({
          id: parseInt(juzId),
          title: `Juz ${juzId}`,
          surahs: juzSurahs
        });
      }
    });

    // Sort by juz id
    transformedJuzData.sort((a, b) => a.id - b.id);

    return {
      juzData: transformedJuzData,
      surahNames: surahNamesMap
    };

  } catch (error) {
    throw new Error(`Failed to fetch Juz data: ${error.message}`);
  }
};


// Fetch audio translations for a specific Surah or Ayah
export const fetchAyahAudioTranslations = async (suraId, ayahNumber = null) => {
    const url = ayahNumber
      ? `${AYAH_AUDIO_TRANSLATION_API}/${suraId}/${ayahNumber}`
      : `${AYAH_AUDIO_TRANSLATION_API}/${suraId}`;
  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

// Fetch Arabic verses in Uthmani script from Quran.com API
export const fetchArabicVerses = async (surahId) => {
  const url = `${QURAN_API_BASE}/quran/verses/uthmani?chapter_number=${surahId}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.verses;
};

// Fetch Arabic verses with page information from Quran.com API
export const fetchArabicVersesWithPage = async (surahId, page = 1) => {
  const url = `${QURAN_API_BASE}/quran/verses/uthmani?chapter_number=${surahId}&page=${page}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    verses: data.verses,
    pagination: data.pagination || null
  };
};








// Add these functions to your existing apifunction.js file

// Fetch basic chapter info from Quran.com API
export const fetchCompleteSurahInfo = async (surahId, language = 'en') => {
  try {
    const [basicChapter, detailedInfo, thafheemInfo, surahsData] = await Promise.all([
      fetchBasicChapterData(surahId, language),
      fetchChapterInfo(surahId, language).catch(() => null),
      fetchThafheemPreface(surahId).catch(() => null),
      fetchSurahs().then(surahs => surahs.find(s => s.number === parseInt(surahId))),
    ]);

    return {
      basic: basicChapter,
      detailed: detailedInfo,
      thafheem: thafheemInfo,
      surah: surahsData,
    };
  } catch (error) {
    console.error('Error fetching complete surah info:', error);
    throw error;
  }
};

// Example of dependent functions you may already have in apifunctions.js
export const fetchBasicChapterData = async (chapterId, language = 'en') => {
  const response = await fetch(`${QURAN_API_BASE}/chapters?language=${language}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.chapters.find(chapter => chapter.id === parseInt(chapterId));
};

export const fetchChapterInfo = async (chapterId, language = 'en') => {
  const response = await fetch(`${QURAN_API_BASE}/chapters/${chapterId}/info?language=${language}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.chapter_info;
};

export const fetchThafheemPreface = async (suraId) => {
  const response = await fetch(`https://thafheem.net/thafheem-api/preface/${suraId}`);
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
      fetchSurahs().then(surahs => surahs.find(s => s.number === parseInt(surahId))),
    ]);

    return {
      ayaRanges: ayaRanges || [],
      quranText: quranText || [],
      surahInfo: surahsData || { number: parseInt(surahId), arabic: "Unknown Surah" },
    };
  } catch (error) {
    console.error('Error fetching block-wise data:', error);
    throw error;
  }
};

// Fetch word-by-word meaning from Quran.com API
export const fetchWordByWordMeaning = async (surahId, verseId, language = 'en') => {
  const verseKey = `${surahId}:${verseId}`;
  const url = `${QURAN_API_BASE}/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_indopak,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs,translation&translation_fields=resource_name,language_name&language=${language}&translations=131`;
  
  console.log('Fetching word-by-word data from:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Word-by-word API response:', data);
    return data.verse;
  } catch (error) {
    console.error('Error fetching word-by-word meaning:', error);
    throw error;
  }
};

// Fetch word meanings from Thafheem API
export const fetchThafheemWordMeanings = async (surahId, verseId) => {
  const url = `https://thafheem.net/thafheem-api/wordmeanings/${surahId}/${verseId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Thafheem word meanings:', error);
    throw error;
  }
};

