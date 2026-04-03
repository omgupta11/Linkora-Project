// app/(provider)/edit-profile.tsx

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

export default function EditProviderProfile() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    business_name: string;
    owner_name: string;
    category: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark: string;
    gst_number: string;
  }>({
    business_name: (user?.provider_profile?.business_name as string) || "",
    owner_name: (user?.provider_profile?.owner_name as string) || "",
    category: (user?.provider_profile?.category as string) || "",
    address: (user?.provider_profile?.address as string) || "",
    city: (user?.provider_profile?.city as string) || "",
    state: (user?.provider_profile?.state as string) || "",
    country: (user?.provider_profile?.country as string) || "India",
    pincode: (user?.provider_profile?.pincode as string) || "",
    landmark: (user?.provider_profile?.landmark as string) || "",
    gst_number: (user?.provider_profile?.gst_number as string) || "",
  });

  const [coverImage, setCoverImage] = useState<any>(
    user?.provider_profile?.cover_image
      ? { uri: getImageUrl(user.provider_profile.cover_image) }
      : null
  );

  const [ownerImage, setOwnerImage] = useState<any>(
    user?.provider_profile?.owner_image
      ? { uri: getImageUrl(user.provider_profile.owner_image) }
      : null
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      if (coverImage?.uri && !coverImage.uri.startsWith("http")) {
        data.append("cover_image", {
          uri: coverImage.uri,
          name: "cover.jpg",
          type: "image/jpeg",
        } as any);
      }

      if (ownerImage?.uri && !ownerImage.uri.startsWith("http")) {
        data.append("owner_image", {
          uri: ownerImage.uri,
          name: "owner.jpg",
          type: "image/jpeg",
        } as any);
      }

      await api.patch("/api/auth/profile/provider/", data);

      await refreshUser();
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
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
          <Text style={styles.title}>Edit Business Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ImagePickerComponent
            currentImage={getImageUrl(user?.provider_profile?.cover_image)}
            onImageSelected={setCoverImage}
          />
          <ImagePickerComponent
            currentImage={getImageUrl(user?.provider_profile?.owner_image)}
            onImageSelected={setOwnerImage}
          />

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "business_name" && styles.inputFocused,
                ]}
                value={formData.business_name}
                onChangeText={(text) => setFormData({ ...formData, business_name: text })}
                placeholder="Enter business name"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("business_name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Owner Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "owner_name" && styles.inputFocused,
                ]}
                value={formData.owner_name}
                onChangeText={(text) => setFormData({ ...formData, owner_name: text })}
                placeholder="Enter owner name"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("owner_name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "category" && styles.inputFocused,
                ]}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Enter business category"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("category")}
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
                placeholder="Enter business address"
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Landmark</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "landmark" && styles.inputFocused,
                ]}
                value={formData.landmark}
                onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                placeholder="Enter landmark"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("landmark")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>GST Number</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "gst_number" && styles.inputFocused,
                ]}
                value={formData.gst_number}
                onChangeText={(text) => setFormData({ ...formData, gst_number: text })}
                placeholder="Enter GST number"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("gst_number")}
                onBlur={() => setFocusedField(null)}
              />
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