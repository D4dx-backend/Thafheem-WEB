/**
 * IndexedDB-based caching system for English translations
 * Cache key format: translation_${surahNumber}_${range}_en
 * 30-day expiry for cached data
 */

const DB_NAME = 'ThafheemTranslations';
const DB_VERSION = 1;
const STORE_NAME = 'translations';
const CACHE_EXPIRY_DAYS = 30;

class TranslationCache {
  constructor() {
    this.db = null;
    this.initPromise = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('expiry', 'expiry', { unique: false });
        }
      };
    });
  }

  /**
   * Generate cache key for translation
   * @param {number} surahId - Surah number
   * @param {string} range - Verse range (e.g., "1-7")
   * @param {string} language - Language code (default: 'E')
   * @returns {string} Cache key
   */
  generateCacheKey(surahId, range, language = 'E') {
    // Normalize language code (mal, E, etc.)
    const normalizedLang = language?.toLowerCase() || 'E';
    return `translation_${surahId}_${range}_${normalizedLang}`;
  }

  /**
   * Get cached translation data
   * @param {number} surahId - Surah number
   * @param {string} range - Verse range
   * @param {string} language - Language code
   * @returns {Promise<any|null>} Cached data or null if not found/expired
   */
  async getCachedTranslation(surahId, range, language = 'E') {
    try {
      await this.initPromise;
      if (!this.db) return null;

      const key = this.generateCacheKey(surahId, range, language);
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(null);
            return;
          }

          // Check if cache has expired
          const now = Date.now();
          if (result.expiry && now > result.expiry) {
            // Cache expired, delete it
            this.deleteCachedTranslation(surahId, range, language);
            resolve(null);
            return;
          }

          resolve(result.data);
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('Error getting cached translation:', error);
      return null;
    }
  }

  /**
   * Set cached translation data
   * @param {number} surahId - Surah number
   * @param {string} range - Verse range
   * @param {any} data - Translation data to cache
   * @param {string} language - Language code
   * @returns {Promise<boolean>} Success status
   */
  async setCachedTranslation(surahId, range, data, language = 'E') {
    try {
      await this.initPromise;
      if (!this.db) return false;

      const key = this.generateCacheKey(surahId, range, language);
      const expiry = Date.now() + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.put({
          key,
          data,
          expiry,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => {
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error setting cached translation:', request.error);
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Error setting cached translation:', error);
      return false;
    }
  }

  /**
   * Delete cached translation
   * @param {number} surahId - Surah number
   * @param {string} range - Verse range
   * @param {string} language - Language code
   * @returns {Promise<boolean>} Success status
   */
  async deleteCachedTranslation(surahId, range, language = 'E') {
    try {
      await this.initPromise;
      if (!this.db) return false;

      const key = this.generateCacheKey(surahId, range, language);
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Error deleting cached translation:', error);
      return false;
    }
  }

  /**
   * Clear all expired cache entries
   * @returns {Promise<number>} Number of entries cleared
   */
  async clearExpiredCache() {
    try {
      await this.initPromise;
      if (!this.db) return 0;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('expiry');
      
      return new Promise((resolve) => {
        const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));
        let clearedCount = 0;
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            clearedCount++;
            cursor.continue();
          } else {
            resolve(clearedCount);
          }
        };
        request.onerror = () => resolve(0);
      });
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   * @returns {Promise<object>} Cache stats
   */
  async getCacheStats() {
    try {
      await this.initPromise;
      if (!this.db) return { total: 0, expired: 0, size: '0 KB' };

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => {
          const total = request.result;
          resolve({
            total,
            expired: 0, // Would need separate query
            size: 'Unknown' // IndexedDB doesn't provide size info easily
          });
        };
        request.onerror = () => resolve({ total: 0, expired: 0, size: '0 KB' });
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { total: 0, expired: 0, size: '0 KB' };
    }
  }

  /**
   * Clear all cache data
   * @returns {Promise<boolean>} Success status
   */
  async clearAllCache() {
    try {
      await this.initPromise;
      if (!this.db) return false;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.clear();
        request.onsuccess = () => {
          resolve(true);
        };
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Error clearing all cache:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new TranslationCache();
