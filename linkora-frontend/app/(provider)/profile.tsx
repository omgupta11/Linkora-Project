import { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/config";
import { useAuth } from "../../context/AuthContext";

export default function ProviderProfileScreen() {
  const { user, refreshUser } = useAuth();

  const [businessName, setBusinessName] = useState(user?.provider_profile?.business_name || "");
  const [ownerName, setOwnerName] = useState(user?.provider_profile?.owner_name || "");
  const [category, setCategory] = useState(user?.provider_profile?.category || "");

  const [coverImage, setCoverImage] = useState<any>(null);
  const [ownerImage, setOwnerImage] = useState<any>(null);

  const pickImage = async (setImage: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      form.append("business_name", businessName);
      form.append("owner_name", ownerName);
      form.append("category", category);

      if (coverImage) {
        form.append("cover_image", {
          uri: coverImage.uri,
          name: "cover.jpg",
          type: "image/jpeg",
        } as any);
      }

      if (ownerImage) {
        form.append("owner_image", {
          uri: ownerImage.uri,
          name: "owner.jpg",
          type: "image/jpeg",
        } as any);
      }

      await api.patch("/api/provider/profile/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refreshUser();

      Alert.alert("Success", "Profile updated");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Profile</Text>

      {/* COVER IMAGE */}
      <Text>Cover Image</Text>
      <Button title="Upload Cover" onPress={() => pickImage(setCoverImage)} />
      {coverImage && <Image source={{ uri: coverImage.uri }} style={styles.image} />}
      {user?.provider_profile?.cover_image && (
        <Image source={{ uri: getImageUrl(user.provider_profile.cover_image) }} style={styles.image} />
      )}

      {/* OWNER IMAGE */}
      <Text>Owner Image</Text>
      <Button title="Upload Owner" onPress={() => pickImage(setOwnerImage)} />
      {ownerImage && <Image source={{ uri: ownerImage.uri }} style={styles.image} />}
      {user?.provider_profile?.owner_image && (
        <Image source={{ uri: getImageUrl(user.provider_profile.owner_image) }} style={styles.image} />
      )}

      <TextInput
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
        style={styles.input}
      />

      <TextInput
        placeholder="Owner Name"
        value={ownerName}
        onChangeText={setOwnerName}
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Button title="Save Profile" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#1F2937",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
});