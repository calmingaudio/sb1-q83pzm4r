import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { faqCategories } from '@/constants/LearnContent';
import CategoryCard from '@/components/learn/CategoryCard';
import FAQItem from '@/components/learn/FAQItem';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };
  
  const handleBackPress = () => {
    setSelectedCategory(null);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {selectedCategory ? (
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedCategory.title}</Text>
              <Text style={styles.subtitle}>{selectedCategory.description}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerContent}>
            <Text style={styles.title}>Learn</Text>
            <Text style={styles.subtitle}>
              Understanding flight helps reduce anxiety
            </Text>
          </View>
        )}
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory ? (
          <Animated.View 
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.faqList}
          >
            {selectedCategory.faqs.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} index={index} />
            ))}
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.categoriesList}
          >
            {faqCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
                index={index}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
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
  categoriesList: {
    marginBottom: 20,
  },
  faqList: {
    marginBottom: 20,
  },
});