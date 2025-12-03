import { API_BASE_PATH } from '../config/apiConfig.js';
import apiService from './apiService.js';

const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 200;

class UrduTranslationService {
  constructor() {
    this.language = 'urdu';
    this.apiBasePath = API_BASE_PATH;
    this.pendingRequests = new Map();
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
    this.footnoteOrderMap = new Map(); // surahNo -> Map(footnoteId -> sequentialNo)
  }

  normalizeSurahNo(surahNo) {
    const parsed = Number.parseInt(surahNo, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  resetFootnoteOrdering(surahNo) {
    if (surahNo === undefined || surahNo === null) {
      this.footnoteOrderMap.clear();
      return;
    }
    const normalized = this.normalizeSurahNo(surahNo);
    if (normalized !== null) {
      this.footnoteOrderMap.delete(normalized);
    }
  }

  getOrAssignFootnoteNumber(surahNo, footnoteId, fallbackNumber) {
    if (!footnoteId) {
      return Number.isFinite(fallbackNumber) ? fallbackNumber : null;
    }

    const normalizedSurah = this.normalizeSurahNo(surahNo);
    if (normalizedSurah === null) {
      return Number.isFinite(fallbackNumber) ? fallbackNumber : null;
    }

    if (!this.footnoteOrderMap.has(normalizedSurah)) {
      this.footnoteOrderMap.set(normalizedSurah, new Map());
    }

    const orderMap = this.footnoteOrderMap.get(normalizedSurah);
    if (orderMap.has(footnoteId)) {
      return orderMap.get(footnoteId);
    }

    const nextNumber = orderMap.size + 1;
    orderMap.set(footnoteId, nextNumber);
    return nextNumber;
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
    try {
      const response = await apiService.getTranslation(this.language, surahNo, ayahNo);
      const translation = response?.translation_text ?? response?.translation ?? '';

      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Urdu translation API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahNo, options = {}) {
    const hasPagination = options && (options.page !== undefined || options.limit !== undefined);
    const page = Number.isInteger(options.page) && options.page > 0 ? options.page : 1;
    const requestedLimit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : DEFAULT_PAGE_SIZE;
    const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const cacheKey = this.generateCacheKey('getSurahTranslations', hasPagination ? { surahNo, page, limit } : { surahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey, { page, limit, hasPagination });
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahNo, cacheKey, { page, limit, hasPagination }) {
    try {
      const params = hasPagination ? { page, limit } : {};
      const response = await apiService.getSurahTranslations(this.language, surahNo, params);
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
      console.error(`❌ Urdu surah translation API failed for ${surahNo}:`, error);
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
    try {
      const response = await apiService.getWordByWord(this.language, surahNo, ayahNo);
      const wordsSource = Array.isArray(response?.words) ? response.words : [];

      if (wordsSource.length === 0) {
        console.warn(`⚠️ No Urdu word-by-word data for ${surahNo}:${ayahNo}`);
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
          language_name: word.translation?.language_name ?? 'Urdu',
          resource_name: word.translation?.resource_name ?? 'Thafheem Urdu Word Database',
        },
        transliteration: {
          text: word.transliteration?.text ?? word.WordPhrase ?? '',
          language_name: word.transliteration?.language_name ?? 'Urdu',
        },
      }));

      this.setCachedData(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`❌ Urdu word-by-word API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getFootnoteExplanation(footnoteId) {
    const cacheKey = this.generateCacheKey('getFootnoteExplanation', { footnoteId });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getFootnoteExplanationInternal(footnoteId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getFootnoteExplanationInternal(footnoteId, cacheKey) {
    try {
      const response = await apiService.makeRequest(`/urdu/footnote/${footnoteId}`);
      const explanation = response?.footnote_text ?? 'Explanation not available';

      this.setCachedData(cacheKey, explanation);
      return explanation;
    } catch (error) {
      const message = error?.message || '';
      const footnoteNotFound =
        message.includes('Footnote not found') || message.includes('404');

      if (footnoteNotFound) {
        console.warn(`⚠️ Urdu footnote ${footnoteId} not found in API, skipping.`);
        this.setCachedData(cacheKey, null);
        return null;
      }

      console.error(`❌ Urdu footnote API failed for ${footnoteId}:`, error);
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
      const translation = await this.getAyahTranslation(surahNo, ayahNo);
      if (!translation || translation.trim() === '') {
        this.setCachedData(cacheKey, []);
        return [];
      }

      const explanations = await this.extractExplanationsFromFootnotes(translation, surahNo, ayahNo);
      this.setCachedData(cacheKey, explanations);
      return explanations;
    } catch (error) {
      console.error(`❌ Urdu explanations failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getExplanation(surahNo, ayahNo) {
    const explanations = await this.getAllExplanations(surahNo, ayahNo);
    if (explanations.length > 0) {
      return explanations[0].explanation;
    }

    const translation = await this.getAyahTranslation(surahNo, ayahNo);
    return translation || 'N/A';
  }

  async extractExplanationsFromFootnotes(translationText, surahNo, ayahNo) {
    const explanations = [];
    if (!translationText) return explanations;

    const footnoteRegex = /<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;
    const footnoteIds = new Map();
    let match;

    while ((match = footnoteRegex.exec(translationText)) !== null) {
      const footnoteId = match[1];
      const fallbackNumber = parseInt(match[2], 10);
      const sequentialNumber = this.getOrAssignFootnoteNumber(
        surahNo,
        footnoteId,
        fallbackNumber
      );
      if (!footnoteIds.has(footnoteId)) {
        footnoteIds.set(footnoteId, sequentialNumber ?? fallbackNumber ?? footnoteIds.size + 1);
      }
    }

    const entries = Array.from(footnoteIds.entries())
      .sort((a, b) => a[1] - b[1]);

    for (const [footnoteId, footnoteNumber] of entries) {
      try {
        const explanation = await this.getFootnoteExplanation(footnoteId);
        if (explanation && explanation.trim() !== '' && explanation !== 'Explanation not available') {
          const sequentialNumber = this.getOrAssignFootnoteNumber(
            surahNo,
            footnoteId,
            footnoteNumber
          );
          explanations.push({
            explanation,
            explanation_no: sequentialNumber ?? footnoteNumber,
          });
        }
      } catch (error) {
        console.warn(`⚠️ Unable to load Urdu explanation for footnote ${footnoteId}:`, error);
      }
    }

    return explanations;
  }

  parseUrduTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const supTags = tempDiv.querySelectorAll('sup[foot_note]');
    supTags.forEach(element => {
      const footnoteId = element.getAttribute('foot_note');
      const footnoteNumber = element.textContent.trim();

      if (footnoteId && /^\d+$/.test(footnoteNumber)) {
        const fallbackNumber = parseInt(footnoteNumber, 10);
        const sequentialNumber = this.getOrAssignFootnoteNumber(
          surahNo,
          footnoteId,
          fallbackNumber
        );
        const displayNumber = Number.isFinite(sequentialNumber) ? sequentialNumber : fallbackNumber;
        element.style.cssText = `
          cursor: pointer !important;
          background-color: #19B5DD !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          border: none !important;
          margin: 0 4px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 22px !important;
          width: 22px !important;
          height: 22px !important;
          border-radius: 9999px !important;
          position: relative !important;
          top: 0 !important;
          text-align: center !important;
          transition: all 0.2s ease-in-out !important;
        `;

        element.setAttribute('data-footnote-id', footnoteId);
        element.setAttribute('data-footnote-number', displayNumber);
        element.setAttribute('data-surah', surahNo);
        element.setAttribute('data-ayah', ayahNo);
        element.setAttribute('title', `Click to view explanation ${displayNumber}`);
        element.className = 'urdu-footnote-link';
        element.removeAttribute('foot_note');
        element.textContent = displayNumber;
      }
    });

    return tempDiv.innerHTML;
  }

  async fetchBlockwiseUrdu(surahNo, startAyah, endAyah) {
    const cacheKey = this.generateCacheKey('fetchBlockwiseUrdu', { surahNo, startAyah, endAyah });
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

  async isAvailable() {
    try {
      await apiService.checkLanguageHealth(this.language);
      return true;
    } catch (error) {
      console.error('❌ Urdu service not available:', error);
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

export default new UrduTranslationService();



