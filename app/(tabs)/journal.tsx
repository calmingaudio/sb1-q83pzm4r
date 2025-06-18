// app/(tabs)/journal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/Colors";
import Animated, { FadeIn } from "react-native-reanimated";
import JournalEntryView from "@/components/journal/JournalEntryView";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const JOURNAL_STORAGE_KEY = "@SkyCalm:journalEntries";

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
        if (storedEntries !== null) {
          setEntries(JSON.parse(storedEntries));
        } else {
          // If no entries are stored, load the mock one as a default
          setEntries(MOCK_ENTRIES);
        }
      } catch (e) {
        console.error("Failed to load journal entries.", e);
        // Fallback to mock entries on error
        setEntries(MOCK_ENTRIES);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

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
    setSelectedDate(date);
    const entry = entries.find(
      (e) => e.date === date.toISOString().split("T")[0]
    );
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

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split("T")[0],
        feelings: selectedFeelings,
        overallFeelings,
        concerns,
        gratitude,
        notes,
      };

      try {
        const updatedEntries = [...entries, newEntry];
        setEntries(updatedEntries); // Update state
        // Save the entire updated array to storage
        await AsyncStorage.setItem(
          JOURNAL_STORAGE_KEY,
          JSON.stringify(updatedEntries)
        );
      } catch (e) {
        console.error("Failed to save journal entry.", e);
      }

      // Reset and return to calendar
      setShowNewEntry(false);
      setCurrentStep(1);
      setSelectedFeelings([]);
      setOverallFeelings("");
      setConcerns("");
      setGratitude("");
      setNotes("");
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
      const today = new Date();

      return (
        <View style={styles.calendar}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <ChevronLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <ChevronRight size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              if (!day) {
                return <View key={index} style={styles.day} />; // Empty cell
              }
              const isSelected =
                day.toDateString() === selectedDate.toDateString();
              const isToday = day.toDateString() === today.toDateString();
              const hasEntry = hasEntryForDate(day);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.day, isSelected && styles.selectedDay]}
                  onPress={() => handleDateSelect(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected ? styles.selectedDayText : isToday && styles.todayText,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {hasEntry && <View style={styles.entryIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    };

  const renderNewEntry = () => {
    return (
      <Animated.View
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
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <LinearGradient
        colors={Colors.light.gradient.primary as any}
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
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.light.primary}
              style={{ marginTop: 50 }}
            />
          ) : showNewEntry ? (
            renderNewEntry()
          ) : (
            renderCalendar()
          )}
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
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 44,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  calendar: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Colors.light.text,
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  day: {
    width: `${100 / 7}%`, // Ensure 7 columns
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning of the dot
  },
  selectedDay: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12, // Make it a squircle
  },
  dayText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedDayText: {
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
  },
  todayText: {
    // Style for today's date (if not selected)
    fontFamily: "Inter-SemiBold",
    color: Colors.light.primary,
  },
  entryIndicator: {
    position: "absolute",
    bottom: 6, // Position dot below the number
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
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
    paddingBottom: 80,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 16,
    paddingBottom: 16,
  },
  feelingButton: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 4,
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
    marginBottom: 4,
  },
  feelingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
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
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  selectedEntryIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});