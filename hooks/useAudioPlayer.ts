import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
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
        const audioConfig = {
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          // Only set platform-specific interruption modes on native platforms
          ...(Platform.OS !== 'web' ? {
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          } : {}),
        };

        await Audio.setAudioModeAsync(audioConfig);
      } catch (error) {
        console.error('Error configuring audio:', error);
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

      // Stop current sound if playing different sound
      if (soundRef.current && currentSoundId.current !== soundId) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // If same sound is playing, just toggle
      if (currentSoundId.current === soundId && soundRef.current) {
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

      // Load and play new sound with optimized looping settings
      const { sound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: true,
        isLooping: true, // Enable seamless looping
        volume: state.volume,
        progressUpdateIntervalMillis: 500, // More frequent updates for smoother progress
        // Optimize for seamless looping
        rate: 1.0,
        shouldCorrectPitch: true,
        pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
      });

      soundRef.current = sound;
      currentSoundId.current = soundId;

      // Set up playback status update with loop optimization
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!isMounted.current) return;
        if (status.isLoaded) {
          setState(prev => ({
            ...prev,
            isPlaying: status.isPlaying,
            isLoading: false,
            position: status.positionMillis || 0,
            duration: status.durationMillis || 0,
          }));

          // Handle seamless looping - restart when near the end to avoid gaps
          if (status.durationMillis && status.positionMillis) {
            const timeRemaining = status.durationMillis - status.positionMillis;
            // If less than 100ms remaining, prepare for seamless loop
            if (timeRemaining < 100 && status.isPlaying) {
              // The isLooping: true setting handles this automatically
              // but we can add additional logic here if needed
            }
          }
        }
      });

      if (!isMounted.current) return;
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    } catch (error) {
      console.error('Error playing sound:', error);
      if (!isMounted.current) return;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Failed to play audio',
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