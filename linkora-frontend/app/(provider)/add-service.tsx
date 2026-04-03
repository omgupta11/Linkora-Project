import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  createService,
  getService,
  updateService,
} from "../../lib/services";
import ImagePickerComponent from "../../components/ImagePicker";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/config";

export default function AddService() {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string }>();
  const editId = params.editId ? String(params.editId) : "";

  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [images, setImages] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!editId) {
        setLoading(false);
        return;
      }

      try {
        const s = await getService(Number(editId));

        if (cancelled) return;

        setTitle(s.title ?? "");
        setPrice(String(s.price ?? ""));
        setCategory(s.category ?? "");
        setDescription(s.description ?? "");
        setDuration(String(s.duration_minutes ?? 60));

        if (s.lat != null) setLat(String(s.lat));
        if (s.lng != null) setLng(String(s.lng));

        setExistingImages(s.images ?? []);
      } catch {
        Alert.alert("Error", "Could not load service.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  async function onSave() {
    const priceNum = parseFloat(price);
    const dur = parseInt(duration, 10) || 60;

    if (!title || !description || !category) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      setSaving(true);

      let serviceId: number;

      if (editId) {
        await updateService(Number(editId), {
          title,
          description,
          price: priceNum,
          category,
          duration_minutes: dur,
        });
        serviceId = Number(editId);
      } else {
        const newService = await createService({
          title,
          description,
          price: priceNum,
          category,
          duration_minutes: dur,
        });
        serviceId = newService.id;
      }

      // upload images
      for (const img of images) {
        const formData = new FormData();

        formData.append("image", {
          uri: img.uri,
          name: "service.jpg",
          type: "image/jpeg",
        } as any);

        await api.post(`/api/services/${serviceId}/images/`, formData);
      }

      Alert.alert("Success", "Service saved");
      router.back();
    } catch {
      Alert.alert("Error", "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  if (loading) {
    return (
      <LinearGradient style={styles.loading} colors={["#000", "#111"]}>
        <ActivityIndicator color="#22C55E" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={["#0B0B0F", "#12121A", "#0B0B0F"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>
            {editId ? "Edit Service" : "Add Service"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SERVICE FORM */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Service Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "title" && styles.inputFocused,
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter service title"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Price (₹) *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "price" && styles.inputFocused,
                    ]}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duration (min) *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "duration" && styles.inputFocused,
                    ]}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="60"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    onFocus={() => setFocusedField("duration")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "category" && styles.inputFocused,
                ]}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Plumbing, Electrical, Cleaning"
                placeholderTextColor="#6B7280"
                onFocus={() => setFocusedField("category")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[
                  styles.textArea,
                  focusedField === "description" && styles.inputFocused,
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your service in detail..."
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Latitude (Optional)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "lat" && styles.inputFocused,
                    ]}
                    value={lat}
                    onChangeText={setLat}
                    placeholder="Location latitude"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    onFocus={() => setFocusedField("lat")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Longitude (Optional)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "lng" && styles.inputFocused,
                    ]}
                    value={lng}
                    onChangeText={setLng}
                    placeholder="Location longitude"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    onFocus={() => setFocusedField("lng")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* IMAGES SECTION */}
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Service Images</Text>

            {existingImages.length > 0 || images.length > 0 ? (
              <FlatList
                data={[...existingImages, ...images]}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                  const isExisting = index < existingImages.length;

                  return (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: isExisting
                            ? getImageUrl(item.image) + `?t=${Date.now()}`
                            : item.uri,
                        }}
                        style={styles.image}
                      />
                      <Pressable
                        style={styles.removeButton}
                        onPress={async () => {
                          if (isExisting) {
                            await api.delete(`/api/services/${editId}/images/${item.id}/`);
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          } else {
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index - existingImages.length)
                            );
                          }
                        }}
                      >
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </Pressable>
                    </View>
                  );
                }}
              />
            ) : null}

            <ImagePickerComponent
              onImageSelected={(img) => setImages((p) => [...p, img])}
            />
          </View>

          {/* SAVE BUTTON */}
          <Animated.View style={animatedStyle}>
            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={onSave}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editId ? "Update Service" : "Create Service"}
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  form: { marginBottom: 30 },
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
  textArea: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
    minHeight: 100,
    textAlignVertical: "top",
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
  imagesSection: { marginBottom: 30 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  imageContainer: {
    marginRight: 12,
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#0B0B0F",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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