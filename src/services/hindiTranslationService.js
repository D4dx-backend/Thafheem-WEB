import { API_BASE_PATH } from '../config/apiConfig.js';
import apiService from './apiService.js';

const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 200;

class HindiTranslationService {
  constructor() {
    this.language = 'hindi';
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
      console.error(`❌ Hindi translation API failed for ${surahNo}:${ayahNo}:`, error);
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

    let processedContent = String(htmlContent);

    // First, process existing sup.f-note tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedContent;

    const supTags = tempDiv.querySelectorAll('sup.f-note');
    supTags.forEach(sup => {
      const link = sup.querySelector('a');
      if (link) {
        const explanationNumber = link.textContent.trim();
        // Updated regex to allow A or B suffix: /^[\d१२३४५६७८९०]+[aAbB]?$/
        if (/^[\d१२३४५६७८९०]+[aAbB]?$/.test(explanationNumber)) {
          sup.style.cssText = `
            cursor: pointer !important;
            background-color: transparent !important;
            color: rgb(41,169,199) !important;
            font-weight: 600 !important;
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
            sup.style.color = '#0891b2';
          });

          sup.addEventListener('mouseleave', () => {
            sup.style.color = 'rgb(41,169,199)';
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

    // Get the processed HTML
    processedContent = tempDiv.innerHTML;

    // Now, find and replace plain text patterns like "25A", "18A", "27B" etc.
    // Pattern: \d{1,3}[aAbB] - matches numbers 1-999 followed by A or B (case insensitive)
    const markerPattern = /(\d{1,3}[aAbB])/g;
    const matches = [];
    let match;

    while ((match = markerPattern.exec(processedContent)) !== null) {
      const token = match[1]; // e.g. "25A", "18A", "27B"
      const index = match.index;

      // Extract numeric part
      const numericPartMatch = token.match(/^(\d{1,3})/);
      if (!numericPartMatch) continue;
      const baseNumber = parseInt(numericPartMatch[1], 10);

      // Only allow 1-342
      if (!(baseNumber >= 1 && baseNumber <= 342)) continue;

      // Skip if inside an HTML tag (between '<' and '>')
      const beforeAll = processedContent.substring(0, index);
      const lastLt = beforeAll.lastIndexOf("<");
      const lastGt = beforeAll.lastIndexOf(">");
      if (lastLt > lastGt) {
        // We're currently inside a tag like <span attr="25A">
        continue;
      }

      // Skip if already inside a <sup>...</sup> or other HTML tag
      const contextStart = Math.max(0, index - 200);
      const context = processedContent.substring(contextStart, index);
      const lastSupOpen = context.lastIndexOf("<sup");
      const lastSupClose = context.lastIndexOf("</sup>");
      if (lastSupOpen > lastSupClose) {
        continue;
      }

      // Skip if already processed (inside a hindi-footnote-link)
      const afterMatch = processedContent.substring(index, index + token.length + 50);
      if (afterMatch.includes('hindi-footnote-link') || afterMatch.includes('data-footnote')) {
        continue;
      }

      matches.push({
        index,
        token,
        length: token.length,
      });
    }

    // Replace from right to left so indices stay valid
    for (let i = matches.length - 1; i >= 0; i--) {
      const { index, token, length } = matches[i];
      const before = processedContent.substring(0, index);
      const after = processedContent.substring(index + length);
      
      // Create clickable sup tag with cyan blue styling (matching other interpretation numbers)
      const clickableTag = `<sup class="hindi-footnote-link" data-footnote="${token}" data-surah="${surahNo}" data-ayah="${ayahNo}" title="Click to view explanation ${token}" style="cursor:pointer!important;background-color:transparent!important;color:rgb(41,169,199)!important;font-weight:600!important;text-decoration:none!important;border:none!important;display:inline!important;font-size:12px!important;vertical-align:super!important;line-height:1!important;position:relative!important;top:3px!important;z-index:10!important;transition:0.2s ease-in-out!important;">${token}</sup>`;
      
      processedContent = before + clickableTag + after;
    }

    return processedContent;
  }

  async isAvailable() {
    try {
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



