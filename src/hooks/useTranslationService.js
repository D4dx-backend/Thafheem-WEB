import { useState, useEffect } from 'react';
import { loadTranslationService, loadWordByWordService, loadInterpretationService } from '../utils/serviceLoader';

/**
 * Custom hook for lazy loading translation services
 * Automatically loads the appropriate service when language changes
 * 
 * @param {string} language - Language code (mal, hi, ur, bn, ta, E)
 * @returns {Object} { translationService, wordByWordService, interpretationService, loading, error }
 */
export const useTranslationService = (language) => {
  const [translationService, setTranslationService] = useState(null);
  const [wordByWordService, setWordByWordService] = useState(null);
  const [interpretationService, setInterpretationService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!language) {
      setLoading(false);
      return;
    }

    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all services in parallel
        const [translation, wordByWord, interpretation] = await Promise.allSettled([
          loadTranslationService(language),
          loadWordByWordService(language),
          loadInterpretationService(language)
        ]);

        // Set translation service
        if (translation.status === 'fulfilled') {
          setTranslationService(translation.value);
        }

        // Set word-by-word service
        if (wordByWord.status === 'fulfilled') {
          setWordByWordService(wordByWord.value);
        }

        // Set interpretation service
        if (interpretation.status === 'fulfilled') {
          setInterpretationService(interpretation.value);
        }

        setLoading(false);
      } catch (err) {
        console.error(`Error loading services for language ${language}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    loadServices();
  }, [language]);

  return {
    translationService,
    wordByWordService,
    interpretationService,
    loading,
    error
  };
};

/**
 * Hook for lazy loading only translation service
 * Lighter weight version when only translation is needed
 */
export const useTranslationOnly = (language) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!language) {
      setLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        setLoading(true);
        setError(null);
        const translationService = await loadTranslationService(language);
        setService(translationService);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading translation service for ${language}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    loadService();
  }, [language]);

  return { service, loading, error };
};

