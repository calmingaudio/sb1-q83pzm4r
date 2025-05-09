import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface JournalEntry {
  id: string;
  date: string;
  feelings: string[];
  overallFeelings: string;
  concerns: string;
  gratitude: string;
  notes: string;
}

interface Props {
  entry: JournalEntry;
}

export default function JournalEntryView({ entry }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feelings About Flying</Text>
          <View style={styles.feelingsContainer}>
            {entry.feelings.map((feeling, index) => (
              <View key={index} style={styles.feelingChip}>
                <Text style={styles.feelingText}>{feeling}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Feelings</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.overallFeelings}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concerns</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.concerns}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gratitude</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.gratitude}</Text>
          </View>
        </View>

        {entry.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{entry.notes}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  date: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  feelingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feelingChip: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  feelingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  cardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
});