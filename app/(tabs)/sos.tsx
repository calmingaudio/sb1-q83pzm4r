import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2, VolumeX, Heart, Shield, Settings } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { router, useNavigation, useFocusEffect } from 'expo-router';
import { BackgroundSound, backgroundSounds } from '@/constants/BackgroundSounds';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePremium } from '@/context/premiumContext';
import BackgroundSoundSelector from '@/components/breathing/BackgroundSoundSelector';
import PremiumModal from '@/components/premium/PremiumModal';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const initialSlides = [
  {
    id: 1,
    title: "You're safe right now",
    subtitle: "This feeling is temporary and will pass. You've gotten through difficult moments before.",
    gradient: ['#6366f1', '#8b5cf6'],
    icon: '🛡️'
  },
  {
    id: 2,
    title: "Focus on your breathing",
    subtitle: "Take slow, deep breaths. In through your nose, out through your mouth.",
    gradient: ['#06b6d4', '#0ea5e9'],
    icon: '🫁'
  },
  {
    id: 3,
    title: "Ground yourself here",
    subtitle: "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
    gradient: ['#10b981', '#059669'],
    icon: '🌱'
  },
  {
    id: 4,
    title: "Your body knows what to do",
    subtitle: "These sensations are your body's natural response. They cannot harm you.",
    gradient: ['#f59e0b', '#d97706'],
    icon: '💪'
  },
  {
    id: 5,
    title: "This will pass",
    subtitle: "Panic peaks and then naturally decreases. You're already on your way to feeling better.",
    gradient: ['#8b5cf6', '#a855f7'],
    icon: '🌅'
  },
  {
    id: 6,
    title: "You're stronger than you know",
    subtitle: "Every time you face this feeling, you're building resilience and courage.",
    gradient: ['#ef4444', '#f87171'],
    icon: '⭐'
  },
  {
    id: 7,
    title: "How are you feeling now?",
    subtitle: "Take a moment to check in with yourself.",
    gradient: ['#6366f1', '#8b5cf6'],
    icon: '💝'
  }
];

const alternateSlides = [
  {
    id: 1,
    title: "You are not in danger",
    subtitle: "Your mind is creating fear, but you are physically safe in this moment.",
    gradient: ['#6366f1', '#8b5cf6'],
    icon: '🛡️'
  },
  {
    id: 2,
    title: "Breathe with intention",
    subtitle: "Slow your breathing down. Count: in for 4, hold for 4, out for 6.",
    gradient: ['#06b6d4', '#0ea5e9'],
    icon: '🫁'
  },
  {
    id: 3,
    title: "Connect with the present",
    subtitle: "Feel your feet on the ground. Notice the temperature of the air. You are here, now.",
    gradient: ['#10b981', '#059669'],
    icon: '🌱'
  },
  {
    id: 4,
    title: "These feelings are temporary",
    subtitle: "Anxiety creates waves of sensation. Like all waves, this one will recede.",
    gradient: ['#f59e0b', '#d97706'],
    icon: '🌊'
  },
  {
    id: 5,
    title: "You've survived this before",
    subtitle: "Remember: you have a 100% track record of getting through difficult moments.",
    gradient: ['#8b5cf6', '#a855f7'],
    icon: '🏆'
  },
  {
    id: 6,
    title: "Trust your resilience",
    subtitle: "Your body and mind are working together to keep you safe and help you heal.",
    gradient: ['#ef4444', '#f87171'],
    icon: '💎'
  },
  {
    id: 7,
    title: "Notice any shifts",
    subtitle: "Has anything changed? Even small improvements are worth celebrating.",
    gradient: ['#6366f1', '#8b5cf6'],
    icon: '🌟'
  }
];

