// app/(consumer)/saved.tsx

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

const SAVED = [
  {
    id: "1",
    name: "Glow Salon",
    category: "Salon • Beauty",
    rating: "4.8",
  },
  {
    id: "2",
    name: "FitZone Gym",
    category: "Gym • Fitness",
    rating: "4.6",
  },
];

export default function SavedBusinesses() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <Text style={styles.title}>Saved Businesses</Text>

      <FlatList
        data={SAVED}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <SavedCard item={item} router={router} />
        )}
      />
    </LinearGradient>
  );
}

function SavedCard({
  item,
  router,
}: {
  item: any;
  router: any;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.03))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => router.push(`/business/${item.id}`)}
      >
        <View style={styles.row}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>

            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#22C55E" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9CA3AF"
          />
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  category: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    color: "#D1D5DB",
  },
});
