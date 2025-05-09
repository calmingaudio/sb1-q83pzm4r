import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { BreathingPattern, SoundOption } from '@/constants/BreathingPatterns';

interface BreathingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  selectedPattern: BreathingPattern;
  onPatternChange: (pattern: BreathingPattern) => void;
  availablePatterns: BreathingPattern[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  availableSounds: SoundOption[];
  currentPhase: string;
  timeRemaining: number;
  cycleCount: number;
}

export default function BreathingControls({
  isPlaying,
  onPlayPause,
  onReset,
  selectedPattern,
  currentPhase,
  timeRemaining,
  cycleCount,
  soundEnabled,
  onToggleSound,
}: BreathingControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.phaseText}>
          {currentPhase === 'inhale' ? 'Breathe In' :
           currentPhase === 'holdInhale' ? 'Hold' :
           currentPhase === 'exhale' ? 'Breathe Out' : 'Rest'}
        </Text>
        <Text style={styles.timerText}>{timeRemaining}s</Text>
        <Text style={styles.cycleText}>Cycle {cycleCount} of {selectedPattern.totalCycles}</Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.soundButton}
          onPress={onToggleSound}
        >
          {soundEnabled ? (
            <Volume2 size={24} color={Colors.light.textSecondary} />
          ) : (
            <VolumeX size={24} color={Colors.light.textSecondary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={onPlayPause}
        >
          {isPlaying ? (
            <Pause size={32} color="#ffffff" />
          ) : (
            <Play size={32} color="#ffffff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={onReset}
        >
          <SkipForward size={24} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.patternInfoContainer}>
        <Text style={styles.patternTitle}>{selectedPattern.name}</Text>
        <Text style={styles.patternDescription}>{selectedPattern.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
  },
  timerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 48,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  cycleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  soundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternInfoContainer: {
    alignItems: 'center',
  },
  patternTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});