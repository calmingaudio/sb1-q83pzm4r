import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dailyTips, DailyTip } from '@/constants/DailyTips';

const TIP_KEY = 'current_daily_tip';
const LAST_TIP_DATE_KEY = 'last_tip_date';

export function useDailyTip() {
  const [currentTip, setCurrentTip] = useState<DailyTip | null>(null);

  useEffect(() => {
    loadTip();
  }, []);

  const loadTip = async () => {
    try {
      const lastTipDate = await AsyncStorage.getItem(LAST_TIP_DATE_KEY);
      const savedTip = await AsyncStorage.getItem(TIP_KEY);
      
      const today = new Date().toDateString();
      
      if (lastTipDate !== today) {
        // Time for a new tip
        const newTip = getRandomTip();
        await AsyncStorage.setItem(TIP_KEY, JSON.stringify(newTip));
        await AsyncStorage.setItem(LAST_TIP_DATE_KEY, today);
        setCurrentTip(newTip);
      } else if (savedTip) {
        // Use the current day's tip
        setCurrentTip(JSON.parse(savedTip));
      } else {
        // Fallback to a random tip
        const newTip = getRandomTip();
        setCurrentTip(newTip);
      }
    } catch (error) {
      console.error('Error loading daily tip:', error);
      setCurrentTip(getRandomTip());
    }
  };

  const getRandomTip = (): DailyTip => {
    const randomIndex = Math.floor(Math.random() * dailyTips.length);
    return dailyTips[randomIndex];
  };

  return currentTip;
}