export default function SOSScreen() {
  const { colors } = useTheme();
  const { isPremium, purchasePlan, restorePurchases } = usePremium();
  const audioPlayer = useAudioPlayer();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSlides, setShowSlides] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAlternateSet, setIsAlternateSet] = useState(false);
  const [showSoundSelector, setShowSoundSelector] = useState(false);
  const [selectedSound, setSelectedSound] = useState<BackgroundSound | null>(backgroundSounds[0]); // Default to silence
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowWelcome(true);
      setShowSlides(false);
      setCurrentSlide(1);
      setIsAlternateSet(false);
      setSelectedSound(backgroundSounds[0]);
      setShowSoundSelector(false);
      audioPlayer.stopSound();
    });

    return unsubscribe;
  }, [navigation]);

  // Stop audio when tab loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // This runs when the tab loses focus
        audioPlayer.stopSound();
      };
    }, [])
  );

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      audioPlayer.stopSound();
    };
  }, []);

  const slides = isAlternateSet ? alternateSlides : initialSlides;

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(currentSlide + 1);
      scrollViewRef.current?.scrollTo({ x: (currentSlide) * SCREEN_WIDTH, animated: true });
    }
  };

  const handleRestart = () => {
    setIsAlternateSet(!isAlternateSet);
    setCurrentSlide(1);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleGotoBreathe = () => {
    audioPlayer.stopSound();
    router.push('/(tabs)/breathe');
  };

  const handleFeelingSelection = (feelingGood: boolean) => {
    if (feelingGood) {
      handleGotoBreathe();
    } else {
      setShowWelcome(false);
      setShowSlides(true);
    }
  };

  const handleSoundSelect = async (sound: BackgroundSound) => {
    setSelectedSound(sound);
    
    // Stop current sound if switching to silence
    if (sound.id === 'none') {
      await audioPlayer.stopSound();
      return;
    }
    
    // Play new sound if it has an audio file
    if (sound.audioFile) {
      await audioPlayer.playSound(sound.audioFile, sound.id);
    }
  };

  const handleVolumeChange = (volume: number) => {
    audioPlayer.setVolume(volume);
  };

  const handlePremiumPurchase = async (planId: 'monthly' | 'annual') => {
    setIsProcessing(true);
    try {
      const success = await purchasePlan(planId);
      if (success) {
        setShowPremiumModal(false);
      }
    } catch (error) {
      console.error('Error purchasing premium:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Error restoring purchases:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = createStyles(colors);

  if (showWelcome) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onPurchase={handlePremiumPurchase}
          onRestore={handleRestorePurchases}
          isLoading={isProcessing}
        />

        <Animated.View 
          style={styles.welcomeContainer}
          entering={FadeInUp.delay(200).springify()}
        >
          {/* Header */}
          <View style={styles.welcomeHeader}>
            <View style={styles.sosIcon}>
              <Shield size={32} color="#ffffff" strokeWidth={2.5} />
            </View>
            <Text style={styles.welcomeTitle}>SOS</Text>
            <Text style={styles.welcomeSubtitle}>You're in a safe space. Let's work through this together.</Text>
          </View>

          {/* Status Check */}
          <Animated.View 
            style={styles.statusSection}
            entering={FadeInDown.delay(400).springify()}
          >
            <Text style={styles.statusQuestion}>How are you feeling right now?</Text>
            <Text style={styles.statusDescription}>Choose the option that best describes your current state</Text>

            <View style={styles.feelingButtons}>
              <AnimatedTouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handleFeelingSelection(false)}
                entering={FadeInDown.delay(600).springify()}
              >
                <LinearGradient
                  colors={['#ef4444', '#f87171']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.buttonIcon}>
                    <Heart size={24} color="#ffffff" strokeWidth={2.5} />
                  </View>
                  <View style={styles.buttonText}>
                    <Text style={styles.buttonTitle}>I need help now</Text>
                    <Text style={styles.buttonSubtitle}>Feeling overwhelmed or panicked</Text>
                  </View>
                </LinearGradient>
              </AnimatedTouchableOpacity>

              <AnimatedTouchableOpacity
                style={styles.calmButton}
                onPress={() => handleFeelingSelection(true)}
                entering={FadeInDown.delay(700).springify()}
              >
                <LinearGradient
                  colors={['#10b981', '#34d399']}
                  style={styles.calmButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.calmButtonIcon}>
                    <Shield size={20} color="#ffffff" strokeWidth={2.5} />
                  </View>
                  <View style={styles.buttonText}>
                    <Text style={styles.calmButtonTitle}>I'm feeling better</Text>
                    <Text style={styles.calmButtonSubtitle}>Take me to breathing exercises</Text>
                  </View>
                </LinearGradient>
              </AnimatedTouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!showSlides) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePremiumPurchase}
        onRestore={handleRestorePurchases}
        isLoading={isProcessing}
      />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.soundButton}
          onPress={() => setShowSoundSelector(!showSoundSelector)}
        >
          {selectedSound && selectedSound.id !== 'none' ? (
            <Volume2 size={20} color={colors.textSecondary} strokeWidth={2} />
          ) : (
            <Settings size={20} color={colors.textSecondary} strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Background Sound Selector */}
      {showSoundSelector && (
        <Animated.View entering={FadeIn.delay(200)}>
          <View style={styles.soundSelectorContainer}>
            <BackgroundSoundSelector
              selectedSound={selectedSound}
              onSoundSelect={handleSoundSelect}
              volume={audioPlayer.volume}
              onVolumeChange={handleVolumeChange}
              isPlaying={audioPlayer.isPlaying}
              onShowPremiumModal={() => setShowPremiumModal(true)}
            />
          </View>
        </Animated.View>
      )}

      {/* Current Sound Display - Only show when sound selector is visible */}
      {selectedSound && selectedSound.id !== 'none' && showSoundSelector && (
        <Animated.View 
          style={styles.currentSoundDisplay}
          entering={FadeIn.delay(300)}
        >
          <View style={styles.currentSoundContent}>
            <Text style={styles.currentSoundEmoji}>{selectedSound.icon}</Text>
            <View style={styles.currentSoundInfo}>
              <Text style={styles.currentSoundName}>{selectedSound.name}</Text>
              <Text style={styles.currentSoundVolume}>Volume: {Math.round(audioPlayer.volume * 100)}%</Text>
            </View>
            {audioPlayer.isPlaying && (
              <View style={styles.soundPlayingIndicator}>
                <View style={[styles.soundWave, styles.soundWave1]} />
                <View style={[styles.soundWave, styles.soundWave2]} />
                <View style={[styles.soundWave, styles.soundWave3]} />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {slides.map((slide, index) => (
          <Animated.View 
            key={slide.id}
            style={[styles.slide, { width: SCREEN_WIDTH }]}
            entering={FadeIn.delay(300)}
          >
            <LinearGradient
              colors={slide.gradient as any}
              style={styles.slideGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.slideContent}>
                <Animated.View 
                  style={styles.slideHeader}
                  entering={FadeInDown.delay(500)}
                >
                  <View style={styles.slideIcon}>
                    <Text style={styles.slideEmoji}>{slide.icon}</Text>
                  </View>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                </Animated.View>

                {currentSlide === slides.length ? (
                  <View style={styles.finalButtons}>
                    <AnimatedTouchableOpacity
                      style={styles.restartButton}
                      onPress={handleRestart}
                      entering={FadeInDown.delay(1000)}
                    >
                      <LinearGradient
                        colors={['#f59e0b', '#f97316']}
                        style={styles.restartButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.restartButtonText}>
                          Not good, let's start over
                        </Text>
                      </LinearGradient>
                    </AnimatedTouchableOpacity>
                    <AnimatedTouchableOpacity
                      style={styles.breatheButton}
                      onPress={handleGotoBreathe}
                      entering={FadeInDown.delay(1200)}
                    >
                      <LinearGradient
                        colors={['#10b981', '#34d399']}
                        style={styles.breatheButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.breatheButtonText}>Continue to breathing</Text>
                      </LinearGradient>
                    </AnimatedTouchableOpacity>
                  </View>
                ) : (
                  <AnimatedTouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                    entering={FadeInDown.delay(1000)}
                  >
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                      style={styles.nextButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.nextButtonText}>Continue</Text>
                    </LinearGradient>
                  </AnimatedTouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.progressContainer}>
        <View style={styles.progressDots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index + 1 && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginTop: 34,
    marginBottom: 16, // Reduced from 24 to 16
  },
  sosIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  welcomeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statusSection: {
    flex: 1,
  },
  statusQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  statusDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  feelingButtons: {
    gap: 16,
  },
  emergencyButton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ef4444', // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  calmButton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#10b981', // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  calmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  calmButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calmButtonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  calmButtonSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundSelectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentSoundDisplay: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  currentSoundContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSoundEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  currentSoundInfo: {
    flex: 1,
    alignItems: 'center',
  },
  currentSoundName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  currentSoundVolume: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  soundPlayingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  soundWave: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  soundWave1: {
    height: 12,
  },
  soundWave2: {
    height: 8,
  },
  soundWave3: {
    height: 16,
  },
  slide: {
    flex: 1,
  },
  slideGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: SCREEN_HEIGHT * 0.1,
  },
  slideHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slideIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideEmoji: {
    fontSize: 36,
  },
  slideTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 34,
  },
  slideSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
    minWidth: 200,
  },
  nextButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  finalButtons: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  restartButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  restartButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  restartButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  breatheButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  breatheButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  breatheButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  progressContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
});