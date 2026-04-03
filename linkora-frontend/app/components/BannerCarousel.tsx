import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, shadows } from "../../constants/colors";

const { width } = Dimensions.get("window");

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
  icon: string;
}

interface BannerCarouselProps {
  onBannerPress?: (banner: Banner) => void;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "1",
    title: "Summer Special",
    subtitle: "50% Off on Services",
    gradient: ["#2563EB", "#1D4ED8"],
    icon: "flash",
  },
  {
    id: "2",
    title: "First Time",
    subtitle: "Extra ₹100 Off",
    gradient: ["#22C55E", "#16A34A"],
    icon: "gift",
  },
  {
    id: "3",
    title: "Refer & Earn",
    subtitle: "₹500 Cashback",
    gradient: ["#EF4444", "#DC2626"],
    icon: "people",
  },
  {
    id: "4",
    title: "Premium Plus",
    subtitle: "Get Premium Membership",
    gradient: ["#8B5CF6", "#7C3AED"],
    icon: "star",
  },
];

export default function BannerCarousel({
  onBannerPress,
}: BannerCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / (width - spacing.lg * 2));
    setScrollIndex(currentIndex);
  };

  return (
    <View style={styles.container}>
      {/* Banners Scroll */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {DEFAULT_BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={styles.bannerCard}
            onPress={() => onBannerPress?.(banner)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={banner.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBg}
            >
              {/* Background Icon */}
              <View style={styles.bgIcon}>
                <Ionicons
                  name={banner.icon as any}
                  size={100}
                  color="rgba(255, 255, 255, 0.15)"
                />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.subtitle}>{banner.subtitle}</Text>
              </View>

              {/* Arrow Icon */}
              <View style={styles.arrowContainer}>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {DEFAULT_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === scrollIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  scrollView: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  bannerCard: {
    width: width - spacing.lg * 2,
    height: 160,
    marginHorizontal: spacing.sm,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  gradientBg: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bgIcon: {
    position: "absolute",
    right: -20,
    top: -20,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  arrowContainer: {
    marginLeft: spacing.md,
    zIndex: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
