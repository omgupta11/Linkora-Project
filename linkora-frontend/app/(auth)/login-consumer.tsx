// app/(auth)/login-consumer.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  View
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { formatAuthError } from "../../lib/auth-errors";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { colors, spacing, radius, shadows } from "../../constants/colors";

export default function LoginConsumer() {
  const router = useRouter();
  const { loginConsumer, loading: authLoading, user } = useAuth();
  
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ===== AUTO-REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
    if (user) {
      console.log("📍 User already logged in as:", user.role);
      router.replace("/(consumer)/home");
    }
  }, [user, router]);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  async function handleLogin() {
    if (!usernameOrEmail.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email/username and password");
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginConsumer(usernameOrEmail.trim().toLowerCase(), password.trim());
      
      if (!result.success) {
        Alert.alert("Login Failed", formatAuthError(result.error) || "Invalid credentials");
      }
      // Navigation happens in AuthContext on success via router.replace()
    } catch (e: any) {
      console.log("LOGIN ERROR:", e);
      Alert.alert("Login Failed", e?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subHeading}>Login to continue as Consumer</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email or Username</Text>
              <TextInput
                style={[styles.input, focusedField === "usernameOrEmail" && styles.inputFocused]}
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="john@example.com"
                placeholderTextColor="#6B7280"
                editable={!isLoading}
                onFocus={() => setFocusedField("usernameOrEmail")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, focusedField === "password" && styles.inputFocused]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor="#6B7280"
                editable={!isLoading}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Animated.View style={animatedStyle}>
              <Pressable 
                style={[styles.primaryButton, (isLoading || authLoading) && styles.disabledButton]} 
                onPress={handleLogin}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.primaryButtonText}>Login</Text>
                )}
              </Pressable>
            </Animated.View>

            <Pressable 
              onPress={() => router.push("/(auth)/register-consumer")} 
              style={styles.signupLink}
              disabled={isLoading}
            >
              <Text style={styles.signupText}>
                Don&apos;t have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotLink}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: { 
    width: '100%',
  },
  heading: { 
    color: colors.textPrimary, 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subHeading: { 
    color: colors.textSecondary, 
    fontSize: 16, 
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  label: { 
    color: colors.textPrimary, 
    marginBottom: spacing.sm,
    fontSize: 14,
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
  inputContainer: {
    marginBottom: spacing.lg,
  },
  primaryButton: {
    height: 52,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: { 
    color: colors.textInverse, 
    fontWeight: "600", 
    fontSize: 16,
  },
  signupLink: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  forgotLink: {
    alignItems: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});