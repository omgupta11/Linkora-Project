// app/(consumer)/edit-profile.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import ImagePickerComponent from "../../components/ImagePicker";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/config";

export default function EditConsumerProfile() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: user?.consumer_profile?.full_name || "",
    address: user?.consumer_profile?.address || "",
    city: user?.consumer_profile?.city || "",
    state: user?.consumer_profile?.state || "",
    country: user?.consumer_profile?.country || "India",
    pincode: user?.consumer_profile?.pincode || "",
  });

  const [profileImage, setProfileImage] = useState<any>(
    user?.consumer_profile?.profile_image
      ? {
          uri: getImageUrl(user.consumer_profile.profile_image),
          mimeType: "image/jpeg",
        }
      : null
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      // append text fields
      data.append("full_name", formData.full_name);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("country", formData.country);
      data.append("pincode", formData.pincode);

      // ✅ FIXED IMAGE LOGIC
      if (profileImage && profileImage.uri && !profileImage.uri.includes("http")) {
        data.append("profile_image", {
          uri: profileImage.uri,
          name: "profile.jpg",
          type: profileImage.mimeType || "image/jpeg",
        } as any);
      }

      console.log("Sending request...");

      const res = await api.patch("/api/auth/profile/consumer/", data);

      console.log("SUCCESS:", res.data);

      await refreshUser();

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error: any) {
      console.log("FULL ERROR:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        JSON.stringify(error?.response?.data || "Failed to update profile")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    // Button press animation will be handled by style
  };

  const handlePressOut = () => {
    // Button press animation will be handled by style
  };

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ImagePickerComponent
            currentImage={getImageUrl(user?.consumer_profile?.profile_image)}
            onImageSelected={setProfileImage}
          />

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "full_name" && styles.inputFocused,
                ]}
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                placeholder="Enter your full name"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("full_name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "address" && styles.inputFocused,
                ]}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Enter your address"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "city" && styles.inputFocused,
                    ]}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="Enter city"
                    placeholderTextColor="#6B7280"
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "state" && styles.inputFocused,
                    ]}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="Enter state"
                    placeholderTextColor="#6B7280"
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "country" && styles.inputFocused,
                    ]}
                    value={formData.country}
                    onChangeText={(text) => setFormData({ ...formData, country: text })}
                    placeholder="Enter country"
                    placeholderTextColor="#6B7280"
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "pincode" && styles.inputFocused,
                    ]}
                    value={formData.pincode}
                    onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                    placeholder="Enter pincode"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    onFocus={() => setFocusedField("pincode")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  form: { marginTop: 20 },
  inputContainer: { marginBottom: 16 },
  label: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 6,
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
  inputFocused: {
    borderColor: "#22C55E",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: { flex: 1 },
  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});