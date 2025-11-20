import { USE_API, API_BASE_PATH, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';

const DEFAULT_TAMIL_PAGE_SIZE = 25;

class TamilTranslationService {
  constructor() {
    this.language = 'tamil';
    this.useApi = USE_API !== false;
    this.apiBasePath = API_BASE_PATH;
    this.cacheEnabled = CACHE_ENABLED;
    this.cacheTtl = CACHE_TTL;
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  _assertApiEnabled() {
    if (!this.useApi) {
      throw new Error('Tamil API is disabled (VITE_USE_API=false).');
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
      console.error(`❌ Tamil translation API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahNo, options = {}) {
    const page = Number.isInteger(options.page) && options.page > 0 ? options.page : 1;
    const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : DEFAULT_TAMIL_PAGE_SIZE;

    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahNo, page, limit });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey, { page, limit });
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahNo, cacheKey, { page, limit }) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getSurahTranslations(this.language, surahNo, { page, limit });
      const translations = Array.isArray(response?.translations)
        ? response.translations.map(verse => ({
            number: verse.verse_number,
            ArabicText: '',
            Translation: verse.translation_text ?? '',
            RawTranslation: verse.translation_text ?? '',
          }))
        : [];
      const pagination = response?.pagination || null;

      translations.forEach(verse => {
        const ayahKey = this.generateCacheKey('getAyahTranslation', {
          surahNo,
          ayahNo: verse.number,
        });
        if (verse.Translation) {
          this.setCachedData(ayahKey, verse.Translation);
        }
      });

      const result = {
        translations,
        pagination: pagination || {
          page,
          limit,
          totalItems: translations.length,
          totalPages: translations.length > 0 ? Math.ceil(translations.length / limit) : 0,
          hasNext: false,
          hasPrev: page > 1,
        },
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Tamil surah translation API failed for ${surahNo}:`, error);
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
      const words = Array.isArray(response?.words) ? response.words : [];

      this.setCachedData(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`❌ Tamil word-by-word API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async fetchBlockwiseTamil(surahNo, startAyah, endAyah) {
    const cacheKey = this.generateCacheKey('fetchBlockwiseTamil', { surahNo, startAyah, endAyah });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const ayahNumbers = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      ayahNumbers.push(ayah);
    }

    const translations = await Promise.all(
      ayahNumbers.map(async ayah => ({
        ayah,
        translation: await this.getAyahTranslation(surahNo, ayah),
      })),
    );

    this.setCachedData(cacheKey, translations);
    return translations;
  }

  async getExplanation() {
    return 'N/A';
  }

  async getAllExplanations() {
    return [];
  }

  async getExplanationByNumber() {
    return 'N/A';
  }

  async isAvailable() {
    try {
      this._assertApiEnabled();
      await apiService.checkLanguageHealth(this.language);
      return true;
    } catch (error) {
      console.error('❌ Tamil service not available:', error);
      return false;
    }
  }

  hasInterpretations() {
    return false;
  }

  isDatabaseDownloaded() {
    return true;
  }

  async downloadDatabase() {
    return true;
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

export default new TamilTranslationService();

