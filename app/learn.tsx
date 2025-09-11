import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, BookOpen, TrendingUp } from 'lucide-react-native';
import BackButton from '@/components/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/components/ThemeProvider';
import { faqCategories } from '@/constants/LearnContent';
import CategoryCard from '@/components/learn/CategoryCard';
import FAQItem from '@/components/learn/FAQItem';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FAQCategory {
  id: string;
  title: string;
  description: string;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export default function LearnScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedFAQ, setHighlightedFAQ] = useState<string | null>(null);
  
  // Get URL parameters for deep linking
  const params = useLocalSearchParams();
  const { category: categoryParam, faq: faqParam } = params;

  useEffect(() => {
    // Handle deep linking from Featured section
    if (categoryParam && faqParam) {
      const targetCategory = faqCategories.find(cat => cat.id === categoryParam);
      if (targetCategory) {
        setSelectedCategory(targetCategory);
        setHighlightedFAQ(faqParam as string);
        
        // Clear highlight after a delay
        setTimeout(() => {
          setHighlightedFAQ(null);
        }, 3000);
      }
    } else if (categoryParam) {
      const targetCategory = faqCategories.find(cat => cat.id === categoryParam);
      if (targetCategory) {
        setSelectedCategory(targetCategory);
      }
    }
  }, [categoryParam, faqParam]);
  
  const handleCategoryPress = (category: FAQCategory) => {
    setSelectedCategory(category);
    setHighlightedFAQ(null); // Clear any highlights when manually selecting category
  };
  
  const handleBackPress = () => {
    setSelectedCategory(null);
    setHighlightedFAQ(null);
  };

  const styles = createStyles(colors);
  
  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Modern Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).springify()}
      >
        <LinearGradient
          colors={colors.gradient.accent as any}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {selectedCategory ? (
              <View style={styles.categoryHeaderContent}>
                <BackButton color="#ffffff" onPress={handleBackPress} />
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>{selectedCategory.title}</Text>
                  <Text style={styles.categorySubtitle}>{selectedCategory.description}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.mainHeaderContent}>
                <BackButton color="#ffffff" />
                <View style={styles.titleSection}>
                  <Text style={styles.title}>Learn & Explore</Text>
                  <Text style={styles.subtitle}>Understanding flight reduces anxiety</Text>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedCategory ? (
          <Animated.View 
            entering={FadeIn.delay(200)}
            exiting={FadeOut}
            style={styles.faqSection}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqSectionTitle}>
                {selectedCategory.faqs.length} Questions & Answers
              </Text>
              <Text style={styles.faqSectionSubtitle}>
                Tap any question to learn more
              </Text>
            </View>
            
            <View style={styles.faqList}>
              {selectedCategory.faqs.map((faq, index) => (
                <FAQItem 
                  key={faq.id} 
                  faq={faq} 
                  index={index}
                />
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeIn.delay(200)}
            exiting={FadeOut}
            style={styles.categoriesSection}
          >
            {/* Did You Know Section - Moved to Top */}
            <Animated.View 
              style={styles.didYouKnowSection}
              entering={FadeInDown.delay(300).springify()}
            >
              <LinearGradient
                colors={[colors.accent, '#f97316']}
                style={styles.didYouKnowCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.didYouKnowContent}>
                  <View style={styles.didYouKnowIcon}>
                    <Text style={styles.didYouKnowEmoji}>💡</Text>
                  </View>
                  <View style={styles.didYouKnowText}>
                    <Text style={styles.didYouKnowTitle}>Did You Know?</Text>
                    <Text style={styles.didYouKnowDescription}>
                      80% of people with flight anxiety say that learning about aviation significantly reduces their fear
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Search and Filter Section */}
            <Animated.View 
              style={styles.searchSection}
              entering={FadeInDown.delay(400).springify()}
            >
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.searchPlaceholder}>Search topics...</Text>
                </View>
                <TouchableOpacity style={styles.filterButton}>
                  <Filter size={20} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Popular Topics */}
            <Animated.View 
              style={styles.popularSection}
              entering={FadeInDown.delay(500).springify()}
            >
              <Text style={styles.sectionTitle}>Popular Topics</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.popularScroll}
                contentContainerStyle={styles.popularContent}
              >
                {['Turbulence', 'Safety', 'Takeoff', 'Sounds'].map((topic, index) => (
                  <TouchableOpacity key={topic} style={styles.popularTag}>
                    <Text style={styles.popularTagText}>{topic}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Categories Grid */}
            <Animated.View 
              style={styles.categoriesGrid}
              entering={FadeInDown.delay(600).springify()}
            >
              <Text style={styles.sectionTitle}>All Categories</Text>
              <Text style={styles.sectionSubtitle}>
                Explore comprehensive guides on every aspect of flying
              </Text>
              
              <View style={styles.categoriesList}>
                {faqCategories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onPress={() => handleCategoryPress(category)}
                    index={index}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
        )}

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
    minHeight: 80,
    justifyContent: 'center',
  },
  categoryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  titleSection: {
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  didYouKnowSection: {
    marginBottom: 32,
  },
  didYouKnowCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  didYouKnowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  didYouKnowIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  didYouKnowEmoji: {
    fontSize: 24,
  },
  didYouKnowText: {
    flex: 1,
  },
  didYouKnowTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  didYouKnowDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  searchSection: {
    marginBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  popularScroll: {
    marginHorizontal: -20,
  },
  popularContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  popularTag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
  },
  categoriesGrid: {
    marginBottom: 32,
  },
  categoriesSection: {
    flex: 1,
  },
  categoriesList: {
    gap: 16,
  },
  faqSection: {
    flex: 1,
  },
  faqHeader: {
    marginBottom: 24,
  },
  faqSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  faqSectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  faqList: {
    gap: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});