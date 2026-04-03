/**
 * Category Grid Component (Justdial Style)
 * app/components/CategoryGrid.tsx
 * 
 * Features:
 * - 4-column grid layout
 * - Icon + label for each category
 * - White cards with soft shadows
 * - Touch feedback
 * - Navigation to filtered services
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors, spacing, radius, shadows } from "../../constants/colors";

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface CategoryGridProps {
  categories?: Category[];
  onCategoryPress?: (category: Category) => void;
  numColumns?: number;
}

// Default categories (Justdial style)
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "electrician",
    name: "Electrician",
    icon: "flash",
    color: "#FDB022",
  },
  {
    id: "plumber",
    name: "Plumber",
    icon: "water",
    color: "#2563EB",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    icon: "sparkles",
    color: "#10B981",
  },
  {
    id: "salon",
    name: "Salon",
    icon: "cut",
    color: "#EC4899",
  },
  {
    id: "ac_repair",
    name: "AC Repair",
    icon: "snow",
    color: "#06B6D4",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    icon: "hammer",
    color: "#8B5CF6",
  },
  {
    id: "painter",
    name: "Painter",
    icon: "brush",
    color: "#F97316",
  },
  {
    id: "pest_control",
    name: "Pest Control",
    icon: "shield-checkmark",
    color: "#EF4444",
  },
];

const { width } = Dimensions.get("window");

export default function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
  onCategoryPress,
  numColumns = 4,
}: CategoryGridProps) {
  const router = useRouter();

  const handleCategoryPress = (category: Category) => {
    console.log(`📂 Selected category: ${category.name}`);

    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Default navigation to filtered services
      router.push({
        pathname: "/(consumer)/services",
        params: { category: category.id, categoryName: category.name },
      });
    }
  };

  // ===== RENDER CATEGORY ITEM =====
  const renderCategoryItem = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 50)}
      style={styles.itemContainer}
    >
      <Pressable
        onPress={() => handleCategoryPress(item)}
        style={({ pressed }) => [
          styles.categoryCard,
          pressed && styles.cardPressed,
        ]}
      >
        {/* Icon Container */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${item.color}20` }, // 20% opacity
          ]}
        >
          <Ionicons name={item.icon} size={32} color={item.color} />
        </View>

        {/* Label */}
        <Text style={styles.categoryLabel} numberOfLines={2}>
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );

  const itemWidth = (width - spacing.lg * 2 - spacing.sm * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderCategoryItem}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ===== MAIN CONTAINER =====
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // ===== COLUMN WRAPPER =====
  columnWrapper: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemSeparator: {
    height: spacing.sm,
  },

  // ===== ITEM CONTAINER =====
  itemContainer: {
    flex: 1,
    maxWidth: "25%",
  },

  // ===== CATEGORY CARD =====
  categoryCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  // ===== ICON CONTAINER =====
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  // ===== CATEGORY LABEL =====
  categoryLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
});
