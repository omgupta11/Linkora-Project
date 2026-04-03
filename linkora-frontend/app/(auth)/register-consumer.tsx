// app/(auth)/register-consumer.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { formatAuthError } from "../../lib/auth-errors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

export default function RegisterConsumer() {
  const router = useRouter();
  const { registerConsumer, user } = useAuth();

  // ===== AUTO-REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
    if (user) {
      console.log("📍 User already logged in as:", user.role);
      router.replace("/(consumer)/home");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    full_name: "",
    address: "",
    city: "",
    state: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for Django
      const submitData = {
        username: formData.username,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: formData.full_name,
        address: formData.address,
        city: formData.city,
        state: formData.state
      };

      const result = await registerConsumer(submitData);
      
      if (!result.success) {
        // Handle Django validation errors
        if (result.error && typeof result.error === 'object') {
          const djangoErrors: Record<string, string> = {};
          Object.entries(result.error).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              djangoErrors[key] = value.join(', ');
            } else {
              djangoErrors[key] = String(value);
            }
          });
          setErrors(djangoErrors);
          Alert.alert("Registration Failed", "Please check the form for errors");
        } else {
          Alert.alert("Registration Failed", formatAuthError(result.error) || "Something went wrong");
        }
      }
      // Navigation happens in AuthContext on success
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert("Registration Failed", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#0B0B0F", "#12121A"]} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Consumer Registration</Text>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <InputField
              label="Username *"
              value={formData.username}
              onChangeText={(value) => handleChange("username", value)}
              placeholder="johndoe"
              autoCapitalize="none"
              error={errors.username}
              editable={!isLoading}
            />

            <InputField
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              editable={!isLoading}
            />

            <InputField
              label="Phone *"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              placeholder="9876543210"
              keyboardType="phone-pad"
              error={errors.phone}
              editable={!isLoading}
            />

            <InputField
              label="Password *"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
              editable={!isLoading}
            />

            <InputField
              label="Confirm Password *"
              value={formData.confirm_password}
              onChangeText={(value) => handleChange("confirm_password", value)}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirm_password}
              editable={!isLoading}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <InputField
              label="Full Name *"
              value={formData.full_name}
              onChangeText={(value) => handleChange("full_name", value)}
              placeholder="John Doe"
              autoCapitalize="words"
              error={errors.full_name}
              editable={!isLoading}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="First Name"
                  value={formData.first_name}
                  onChangeText={(value) => handleChange("first_name", value)}
                  placeholder="John"
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="Last Name"
                  value={formData.last_name}
                  onChangeText={(value) => handleChange("last_name", value)}
                  placeholder="Doe"
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            <InputField
              label="Address"
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="123 Main Street"
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="City"
                  value={formData.city}
                  onChangeText={(value) => handleChange("city", value)}
                  placeholder="Mumbai"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="State"
                  value={formData.state}
                  onChangeText={(value) => handleChange("state", value)}
                  placeholder="Maharashtra"
                  editable={!isLoading}
                />
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => router.push("/(auth)/login-consumer")}
            style={styles.loginLink}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Login</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Input Component
function InputField({ label, error, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
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
    padding: 24,
    paddingBottom: 40,
  },
  heading: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  loginHighlight: {
    color: "#22C55E",
    fontWeight: "600",
  },
});