import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import JournalEntryView from '@/components/journal/JournalEntryView';

interface JournalEntry {
  id: string;
  date: string;
  feelings: string[];
  overallFeelings: string;
  concerns: string;
  gratitude: string;
  notes: string;
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    feelings: ['Anxious', 'Hopeful', 'Determined'],
    overallFeelings: "Mixed feelings about my upcoming flight. While there's some anxiety, I'm also feeling more prepared than usual.",
    concerns: "Still worried about turbulence, but I'm learning to understand it better through the app's resources.",
    gratitude: "Grateful for this app and the support it provides. Also thankful for my family's encouragement and understanding.",
    notes: "The breathing exercises really helped today. I'm going to keep practicing them before my flight."
  }
];

const FEELINGS = [
  { emoji: '😰', text: 'Panic' },
  { emoji: '😟', text: 'Worried' },
  { emoji: '😨', text: 'Nervous' },
  { emoji: '😧', text: 'Anxious' },
  { emoji: '😩', text: 'Overwhelmed' },
  { emoji: '😱', text: 'Fearful' },
  { emoji: '😢', text: 'Crying' },
  { emoji: '💪', text: 'Strong' },
  { emoji: '🎯', text: 'Determined' },
  { emoji: '🦁', text: 'Brave' },
  { emoji: '🌟', text: 'Hopeful' },
  { emoji: '😌', text: 'Calm' },
  { emoji: '😮‍💨', text: 'Relieved' },
  { emoji: '😤', text: 'Tense' },
  { emoji: '🙏', text: 'Grateful' },
  { emoji: '🫥', text: 'Disconnected' },
  { emoji: '😠', text: 'Irritated' },
  { emoji: '😳', text: 'Embarrassed' },
  { emoji: '💫', text: 'Empowered' },
  { emoji: '🤗', text: 'Comforted' },
];

export default function JournalScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showEntryView, setShowEntryView] = useState<JournalEntry | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [overallFeelings, setOverallFeelings] = useState('');
  const [concerns, setConcerns] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const entry = MOCK_ENTRIES.find(e => e.date === date.toISOString().split('T')[0]);
    if (entry) {
      setShowEntryView(entry);
      setShowNewEntry(false);
    } else {
      setShowNewEntry(true);
      setShowEntryView(null);
      setCurrentStep(1);
    }
  };

  const handleFeelingSelect = (feeling: string) => {
    if (selectedFeelings.includes(feeling)) {
      setSelectedFeelings(selectedFeelings.filter(f => f !== feeling));
    } else {
      setSelectedFeelings([...selectedFeelings, feeling]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        feelings: selectedFeelings,
        overallFeelings,
        concerns,
        gratitude,
        notes
      };
      
      // In a real app, save to database
      console.log('New entry:', newEntry);
      
      // Reset and return to calendar
      setShowNewEntry(false);
      setCurrentStep(1);
      setSelectedFeelings([]);
      setOverallFeelings('');
      setConcerns('');
      setGratitude('');
      setNotes('');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowNewEntry(false);
    }
  };

  const hasEntryForDate = (date: Date) => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return MOCK_ENTRIES.some(entry => entry.date === dateString);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weeks = [];
    let week = [];
    
    days.forEach((day, index) => {
      week.push(day);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <View style={styles.calendar}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <ChevronLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <ChevronRight size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        {weeks.map((week, i) => (
          <View key={i} style={styles.week}>
            {week.map((day, j) => (
              <TouchableOpacity
                key={j}
                style={[
                  styles.day,
                  day && selectedDate.toDateString() === day.toDateString() && styles.selectedDay
                ]}
                onPress={() => day && handleDateSelect(day)}
                disabled={!day}
              >
                {day && (
                  <View style={styles.dayContent}>
                    <Text style={[
                      styles.dayText,
                      day.toDateString() === selectedDate.toDateString() && styles.selectedDayText
                    ]}>
                      {day.getDate()}
                    </Text>
                    {hasEntryForDate(day) && (
                      <View style={[
                        styles.entryIndicator,
                        day.toDateString() === selectedDate.toDateString() && styles.selectedEntryIndicator
                      ]}>
                        <BookOpen size={12} color={day.toDateString() === selectedDate.toDateString() ? '#ffffff' : Colors.light.primary} />
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderNewEntry = () => {
    return (
      <Animated.View 
        style={styles.newEntry}
        entering={FadeIn}
      >
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.light.text} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Step {currentStep} of 5</Text>
        </View>

        {currentStep === 1 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>How are you feeling about flying?</Text>
            <View style={styles.feelingsContainer}>
              <View style={styles.feelingsGrid}>
                {FEELINGS.map((feeling, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.feelingButton,
                      selectedFeelings.includes(feeling.text) && styles.selectedFeeling
                    ]}
                    onPress={() => handleFeelingSelect(feeling.text)}
                  >
                    <Text style={styles.feelingEmoji}>{feeling.emoji}</Text>
                    <Text style={[
                      styles.feelingText,
                      selectedFeelings.includes(feeling.text) && styles.selectedFeelingText
                    ]}>
                      {feeling.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>What's your overall feeling with flying today?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={overallFeelings}
              onChangeText={setOverallFeelings}
              placeholder="Share your thoughts..."
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>What's weighing you down with flying today?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={concerns}
              onChangeText={setConcerns}
              placeholder="Share your concerns..."
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>What are you feeling grateful for today?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={gratitude}
              onChangeText={setGratitude}
              placeholder="Share your gratitude..."
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Additional Notes</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any other thoughts..."
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 5 ? 'Save Entry' : 'Next'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {(showNewEntry || showEntryView) && (
            <TouchableOpacity 
              onPress={() => {
                setShowNewEntry(false);
                setShowEntryView(null);
              }}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#ffffff" />
              <Text style={styles.backText}>Calendar</Text>
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.subtitle}>{formatDate(selectedDate)}</Text>
          </View>
        </View>
      </LinearGradient>

      {showEntryView ? (
        <JournalEntryView entry={showEntryView} />
      ) : (
        <ScrollView style={styles.content}>
          {showNewEntry ? renderNewEntry() : renderCalendar()}
        </ScrollView>
      )}
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
    paddingTop: 12,
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
  calendar: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: Colors.light.primary,
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedDayText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  newEntry: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  stepIndicator: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  step: {
    flex: 1,
    marginBottom: 24,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  feelingsContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 16,
  },
  feelingButton: {
    width: '15.5%',
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  selectedFeeling: {
    backgroundColor: Colors.light.primary,
  },
  feelingEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  feelingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.light.text,
    textAlign: 'center',
  },
  selectedFeelingText: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 120,
    textAlignVertical: 'top',
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
  nextButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  entryIndicator: {
    marginTop: 4,
    padding: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(8, 145, 178, 0.1)',
  },
  selectedEntryIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});