import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
        // Gentle vibration pattern for exhale
        window.navigator.vibrate([100, 30, 100]);
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
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pattern.name}</Text>
      </LinearGradient>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 999,
    opacity: 0.3,
  },
  phaseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: Colors.light.text,
    marginTop: 40,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 72,
    color: Colors.light.primary,
    marginTop: 20,
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
    marginBottom: 40,
  },
  playButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});