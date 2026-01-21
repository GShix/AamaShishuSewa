import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, UserCircle, Phone, Info, Users, Newspaper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserMobileBottomNav = ({ t, language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // User dashboard navigation items
  const navItems = [
    { 
      id: 'dashboard',
      icon: Home, 
      label: language === 'ne' ? 'होम' : 'Home', 
      path: '/user/dashboard',
      activeColor: 'text-rose-600',
      inactiveColor: 'text-slate-400'
    },
    { 
      id: 'bookings',
      icon: Calendar, 
      label: language === 'ne' ? 'बुकिङ' : 'Bookings', 
      path: '/user/bookings',
      activeColor: 'text-rose-600',
      inactiveColor: 'text-slate-400'
    },
    { 
      id: 'newbooking',
      icon: Calendar, 
      label: language === 'ne' ? 'नयाँ बुक' : 'Book', 
      path: '/book',
      activeColor: 'text-rose-600',
      inactiveColor: 'text-slate-400',
      highlighted: true // This will be the main CTA
    },
    { 
      id: 'employees',
      icon: Users, 
      label: language === 'ne' ? 'कर्मचारी' : 'Staff', 
      path: '/user/employees',
      activeColor: 'text-rose-600',
      inactiveColor: 'text-slate-400'
    },
    { 
      id: 'profile',
      icon: UserCircle, 
      label: language === 'ne' ? 'प्रोफाइल' : 'Profile', 
      path: '/user/profile',
      activeColor: 'text-rose-600',
      inactiveColor: 'text-slate-400'
    },
  ];

  const isActive = (path) => {
    if (path === '/user/dashboard') {
      return location.pathname === '/user/dashboard' || location.pathname === '/user';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            if (item.highlighted) {
              // Highlighted/Primary button (Book Now)
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center -mt-6 transition-transform active:scale-95"
                >
                  <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-full p-4 shadow-lg shadow-rose-200 mb-1">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-rose-600">
                    {item.label}
                  </span>
                </button>
              );
            }

            // Regular nav items
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 active:scale-95 ${
                  active ? 'scale-105' : 'scale-100'
                }`}
              >
                <Icon 
                  className={`w-6 h-6 mb-1 transition-colors ${
                    active ? item.activeColor : item.inactiveColor
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span 
                  className={`text-[10px] font-semibold transition-colors ${
                    active ? item.activeColor : item.inactiveColor
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind the bottom nav */}
      <div className="md:hidden h-20" aria-hidden="true"></div>
    </>
  );
};

export default UserMobileBottomNav;
