import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane, Wind, Shield, Heart, ArrowRight, Brain, Clock, Star } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const features = [
  {
    icon: Wind,
    title: 'Breathing Exercises',
    description: 'Proven techniques to calm your mind during flights',
    gradient: ['#6366f1', '#8b5cf6'],
  },
  {
    icon: Brain,
    title: 'Guided Meditations',
    description: 'Tailored meditations for every stage of your journey',
    gradient: ['#8b5cf6', '#a855f7'],
  },
  {
    icon: Shield,
    title: 'Emergency SOS',
    description: 'Instant relief when anxiety peaks',
    gradient: ['#ef4444', '#f87171'],
  },
  {
    icon: Heart,
    title: 'Flight Education',
    description: 'Learn why flying is the safest way to travel',
    gradient: ['#10b981', '#34d399'],
  },
];

const meditationStages = [
  {
    icon: Clock,
    title: 'Days Leading Up',
    description: 'Prepare mentally for your upcoming flight',
    gradient: ['#f59e0b', '#f97316'],
  },
  {
    icon: Plane,
    title: 'Pre-Flight',
    description: 'Calm your nerves at the airport and before boarding',
    gradient: ['#06b6d4', '#0ea5e9'],
  },
  {
    icon: Star,
    title: 'Mid-Flight',
    description: 'Emergency meditations when panic kicks in during flight',
    gradient: ['#ef4444', '#f87171'],
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'SkyCalm helped me take my first flight in 10 years. The breathing exercises really work!',
    rating: 5,
  },
  {
    name: 'Mike R.',
    text: 'The education section completely changed my perspective on flying. I actually enjoy flights now.',
    rating: 5,
  },
  {
    name: 'Emma L.',
    text: 'The SOS feature saved me during a turbulent flight. This app is a lifesaver.',
    rating: 5,
  },
];

export default function WelcomeScreen() {
  const { colors } = useTheme();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View 
          style={styles.heroSection}
          entering={FadeInUp.delay(200).springify()}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#a855f7']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <Plane size={48} color="#ffffff" strokeWidth={2.5} />
              </View>
              <Text style={styles.heroTitle}>SkyCalm</Text>
              <Text style={styles.heroSubtitle}>
                Your companion for peaceful flights and anxiety relief
              </Text>
              
              {/* Top Get Started Button */}
              <Animated.View 
                style={styles.topCtaContainer}
                entering={FadeInDown.delay(400).springify()}
              >
                <TouchableOpacity
                  style={styles.topGetStartedButton}
                  onPress={handleGetStarted}
                >
                  <LinearGradient
                    colors={['#10b981', '#34d399']}
                    style={styles.topGetStartedGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.topGetStartedText}>Get Started</Text>
                    <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.topSignInButton} 
                  onPress={handleSignIn}
                >
                  <Text style={styles.topSignInText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.delay(500).springify()}
          >
            Everything you need to fly with confidence
          </Animated.Text>
          
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={styles.featureCard}
              entering={FadeInRight.delay(600 + index * 100).springify()}
            >
              <LinearGradient
                colors={feature.gradient}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIcon}>
                  <feature.icon size={32} color="#ffffff" strokeWidth={2.5} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Meditation Stages Section */}
        <View style={styles.meditationSection}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.delay(1000).springify()}
          >
            Guided Meditations for Every Stage
          </Animated.Text>
          <Animated.Text 
            style={styles.sectionSubtitle}
            entering={FadeInDown.delay(1050).springify()}
          >
            Specialized meditations designed for your complete flying journey
          </Animated.Text>
          
          {meditationStages.map((stage, index) => (
            <Animated.View
              key={index}
              style={styles.meditationCard}
              entering={FadeInDown.delay(1100 + index * 100).springify()}
            >
              <LinearGradient
                colors={stage.gradient}
                style={styles.meditationGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.meditationIcon}>
                  <stage.icon size={28} color="#ffffff" strokeWidth={2.5} />
                </View>
                <View style={styles.meditationContent}>
                  <Text style={styles.meditationTitle}>{stage.title}</Text>
                  <Text style={styles.meditationDescription}>{stage.description}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.delay(1500).springify()}
          >
            Trusted by thousands of travelers
          </Animated.Text>
          
          {testimonials.map((testimonial, index) => (
            <Animated.View
              key={index}
              style={styles.testimonialCard}
              entering={FadeInDown.delay(1600 + index * 100).springify()}
            >
              <View style={styles.testimonialHeader}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} color="#fbbf24" fill="#fbbf24" strokeWidth={1} />
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
            </Animated.View>
          ))}
        </View>

        {/* Bottom CTA Section */}
        <Animated.View 
          style={styles.ctaSection}
          entering={FadeInDown.delay(1900).springify()}
        >
          <Text style={styles.ctaTitle}>Ready to overcome your flight anxiety?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands who've found peace in the skies
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <LinearGradient
              colors={['#10b981', '#34d399']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.textButton} onPress={handleSignIn}>
            <Text style={styles.textButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Free to start • Premium features available • Secure & private
          </Text>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  topCtaContainer: {
    width: '100%',
    alignItems: 'center',
  },
  topGetStartedButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
    }),
  },
  topGetStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  topGetStartedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  topSignInButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  topSignInText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textDecorationLine: 'underline',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featureCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
    }),
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  meditationSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  meditationCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  meditationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  meditationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  meditationContent: {
    flex: 1,
  },
  meditationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  meditationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  testimonialsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  testimonialCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  ctaSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    width: '100%',
    backgroundColor: '#10b981', // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  textButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
});