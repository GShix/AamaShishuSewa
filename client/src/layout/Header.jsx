import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Menu, X, Heart, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ language, setLanguage, t }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Safety check to prevent white-screen crashes if t isn't loaded yet
  if (!t) return <nav className="bg-white/90 h-20 border-b border-rose-100 sticky top-0 z-50"></nav>;

  // Helper to filter links based on login status
  const filteredNav = t.nav?.filter(item => {
    if (item.type === 'auth') return !isAuthenticated;
    if (item.type === 'private') return isAuthenticated;
    return true;
  });

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-20">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-11 h-11 md:w-12 md:h-12 bg-rose-100 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:rotate-6 transition-all duration-300">
            <img className='h-8 w-8 md:h-10 md:w-10 object-contain' src="/logo.png" alt="Logo" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-rose-600 leading-none">
              {language === 'ne' ? 'आमा शिशु सेवा' : 'Aama Shishu Sewa'}
            </h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">
              {language === 'ne' ? 'Aama Shishu Sewa' : 'Maternal & Infant Care'}
              {/* Care for your baby, care for your home. */}
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {filteredNav?.map((item, i) => (
            <button 
              key={i} 
              onClick={() => navigate(item.path)} 
              className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors relative group cursor-pointer"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-700 hover:bg-white transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" /> 
            {language === 'ne' ? 'ENGLISH' : 'नेपाली'}
          </button>
        </div>
        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} 
              className="p-2 rounded-lg text-slate-600 cursor-pointer hover:bg-rose-50 transition-colors"
            >
              <Globe className="w-5 h-5 hover:text-rose-500" />
            </button>
            {isLangDropdownOpen && (
              <>
                {/* Backdrop for language dropdown */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsLangDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-rose-100 rounded-xl shadow-xl z-40 py-2">
                  <button 
                    onClick={() => { setLanguage('ne'); setIsLangDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    नेपाली
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={28} className='cursor-pointer'/> : <Menu size={28} className='cursor-pointer'/>}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Menu Overlay */}
        <div className={`fixed right-0 top-20 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-rose-50 to-pink-50 z-50 transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex flex-col p-6 space-y-1">
              {/* Added ?. to safely access nav */}
              {t?.nav?.filter(item => {
                if (item.type === 'auth') return !isAuthenticated;
                if (item.type === 'private') return isAuthenticated;
                return true;
              }).map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => { navigate(item.path); setIsMenuOpen(false); }} 
                  className="text-left py-4 px-4 text-lg font-bold text-slate-700 hover:text-rose-500 hover:bg-white/50 rounded-lg border-b border-rose-100/50 cursor-pointer transition-all"
                >
                  {item.name}
                </button>
              ))}
            </div>
            
            {/* Book Service Button */}
            <div className="mt-auto p-6">
              <button 
                onClick={() => { navigate('/book'); setIsMenuOpen(false); }} 
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-black shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="w-5 h-5 fill-white" /> {t?.hero?.ctaBook || 'Book'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Header;