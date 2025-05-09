import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane } from 'lucide-react-native';
import { onboardingQuestions } from '@/constants/Onboarding';
import Colors from '@/constants/Colors';

export default function OnboardingScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === onboardingQuestions.length - 1;

  const handleOptionSelect = (optionValue: string) => {
    if (currentQuestion.multiSelect) {
      // For multi-select questions
      const currentAnswers = answers[currentQuestion.id] as string[] || [];
      const updatedAnswers = currentAnswers.includes(optionValue)
        ? currentAnswers.filter(value => value !== optionValue)
        : [...currentAnswers, optionValue];
      
      setAnswers({
        ...answers,
        [currentQuestion.id]: updatedAnswers
      });
    } else {
      // For single-select questions
      setAnswers({
        ...answers,
        [currentQuestion.id]: optionValue
      });
    }
  };

  const isOptionSelected = (optionValue: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(optionValue);
    }
    return answer === optionValue;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Save answers to storage in a real app
      // For now, we'll just navigate to the main app
      router.replace('/(tabs)');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isNextDisabled = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.multiSelect) {
      return !answer || (answer as string[]).length === 0;
    }
    return !answer;
  };

  return (
    <LinearGradient
      colors={['#0369a1', '#0ea5e9', '#7dd3fc']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Plane color="#ffffff" size={40} />
          <Text style={styles.title}>SkyCalm</Text>
          <View style={styles.progressContainer}>
            {onboardingQuestions.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot, 
                  index === currentQuestionIndex ? styles.activeDot : null,
                  index < currentQuestionIndex ? styles.completedDot : null
                ]} 
              />
            ))}
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          
          <ScrollView style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isOptionSelected(option.value) && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  isOptionSelected(option.value) && styles.selectedOptionText
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextDisabled() && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={isNextDisabled()}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#ffffff',
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedDot: {
    backgroundColor: '#ffffff',
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    flex: 1,
  },
  questionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedOption: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
    opacity: 0.7,
  },
  nextButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});