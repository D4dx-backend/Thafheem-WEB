import { useState, useEffect, useCallback } from 'react';
import { fetchAyaTranslation } from '../api/apifunction';
import { useTheme } from '../context/ThemeContext';

// In-memory cache for block translations
// Structure: { 'surahId-range': translationData }
const blockTranslationCache = new Map();
const MAX_CACHE_SIZE = 500; // Cache up to 500 blocks

/**
 * Custom hook for fetching and caching block translations
 * Reduces API calls when navigating between surahs
 */
export const useBlockTranslations = (surahId) => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { translationLanguage } = useTheme();

  /**
   * Fetch a single block translation with caching
   */
  const fetchBlockTranslation = useCallback(async (range) => {
    const cacheKey = `${surahId}-${range}-${translationLanguage || 'mal'}`;
    
    // Return cached data if available
    if (blockTranslationCache.has(cacheKey)) {
      return blockTranslationCache.get(cacheKey);
    }

    // Fetch from API
    try {
      const data = await fetchAyaTranslation(parseInt(surahId), range, translationLanguage || 'mal');
      
      // Cache the result
      if (blockTranslationCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry if cache is full
        const firstKey = blockTranslationCache.keys().next().value;
        blockTranslationCache.delete(firstKey);
      }
      blockTranslationCache.set(cacheKey, data);
      
      return data;
    } catch (err) {
      console.error(`Error fetching translation for ${cacheKey}:`, err);
      throw err;
    }
  }, [surahId, translationLanguage]);

  /**
   * Fetch multiple block translations in batches with caching
   */
  const fetchBlocksInBatches = useCallback(async (blocks, batchSize = 5, delayMs = 500) => {
    setLoading(true);
    setError(null);
    const results = {};

    try {
      for (let i = 0; i < blocks.length; i += batchSize) {
        const batch = blocks.slice(i, i + batchSize);
        
        // Process batch with caching
        const batchPromises = batch.map(async (block) => {
          try {
            const ayaFrom = block.AyaFrom || block.ayafrom || block.from;
            const ayaTo = block.AyaTo || block.ayato || block.to;
            const blockId = block.ID || block.id;

            if (ayaFrom && ayaTo) {
              const range = `${ayaFrom}-${ayaTo}`;
              const data = await fetchBlockTranslation(range);
              
              return {
                blockId,
                data: {
                  range,
                  ayaFrom,
                  ayaTo,
                  data,
                },
              };
            }
            return null;
          } catch (blockErr) {
            console.error(`Error in batch for block ${block.ID}:`, blockErr);
            return null;
          }
        });

        // Wait for batch to complete
        const batchResults = await Promise.all(batchPromises);
        
        // Update results
        batchResults.forEach(result => {
          if (result) {
            results[result.blockId] = result.data;
          }
        });
        
        // Update state progressively
        setTranslations(prev => ({ ...prev, ...results }));
        
        // Delay between batches (except last)
        if (i + batchSize < blocks.length) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBlockTranslation]);

  /**
   * Check if a block is cached
   */
  const isCached = useCallback((range) => {
    const cacheKey = `${surahId}-${range}-${translationLanguage || 'mal'}`;
    return blockTranslationCache.has(cacheKey);
  }, [surahId, translationLanguage]);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    const surahCacheKeys = Array.from(blockTranslationCache.keys())
      .filter(key => key.startsWith(`${surahId}-`));
    
    return {
      totalCached: blockTranslationCache.size,
      surahCached: surahCacheKeys.length,
      cacheHitRate: blockTranslationCache.size > 0 
        ? (surahCacheKeys.length / blockTranslationCache.size * 100).toFixed(1) + '%'
        : '0%',
    };
  }, [surahId]);

  /**
   * Clear cache for specific surah or all
   */
  const clearCache = useCallback((specificSurahId = null) => {
    if (specificSurahId) {
      // Clear only this surah's cache
      const keysToDelete = Array.from(blockTranslationCache.keys())
        .filter(key => key.startsWith(`${specificSurahId}-`));
      keysToDelete.forEach(key => blockTranslationCache.delete(key));
    } else {
      // Clear all cache
      blockTranslationCache.clear();
    }
    setTranslations({});
  }, []);

  return {
    translations,
    loading,
    error,
    fetchBlockTranslation,
    fetchBlocksInBatches,
    isCached,
    getCacheStats,
    clearCache,
  };
};

/**
 * Get cache size for monitoring
 */
export const getBlockCacheSize = () => blockTranslationCache.size;

/**
 * Clear all block translation cache
 */
export const clearAllBlockCache = () => blockTranslationCache.clear();





