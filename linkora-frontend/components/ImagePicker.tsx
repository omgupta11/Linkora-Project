// components/ImagePicker.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerProps {
  currentImage?: string | null;
  onImageSelected: (image: { uri: string; mimeType: string } | null) => void;
  placeholder?: string;
  style?: any;
}

export default function ImagePickerComponent({
  currentImage,
  onImageSelected,
  placeholder = "Select Image",
  style,
}: ImagePickerProps) {
  const [imageUri, setImageUri] = useState<string | null>(currentImage || null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant permission to access photos");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const mimeType = result.assets[0].mimeType || "image/jpeg";
      setImageUri(uri);
      onImageSelected({ uri, mimeType });
    }
  };

  const removeImage = () => {
    setImageUri(null);
    onImageSelected(null);
  };

  return (
    <View style={[styles.container, style]}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Pressable style={styles.removeButton} onPress={removeImage}>
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.placeholder} onPress={pickImage}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </Pressable>
      )}
      {imageUri && (
        <Pressable style={styles.changeButton} onPress={pickImage}>
          <Text style={styles.changeText}>Change Image</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#22C55E",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
  },
  changeButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#22C55E",
    borderRadius: 6,
  },
  changeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});