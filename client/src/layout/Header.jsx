import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Menu, X, Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ language, setLanguage, t }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Fallback check: If t is missing, don't render nav elements to prevent crash
  if (!t) return <nav className="bg-white/90 h-20 border-b border-rose-100 sticky top-0 z-50"></nav>;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-20">
        
        {/* Logo Section - Preserved from your Home.jsx */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:rotate-6 transition-all duration-300">
            <img className='h-6 w-6 md:h-8 md:w-8 object-contain' src="/assets/logo.png" alt="Logo" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-rose-600 leading-none">आमा शिशु सेवा</h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Aama Shishu Sewa</p>
          </div>
        </div>

        {/* Desktop Links - Optimized for Auth */}
        <div className="hidden md:flex items-center gap-8">
          {/* Added ?. to safely access nav */}
          {t?.nav?.filter(item => {
            if (item.type === 'auth') return !isAuthenticated;
            if (item.type === 'private') return isAuthenticated;
            return true;
          }).map((item, i) => (
            <button 
              key={i} 
              onClick={() => navigate(item.path)} 
              className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors relative group cursor-pointer"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
          
          {/* Language Toggle - Your Original Style */}
          <button 
            onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} 
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-700 hover:bg-white transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" /> {language === 'ne' ? 'ENGLISH' : 'नेपाली'}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-lg text-slate-600 cursor-pointer">
              <Globe className="w-5 h-5 hover:text-rose-300" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-rose-100 rounded-xl shadow-xl z-50 py-2">
                <button onClick={() => { setLanguage('ne'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer">नेपाली</button>
                <button onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer">English</button>
              </div>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-rose-600">
            {isMenuOpen ? <X size={28} className='cursor-pointer'/> : <Menu size={28} className='cursor-pointer'/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-20 bg-white z-40 transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 space-y-2 bg-rose-200">
          {/* Added ?. to safely access nav */}
          {t?.nav?.filter(item => {
            if (item.type === 'auth') return !isAuthenticated;
            if (item.type === 'private') return isAuthenticated;
            return true;
          }).map((item, i) => (
            <button key={i} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="text-left py-4 text-lg font-bold text-slate-700 hover:text-rose-400 border-b border-slate-50 cursor-pointer">
              {item.name}
            </button>
          ))}
          <button onClick={() => { navigate('/book'); setIsMenuOpen(false); }} className="mt-4 w-full py-4 bg-rose-500 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer">
            <Heart className="w-5 h-5 fill-white" /> {t?.hero?.ctaBook || 'Book'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;