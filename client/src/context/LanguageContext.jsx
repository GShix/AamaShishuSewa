import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ne');
  const t = TRANSLATIONS[language];

  const toggleLanguage = () => setLanguage(prev => prev === 'ne' ? 'en' : 'ne');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);