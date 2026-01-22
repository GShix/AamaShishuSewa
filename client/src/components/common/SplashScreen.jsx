// client/src/components/common/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300); // Small delay before hiding
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-500 via-red-400 to-orange-500 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          <div className="relative bg-white rounded-full p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.png" 
              alt="Aama Shishu Sewa" 
              className="h-24 w-24 object-contain animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white animate-fade-in">
            आमा शिशु सेवा
          </h1>
          <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Aama Shishu Sewa
          </p>
          <p className="text-sm text-white/80 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Trusted Care for Mothers & Infants
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center space-x-2 text-white/90">
          <Heart className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
