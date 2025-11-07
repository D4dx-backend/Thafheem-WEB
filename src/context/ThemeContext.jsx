

// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { preloadLanguageServices } from "../utils/serviceLoader";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize state with values from localStorage or defaults
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  
  const [quranFont, setQuranFont] = useState(() => {
    const savedFont = localStorage.getItem("quranFont");
    return savedFont || "Amiri Quran";
  });
  
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    return savedFontSize ? parseInt(savedFontSize) : 26;
  });
  
  const [translationFontSize, setTranslationFontSize] = useState(() => {
    const savedTranslationFontSize = localStorage.getItem("translationFontSize");
    const fontSize = savedTranslationFontSize ? parseInt(savedTranslationFontSize) : 17;
    // Ensure font size doesn't exceed maximum of 19
    return Math.min(19, Math.max(10, fontSize));
  });

  const [viewType, setViewType] = useState(() => {
    const savedViewType = localStorage.getItem("viewType");
    // Valid view types
    const validViewTypes = ['Ayah Wise', 'Block Wise'];
    // Default to Ayah Wise if no saved value or invalid value
    if (!savedViewType || !validViewTypes.includes(savedViewType)) {
      return "Ayah Wise";
    }
    return savedViewType;
  });

  // Selected translation language for APIs (Malayalam default)
  // Store API code variants: 'mal' for Malayalam, 'E' for English, 'ta' for Tamil, 'bn' for Bangla
  const [translationLanguage, setTranslationLanguage] = useState(() => {
    const savedLang = localStorage.getItem("translationLanguage");
    // Valid language codes
    const validLanguages = ['mal', 'E', 'ta', 'bn', 'ur', 'hi'];
    // Default to Malayalam if no saved value or invalid value
    if (!savedLang || !validLanguages.includes(savedLang)) {
      return "mal";
    }
    return savedLang;
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement; // <html>
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Save font settings to localStorage
  useEffect(() => {
    localStorage.setItem("quranFont", quranFont);
  }, [quranFont]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Ensure font size doesn't exceed maximum of 19 before saving
    const clampedSize = Math.min(19, Math.max(10, translationFontSize));
    if (clampedSize !== translationFontSize) {
      setTranslationFontSize(clampedSize);
    }
    localStorage.setItem("translationFontSize", clampedSize.toString());
  }, [translationFontSize]);

  useEffect(() => {
    localStorage.setItem("viewType", viewType);
  }, [viewType]);

  useEffect(() => {
    localStorage.setItem("translationLanguage", translationLanguage);
    
    // Preload translation services when language changes
    // This ensures services are ready when user navigates to pages that need them
    if (translationLanguage && translationLanguage !== 'mal') {
      preloadLanguageServices(translationLanguage).catch(error => {
        console.warn(`Failed to preload services for ${translationLanguage}:`, error);
      });
    }
  }, [translationLanguage]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      quranFont, 
      setQuranFont, 
      fontSize, 
      setFontSize, 
      translationFontSize, 
      setTranslationFontSize,
      viewType,
      setViewType,
      translationLanguage,
      setTranslationLanguage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);