// app/(provider)/images.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const IMAGES = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
];

export default function ProviderImages() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Business Images</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={IMAGES}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={() => <ImageBox />}
      />

      <Pressable style={styles.addBtn}>
        <Ionicons name="add" size={28} color="#000" />
        <Text style={styles.addText}>Upload Images</Text>
      </Pressable>
    </LinearGradient>
  );
}

function ImageBox() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.imageBox, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.05))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      </Pressable>
    </Animated.View>
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
  imageBox: {
    flex: 1,
    height: 110,
    backgroundColor: "#111827",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    marginTop: 30,
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 6,
  },
  addText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});
