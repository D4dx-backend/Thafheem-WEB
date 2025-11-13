import { USE_API, API_BASE_PATH, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';

class HindiTranslationService {
  constructor() {
    this.language = 'hindi';
    this.useApi = USE_API;
    this.apiBasePath = API_BASE_PATH;
    this.cacheEnabled = CACHE_ENABLED;
    this.cacheTtl = CACHE_TTL;
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  _assertApiEnabled() {
    if (!this.useApi) {
      throw new Error('Hindi API is disabled (VITE_USE_API=false).');
    }
  }

  generateCacheKey(method, params) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${method}${paramString ? `?${paramString}` : ''}`;
  }

  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheTtl;
  }

  getCachedData(cacheKey) {
    if (!this.cacheEnabled) return null;
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  setCachedData(cacheKey, data) {
    if (!this.cacheEnabled) return;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  async getAyahTranslation(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAyahTranslationInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAyahTranslationInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getTranslation(this.language, surahNo, ayahNo);
      const translation = response?.translation_text ?? response?.translation ?? '';

      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Hindi translation API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahNo) {
    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getSurahTranslations(this.language, surahNo);
      const translations = Array.isArray(response?.translations)
        ? response.translations.map(verse => ({
            number: verse.verse_number,
            ArabicText: '',
            Translation: verse.translation_text ?? '',
          }))
        : [];

      translations.forEach(verse => {
        const ayahKey = this.generateCacheKey('getAyahTranslation', {
          surahNo,
          ayahNo: verse.number,
        });
        if (verse.Translation) {
          this.setCachedData(ayahKey, verse.Translation);
        }
      });

      this.setCachedData(cacheKey, translations);
      return translations;
    } catch (error) {
      console.error(`❌ Hindi surah translation API failed for ${surahNo}:`, error);
      throw error;
    }
  }

  async getWordByWordData(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getWordByWordDataInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getWordByWordDataInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getWordByWord(this.language, surahNo, ayahNo);
      const wordsSource = Array.isArray(response?.words) ? response.words : [];

      if (wordsSource.length === 0) {
        console.warn(`⚠️ No Hindi word-by-word data for ${surahNo}:${ayahNo}`);
        return [];
      }

      const words = wordsSource.map((word, index) => ({
        id: word.id ?? word.WordId ?? word.word_id ?? index + 1,
        position: word.position ?? word.WordId ?? word.word_id ?? index + 1,
        audio_url: word.audio_url ?? null,
        char_type_name: word.char_type_name ?? 'word',
        code_v1: word.code_v1 ?? '',
        code_v2: word.code_v2 ?? '',
        line_number: word.line_number ?? 1,
        page_number: word.page_number ?? 1,
        text_uthmani: word.text_uthmani ?? '',
        text_simple: word.text_simple ?? '',
        translation: {
          text: word.translation?.text ?? word.WordMeaning ?? '',
          language_name: word.translation?.language_name ?? 'Hindi',
          resource_name: word.translation?.resource_name ?? 'Thafheem Hindi Word Database',
        },
        transliteration: {
          text: word.transliteration?.text ?? word.WordPhrase ?? '',
          language_name: word.transliteration?.language_name ?? 'Hindi',
        },
      }));

      this.setCachedData(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`❌ Hindi word-by-word API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getExplanation(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getExplanation', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getExplanationInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getExplanationInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getInterpretation(this.language, surahNo, ayahNo);
      const explanation = response?.explanations?.[0]?.explanation ?? null;

      if (!explanation) {
        console.warn(`⚠️ No Hindi explanation found for ${surahNo}:${ayahNo}`);
        return null;
      }

      this.setCachedData(cacheKey, explanation);
      return explanation;
    } catch (error) {
      console.error(`❌ Hindi explanation API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getAllExplanations(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAllExplanations', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAllExplanationsInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAllExplanationsInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getInterpretation(this.language, surahNo, ayahNo);
      const explanations = Array.isArray(response?.explanations)
        ? response.explanations.map(exp => ({
            explanation: exp.explanation,
            explanation_no_local: exp.explanation_no_local ?? null,
            explanation_no_en: exp.explanation_no_en ?? null,
          }))
        : [];

      this.setCachedData(cacheKey, explanations);
      return explanations;
    } catch (error) {
      console.error(`❌ Hindi explanations API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    const cacheKey = this.generateCacheKey('getExplanationByNumber', { surahNo, ayahNo, explanationNumber });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getExplanationByNumberInternal(surahNo, ayahNo, explanationNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getExplanationByNumberInternal(surahNo, ayahNo, explanationNumber, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getInterpretation(this.language, surahNo, ayahNo, explanationNumber);
      const explanation = response?.explanations?.find(exp =>
        exp.explanation_no_local == explanationNumber ||
        exp.explanation_no_en == explanationNumber,
      );

      if (!explanation?.explanation) {
        console.warn(`⚠️ No Hindi explanation found for ${surahNo}:${ayahNo} number ${explanationNumber}`);
        return null;
      }

      this.setCachedData(cacheKey, explanation.explanation);
      return explanation.explanation;
    } catch (error) {
      console.error(
        `❌ Hindi explanation API failed for ${surahNo}:${ayahNo} number ${explanationNumber}:`,
        error,
      );
      throw error;
    }
  }

  parseHindiTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const supTags = tempDiv.querySelectorAll('sup.f-note');
    supTags.forEach(sup => {
      const link = sup.querySelector('a');
      if (link) {
        const explanationNumber = link.textContent.trim();
        if (/^[\d१२३४५६७८९०]+$/.test(explanationNumber)) {
          sup.style.cssText = `
            cursor: pointer !important;
            background-color: #19B5DD !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            border: none !important;
            padding: 4px 8px !important;
            margin: 0 4px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 12px !important;
            vertical-align: middle !important;
            line-height: 1 !important;
            border-radius: 50% !important;
            position: relative !important;
            top: 0 !important;
            min-width: 24px !important;
            min-height: 24px !important;
            text-align: center !important;
            transition: all 0.2s ease-in-out !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          `;

          sup.addEventListener('mouseenter', () => {
            sup.style.backgroundColor = '#0ea5e9';
            sup.style.transform = 'scale(1.1)';
          });

          sup.addEventListener('mouseleave', () => {
            sup.style.backgroundColor = '#19B5DD';
            sup.style.transform = 'scale(1)';
          });

          sup.setAttribute('data-footnote', explanationNumber);
          sup.setAttribute('data-surah', surahNo);
          sup.setAttribute('data-ayah', ayahNo);
          sup.setAttribute('title', `Click to view explanation ${explanationNumber}`);
          sup.className = 'hindi-footnote-link';
          sup.innerHTML = explanationNumber;
        }
      }
    });

    return tempDiv.innerHTML;
  }

  async isAvailable() {
    try {
      this._assertApiEnabled();
      await apiService.checkLanguageHealth(this.language);
      return true;
    } catch (error) {
      console.error('❌ Hindi service not available:', error);
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  destroy() {
    this.clearCache();
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheEnabled: this.cacheEnabled,
      cacheTtl: this.cacheTtl,
      mode: 'API-only',
    };
  }
}

export default new HindiTranslationService();



