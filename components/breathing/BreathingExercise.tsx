import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { BreathingPattern } from '@/constants/BreathingPatterns';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  Easing,
  FadeIn,
  FadeOut 
} from 'react-native-reanimated';

interface Props {
  pattern: BreathingPattern;
  onClose: () => void;
}

export default function BreathingExercise({ pattern, onClose }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'holdInhale' | 'exhale' | 'holdExhale'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(pattern.inhaleSeconds);
  const [cycleCount, setCycleCount] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to handle vibration feedback
  const triggerVibration = () => {
    if (Platform.OS === 'web' && currentPhase === 'exhale') {
      try {
        // Gentle vibration pattern for exhale - only on web
        const nav = (globalThis as any).navigator;
        if (nav && nav.vibrate) {
          nav.vibrate([100, 30, 100]);
        }
      } catch (error) {
        console.log('Vibration not supported');
      }
    }
  };
  
  useEffect(() => {
    if (isPlaying) {
      triggerVibration();
      
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            moveToNextPhase();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentPhase]);
  
  const moveToNextPhase = () => {
    if (currentPhase === 'inhale') {
      if (pattern.holdInhaleSeconds > 0) {
        setCurrentPhase('holdInhale');
        setTimeRemaining(pattern.holdInhaleSeconds);
      } else {
        setCurrentPhase('exhale');
        setTimeRemaining(pattern.exhaleSeconds);
      }
    } else if (currentPhase === 'holdInhale') {
      setCurrentPhase('exhale');
      setTimeRemaining(pattern.exhaleSeconds);
    } else if (currentPhase === 'exhale') {
      if (pattern.holdExhaleSeconds > 0) {
        setCurrentPhase('holdExhale');
        setTimeRemaining(pattern.holdExhaleSeconds);
      } else {
        if (cycleCount >= pattern.totalCycles) {
          resetExercise();
          setIsPlaying(false);
        } else {
          setCycleCount(cycleCount + 1);
          setCurrentPhase('inhale');
          setTimeRemaining(pattern.inhaleSeconds);
        }
      }
    } else if (currentPhase === 'holdExhale') {
      if (cycleCount >= pattern.totalCycles) {
        resetExercise();
        setIsPlaying(false);
      } else {
        setCycleCount(cycleCount + 1);
        setCurrentPhase('inhale');
        setTimeRemaining(pattern.inhaleSeconds);
      }
    }
  };
  
  const resetExercise = () => {
    setCycleCount(1);
    setCurrentPhase('inhale');
    setTimeRemaining(pattern.inhaleSeconds);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    const size = currentPhase === 'inhale' ? 300 : 
                 currentPhase === 'holdInhale' ? 300 :
                 currentPhase === 'exhale' ? 150 : 150;
                 
    return {
      width: withTiming(size, {
        duration: currentPhase === 'inhale' ? pattern.inhaleSeconds * 1000 :
                 currentPhase === 'exhale' ? pattern.exhaleSeconds * 1000 : 100,
        easing: Easing.inOut(Easing.ease),
      }),
      height: withTiming(size, {
        duration: currentPhase === 'inhale' ? pattern.inhaleSeconds * 1000 :
                 currentPhase === 'exhale' ? pattern.exhaleSeconds * 1000 : 100,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Modern Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={Colors.light.gradient.primary as any}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{pattern.name}</Text>
            <View style={styles.spacer} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.breathCircle, animatedStyle]} />
          <Text style={styles.phaseText}>
            {currentPhase === 'inhale' ? 'Breathe In' :
             currentPhase === 'holdInhale' ? 'Hold' :
             currentPhase === 'exhale' ? 'Breathe Out' : 'Rest'}
          </Text>
          <Text style={styles.timerText}>{timeRemaining}</Text>
          <Text style={styles.cycleText}>Cycle {cycleCount} of {pattern.totalCycles}</Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 40, // Same width as back button for perfect centering
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '70%', // Limit height to prevent overflow
  },
  breathCircle: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 999,
    opacity: 0.3,
  },
  phaseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: Colors.light.text,
    marginTop: 30,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 64,
    color: Colors.light.primary,
    marginTop: 16,
  },
  cycleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  playButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  playButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});