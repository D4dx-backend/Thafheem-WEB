// API Service
// Centralized service for making API calls to the backend
// Handles caching, error handling, and fallback logic

import { API_BASE_URL, API_BASE_PATH, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';

class ApiService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = new Map(); // Prevent duplicate requests
  }

  // Generate cache key for API requests
  generateCacheKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  // Check if cached data is still valid
  isCacheValid(timestamp) {
    return Date.now() - timestamp < CACHE_TTL;
  }

  // Get cached data if valid
  getCachedData(cacheKey) {
    if (!CACHE_ENABLED) return null;
    
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  // Store data in cache
  setCachedData(cacheKey, data) {
    if (!CACHE_ENABLED) return;
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  // Make API request with caching and deduplication
  async makeRequest(endpoint, params = {}, options = {}) {
    const cacheKey = this.generateCacheKey(endpoint, params);
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._makeActualRequest(endpoint, params, options);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // Cache successful response
      this.setCachedData(cacheKey, data);
      
      return data;
    } finally {
      // Remove from request queue
      this.requestQueue.delete(cacheKey);
    }
  }

  // Actual API request implementation
  async _makeActualRequest(endpoint, params = {}, options = {}) {
    const basePath = API_BASE_PATH || `${API_BASE_URL}/api/v1`;
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${basePath}${sanitizedEndpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  }

  // Get translation for specific ayah
  async getTranslation(language, surah, ayah) {
    return this.makeRequest(`/${language}/translation/${surah}/${ayah}`);
  }

  // Get all translations for a surah
  async getSurahTranslations(language, surah) {
    return this.makeRequest(`/${language}/surah/${surah}`);
  }

  // Get interpretation/explanation for specific ayah
  async getInterpretation(language, surah, ayah, explanationNo = null) {
    const params = explanationNo ? { explanationNo } : {};
    return this.makeRequest(`/${language}/interpretation/${surah}/${ayah}`, params);
  }

  // Get word-by-word data for specific ayah
  async getWordByWord(language, surah, ayah) {
    return this.makeRequest(`/${language}/word-by-word/${surah}/${ayah}`);
  }

  // Get Urdu footnote
  async getUrduFootnote(footnoteId) {
    return this.makeRequest(`/urdu/footnote/${footnoteId}`);
  }

  // Check language health
  async checkLanguageHealth(language) {
    return this.makeRequest(`/${language}/health`);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.requestQueue.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      queueSize: this.requestQueue.size,
      enabled: CACHE_ENABLED,
      ttl: CACHE_TTL
    };
  }
}

// Export singleton instance
export default new ApiService();
