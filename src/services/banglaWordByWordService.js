import banglaTranslationService from './banglaTranslationService.js';
import apiService from './apiService.js';

class BanglaWordByWordService {
  async getWordByWordData(surahId, ayahNumber) {
    return banglaTranslationService.getWordByWordData(surahId, ayahNumber);
  }

  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      const banglaData = await banglaTranslationService.getWordByWordData(surahId, ayahNumber);
      if (!banglaData) {
        console.warn(`⚠️ No Bangla data found for ${surahId}:${ayahNumber}`);
        return null;
      }

      // Fetch Arabic text from our API to get the complete verse text
      try {
        const arabicData = await apiService.getArabicText(surahId, ayahNumber);
        return {
          ...banglaData,
          text_uthmani: arabicData.text_uthmani || banglaData.text_uthmani || '',
          text_simple: arabicData.text_simple || banglaData.text_simple || ''
        };
      } catch (arabicError) {
        console.warn('⚠️ Could not fetch Arabic text, using Bangla data only');
        // Construct text_uthmani from words if available
        if (banglaData.words && banglaData.words.length > 0) {
          const constructedText = banglaData.words
            .map(word => word.text_uthmani || word.WordPhrase || '')
            .filter(Boolean)
            .join(' ');
          return {
            ...banglaData,
            text_uthmani: banglaData.text_uthmani || constructedText,
            text_simple: banglaData.text_simple || constructedText
          };
        }
      }

      return banglaData;
    } catch (error) {
      console.error(`❌ Error fetching Bangla word-by-word with Arabic for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async isAvailable() {
    return banglaTranslationService.isAvailable();
  }
}

const banglaWordByWordService = new BanglaWordByWordService();
export default banglaWordByWordService;

