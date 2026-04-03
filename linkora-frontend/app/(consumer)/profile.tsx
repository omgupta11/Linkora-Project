// app/(consumer)/profile.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
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
import { getImageUrl } from "../../lib/config";

export default function ConsumerProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayName =
    user?.consumer_profile?.full_name?.trim() ||
    user?.email ||
    "Account";

  const profileImage = user?.consumer_profile?.profile_image;

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        {/* ✅ PROFILE IMAGE FIX */}
        {profileImage ? (
          <Image
            source={{
              uri: getImageUrl(profileImage) + `?t=${Date.now()}`, // cache fix
            }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={90}
            color="#22C55E"
          />
        )}

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.list}>
        <Option
          icon="receipt-outline"
          label="My Bookings"
          onPress={() => router.push("/(consumer)/bookings")}
        />
        <Option
          icon="heart-outline"
          label="Saved Businesses"
          onPress={() => {}}
        />
        <Option
          icon="settings-outline"
          label="Edit Profile"
          onPress={() => router.push("/(consumer)/edit-profile")}
        />
        <Option
          icon="log-out-outline"
          label="Logout"
          danger
          onPress={() => {
            logout();
          }}
        />
      </View>
    </LinearGradient>
  );
}

function Option({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.03))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={styles.option}
      >
        <Ionicons
          name={icon}
          size={22}
          color={danger ? "#EF4444" : "#22C55E"}
        />
        <Text
          style={[
            styles.optionText,
            danger && { color: "#EF4444" },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#22C55E",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  list: {
    gap: 14,
  },
  option: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});