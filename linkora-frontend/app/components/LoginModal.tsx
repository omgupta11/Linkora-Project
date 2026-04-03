import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadows } from "../../constants/colors";

const { height, width } = Dimensions.get("window");

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: (phone: string) => Promise<void>;
  onSkip?: () => void;
  isLoading?: boolean;
}

export default function LoginModal({
  visible,
  onClose,
  onLogin,
  onSkip,
  isLoading = false,
}: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate phone format (10 digits for India)
  const isValidPhone = phone.replace(/\D/g, "").length === 10;

  const handleLogin = async () => {
    setErrorMessage("");

    if (!isValidPhone) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please agree to terms and conditions");
      return;
    }

    try {
      await onLogin(phone);
      // Reset on success
      setPhone("");
      setAgreedToTerms(false);
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    }
  };

  const handleSkip = () => {
    // Reset
    setPhone("");
    setAgreedToTerms(false);
    setErrorMessage("");
    if (onSkip) {
      onSkip();
    }
    onClose();
  };

  const handleClose = () => {
    // Reset
    setPhone("");
    setAgreedToTerms(false);
    setErrorMessage("");
    onClose();
  };

  const formatPhoneInput = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Centered Card */}
            <View style={styles.cardContainer}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.6}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>
                  Login for seamless experience
                </Text>
              </View>

              {/* Phone Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>🇮🇳 +91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={formatPhoneInput}
                    editable={!isLoading}
                  />
                </View>
                {phone && (
                  <Text style={styles.phoneExample}>
                    You'll receive OTP on +91 {phone.slice(0, 5)} {phone.slice(5)}
                  </Text>
                )}
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreedToTerms && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.background}
                    />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to Terms & Conditions and Privacy Policy
                </Text>
              </TouchableOpacity>

              {/* Error Message */}
              {errorMessage && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={colors.error}
                  />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!isValidPhone || !agreedToTerms || isLoading) &&
                    styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isValidPhone || !agreedToTerms || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator
                    color={colors.background}
                    size="small"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="send"
                      size={18}
                      color={colors.background}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.loginButtonText}>Login with OTP</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Skip Link */}
              <TouchableOpacity
                onPress={handleSkip}
                disabled={isLoading}
                activeOpacity={0.6}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  cardContainer: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    marginHorizontal: spacing.md,
    ...shadows.md,
    maxWidth: width - 32,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: spacing.xs,
    marginRight: -spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    height: 48,
  },
  countryCode: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  phoneExample: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xs,
    marginRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginLeft: spacing.sm,
    flex: 1,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  loginButtonDisabled: {
    backgroundColor: "#D1D5DB",
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },
  skipText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.sm,
  },
});
