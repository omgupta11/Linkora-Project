// app/(provider)/location.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

export default function ProviderLocation() {
  const router = useRouter();
  const { user } = useAuth();
  const address =
    (typeof user?.provider_profile?.address === "string"
      ? user.provider_profile.address.trim()
      : "") ||
    [
      user?.provider_profile?.city,
      user?.provider_profile?.state,
      user?.provider_profile?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Add your address in profile";
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Business Location</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapBox}>
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text style={styles.mapText}>Map Picker Preview</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{address}</Text>

        <Text style={styles.label}>Maps</Text>
        <Text style={styles.link}>Open Maps from your device to pin the exact location.</Text>
      </View>

      <Animated.View style={animatedStyle}>
        <Pressable
          style={styles.saveBtn}
          onPressIn={() => (scale.value = withSpring(1.05))}
          onPressOut={() => (scale.value = withSpring(1))}
          onPress={() => router.back()}
        >
          <Text style={styles.saveText}>Save Location</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapBox: {
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  mapText: {
    color: "#9CA3AF",
    marginTop: 8,
  },
  info: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  value: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  link: {
    fontSize: 14,
    color: "#22C55E",
  },
  saveBtn: {
    marginTop: "auto",
    marginBottom: 30,
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
