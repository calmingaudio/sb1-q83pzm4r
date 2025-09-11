import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aviationStats, AviationStat } from '@/constants/AviationStats';

const CURRENT_STAT_KEY = 'current_aviation_stat';
const LAST_STAT_DATE_KEY = 'last_stat_date';
const STAT_INDEX_KEY = 'stat_index';

export function useAviationStats() {
  const [currentStat, setCurrentStat] = useState<AviationStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStat();
  }, []);

  const loadStat = async () => {
    try {
      const lastStatDate = await AsyncStorage.getItem(LAST_STAT_DATE_KEY);
      const savedStat = await AsyncStorage.getItem(CURRENT_STAT_KEY);
      const savedIndex = await AsyncStorage.getItem(STAT_INDEX_KEY);
      
      const today = new Date().toDateString();
      
      if (lastStatDate !== today) {
        // Time for a new stat - cycle through them sequentially
        const currentIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
        const nextIndex = (currentIndex + 1) % aviationStats.length;
        const newStat = aviationStats[nextIndex];
        
        await AsyncStorage.setItem(CURRENT_STAT_KEY, JSON.stringify(newStat));
        await AsyncStorage.setItem(LAST_STAT_DATE_KEY, today);
        await AsyncStorage.setItem(STAT_INDEX_KEY, nextIndex.toString());
        setCurrentStat(newStat);
      } else if (savedStat) {
        // Use the current day's stat
        setCurrentStat(JSON.parse(savedStat));
      } else {
        // Fallback to first stat
        const firstStat = aviationStats[0];
        setCurrentStat(firstStat);
        await AsyncStorage.setItem(CURRENT_STAT_KEY, JSON.stringify(firstStat));
        await AsyncStorage.setItem(STAT_INDEX_KEY, '0');
      }
    } catch (error) {
      console.error('Error loading aviation stat:', error);
      setCurrentStat(aviationStats[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStat = async () => {
    try {
      const savedIndex = await AsyncStorage.getItem(STAT_INDEX_KEY);
      const currentIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
      const nextIndex = (currentIndex + 1) % aviationStats.length;
      const newStat = aviationStats[nextIndex];
      
      await AsyncStorage.setItem(CURRENT_STAT_KEY, JSON.stringify(newStat));
      await AsyncStorage.setItem(STAT_INDEX_KEY, nextIndex.toString());
      setCurrentStat(newStat);
      
      return newStat;
    } catch (error) {
      console.error('Error getting next stat:', error);
      return currentStat;
    }
  };

  return {
    currentStat,
    isLoading,
    getNextStat,
  };
}