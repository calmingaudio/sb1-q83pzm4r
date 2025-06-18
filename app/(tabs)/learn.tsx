import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ColorValue
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets, // Import useSafeAreaInsets
} from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { faqCategories } from "@/constants/LearnContent";
import CategoryCard from "@/components/learn/CategoryCard";
import FAQItem from "@/components/learn/FAQItem";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const insets = useSafeAreaInsets();

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleBackPress = () => {
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <LinearGradient
        colors={Colors.light.gradient.primary as [ColorValue, ColorValue, ...ColorValue[]]}
        style={[
          styles.header,
        ]}
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
              <Text style={styles.subtitle}>
                {selectedCategory.description}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Learn</Text>
              <Text style={styles.subtitle}>
                Understanding flight helps reduce anxiety
              </Text>
            </View>
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

        {/* Medical Disclaimer Section */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            SkyCalm is intended for relaxation, reflection, and spiritual
            encouragement. It is not a substitute for professional medical
            advice, diagnosis, or treatment. Always seek the advice of your
            physician or qualified mental health provider with any questions
            you may have regarding a medical condition or mental health
            concern. Never disregard professional advice or delay seeking it
            because of content provided in this app.
          </Text>
        </View>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 44,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
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
    padding: 20, // This padding is for the content area below the header
  },
  categoriesList: {
    marginBottom: 20,
  },
  faqList: {
    marginBottom: 20,
  },
  disclaimerContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  disclaimerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});