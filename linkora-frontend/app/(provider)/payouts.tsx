// app/(provider)/payouts.tsx

import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ProviderPayouts() {
  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <Text style={styles.title}>Payouts</Text>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.card}>
        <Ionicons name="wallet-outline" size={28} color="#22C55E" />
        <View>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.amount}>₹24,850</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
        <Ionicons name="card-outline" size={28} color="#22C55E" />
        <View>
          <Text style={styles.label}>Last Payout</Text>
          <Text style={styles.amount}>₹8,450</Text>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  amount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 6,
  },
});
