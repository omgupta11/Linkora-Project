/**
 * Header Component (Justdial Style)
 * app/components/Header.tsx
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius, shadows } from "../../constants/colors";

interface HeaderProps {
  showLocation?: boolean;
  location?: string;
  showAuthButtons?: boolean;
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
}

export default function Header({
  showLocation = false,
  location = "Kanpur",
  showAuthButtons = true,
  onLoginPress,
  onSignUpPress,
}: HeaderProps) {
  const router = useRouter();

  const handleLoginPress = onLoginPress || (() => router.push("/role-select?role=consumer"));
  const handleSignUpPress = onSignUpPress || (() => router.push("/(auth)/register-consumer"));

  return (
    <View>
      {/* Main Header Bar */}
      <View style={styles.headerBar}>
        {/* LEFT: Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            <Text style={styles.logoBlue}>Link</Text>
            <Text style={styles.logoGreen}>ora</Text>
          </Text>
        </View>

        {/* RIGHT: Auth Buttons */}
        {showAuthButtons && (
          <View style={styles.authContainer}>
            <Pressable
              onPress={handleLoginPress}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable
              onPress={handleSignUpPress}
              style={({ pressed }) => [
                styles.signUpButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Optional Location Bar */}
      {showLocation && (
        <View style={styles.locationBar}>
          <Text style={styles.locationLabel}>📍 </Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ===== HEADER BAR =====
  headerBar: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // ===== LOGO =====
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  logoBlue: {
    color: colors.secondary,
  },
  logoGreen: {
    color: colors.primary,
  },

  // ===== AUTH BUTTONS =====
  authContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  loginButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  signUpButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  signUpButtonText: {
    color: colors.textInverse,
    fontWeight: "600",
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.8,
  },

  // ===== LOCATION BAR =====
  locationBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  locationLabel: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  locationText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
});
