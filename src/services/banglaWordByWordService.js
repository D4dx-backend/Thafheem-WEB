import banglaTranslationService from './banglaTranslationService.js';

class BanglaWordByWordService {
  async getWordByWordData(surahId, ayahNumber) {
    return banglaTranslationService.getWordByWordData(surahId, ayahNumber);
  }

  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    return banglaTranslationService.getWordByWordData(surahId, ayahNumber);
  }

  async isAvailable() {
    return banglaTranslationService.isAvailable();
  }
}

const banglaWordByWordService = new BanglaWordByWordService();
export default banglaWordByWordService;

