import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DOWNLOADED_TRACKS_KEY = 'downloaded_music_tracks';
const DOWNLOAD_PROGRESS_KEY = 'download_progress';

export interface DownloadedTrack {
  id: string;
  title: string;
  artist: string;
  localUri: string;
  downloadDate: string;
  fileSize: number;
}

export interface DownloadProgress {
  trackId: string;
  progress: number;
  isDownloading: boolean;
}

export function useOfflineMusic() {
  const [downloadedTracks, setDownloadedTracks] = useState<DownloadedTrack[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDownloadedTracks();
  }, []);

  const loadDownloadedTracks = async () => {
    try {
      const saved = await AsyncStorage.getItem(DOWNLOADED_TRACKS_KEY);
      if (saved) {
        const tracks = JSON.parse(saved);
        // Verify files still exist
        const validTracks = [];
        for (const track of tracks) {
          const fileInfo = await FileSystem.getInfoAsync(track.localUri);
          if (fileInfo.exists) {
            validTracks.push(track);
          }
        }
        setDownloadedTracks(validTracks);
        // Update storage with valid tracks only
        await AsyncStorage.setItem(DOWNLOADED_TRACKS_KEY, JSON.stringify(validTracks));
      }
    } catch (error) {
      console.error('Error loading downloaded tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTrackDownloaded = (trackId: string): boolean => {
    return downloadedTracks.some(track => track.id === trackId);
  };

  const getDownloadedTrack = (trackId: string): DownloadedTrack | null => {
    return downloadedTracks.find(track => track.id === trackId) || null;
  };

  const downloadTrack = async (track: any): Promise<boolean> => {
    try {
      // For demo purposes, we'll simulate a download
      // In a real app, you would download from a CDN or streaming service
      const simulatedUrl = `https://example.com/music/${track.id}.mp3`;
      const fileName = `${track.id}.mp3`;
      const localUri = `${FileSystem.documentDirectory}music/${fileName}`;

      // Ensure music directory exists
      const musicDir = `${FileSystem.documentDirectory}music/`;
      const dirInfo = await FileSystem.getInfoAsync(musicDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
      }

      // Set initial progress
      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { trackId: track.id, progress: 0, isDownloading: true }
      }));

      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(prev => ({
          ...prev,
          [track.id]: { trackId: track.id, progress: i, isDownloading: true }
        }));
      }

      // Create a dummy file for demo (in real app, this would be the actual download)
      await FileSystem.writeAsStringAsync(localUri, `Demo audio file for ${track.title}`, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      const downloadedTrack: DownloadedTrack = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        localUri,
        downloadDate: new Date().toISOString(),
        fileSize: fileInfo.size || 0,
      };

      const updatedTracks = [...downloadedTracks, downloadedTrack];
      setDownloadedTracks(updatedTracks);
      await AsyncStorage.setItem(DOWNLOADED_TRACKS_KEY, JSON.stringify(updatedTracks));

      // Clear progress
      setDownloadProgress(prev => {
        const updated = { ...prev };
        delete updated[track.id];
        return updated;
      });

      return true;
    } catch (error) {
      console.error('Error downloading track:', error);
      setDownloadProgress(prev => {
        const updated = { ...prev };
        delete updated[track.id];
        return updated;
      });
      return false;
    }
  };

  const deleteTrack = async (trackId: string): Promise<boolean> => {
    try {
      const track = downloadedTracks.find(t => t.id === trackId);
      if (!track) return false;

      // Delete the file
      await FileSystem.deleteAsync(track.localUri, { idempotent: true });

      // Update state and storage
      const updatedTracks = downloadedTracks.filter(t => t.id !== trackId);
      setDownloadedTracks(updatedTracks);
      await AsyncStorage.setItem(DOWNLOADED_TRACKS_KEY, JSON.stringify(updatedTracks));

      return true;
    } catch (error) {
      console.error('Error deleting track:', error);
      return false;
    }
  };

  const getTotalDownloadSize = (): number => {
    return downloadedTracks.reduce((total, track) => total + track.fileSize, 0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAllDownloads = async (): Promise<boolean> => {
    try {
      // Delete all files
      for (const track of downloadedTracks) {
        await FileSystem.deleteAsync(track.localUri, { idempotent: true });
      }

      // Clear storage
      setDownloadedTracks([]);
      await AsyncStorage.removeItem(DOWNLOADED_TRACKS_KEY);

      return true;
    } catch (error) {
      console.error('Error clearing downloads:', error);
      return false;
    }
  };

  return {
    downloadedTracks,
    downloadProgress,
    isLoading,
    isTrackDownloaded,
    getDownloadedTrack,
    downloadTrack,
    deleteTrack,
    getTotalDownloadSize,
    formatFileSize,
    clearAllDownloads,
  };
}