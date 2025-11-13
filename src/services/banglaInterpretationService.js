import banglaTranslationService from './banglaTranslationService.js';

class BanglaInterpretationService {
  constructor() {
    this.language = 'bangla';
  }

  async getExplanation(surahNo, ayahNo) {
    return banglaTranslationService.getExplanation(surahNo, ayahNo);
  }

  async getAllExplanations(surahNo, ayahNo) {
    return banglaTranslationService.getAllExplanations(surahNo, ayahNo);
  }

  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    return banglaTranslationService.getExplanationByNumber(surahNo, ayahNo, explanationNumber);
  }

  parseBanglaTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) {
    return banglaTranslationService.parseBanglaTranslationWithClickableExplanations(
      htmlContent,
      surahNo,
      ayahNo,
    );
  }

  async isAvailable() {
    return true;
  }

  destroy() {
    // No-op for API-backed service
  }
}

const banglaInterpretationService = new BanglaInterpretationService();
export default banglaInterpretationService;

