import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface BreathingAnimationProps {
  phase: 'inhale' | 'holdInhale' | 'exhale' | 'holdExhale';
  duration: number;
  style?: ViewStyle;
}

export default function BreathingAnimation({ phase, duration, style }: BreathingAnimationProps) {
  const animationValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    let animation;
    
    if (phase === 'inhale') {
      // Expand the circle
      animation = Animated.timing(animationValue, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      });
    } else if (phase === 'exhale') {
      // Contract the circle
      animation = Animated.timing(animationValue, {
        toValue: 0,
        duration: duration * 1000,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      });
    } else {
      // Hold the current size
      return;
    }
    
    animation.start();
    
    return () => {
      animation.stop();
    };
  }, [phase, duration, animationValue]);
  
  const circleScaleInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  
  const opacityInnerCircleInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  });
  
  const opacityOuterCircleInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });
  
  const phaseBgColor = phase === 'inhale' || phase === 'holdInhale' 
    ? Colors.light.primaryLight 
    : Colors.light.secondary;
  
  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.outerCircle,
          {
            transform: [{ scale: circleScaleInterpolation }],
            opacity: opacityOuterCircleInterpolation,
            backgroundColor: phaseBgColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.innerCircle,
          {
            transform: [{ scale: circleScaleInterpolation }],
            opacity: opacityInnerCircleInterpolation,
            backgroundColor: phaseBgColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  outerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.light.primaryLight,
  },
  innerCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primaryLight,
  },
});