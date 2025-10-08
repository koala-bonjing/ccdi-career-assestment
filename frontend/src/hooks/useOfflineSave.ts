// hooks/useOfflineSave.ts
import { useState, useEffect } from 'react';

export const useOfflineSave = (key: string, data: any) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Online - data will sync');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('📴 Offline - working locally');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};