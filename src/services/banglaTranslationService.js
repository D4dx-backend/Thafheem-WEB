import { API_BASE_PATH } from '../config/apiConfig.js';
import apiService from './apiService.js';

const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 200;

class BanglaTranslationService {
  constructor() {
    this.language = 'bangla';
    this.apiBasePath = API_BASE_PATH;
    this.pendingRequests = new Map();
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
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

  async getAyahTranslation(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahId, ayahNumber });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAyahTranslationInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAyahTranslationInternal(surahId, ayahNumber, cacheKey) {
    try {
      const response = await apiService.getTranslation(this.language, surahId, ayahNumber);
      const translation = response?.translation_text ?? response?.translation ?? null;

      if (!translation) {
        console.warn(`⚠️ No Bangla translation returned for ${surahId}:${ayahNumber}`);
        return null;
      }

      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Bangla translation API failed for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahId, options = {}) {
    const hasPagination = options && (options.page !== undefined || options.limit !== undefined);
    const page = Number.isInteger(options.page) && options.page > 0 ? options.page : 1;
    const requestedLimit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : DEFAULT_PAGE_SIZE;
    const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const cacheKey = this.generateCacheKey('getSurahTranslations', hasPagination ? { surahId, page, limit } : { surahId });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahId, cacheKey, { page, limit, hasPagination });
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahId, cacheKey, { page, limit, hasPagination }) {
    try {
      const params = hasPagination ? { page, limit } : {};
      const response = await apiService.getSurahTranslations(this.language, surahId, params);
      const translations = Array.isArray(response?.translations)
        ? response.translations.map(verse => ({
            number: verse.verse_number,
            ArabicText: '',
            Translation: verse.translation_text ?? '',
          }))
        : [];

      translations.forEach(verse => {
        const ayahKey = this.generateCacheKey('getAyahTranslation', {
          surahId,
          ayahNumber: verse.number,
        });
        if (verse.Translation) {
          this.setCachedData(ayahKey, verse.Translation);
        }
      });

      if (!hasPagination) {
        this.setCachedData(cacheKey, translations);
        return translations;
      }

      const pagination = response?.pagination
        ? {
            page: response.pagination.page ?? page,
            limit: response.pagination.limit ?? limit,
            totalItems: response.pagination.totalItems ?? response.pagination.total ?? null,
            totalPages: response.pagination.totalPages ?? null,
            hasNext: response.pagination.hasNext ?? false,
            hasPrev: response.pagination.hasPrev ?? page > 1,
            from: response.pagination.from ?? null,
            to: response.pagination.to ?? null,
          }
        : {
            page,
            limit,
            totalItems: response?.count ?? null,
            totalPages: response?.count ? Math.ceil(response.count / limit) : null,
            hasNext: translations.length === limit,
            hasPrev: page > 1,
            from: translations[0]?.number ?? null,
            to: translations[translations.length - 1]?.number ?? null,
          };

      const result = { translations, pagination };
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Bangla surah translation API failed for ${surahId}:`, error);
      throw error;
    }
  }

  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahId, ayahNumber });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getWordByWordDataInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getWordByWordDataInternal(surahId, ayahNumber, cacheKey) {
    try {
      const response = await apiService.getWordByWord(this.language, surahId, ayahNumber);
      const wordsSource = Array.isArray(response?.words) ? response.words : [];

      if (wordsSource.length === 0) {
        console.warn(`⚠️ No Bangla word-by-word data for ${surahId}:${ayahNumber}`);
        return null;
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
        // Map WordPhrase (Arabic text) to text_uthmani and text_simple
        text_uthmani: word.text_uthmani ?? word.WordPhrase ?? '',
        text_simple: word.text_simple ?? word.WordPhrase ?? '',
        translation: {
          text: word.translation?.text ?? word.WordMeaning ?? '',
          language_name: word.translation?.language_name ?? 'Bangla',
          resource_name: word.translation?.resource_name ?? 'Thafheem Bangla Word Database',
        },
        transliteration: {
          text: word.transliteration?.text ?? '',
          language_name: word.transliteration?.language_name ?? 'English',
        },
      }));

      // Construct full verse text from words if not provided by backend
      const constructedText = words
        .map(word => word.text_uthmani || word.WordPhrase || '')
        .filter(Boolean)
        .join(' ');

      const payload = {
        text_uthmani: response?.text_uthmani ?? constructedText,
        words,
        translations: response?.translations ?? [],
      };

      this.setCachedData(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error(`❌ Bangla word-by-word API failed for ${surahId}:${ayahNumber}:`, error);
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
    try {
      const response = await apiService.getInterpretation(this.language, surahNo, ayahNo);
      const explanation = response?.explanations?.[0]?.explanation ?? null;

      if (!explanation) {
        console.warn(`⚠️ No Bangla explanation found for ${surahNo}:${ayahNo}`);
        return null;
      }

      this.setCachedData(cacheKey, explanation);
      return explanation;
    } catch (error) {
      console.error(`❌ Bangla explanation API failed for ${surahNo}:${ayahNo}:`, error);
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
    try {
      const response = await apiService.getInterpretation(this.language, surahNo, ayahNo);
      const explanations = Array.isArray(response?.explanations)
        ? response.explanations.map(exp => ({
            explanation: exp.explanation,
            explanation_no_BNG: exp.explanation_no_local ?? exp.explanation_no_bng ?? null,
            explanation_no_EN: exp.explanation_no_en ?? null,
          }))
        : [];

      this.setCachedData(cacheKey, explanations);
      return explanations;
    } catch (error) {
      console.error(`❌ Bangla explanations API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    const cacheKey = this.generateCacheKey('getExplanationByNumber', {
      surahNo,
      ayahNo,
      explanationNumber,
    });

    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getExplanationByNumberInternal(
      surahNo,
      ayahNo,
      explanationNumber,
      cacheKey,
    );

    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getExplanationByNumberInternal(surahNo, ayahNo, explanationNumber, cacheKey) {
    try {
      const response = await apiService.getInterpretation(
        this.language,
        surahNo,
        ayahNo,
        explanationNumber,
      );

      const explanation = response?.explanations?.find(exp =>
        exp.explanation_no_local == explanationNumber ||
        exp.explanation_no_en == explanationNumber ||
        exp.explanation_no_bng == explanationNumber,
      );

      if (!explanation?.explanation) {
        console.warn(
          `⚠️ No Bangla explanation found for ${surahNo}:${ayahNo} number ${explanationNumber}`,
        );
        return null;
      }

      this.setCachedData(cacheKey, explanation.explanation);
      return explanation.explanation;
    } catch (error) {
      console.error(
        `❌ Bangla explanation API failed for ${surahNo}:${ayahNo} number ${explanationNumber}:`,
        error,
      );
      throw error;
    }
  }

  parseBanglaTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const supTags = tempDiv.querySelectorAll('sup.f-note');
    supTags.forEach(sup => {
      const link = sup.querySelector('a');
      if (link) {
        const explanationNumber = link.textContent.trim();
        if (/^[\d১২৩৪৫৬৭৮৯০]+$/.test(explanationNumber)) {
          sup.style.cssText = `
            cursor: pointer !important;
            background-color: transparent !important;
            color: #19B5DD !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            border: none !important;
            display: inline !important;
            font-size: 12px !important;
            vertical-align: super !important;
            line-height: 1 !important;
            position: relative !important;
            top: 3px !important;
            transition: all 0.2s ease-in-out !important;
          `;

          sup.addEventListener('mouseenter', () => {
            sup.style.color = '#0ea5e9';
          });

          sup.addEventListener('mouseleave', () => {
            sup.style.color = '#19B5DD';
          });

          sup.setAttribute('data-explanation-number', explanationNumber);
          sup.setAttribute('data-surah', surahNo);
          sup.setAttribute('data-ayah', ayahNo);
          sup.setAttribute('title', `Click to view explanation ${explanationNumber}`);
          sup.className = 'bangla-explanation-link';
          sup.innerHTML = explanationNumber;
        }
      }
    });

    return tempDiv.innerHTML;
  }

  async isAvailable() {
    try {
      await apiService.checkLanguageHealth(this.language);
      return true;
    } catch (error) {
      console.error('❌ Bangla service not available:', error);
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
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

export default new BanglaTranslationService();



