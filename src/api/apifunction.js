import { SURA_NAMES_API, PAGE_RANGES_API, AYAH_AUDIO_TRANSLATION_API } from "./apis";

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
    type: surah.SuraType === "M" ? "Makki" : "Madani",
  }));
};

export const fetchPageRanges = async () => {
  const response = await fetch(PAGE_RANGES_API);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const fetchJuzData = async () => {
  try {
    // Fetch both APIs concurrently
    const [pageRangesData, surahsData] = await Promise.all([
      fetchPageRanges(),
      fetchSurahs(),
    ]);

    // Create surah names mapping
    const surahNamesMap = {};
    surahsData.forEach(surah => {
      surahNamesMap[surah.number] = {
        name: surah.name,
        arabic: surah.arabic,
        type: surah.type,
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
            type: surahInfo.type,
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


