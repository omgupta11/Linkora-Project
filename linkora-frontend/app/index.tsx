import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, shadows } from "../constants/colors";

const { height } = Dimensions.get("window");

export default function Landing() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const scaleConsumer = useSharedValue(1);
  const scaleProvider = useSharedValue(1);

  const consumerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleConsumer.value }],
  }));

  const providerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleProvider.value }],
  }));

  // ===== AUTO-REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
    if (!loading && user) {
      console.log("🏠 Landing: User already authenticated as", user.role);
      if (user.role === "provider") {
        router.replace("/(provider)/dashboard");
      } else {
        router.replace("/(consumer)/home");
      }
    }
  }, [user, loading, router]);

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.logo}>Linkora</Text>
        <Text style={styles.tagline}>Where Every Purchase Pays Back</Text>
        <Text style={styles.description}>
          Linkora connects consumers with trusted local businesses and empowers
          service providers with visibility, transparency, and growth.
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.features}>
        <Text style={styles.feature}>• Discover verified local businesses</Text>
        <Text style={styles.feature}>• Transparent pricing & services</Text>
        <Text style={styles.feature}>• Earn rewards on every booking</Text>
        <Text style={styles.feature}>• Grow your business with trust</Text>
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Animated.View style={consumerStyle}>
          <Pressable
            onPress={() => router.push("/role-select?role=consumer")}
            onPressIn={() => (scaleConsumer.value = withSpring(1.05))}
            onPressOut={() => (scaleConsumer.value = withSpring(1))}
            style={[styles.button, styles.consumer]}
          >
            <Text style={styles.buttonText}>Continue as Consumer</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={providerStyle}>
          <Pressable
            onPress={() => router.push("/role-select?role=provider")}
            onPressIn={() => (scaleProvider.value = withSpring(1.05))}
            onPressOut={() => (scaleProvider.value = withSpring(1))}
            style={[styles.button, styles.provider]}
          >
            <Text style={styles.buttonText}>Continue as Provider</Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.12,
  },
  hero: { marginBottom: spacing.xl },
  logo: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  features: { marginBottom: spacing.xl },
  feature: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cta: {
    marginTop: "auto",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  button: {
    height: 52,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    ...shadows.md,
  },
  consumer: { backgroundColor: colors.primary },
  provider: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
});
