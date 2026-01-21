import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants/translations';
import { LANGUAGE_CONFIG } from '../config/languageConfig';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or use default from config
  const getInitialLanguage = () => {
    if (LANGUAGE_CONFIG.PERSIST_LANGUAGE) {
      const savedLanguage = localStorage.getItem(LANGUAGE_CONFIG.STORAGE_KEY);
      if (savedLanguage && LANGUAGE_CONFIG.AVAILABLE_LANGUAGES.includes(savedLanguage)) {
        return savedLanguage;
      }
    }
    return LANGUAGE_CONFIG.DEFAULT_LANGUAGE;
  };

  const [language, setLanguage] = useState(getInitialLanguage);
  const t = TRANSLATIONS[language];

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (LANGUAGE_CONFIG.PERSIST_LANGUAGE) {
      localStorage.setItem(LANGUAGE_CONFIG.STORAGE_KEY, language);
    }
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => prev === 'ne' ? 'en' : 'ne');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);