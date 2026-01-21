import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Menu, X, Heart, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ language, setLanguage, t }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

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

        {/* Mobile Section - Simplified (Bottom Nav handles main navigation) */}
        <div className="md:hidden flex items-center gap-2">
          {/* Language Toggle for Mobile */}
          <div className="relative">
            <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-lg text-slate-600 cursor-pointer hover:bg-rose-50 transition">
              <Globe className="w-5 h-5 hover:text-rose-500" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-rose-100 rounded-xl shadow-xl z-50 py-2">
                <button onClick={() => { setLanguage('ne'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer">नेपाली</button>
                <button onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer">English</button>
              </div>
            )}
          </div>

          {/* Login/Profile Button */}
          {!isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full text-xs font-bold hover:bg-rose-600 transition shadow-md cursor-pointer"
            >
              <UserCircle className="w-4 h-4" />
              {language === 'ne' ? 'लगइन' : 'Login'}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-9 h-9 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-lg transition"
              title="Dashboard"
            >
              {isAuthenticated?.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay - Removed (using bottom nav instead) */}
    </nav>
  );
};

export default Header;