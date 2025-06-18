import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { router, useNavigation } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const initialSlides = [
  {
    id: 1,
    title: "This feeling won't last forever",
    subtitle: "Most panic peaks within minutes—relief is already on its way",
    gradient: ['#E0EAFC', '#CFDEF3']
  },
  {
    id: 2,
    title: "What feels overwhelming will soon pass",
    subtitle: "You're experiencing a wave. Like all waves, this one will recede",
    gradient: ['#E6DADA', '#274046']
  },
  {
    id: 3,
    title: "Anxiety has a ceiling",
    subtitle: "It may rise, but it can't keep climbing. You're closer to calm than you think",
    gradient: ['#2BC0E4', '#EAECC6']
  },
  {
    id: 4,
    title: "These are just physical sensations",
    subtitle: "They might be loud, but they don't control you—and they cannot harm you",
    gradient: ['#C9D6FF', '#E2E2E2']
  },
  {
    id: 5,
    title: "Your body knows how to get through this",
    subtitle: "It's built to protect you—even when things feel uncertain",
    gradient: ['#F3E7E9', '#E3EEFF']
  },
  {
    id: 6,
    title: "Trust in your own strength",
    subtitle: "Even discomfort is something your body can handle. You are safe here",
    gradient: ['#E0EAFC', '#CFDEF3']
  },
  {
    id: 7,
    title: "Check in with yourself",
    subtitle: "Are things starting to ease?",
    gradient: ['#E6DADA', '#274046']
  }
];

const alternateSlides = [
  {
    id: 1,
    title: "This storm in your body will settle",
    subtitle: "It feels big now, but it will shrink. Every storm passes",
    gradient: ['#E0EAFC', '#CFDEF3']
  },
  {
    id: 2,
    title: "This fear isn't permanent",
    subtitle: "Your thoughts and body are reacting to stress—not to real danger. It will fade",
    gradient: ['#E6DADA', '#274046']
  },
  {
    id: 3,
    title: "Panic rises, then releases",
    subtitle: "Your body won't stay in this state. It's designed to return to balance",
    gradient: ['#2BC0E4', '#EAECC6']
  },
  {
    id: 4,
    title: "Your sensations are loud, not dangerous",
    subtitle: "Shaky hands, racing heart—these are stress signals, not warnings. They will quiet soon",
    gradient: ['#C9D6FF', '#E2E2E2']
  },
  {
    id: 5,
    title: "You've felt this before—and made it through",
    subtitle: "You've handled discomfort before, even when it felt like too much. You're doing it again now",
    gradient: ['#F3E7E9', '#E3EEFF']
  },
  {
    id: 6,
    title: "Your nervous system is doing its job",
    subtitle: "It's reacting fast—but it will settle down. You are safe while it resets",
    gradient: ['#E0EAFC', '#CFDEF3']
  },
  {
    id: 7,
    title: "Take a moment. How are you now?",
    subtitle: "Is there space inside you again?",
    gradient: ['#E6DADA', '#274046']
  }
];

export default function SOSScreen() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSlides, setShowSlides] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAlternateSet, setIsAlternateSet] = useState(false);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowWelcome(true);
      setShowSlides(false);
      setCurrentSlide(1);
      setIsAlternateSet(false);
    });

    return unsubscribe;
  }, [navigation]);

  const slides = isAlternateSet ? alternateSlides : initialSlides;

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(currentSlide + 1);
      scrollViewRef.current?.scrollTo({ x: (currentSlide) * SCREEN_WIDTH, animated: true });
    }
  };

  const handleRestart = () => {
    setIsAlternateSet(!isAlternateSet);
    setCurrentSlide(1);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleGotoBreathe = () => {
    router.push('/(tabs)/breathe');
  };

  const handleFeelingSelection = (feelingGood: boolean) => {
    if (feelingGood) {
      handleGotoBreathe();
    } else {
      setShowWelcome(false);
      setShowSlides(true);
    }
  };

  if (showWelcome) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <LinearGradient
          colors={Colors.light.gradient.primary}
          style={styles.welcomeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={styles.welcomeContent}
            entering={FadeInDown.delay(300).springify()}
          >
            <Text style={styles.welcomeTitle}>
              🆘 SOS Support
            </Text>
            <Text style={styles.welcomeText}>
              You're in a safe space. Let these steps walk you out of panic and into peace...
            </Text>
            
            <Text style={styles.welcomeQuestion}>
              How are you feeling right now?
            </Text>

            <View style={styles.feelingButtons}>
              <TouchableOpacity
                style={[styles.feelingButton, styles.notGoodButton]}
                onPress={() => handleFeelingSelection(false)}
              >
                <Text style={styles.notGoodButtonText}>😔 Not Good - I Need Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.feelingButton, styles.feelingGoodButton]}
                onPress={() => handleFeelingSelection(true)}
              >
                <Text style={styles.feelingGoodButtonText}>😊 I'm Okay - Take Me to Breathe</Text>
              </TouchableOpacity>
            </View>

            {/* Disclaimer Section */}
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                This feature is for emotional support and is not a substitute
                for professional medical advice. If you are in a crisis or
                believe you are having a medical emergency, please contact a
                healthcare professional or emergency services.
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!showSlides) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {slides.map((slide, index) => (
          <Animated.View 
            key={slide.id}
            style={[styles.slide, { width: SCREEN_WIDTH }]}
            entering={FadeIn.delay(300)}
          >
            <LinearGradient
              colors={slide.gradient}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.content}>
                <Animated.View 
                  style={styles.textContainer}
                  entering={FadeInDown.delay(500)}
                >
                  <Text style={styles.title}>
                    {slide.title}
                  </Text>
                  <Text style={styles.subtitle}>
                    {slide.subtitle}
                  </Text>
                </Animated.View>

                {currentSlide === slides.length ? (
                  <View style={styles.finalButtons}>
                    <AnimatedTouchableOpacity
                      style={[styles.button, styles.restartButton]}
                      onPress={handleRestart}
                      entering={FadeInDown.delay(1000)}
                    >
                      <Text style={[styles.buttonText, styles.restartButtonText]}>
                        {isAlternateSet ? '🔄 Not Yet - Try Different Words' : '🔄 Not Yet - Start Over'}
                      </Text>
                    </AnimatedTouchableOpacity>
                    <AnimatedTouchableOpacity
                      style={[styles.button, styles.breatheButton]}
                      onPress={handleGotoBreathe}
                      entering={FadeInDown.delay(1200)}
                    >
                      <Text style={styles.buttonText}>
                        💨 Yes - Let's Practice Breathing
                      </Text>
                    </AnimatedTouchableOpacity>
                  </View>
                ) : (
                  <AnimatedTouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                    entering={FadeInDown.delay(1000)}
                  >
                    <Text style={styles.buttonText}>➡️ Next Step</Text>
                  </AnimatedTouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.progressDots}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index + 1 && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  welcomeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  welcomeQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  feelingButtons: {
    width: '100%',
    gap: 16,
  },
  feelingButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  notGoodButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  feelingGoodButton: {
    backgroundColor: '#ffffff',
  },
  notGoodButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  feelingGoodButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  disclaimerContainer: {
    marginTop: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
  },
  disclaimerText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 18,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: SCREEN_HEIGHT * 0.1,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'left',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'left',
    lineHeight: 24,
    opacity: 0.8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 200,
    marginTop: 40,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  finalButtons: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  restartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  restartButtonText: {
    color: '#ffffff',
  },
  breatheButton: {
    backgroundColor: Colors.light.primary,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.border,
  },
  activeDot: {
    backgroundColor: Colors.light.primary,
    width: 12,
  },
});