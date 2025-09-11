// app/(tabs)/journal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight, BookOpen, Plus, Calendar } from "lucide-react-native";
import Colors from "@/constants/Colors";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import JournalEntryView from "@/components/journal/JournalEntryView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '@/components/ThemeProvider';

const JOURNAL_ENTRIES_KEY = 'journal_entries';


interface JournalEntry {
  id: string;
  date: string;
  flyingFeeling: string;
  feelings: string[];
  overallFeelings: string;
  concerns: string;
  gratitude: string;
  notes: string;
}

const FEELINGS = [
  { emoji: '😰', text: 'Panic' },
  { emoji: '😟', text: 'Worried' },
  { emoji: '😨', text: 'Nervous' },
  { emoji: '😧', text: 'Anxious' },
  { emoji: '😩', text: 'Overwhelmed' },
  { emoji: '😱', text: 'Fearful' },
  { emoji: '😢', text: 'Sad' },
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

const FLYING_FEELINGS = [
  { id: 'excited', text: 'Excited to fly', emoji: '🤩', color: '#10b981' },
  { id: 'neutral', text: 'Neutral about flying', emoji: '😐', color: '#6b7280' },
  { id: 'slightly_nervous', text: 'Slightly nervous', emoji: '😅', color: '#f59e0b' },
  { id: 'anxious', text: 'Anxious about flying', emoji: '😰', color: '#ef4444' },
  { id: 'very_scared', text: 'Very scared to fly', emoji: '😱', color: '#dc2626' },
];


export default function JournalScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showEntryView, setShowEntryView] = useState<JournalEntry | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [flyingFeeling, setFlyingFeeling] = useState('');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [overallFeelings, setOverallFeelings] = useState('');
  const [concerns, setConcerns] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');


  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(JOURNAL_ENTRIES_KEY);
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (newEntries: JournalEntry[]) => {
    try {
      await AsyncStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving journal entries:', error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    }
  };


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
    while (days.length < 42) {
      days.push(null);
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
    const entry = entries.find(e => e.date === date.toISOString().split('T')[0]);
    if (entry) {
      // Only show existing entries, don't create new ones
      setShowEntryView(entry);
      setShowNewEntry(false);
    }
    // If no entry exists, do nothing (don't create new entry)
  };

  const handleNewEntry = () => {
    setSelectedDate(new Date());
    setShowNewEntry(true);
    setShowEntryView(null);
    setCurrentStep(0);
    resetForm();
  };

  const resetForm = () => {
    setFlyingFeeling('');
    setSelectedFeelings([]);
    setOverallFeelings('');
    setConcerns('');
    setGratitude('');
    setNotes('');
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
      handleSaveEntry();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowNewEntry(false);
      resetForm();
    }
  };
  

  const handleSaveEntry = async () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      flyingFeeling,
      feelings: selectedFeelings,
      overallFeelings,
      concerns,
      gratitude,
      notes
    };
    
    const updatedEntries = [...entries, newEntry];
    await saveEntries(updatedEntries);
    
    // Reset and return to calendar
    setShowNewEntry(false);
    resetForm();
    setCurrentStep(0);
  };

  const hasEntryForDate = (date: Date) => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return entries.some(entry => entry.date === dateString);
  };

  const getEntryForDate = (date: Date) => {
    if (!date) return null;
    const dateString = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date === dateString);
  };

  const isDateInPast = (date: Date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isDateToday = (date: Date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return flyingFeeling !== '';
      case 1: return selectedFeelings.length > 0;
      case 2: return overallFeelings.trim() !== '';
      case 3: return concerns.trim() !== '';
      case 4: return gratitude.trim() !== '';
      case 5: return true; // Notes are optional
      default: return false;
    }
  };

  const styles = createStyles(colors);

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = [];
    
    days.forEach((day, index) => {
      week.push(day);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <Animated.View 
        style={styles.calendarContainer}
        entering={FadeIn.delay(200)}
      >
        {/* New Entry Button - Moved to Top */}
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={handleNewEntry}
        >
          <LinearGradient
            colors={colors.gradient.primary as any}
            style={styles.newEntryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Plus size={20} color="#ffffff" strokeWidth={2.5} />
            <Text style={styles.newEntryText}>New Entry</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.calendar}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
              <ChevronLeft size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
              <ChevronRight size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          {weeks.map((week, i) => (
            <View key={i} style={styles.week}>
              {week.map((day, j) => {
                const hasEntry = day && hasEntryForDate(day);
                const entry = day ? getEntryForDate(day) : null;
                const isPast = day && isDateInPast(day);
                const isToday = day && isDateToday(day);
                
                return (
                  <TouchableOpacity
                    key={j}
                    style={[
                      styles.day,
                      hasEntry && styles.dayWithEntry,
                      isPast && hasEntry && styles.dayWithEntryPast,
                      isToday && styles.dayToday,
                      isToday && hasEntry && styles.dayTodayWithEntry
                    ]}
                    onPress={() => day && hasEntry && handleDateSelect(day)}
                    disabled={!day || !hasEntry}
                  >
                    {day && (
                      <View style={styles.dayContent}>
                        <Text style={[
                          styles.dayText,
                          hasEntry && styles.dayWithEntryText,
                          isPast && hasEntry && styles.dayWithEntryTextPast,
                          isToday && styles.dayTodayText,
                          isToday && hasEntry && styles.dayTodayWithEntryText
                        ]}>
                          {day.getDate()}
                        </Text>
                        {hasEntry && (
                          <View style={styles.entryIndicator}>
                            <BookOpen 
                              size={8} 
                              color={
                                isToday ? '#ffffff' :
                                isPast ? colors.textSecondary : 
                                colors.primary
                              } 
                              strokeWidth={2} 
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderNewEntry = () => {
    const steps = [
      {
        title: "How are you feeling about flying?",
        subtitle: "Choose the option that best describes your current feelings about flying"
      },
      {
        title: "What emotions are you experiencing?",
        subtitle: "Select all that apply to how you're feeling right now"
      },
      {
        title: "Describe your overall feelings",
        subtitle: "Share your thoughts about flying in your own words"
      },
      {
        title: "What's concerning you?",
        subtitle: "What specific aspects of flying are weighing on your mind?"
      },
      {
        title: "What are you grateful for?",
        subtitle: "Focus on the positive things in your life right now"
      },
      {
        title: "Additional thoughts",
        subtitle: "Any other reflections you'd like to capture (optional)"
      }
    ];

    return (
      <View style={styles.newEntry}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={20} color={colors.text} strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.stepIndicator}>Step {currentStep + 1} of {steps.length}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={styles.step}
            entering={FadeInDown.delay(300)}
          >
            <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
            <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>

            {currentStep === 0 && (
              <View style={styles.flyingFeelingsContainer}>
                {FLYING_FEELINGS.map((feeling, index) => (
                  <TouchableOpacity
                    key={feeling.id}
                    style={[
                      styles.flyingFeelingButton,
                      flyingFeeling === feeling.id && styles.selectedFlyingFeeling,
                      flyingFeeling === feeling.id && styles.selectedShadow,
                      { borderColor: feeling.color }
                    ]}
                    onPress={() => setFlyingFeeling(feeling.id)}
                  >
                    <Text style={styles.flyingFeelingEmoji}>{feeling.emoji}</Text>
                    <Text style={[
                      styles.flyingFeelingText,
                      flyingFeeling === feeling.id && styles.selectedFlyingFeelingText
                    ]}>
                      {feeling.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {currentStep === 1 && (
              <View style={styles.feelingsContainer}>
                <View style={styles.feelingsGrid}>
                  {FEELINGS.map((feeling, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.feelingButton,
                        selectedFeelings.includes(feeling.text) && styles.selectedFeeling,
                        selectedFeelings.includes(feeling.text) && styles.selectedShadow
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
            )}

            {currentStep === 2 && (
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={overallFeelings}
                onChangeText={setOverallFeelings}
                placeholder="Share your thoughts about flying today..."
                placeholderTextColor={colors.textSecondary}
              />
            )}

            {currentStep === 3 && (
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={concerns}
                onChangeText={setConcerns}
                placeholder="What aspects of flying are concerning you?"
                placeholderTextColor={colors.textSecondary}
              />
            )}

            {currentStep === 4 && (
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={gratitude}
                onChangeText={setGratitude}
                placeholder="What are you feeling grateful for today?"
                placeholderTextColor={colors.textSecondary}
              />
            )}

            {currentStep === 5 && (
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional thoughts or reflections..."
                placeholderTextColor={colors.textSecondary}
              />
            )}

            {/* Continue Button - Positioned right below the content */}
            <View style={styles.continueButtonContainer}>
              <TouchableOpacity
                style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
                onPress={handleNext}
                disabled={!canProceed()}
              >
                <LinearGradient
                  colors={canProceed() ? colors.gradient.primary as any : [colors.border, colors.border]}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.continueButtonText, !canProceed() && styles.continueButtonTextDisabled]}>
                    {currentStep === 5 ? 'Save Entry' : 'Continue'}
                  </Text>
                  {currentStep < 5 && (
                    <ChevronRight size={16} color={canProceed() ? '#ffffff' : colors.textSecondary} strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Modern Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).springify()}
      >
        <LinearGradient
          colors={colors.gradient.secondary as any}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {(showNewEntry || showEntryView) && (
              <TouchableOpacity 
                onPress={() => {
                  setShowNewEntry(false);
                  setShowEntryView(null);
                  resetForm();
                }}
                style={styles.headerBackButton}
              >
                <ChevronLeft size={24} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {showEntryView ? 'Journal Entry' : showNewEntry ? 'New Entry' : 'Journal'}
              </Text>
              <Text style={styles.subtitle}>
                {showEntryView || showNewEntry ? formatDate(selectedDate) : 'Track how you\'re feeling'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {showEntryView ? (
        <JournalEntryView entry={showEntryView} />
      ) : showNewEntry ? (
        renderNewEntry()
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCalendar()}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  newEntryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
    }),
  },
  newEntryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  newEntryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  calendar: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 2,
  },
  dayWithEntry: {
    backgroundColor: colors.backgroundSecondary,
  },
  dayWithEntryPast: {
    backgroundColor: colors.border,
  },
  dayToday: {
    backgroundColor: colors.primary,
  },
  dayTodayWithEntry: {
    backgroundColor: colors.primary,
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text,
  },
  dayWithEntryText: {
    color: colors.primary,
    fontFamily: 'Inter-Medium',
  },
  dayWithEntryTextPast: {
    color: colors.textSecondary,
    fontFamily: 'Inter-Medium',
  },
  dayTodayText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  dayTodayWithEntryText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  entryIndicator: {
    marginTop: 2,
  },
  newEntry: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
  progressContainer: {
    flex: 1,
  },
  stepIndicator: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
  },
  step: {
    marginBottom: 24,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 30,
  },
  stepSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  flyingFeelingsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  flyingFeelingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  selectedFlyingFeeling: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
  },
  selectedShadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  flyingFeelingEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  flyingFeelingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectedFlyingFeelingText: {
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  feelingsContainer: {
    paddingBottom: 20,
    marginBottom: 32,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  feelingButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  selectedFeeling: {
    backgroundColor: colors.primary,
  },
  feelingEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  feelingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.text,
    textAlign: 'center',
  },
  selectedFeelingText: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  continueButtonContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  continueButtonDisabled: {
    opacity: 0.5,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowOpacity: 0.2,
      },
    }),
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: colors.textSecondary,
  },
  bottomSpacing: {
    height: 100,
  },
});