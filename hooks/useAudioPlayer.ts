import { useState, useEffect, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Platform } from 'react-native';

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  position: number;
  duration: number;
}

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    volume: 0.5,
    position: 0,
    duration: 0,
  });
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentSoundId = useRef<string | null>(null);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    // Configure audio session for background playback and seamless looping
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });
        console.log('Audio mode configured successfully');
      } catch (error) {
        console.error('Error configuring audio:', error);
        setState(prev => ({ ...prev, error: 'Failed to configure audio' }));
      }
    };

    configureAudio();

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playSound = async (audioFile: any, soundId: string) => {
    try {
      if (!isMounted.current) return;
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('Starting to play sound:', soundId);

      // Stop current sound if playing different sound
      if (soundRef.current && currentSoundId.current !== soundId) {
        console.log('Unloading previous sound');
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // If same sound is playing, just toggle
      if (currentSoundId.current === soundId && soundRef.current) {
        console.log('Toggling existing sound');
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            if (!isMounted.current) return;
            setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
          } else {
            await soundRef.current.playAsync();
            if (!isMounted.current) return;
            setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
          }
          return;
        }
      }

      console.log('Loading new sound:', audioFile);
      
      // Load and play new sound
      const { sound, status } = await Audio.Sound.createAsync(
        typeof audioFile === 'string' ? { uri: audioFile } : audioFile,
        {
          shouldPlay: true,
          isLooping: true,
          volume: state.volume,
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          rate: 1.0,
          shouldCorrectPitch: true,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
        },
        (status) => {
          if (!isMounted.current) return;
          if (status.isLoaded) {
            setState(prev => ({
              ...prev,
              isPlaying: status.isPlaying,
              position: status.positionMillis || 0,
              duration: status.durationMillis || 0,
            }));
          } else {
            console.log('Sound status not loaded:', status);
          }
        }
      );

      console.log('Sound created successfully');
      soundRef.current = sound;
      currentSoundId.current = soundId;

      if (!isMounted.current) return;
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    } catch (error) {
      console.error('Error playing sound:', error);
      if (!isMounted.current) return;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Failed to play audio: ' + (error instanceof Error ? error.message : String(error)),
      }));
    }
  };

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        currentSoundId.current = null;
      }
      if (!isMounted.current) return;
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        position: 0,
        duration: 0 
      }));
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        if (!isMounted.current) return;
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const resumeSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        if (!isMounted.current) return;
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      if (!isMounted.current) return;
      setState(prev => ({ ...prev, volume: clampedVolume }));
      
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(clampedVolume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const seekTo = async (positionMillis: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(positionMillis);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  return {
    ...state,
    playSound,
    stopSound,
    pauseSound,
    resumeSound,
    setVolume,
    seekTo,
    formatTime,
    currentSoundId: currentSoundId.current,
  };
}