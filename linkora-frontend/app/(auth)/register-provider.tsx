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
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { formatAuthError } from "../../lib/auth-errors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

export default function RegisterProvider() {
  const router = useRouter();
  const { registerProvider, user } = useAuth();

  // ===== AUTO-REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
    if (user) {
      console.log("📍 User already logged in as:", user.role);
      router.replace("/(provider)/dashboard");
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
    business_name: "",
    business_type: "",
    description: "",
    address: "",
    city: "",
    state: "",
    service_area: "",
    business_email: "",
    registration_number: "",
    years_in_business: "0"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<any>(null);
  const [ownerImage, setOwnerImage] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.username.trim()) newErrors.username = "Username required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Must be 10 digits";
    
    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 8) newErrors.password = "Min 8 characters";
    
    if (!formData.confirm_password) newErrors.confirm_password = "Confirm password";
    else if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords don&apos;t match";
    
    if (!formData.business_name.trim()) newErrors.business_name = "Business name required";
    if (!formData.business_type.trim()) newErrors.business_type = "Business type required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.state.trim()) newErrors.state = "State required";
    if (!formData.service_area.trim()) newErrors.service_area = "Service area required";
    if (!formData.business_email.trim()) newErrors.business_email = "Business email required";
    else if (!emailRegex.test(formData.business_email)) newErrors.business_email = "Invalid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function pickImage(setter: any) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  }

  async function handleSubmit() {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for Django
      const submitData = {
        username: formData.username,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        business_name: formData.business_name,
        business_type: formData.business_type,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        service_area: formData.service_area,
        business_email: formData.business_email.toLowerCase(),
        registration_number: formData.registration_number,
        years_in_business: parseInt(formData.years_in_business) || 0,
        coverImage,
        ownerImage,
      };

      const result = await registerProvider(submitData);
      
      if (!result.success) {
        if (result.error && typeof result.error === 'object') {
          // Handle Django validation errors
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
      // Success navigation happens in AuthContext
    } catch (error: any) {
      console.error("Provider registration error:", error);
      Alert.alert("Registration Failed", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const businessTypes = [
    "Restaurant", "Salon", "Plumber", "Electrician", "Carpenter",
    "Cleaning", "Repair", "Coaching", "Medical", "Hotel",
    "Transport", "Construction", "Other"
  ];

  return (
    <LinearGradient colors={["#0B0B0F", "#12121A"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Service Provider Registration</Text>

          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="Username *"
                  value={formData.username}
                  onChangeText={(value) => handleChange("username", value)}
                  placeholder="johndoe"
                  autoCapitalize="none"
                  error={errors.username}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="Phone *"
                  value={formData.phone}
                  onChangeText={(value) => handleChange("phone", value)}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  error={errors.phone}
                  editable={!loading}
                />
              </View>
            </View>

            <InputField
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              editable={!loading}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="Password *"
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="Confirm Password *"
                  value={formData.confirm_password}
                  onChangeText={(value) => handleChange("confirm_password", value)}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.confirm_password}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="First Name"
                  value={formData.first_name}
                  onChangeText={(value) => handleChange("first_name", value)}
                  placeholder="John"
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="Last Name"
                  value={formData.last_name}
                  onChangeText={(value) => handleChange("last_name", value)}
                  placeholder="Doe"
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          {/* Business Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <InputField
              label="Business Name *"
              value={formData.business_name}
              onChangeText={(value) => handleChange("business_name", value)}
              placeholder="ABC Services Pvt Ltd"
              autoCapitalize="words"
              error={errors.business_name}
              editable={!loading}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {businessTypes.map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.categoryButton,
                        formData.business_type === type && styles.categoryButtonSelected
                      ]}
                      onPress={() => handleChange("business_type", type)}
                      disabled={loading}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        formData.business_type === type && styles.categoryButtonTextSelected
                      ]}>
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
              {errors.business_type && (
                <Text style={styles.errorText}>{errors.business_type}</Text>
              )}
            </View>

            <InputField
              label="Description *"
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
              placeholder="Describe your business services..."
              multiline
              numberOfLines={4}
              style={styles.textArea}
              error={errors.description}
              editable={!loading}
            />

            <InputField
              label="Address *"
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="123 Business Street, Area"
              multiline
              numberOfLines={2}
              error={errors.address}
              editable={!loading}
            />

            <View style={styles.row}>
              <View style={styles.thirdInput}>
                <InputField
                  label="City *"
                  value={formData.city}
                  onChangeText={(value) => handleChange("city", value)}
                  placeholder="Mumbai"
                  error={errors.city}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.thirdInput}>
                <InputField
                  label="State *"
                  value={formData.state}
                  onChangeText={(value) => handleChange("state", value)}
                  placeholder="Maharashtra"
                  error={errors.state}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.thirdInput}>
                <InputField
                  label="Service Area *"
                  value={formData.service_area}
                  onChangeText={(value) => handleChange("service_area", value)}
                  placeholder="Local/Statewide"
                  error={errors.service_area}
                  editable={!loading}
                />
              </View>
            </View>

            <InputField
              label="Business Email *"
              value={formData.business_email}
              onChangeText={(value) => handleChange("business_email", value)}
              placeholder="contact@business.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.business_email}
              editable={!loading}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="Registration No. (Optional)"
                  value={formData.registration_number}
                  onChangeText={(value) => handleChange("registration_number", value)}
                  placeholder="GST/Registration"
                  editable={!loading}
                />
              </View>
              
              <View style={styles.halfInput}>
                <InputField
                  label="Years in Business"
                  value={formData.years_in_business}
                  onChangeText={(value) => handleChange("years_in_business", value)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          {/* Optional Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional Images</Text>
            
            <View style={styles.imageSection}>
              <ImageUpload
                label="Cover Image"
                image={coverImage}
                onPick={() => pickImage(setCoverImage)}
                disabled={loading}
              />
              
              <ImageUpload
                label="Owner/Profile Image"
                image={ownerImage}
                onPick={() => pickImage(setOwnerImage)}
                disabled={loading}
              />
            </View>
          </View>

          <Pressable
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryButtonText}>Register as Service Provider</Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => router.push("/(auth)/login-provider")}
            style={styles.loginLink}
            disabled={loading}
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
function InputField({ label, error, style, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// Image Upload Component
function ImageUpload({ label, image, onPick, disabled }: any) {
  return (
    <View style={styles.imageUploadContainer}>
      <Text style={styles.label}>{label} (Optional)</Text>
      <Pressable
        style={styles.imageBox}
        onPress={onPick}
        disabled={disabled}
      >
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={32} color="#9CA3AF" />
            <Text style={styles.imagePlaceholderText}>Tap to add {label.toLowerCase()}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  inputContainer: {
    marginBottom: 18,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 16,
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
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  thirdInput: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#1F2937",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  categoryButtonSelected: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  categoryButtonText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  categoryButtonTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  imageSection: {
    flexDirection: "row",
    gap: 16,
  },
  imageUploadContainer: {
    flex: 1,
  },
  imageBox: {
    height: 120,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#374151",
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
    marginBottom: 30,
  },
  loginText: {
    color: "#9CA3AF",
    fontSize: 15,
  },
  loginHighlight: {
    color: "#22C55E",
    fontWeight: "600",
  },
});