

// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

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
    return savedTranslationFontSize ? parseInt(savedTranslationFontSize) : 17;
  });

  const [viewType, setViewType] = useState(() => {
    const savedViewType = localStorage.getItem("viewType");
    return savedViewType || "Ayah Wise";
  });

  // Selected translation language for APIs (Malayalam default)
  // Store API code variants: 'mal' for Malayalam, 'E' for English, 'ta' for Tamil
  const [translationLanguage, setTranslationLanguage] = useState(() => {
    const savedLang = localStorage.getItem("translationLanguage");
    // Backward compatible default to Malayalam
    return savedLang || "mal";
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
    localStorage.setItem("translationFontSize", translationFontSize.toString());
  }, [translationFontSize]);

  useEffect(() => {
    localStorage.setItem("viewType", viewType);
  }, [viewType]);

  useEffect(() => {
    localStorage.setItem("translationLanguage", translationLanguage);
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