import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { breathingPatterns } from '@/constants/BreathingPatterns';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BreathingExercise from '../../components/breathing/BreathingExercise';

export default function BreatheScreen() {
  const [selectedPattern, setSelectedPattern] = useState(null);
  
  if (selectedPattern) {
    return <BreathingExercise pattern={selectedPattern} onClose={() => setSelectedPattern(null)} />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={styles.headerContent}
          entering={FadeInDown.delay(100).springify()}
        >
          <Text style={styles.title}>Breathe</Text>
          <Text style={styles.subtitle}>Choose a breathing technique to begin</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {breathingPatterns.map((pattern, index) => (
          <Animated.View
            key={pattern.id}
            entering={FadeInDown.delay(150 + index * 100).springify()}
          >
            <TouchableOpacity
              onPress={() => setSelectedPattern(pattern)}
              style={styles.patternCard}
            >
              <LinearGradient
                colors={Colors.light.gradient.primary}
                style={styles.patternHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.patternName}>{pattern.name}</Text>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
              </LinearGradient>

              <View style={styles.patternContent}>
                <View style={styles.timingsContainer}>
                  <View style={styles.timingColumn}>
                    <Text style={styles.timingValue}>{pattern.inhaleSeconds}s</Text>
                    <Text style={styles.timingLabel}>Inhale</Text>
                  </View>
                  
                  {pattern.holdInhaleSeconds > 0 && (
                    <View style={styles.timingColumn}>
                      <Text style={styles.timingValue}>{pattern.holdInhaleSeconds}s</Text>
                      <Text style={styles.timingLabel}>Hold</Text>
                    </View>
                  )}
                  
                  <View style={styles.timingColumn}>
                    <Text style={styles.timingValue}>{pattern.exhaleSeconds}s</Text>
                    <Text style={styles.timingLabel}>Exhale</Text>
                  </View>
                  
                  {pattern.holdExhaleSeconds > 0 && (
                    <View style={styles.timingColumn}>
                      <Text style={styles.timingValue}>{pattern.holdExhaleSeconds}s</Text>
                      <Text style={styles.timingLabel}>Rest</Text>
                    </View>
                  )}
                </View>

                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>Benefits:</Text>
                  {pattern.benefits.map((benefit, idx) => (
                    <Text key={idx} style={styles.benefitText}>• {benefit}</Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    marginTop: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  patternCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  patternHeader: {
    padding: 20,
  },
  patternName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 8,
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  patternContent: {
    padding: 20,
  },
  timingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  timingColumn: {
    alignItems: 'center',
  },
  timingValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  timingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});