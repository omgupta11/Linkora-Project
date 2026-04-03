// app/payment.tsx

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

const METHODS = [
  { id: "gpay", label: "Google Pay", icon: "logo-google" },
  { id: "phonepe", label: "PhonePe", icon: "phone-portrait-outline" },
  { id: "paytm", label: "Paytm", icon: "wallet-outline" },
  { id: "upi", label: "UPI", icon: "flash-outline" },
  { id: "card", label: "Card", icon: "card-outline" },
];

export default function Payment() {
  const router = useRouter();
  const selected = useSharedValue("");

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.list}>
        {METHODS.map((item) => (
          <MethodCard
            key={item.id}
            item={item}
            selected={selected}
          />
        ))}
      </View>

      <Pressable
        style={[
          styles.payBtn,
          !selected.value && { opacity: 0.5 },
        ]}
        disabled={!selected.value}
        onPress={() => router.replace("/payment-success")}
      >
        <Text style={styles.payText}>Pay Now</Text>
      </Pressable>
    </LinearGradient>
  );
}

function MethodCard({
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
    <Animated.View style={[styles.method, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.03))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => (selected.value = item.id)}
      >
        <View style={styles.methodRow}>
          <Ionicons name={item.icon} size={22} color="#22C55E" />
          <Text style={styles.methodText}>{item.label}</Text>
          {selected.value === item.id && (
            <Ionicons
              name="checkmark-circle"
              size={20}
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
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  list: {
    gap: 14,
  },
  method: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  methodText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    flex: 1,
  },
  payBtn: {
    marginTop: "auto",
    marginBottom: 30,
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
