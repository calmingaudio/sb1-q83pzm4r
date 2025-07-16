import { useOfflineContext } from '@/components/OfflineProvider';
import { useOfflineMusic } from '@/hooks/useOfflineMusic';

export function useOfflineContent() {
  const {
    isOnline,
    isAuthenticated,
    isPremium,
    isOfflineMode,
    offlineContentAvailable,
    getBreathingPatterns,
    getFAQCategories,
    saveJournalEntry,
    getJournalEntries,
  } = useOfflineContext();

  const { 
    downloadedTracks, 
    isTrackDownloaded, 
    getDownloadedTrack 
  } = useOfflineMusic();

  // Determine what content is available offline
  const getAvailableContent = () => {
    const content = {
      breathing: false,
      journal: false,
      music: false,
      meditations: false,
      learn: false,
      sos: true, // Always available
    };

    if (!isAuthenticated) {
      // Unauthenticated users get minimal offline access
      return content;
    }

    if (isOfflineMode || !isOnline) {
      // Offline mode - use cached content
      content.breathing = true;
      content.journal = true;
      content.learn = true;
      
      if (isPremium) {
        content.music = downloadedTracks.length > 0;
        content.meditations = true;
      }
    } else {
      // Online mode - full access
      content.breathing = true;
      content.journal = true;
      content.learn = true;
      
      if (isPremium) {
        content.music = true;
        content.meditations = true;
      }
    }

    return content;
  };

  // Check if specific feature is available
  const canAccessFeature = (feature: keyof ReturnType<typeof getAvailableContent>) => {
    const available = getAvailableContent();
    return available[feature];
  };

  // Get offline content with fallbacks
  const getOfflineBreathingPatterns = async () => {
    if (canAccessFeature('breathing')) {
      return await getBreathingPatterns();
    }
    return null;
  };

  const getOfflineFAQCategories = async () => {
    if (canAccessFeature('learn')) {
      return await getFAQCategories();
    }
    return null;
  };

  const saveOfflineJournalEntry = async (entry: any) => {
    if (canAccessFeature('journal')) {
      return await saveJournalEntry(entry);
    }
    return false;
  };

  const getOfflineJournalEntries = async () => {
    if (canAccessFeature('journal')) {
      return await getJournalEntries();
    }
    return [];
  };

  const getOfflineMusicTracks = () => {
    if (canAccessFeature('music')) {
      return downloadedTracks;
    }
    return [];
  };

  // Get offline status for UI
  const getOfflineStatus = () => {
    if (!isOnline) {
      return {
        mode: 'offline' as const,
        message: 'You\'re offline. Some features may be limited.',
        canAccessContent: offlineContentAvailable,
      };
    }

    if (isOfflineMode) {
      return {
        mode: 'cached' as const,
        message: 'Using cached content. Some features may be limited.',
        canAccessContent: offlineContentAvailable,
      };
    }

    return {
      mode: 'online' as const,
      message: 'All features available.',
      canAccessContent: true,
    };
  };

  return {
    // Status
    isOnline,
    isAuthenticated,
    isPremium,
    isOfflineMode,
    offlineContentAvailable,
    
    // Content access
    getAvailableContent,
    canAccessFeature,
    
    // Content getters
    getOfflineBreathingPatterns,
    getOfflineFAQCategories,
    saveOfflineJournalEntry,
    getOfflineJournalEntries,
    getOfflineMusicTracks,
    
    // Music helpers
    isTrackDownloaded,
    getDownloadedTrack,
    downloadedTracks,
    
    // Status info
    getOfflineStatus,
  };
} 