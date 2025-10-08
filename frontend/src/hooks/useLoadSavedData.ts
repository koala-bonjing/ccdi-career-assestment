  // hooks/useLoadSavedData.ts
  import { useState, useEffect } from 'react';
  import { useAuth } from '../context/AuthContext';

  export const useLoadSavedData = (key: string) => {
    const { user } = useAuth();
    const [savedData, setSavedData] = useState<any>(null);

    useEffect(() => {
      // Try user-specific data first
      if (user?.id) {
        const userKey = `${key}_${user.id}`;
        const saved = localStorage.getItem(userKey);
        
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.userId === user.id) {
              setSavedData(parsed.data);
              console.log('✅ Loaded user-specific saved data');
              return;
            }
          } catch (error) {
            console.error('Error loading user data:', error);
          }
        }
      }

      // Fallback to session data
      const sessionKey = `${key}_session`;
      const sessionSaved = localStorage.getItem(sessionKey);
      if (sessionSaved) {
        try {
          const parsed = JSON.parse(sessionSaved);
          setSavedData(parsed.data);
          console.log('🔄 Loaded session data');
        } catch (error) {
          console.error('Error loading session data:', error);
        }
      }
    }, [key, user]);

    return savedData;
  };