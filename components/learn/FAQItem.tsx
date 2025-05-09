import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FAQ } from '@/constants/LearnContent';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface FAQItemProps {
  faq: FAQ;
  index: number;
}

export default function FAQItem({ faq, index }: FAQItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.delay(index * 100).springify()}
    >
      <TouchableOpacity 
        style={styles.questionContainer}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{faq.question}</Text>
        {expanded ? (
          <ChevronUp size={20} color={Colors.light.text} />
        ) : (
          <ChevronDown size={20} color={Colors.light.text} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <Animated.View 
          style={styles.answerContainer}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={styles.answerText}>{faq.answer}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
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
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
    marginRight: 16,
  },
  answerContainer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  answerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 24,
  },
});