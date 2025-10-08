// hooks/useAutoSave.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAutoSave = (key: string, data: any, delay = 2000) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const timeoutId = setTimeout(() => {
      console.log('🔄 Auto-saving data...', data);
      setIsSaving(true);
      
      const storageKey = user?.id ? `${key}_${user.id}` : `${key}_session`;
      
      const saveData = {
        data,
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      console.log('✅ Data saved to:', storageKey);
      
      setTimeout(() => setIsSaving(false), 500);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, delay, key, user]);

  return { isSaving };
};