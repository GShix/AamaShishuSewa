import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PublicLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { t, language, setLanguage } = useLanguage(); // Get from Context

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#FFFBFB] flex flex-col">
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main className="flex-grow">
        {/* Pass translations down to page components */}
        {React.Children.map(children, child => 
          React.isValidElement(child) ? React.cloneElement(child, { t, language }) : child
        )}
      </main>
      <Footer t={t} language={language} />
    </div>
  );
};

export default PublicLayout;