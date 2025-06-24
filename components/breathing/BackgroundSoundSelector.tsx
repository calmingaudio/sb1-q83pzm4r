import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, PanResponder } from 'react-native';
import { Volume2, VolumeX, Crown, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/components/ThemeProvider';
import { backgroundSounds, BackgroundSound } from '@/constants/BackgroundSounds';
import { usePremium } from '@/hooks/usePremium';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  selectedSound: BackgroundSound | null;
  onSoundSelect: (sound: BackgroundSound) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  onShowPremiumModal: () => void;
}

export default function BackgroundSoundSelector({
  selectedSound,
  onSoundSelect,
  volume,
  onVolumeChange,
  isPlaying,
  onShowPremiumModal
}: Props) {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [sliderWidth, setSliderWidth] = useState(200);

  const handleSoundSelect = (sound: BackgroundSound) => {
    if (sound.isPremium && !isPremium) {
      onShowPremiumModal();
      return;
    }
    onSoundSelect(sound);
  };

  // Create PanResponder for volume slider
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX } = event.nativeEvent;
      const newVolume = Math.max(0, Math.min(1, locationX / sliderWidth));
      onVolumeChange(newVolume);
    },
    onPanResponderMove: (event) => {
      const { locationX } = event.nativeEvent;
      const newVolume = Math.max(0, Math.min(1, locationX / sliderWidth));
      onVolumeChange(newVolume);
    },
    onPanResponderRelease: () => {
      // Optional: Add haptic feedback here if needed
    },
  });

  const handleSliderLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  const handleVolumeButtonPress = (newVolume: number) => {
    onVolumeChange(newVolume);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Volume2 size={20} color={colors.primary} strokeWidth={2.5} />
          <Text style={styles.title}>Background Sounds</Text>
        </View>
        <Text style={styles.subtitle}>
          {selectedSound ? selectedSound.name : 'None selected'}
        </Text>
      </View>

      {/* Volume Control */}
      {selectedSound && selectedSound.id !== 'none' && (
        <Animated.View 
          style={styles.volumeSection}
          entering={FadeInDown.delay(100).springify()}
        >
          <View style={styles.volumeHeader}>
            <Text style={styles.volumeLabel}>Volume</Text>
            <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
          </View>
          <View style={styles.volumeSliderContainer}>
            <TouchableOpacity 
              onPress={() => handleVolumeButtonPress(0)} 
              style={styles.volumeButton}
            >
              <VolumeX size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            
            <View 
              style={styles.volumeSlider}
              onLayout={handleSliderLayout}
              {...panResponder.panHandlers}
            >
              <View style={styles.volumeTrack} />
              <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
              <View style={[styles.volumeThumb, { left: `${Math.max(0, Math.min(100, volume * 100 - 2))}%` }]} />
            </View>
            
            <TouchableOpacity 
              onPress={() => handleVolumeButtonPress(1)} 
              style={styles.volumeButton}
            >
              <Volume2 size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Sound Icons Grid */}
      <View style={styles.soundsContainer}>
        <View style={styles.soundsGrid}>
          {backgroundSounds.map((sound, index) => {
            const isSelected = selectedSound?.id === sound.id;
            const isLocked = sound.isPremium && !isPremium;
            
            return (
              <Animated.View
                key={sound.id}
                entering={FadeInDown.delay(200 + index * 50).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.soundButton,
                    isSelected && styles.soundButtonSelected,
                    isLocked && styles.soundButtonLocked
                  ]}
                  onPress={() => handleSoundSelect(sound)}
                  activeOpacity={0.8}
                >
                  {isSelected && !isLocked && (
                    <LinearGradient
                      colors={colors.gradient.primary}
                      style={styles.soundButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  
                  {/* Premium Lock Overlay */}
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <Lock size={20} color="#FFD700" strokeWidth={2.5} />
                    </View>
                  )}

                  {/* Premium Badge */}
                  {sound.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Crown size={12} color="#FFD700" strokeWidth={2.5} />
                    </View>
                  )}

                  {/* Playing Indicator */}
                  {isSelected && isPlaying && !isLocked && (
                    <View style={styles.playingIndicator}>
                      <View style={[styles.playingBar, styles.playingBar1]} />
                      <View style={[styles.playingBar, styles.playingBar2]} />
                      <View style={[styles.playingBar, styles.playingBar3]} />
                    </View>
                  )}

                  <View style={styles.soundButtonContent}>
                    <Text style={[
                      styles.soundEmoji,
                      isSelected && !isLocked && styles.soundEmojiSelected
                    ]}>
                      {sound.icon}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  volumeSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  volumeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
  },
  volumeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 18, // Increase touch area
  },
  volumeTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  volumeFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  volumeThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: -10,
    marginTop: -8,
    borderWidth: 2,
    borderColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  soundsContainer: {
    paddingBottom: 10,
  },
  soundsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  soundButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  soundButtonSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  soundButtonLocked: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  soundButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 35,
  },
  premiumBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    zIndex: 1,
  },
  playingBar: {
    width: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
  playingBar1: {
    height: 12,
  },
  playingBar2: {
    height: 8,
  },
  playingBar3: {
    height: 16,
  },
  soundButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  soundEmoji: {
    fontSize: 28,
  },
  soundEmojiSelected: {
    fontSize: 32,
  },
});