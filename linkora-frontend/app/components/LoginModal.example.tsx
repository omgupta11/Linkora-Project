import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginModal from "../components/LoginModal";
import api from "../../lib/api";
import { colors, spacing, radius, typography } from "../../constants/colors";

/**
 * EXAMPLE 1: Basic Usage
 * Minimal setup with LoginModal
 */
export function BasicExample() {
  const [visible, setVisible] = useState(false);

  const handleLogin = async (phone: string) => {
    await api.post("/api/auth/send-otp/", {
      phone: "+91" + phone,
    });
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Open Login Modal</Text>
      </TouchableOpacity>

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

/**
 * EXAMPLE 2: With Loading State
 * Shows spinner during API call
 */
export function WithLoadingExample() {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });
      setVisible(false);
      Alert.alert("Success", "OTP sent to your phone");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </>
  );
}

/**
 * EXAMPLE 3: With Skip Handler
 * User can skip login and continue as guest
 */
export function WithSkipExample() {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });
      setVisible(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    console.log("User chose to skip login");
    // Continue as guest, analytics, etc.
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
        onSkip={handleSkip}
        isLoading={isLoading}
      />
    </>
  );
}

/**
 * EXAMPLE 4: Full Integration with Navigation
 * Navigates to OTP screen after sending OTP
 */
export function FullIntegrationExample() {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });

      // Navigate to OTP verification screen
      // router.push({
      //   pathname: "/(auth)/otp-verify",
      //   params: {
      //     phone: "+91" + phone,
      //     requestId: response.data.request_id,
      //   },
      // });

      setVisible(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Continue as guest
    // router.push("/(consumer)/home");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="log-in-outline" size={20} color={colors.background} />
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
        onSkip={handleSkip}
        isLoading={isLoading}
      />
    </>
  );
}

/**
 * EXAMPLE 5: In Header/Navbar
 * Login button in app header
 */
export function HeaderIntegrationExample() {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });
      setVisible(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.logo}>Linkora</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </View>
  );
}

/**
 * EXAMPLE 6: With Error Boundary
 * Handles and displays errors gracefully
 */
export function WithErrorBoundaryExample() {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });

      if (response.status === 200) {
        setVisible(false);
        Alert.alert("Success", "OTP sent successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setError(null);
          setVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Login with Phone</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <LoginModal
        visible={visible}
        onClose={() => setVisible(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  headerRight: {
    flexDirection: "row",
  },
  loginButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  loginButtonText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  errorText: {
    marginLeft: spacing.sm,
    color: colors.error,
    fontSize: 14,
  },
});

/**
 * USAGE GUIDE:
 *
 * 1. Basic: Just import LoginModal and manage state
 *
 * 2. With Loading: Add setIsLoading in try/catch for API call
 *
 * 3. With Skip: Add onSkip handler for guest continuation
 *
 * 4. Full Integration:
 *    - Import router from expo-router
 *    - Navigate to OTP screen after success
 *    - Pass phone & request ID as params
 *
 * 5. Header Integration:
 *    - Wrap LoginModal in Header component
 *    - Put login button in header
 *    - Modal appears on top of header
 *
 * 6. Error Boundary:
 *    - Catch errors and display in banner
 *    - Reset form on modal open
 *    - Show friendly error messages
 *
 * VALIDATION:
 * - Phone: Must be 10 digits (auto-cleaned)
 * - Checkbox: Must be checked
 * - Button: Disabled if invalid
 *
 * API RESPONSE EXPECTED:
 * {
 *   "message": "OTP sent",
 *   "request_id": "xyz123"
 * }
 *
 * API ERROR EXPECTED:
 * {
 *   "error": "Phone already registered"
 * }
 */
