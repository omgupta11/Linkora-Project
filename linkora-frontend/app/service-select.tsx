// app/service-select.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const SERVICES = [
  { id: "1", name: "Haircut & Styling", price: 499 },
  { id: "2", name: "Facial & Cleanup", price: 799 },
  { id: "3", name: "Bridal Package", price: 4999 },
];

export default function ServiceSelect() {
  const router = useRouter();
  const selected = useSharedValue<string>("");

  const total =
    SERVICES.find((s) => s.id === selected.value)?.price || 0;

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Select Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {SERVICES.map((item) => (
          <ServiceCard
            key={item.id}
            item={item}
            selected={selected}
          />
        ))}
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>₹{total}</Text>
        </View>

        <Pressable
          style={[
            styles.payBtn,
            !selected.value && { opacity: 0.5 },
          ]}
          disabled={!selected.value}
          onPress={() => router.push("/payment")}
        >
          <Text style={styles.payText}>Continue to Pay</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function ServiceCard({
  item,
  selected,
}: {
  item: any;
  selected: { value: string };
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor:
      selected.value === item.id ? "#22C55E" : "#1F2937",
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.04))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => (selected.value = item.id)}
      >
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>₹{item.price}</Text>
          </View>

          {selected.value === item.id && (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color="#22C55E"
            />
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  summary: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  payBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  payText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
