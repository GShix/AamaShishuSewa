import { useState, useEffect } from 'react';

/**
 * Hook to detect online/offline status
 * @returns {boolean} isOnline - Current network status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Hook to check if app is installed as PWA
 * @returns {boolean} isInstalled - Whether app is installed
 */
export const useIsInstalled = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone || // iOS Safari
      document.referrer.includes('android-app://'); // Android

    setIsInstalled(isPWA);
  }, []);

  return isInstalled;
};
