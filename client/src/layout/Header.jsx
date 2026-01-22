import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Menu, X, Heart, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ language, setLanguage, t }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  if (!t) return <nav className="bg-white/90 h-20 border-b border-rose-100 sticky top-0 z-50"></nav>;

  const filteredNav = t.nav?.filter(item => {
    if (item.type === 'auth') return !isAuthenticated;
    if (item.type === 'private') return isAuthenticated;
    return true;
  });

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-[80]">
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
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {filteredNav?.map((item, i) => (
              <button 
                key={i} 
                onClick={() => navigate(item.path)} 
                className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
            
            <button 
              onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-700 hover:bg-white transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" /> 
              {language === 'ne' ? 'ENGLISH' : 'नेपाली'}
            </button>
          </div>

          {/* Mobile Interaction Bar */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} 
              className="p-2 rounded-lg text-slate-600 relative"
            >
              <Globe className="w-6 h-6" />
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-3 w-32 bg-white border border-rose-100 rounded-xl shadow-2xl z-[110] py-2">
                  <button onClick={() => { setLanguage('ne'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50">नेपाली</button>
                  <button onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50">English</button>
                </div>
              )}
            </button>

            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[90] md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-[300px] bg-white z-[100] transform transition-transform duration-500 ease-out md:hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-rose-50 bg-white/80 backdrop-blur-md sticky top-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-black text-rose-600 tracking-tight">MENU</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-grow overflow-y-auto py-6">
            <div className="flex flex-col px-4 space-y-2">
              {filteredNav?.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => { navigate(item.path); setIsMenuOpen(false); }} 
                  className="group flex items-center justify-between w-full py-4 px-5 rounded-2xl text-left transition-all hover:bg-rose-50/50"
                >
                  <span className="text-lg font-bold text-slate-700 group-hover:text-rose-600 transition-colors">
                    {item.name}
                  </span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer Recruitment Notice & CTA */}
          <div className="p-6 bg-rose-50/30 border-t border-rose-100">
            <div className="bg-white/60 p-3 rounded-xl border border-rose-100 mb-6">
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Immediate Vacancy</p>
               <p className="text-xs font-bold text-slate-600">Ktm: 15 | Bkt: 15 | Llt: 15</p>
            </div>
            <button 
              onClick={() => { navigate('/careers'); setIsMenuOpen(false); }} 
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Heart className="w-5 h-5 fill-white" /> 
              {language === 'ne' ? 'अहिले आवेदन दिनुहोस्' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;