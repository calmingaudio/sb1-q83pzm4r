import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const feelings = [
  { id: 'relaxed', text: 'Completely relaxed', emoji: '😌' },
  { id: 'okay', text: 'Okay, with moments of tension', emoji: '😅' },
  { id: 'worried', text: 'Frequently worried or scanning for danger', emoji: '😟' },
  { id: 'anxious', text: 'Anxious and hyper-aware', emoji: '😰' },
  { id: 'panic', text: 'On edge or panicking', emoji: '😱' },
];

export default function DuringFlightScreen() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedFeeling) {
      router.push('/questionnaire/last-flight');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.questionContainer}
        >
          <Text style={styles.question}>
            How do you feel during the flight?
          </Text>
          <Text style={styles.subtitle}>
            What emotions or sensations usually come up when you're in the air?
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {feelings.map((feeling, index) => (
            <Animated.View
              key={feeling.id}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedFeeling === feeling.id && styles.selectedOption
                ]}
                onPress={() => setSelectedFeeling(feeling.id)}
              >
                <Text style={styles.emoji}>{feeling.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  selectedFeeling === feeling.id && styles.selectedOptionText
                ]}>
                  {feeling.text}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[styles.button, !selectedFeeling && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!selectedFeeling}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
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
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionContainer: {
    marginBottom: 32,
  },
  question: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  selectedOption: {
    backgroundColor: Colors.light.primary,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.light.border,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});