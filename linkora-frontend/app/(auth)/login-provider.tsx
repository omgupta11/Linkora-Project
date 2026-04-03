import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { formatAuthError } from "../../lib/auth-errors";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { colors, spacing, radius, shadows } from "../../constants/colors";

export default function LoginProvider() {
  const router = useRouter();
  const { loginProvider, loading: authLoading, user } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ===== AUTO-REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
    if (user) {
      console.log("📍 User already logged in as:", user.role);
      router.replace("/(provider)/dashboard");
    }
  }, [user, router]);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  async function handleLogin() {
    setSubmitted(true);
    
    if (!usernameOrEmail.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email/username and password");
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginProvider(usernameOrEmail.trim().toLowerCase(), password.trim());
      
      if (!result.success) {
        Alert.alert("Login Failed", formatAuthError(result.error) || "Invalid credentials");
      }
      // Navigation happens in AuthContext on success via router.replace()
    } catch (e: any) {
      Alert.alert(
        "Login Failed",
        e?.message || "Network error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Ionicons
            name="briefcase-outline"
            size={42}
            color={colors.primary}
          />
          <Text style={styles.title}>Provider Login</Text>
          <Text style={styles.subtitle}>
            Manage your business & bookings
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Username *</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "usernameOrEmail" && styles.inputFocused,
              ]}
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="business@example.com or username"
              placeholderTextColor="#6B7280"
              editable={!isLoading && !authLoading}
              onFocus={() => setFocusedField("usernameOrEmail")}
              onBlur={() => setFocusedField(null)}
            />
            {submitted && !usernameOrEmail && (
              <Text style={styles.error}>Email/Username required</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <View style={[
              styles.passwordContainer,
              focusedField === "password" && styles.inputFocused,
            ]}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor="#6B7280"
                editable={!isLoading && !authLoading}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {submitted && !password && (
              <Text style={styles.error}>Password required</Text>
            )}
          </View>
        </View>

        <Animated.View style={animatedStyle}>
          <Pressable
            style={[styles.primaryButton, (isLoading || authLoading) && styles.disabledButton]}
            onPress={handleLogin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isLoading || authLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading || authLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>
        </Animated.View>

        <Pressable 
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.linkContainer}
          disabled={isLoading || authLoading}
        >
          <Text style={styles.linkText}>Forgot password?</Text>
        </Pressable>

        <Pressable 
          onPress={() => router.push("/(auth)/register-provider")}
          style={styles.linkContainer}
          disabled={isLoading || authLoading}
        >
          <Text style={styles.linkAltText}>
            Don&apos;t have an account? <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
  },
  header: {
    marginTop: 40,
    marginBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
  form: { 
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  passwordInput: {
    flex: 1,
    height: 52,
    color: colors.textPrimary,
    fontSize: 16,
  },
  error: { 
    color: colors.accent, 
    fontSize: 12, 
    marginTop: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  linkAltText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkHighlight: {
    color: colors.primary,
    fontWeight: "600",
  },
});