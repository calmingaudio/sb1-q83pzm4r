import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { BreathingPattern } from '@/constants/BreathingPatterns';
import { LinearGradient } from 'expo-linear-gradient';

interface PatternSelectorProps {
  patterns: BreathingPattern[];
  selectedPattern: BreathingPattern;
  onSelectPattern: (pattern: BreathingPattern) => void;
}

export default function PatternSelector({
  patterns,
  selectedPattern,
  onSelectPattern,
}: PatternSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Patterns</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.patternsContainer}
      >
        {patterns.map((pattern) => (
          <TouchableOpacity
            key={pattern.id}
            onPress={() => onSelectPattern(pattern)}
          >
            <LinearGradient
              colors={
                selectedPattern.id === pattern.id 
                  ? Colors.light.gradient.primary
                  : ['#ffffff', '#ffffff']
              }
              style={[
                styles.patternCard,
                selectedPattern.id === pattern.id && styles.selectedPatternCard,
              ]}
            >
              <Text 
                style={[
                  styles.patternName,
                  selectedPattern.id === pattern.id && styles.selectedPatternName,
                ]}
              >
                {pattern.name}
              </Text>
              
              <Text 
                style={[
                  styles.patternDescription,
                  selectedPattern.id === pattern.id && styles.selectedPatternDescription,
                ]}
                numberOfLines={2}
              >
                {pattern.description}
              </Text>
              
              <View style={styles.patternTimings}>
                <View style={styles.timingItem}>
                  <Text 
                    style={[
                      styles.timingLabel,
                      selectedPattern.id === pattern.id && styles.selectedTimingLabel,
                    ]}
                  >
                    Inhale
                  </Text>
                  <Text 
                    style={[
                      styles.timingValue,
                      selectedPattern.id === pattern.id && styles.selectedTimingValue,
                    ]}
                  >
                    {pattern.inhaleSeconds}s
                  </Text>
                </View>
                
                {pattern.holdInhaleSeconds > 0 && (
                  <View style={styles.timingItem}>
                    <Text 
                      style={[
                        styles.timingLabel,
                        selectedPattern.id === pattern.id && styles.selectedTimingLabel,
                      ]}
                    >
                      Hold
                    </Text>
                    <Text 
                      style={[
                        styles.timingValue,
                        selectedPattern.id === pattern.id && styles.selectedTimingValue,
                      ]}
                    >
                      {pattern.holdInhaleSeconds}s
                    </Text>
                  </View>
                )}
                
                <View style={styles.timingItem}>
                  <Text 
                    style={[
                      styles.timingLabel,
                      selectedPattern.id === pattern.id && styles.selectedTimingLabel,
                    ]}
                  >
                    Exhale
                  </Text>
                  <Text 
                    style={[
                      styles.timingValue,
                      selectedPattern.id === pattern.id && styles.selectedTimingValue,
                    ]}
                  >
                    {pattern.exhaleSeconds}s
                  </Text>
                </View>
                
                {pattern.holdExhaleSeconds > 0 && (
                  <View style={styles.timingItem}>
                    <Text 
                      style={[
                        styles.timingLabel,
                        selectedPattern.id === pattern.id && styles.selectedTimingLabel,
                      ]}
                    >
                      Rest
                    </Text>
                    <Text 
                      style={[
                        styles.timingValue,
                        selectedPattern.id === pattern.id && styles.selectedTimingValue,
                      ]}
                    >
                      {pattern.holdExhaleSeconds}s
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.benefitsContainer}>
                {pattern.benefits.map((benefit, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.benefitText,
                      selectedPattern.id === pattern.id && styles.selectedBenefitText,
                    ]}
                    numberOfLines={1}
                  >
                    • {benefit}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  patternsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  patternCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 20,
    width: 280,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedPatternCard: {
    borderColor: 'transparent',
  },
  patternName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  selectedPatternName: {
    color: '#ffffff',
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  selectedPatternDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  patternTimings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  timingItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 8,
  },
  timingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  selectedTimingLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timingValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedTimingValue: {
    color: '#ffffff',
  },
  benefitsContainer: {
    gap: 4,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  selectedBenefitText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});