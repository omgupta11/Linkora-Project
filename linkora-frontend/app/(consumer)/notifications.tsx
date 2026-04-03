// app/(consumer)/notifications.tsx

import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Booking Confirmed",
    desc: "Your appointment at Glow Salon is confirmed",
    time: "2h ago",
    icon: "checkmark-circle-outline",
  },
  {
    id: "2",
    title: "Payment Successful",
    desc: "₹499 paid via Google Pay",
    time: "1 day ago",
    icon: "card-outline",
  },
];

export default function Notifications() {
  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 80)}
            style={styles.card}
          >
            <Ionicons
              name={item.icon as any}
              size={26}
              color="#22C55E"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </Animated.View>
        )}
      />
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardDesc: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: "#6B7280",
  },
});
