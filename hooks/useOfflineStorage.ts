import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { breathingPatterns } from '@/constants/BreathingPatterns';
import { faqCategories } from '@/constants/LearnContent';

const STORAGE_KEYS = {
  BREATHING_PATTERNS: 'offline_breathing_patterns',
  FAQ_CATEGORIES: 'offline_faq_categories',
  JOURNAL_ENTRIES: 'offline_journal_entries',
  LAST_SYNC: 'offline_last_sync',
};

export function useOfflineStorage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);

  useEffect(() => {
    initializeOfflineStorage();
  }, []);

  const initializeOfflineStorage = async () => {
    try {
      setIsLoading(true);
      
      // Initialize core content if not already cached
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!lastSync) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.BREATHING_PATTERNS, JSON.stringify(breathingPatterns)),
          AsyncStorage.setItem(STORAGE_KEYS.FAQ_CATEGORIES, JSON.stringify(faqCategories)),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString()),
        ]);
      }
      
      setLastSyncDate(lastSync ? new Date(lastSync) : new Date());
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize offline storage');
      setIsLoading(false);
    }
  };

  const getBreathingPatterns = async () => {
    try {
      const patterns = await AsyncStorage.getItem(STORAGE_KEYS.BREATHING_PATTERNS);
      return patterns ? JSON.parse(patterns) : breathingPatterns;
    } catch (err) {
      return breathingPatterns; // Fallback to constants if storage fails
    }
  };

  const getFAQCategories = async () => {
    try {
      const categories = await AsyncStorage.getItem(STORAGE_KEYS.FAQ_CATEGORIES);
      return categories ? JSON.parse(categories) : faqCategories;
    } catch (err) {
      return faqCategories; // Fallback to constants if storage fails
    }
  };

  const saveJournalEntry = async (entry: any) => {
    try {
      const existingEntries = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      entries.push(entry);
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
      return true;
    } catch (err) {
      setError('Failed to save journal entry');
      return false;
    }
  };

  const getJournalEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      return entries ? JSON.parse(entries) : [];
    } catch (err) {
      setError('Failed to retrieve journal entries');
      return [];
    }
  };

  const clearOfflineData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.BREATHING_PATTERNS,
        STORAGE_KEYS.FAQ_CATEGORIES,
        STORAGE_KEYS.JOURNAL_ENTRIES,
        STORAGE_KEYS.LAST_SYNC,
      ]);
      await initializeOfflineStorage();
    } catch (err) {
      setError('Failed to clear offline data');
    }
  };

  return {
    isLoading,
    error,
    lastSyncDate,
    getBreathingPatterns,
    getFAQCategories,
    saveJournalEntry,
    getJournalEntries,
    clearOfflineData,
  };
}