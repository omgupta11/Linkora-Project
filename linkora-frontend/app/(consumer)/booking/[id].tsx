import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { getBooking } from "../../../lib/bookings";

export default function ConsumerBookingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [b, setB] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      try {
        const data = await getBooking(Number(id));
        if (!cancelled) setB(data);
      } catch {
        if (!cancelled) setB(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.loading}
      >
        <ActivityIndicator size="large" color="#22C55E" />
      </LinearGradient>
    );
  }

  if (!b) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.loading}
      >
        <Text style={styles.muted}>Booking not found</Text>
        <Pressable onPress={() => router.back()} style={styles.support}>
          <Text style={styles.supportText}>Go back</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Animated.View entering={FadeInUp} style={styles.card}>
        <Text style={styles.business}>
          {b.provider_business_name || "Provider"}
        </Text>
        <Text style={styles.service}>{b.service_title}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{String(b.scheduled_date)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{String(b.scheduled_time)}</Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>{b.status}</Text>
        </View>
      </Animated.View>

      <Pressable style={styles.support}>
        <Text style={styles.supportText}>Contact Support</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  loading: {
    flex: 1,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  muted: { color: "#9CA3AF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#FFF" },
  card: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  business: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  service: { fontSize: 14, color: "#9CA3AF" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#9CA3AF", fontSize: 14 },
  value: { color: "#FFF", fontSize: 14 },
  status: {
    marginTop: 14,
    backgroundColor: "#14532D",
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
  },
  statusText: { color: "#FFF", fontWeight: "600" },
  support: {
    marginTop: "auto",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  supportText: { color: "#22C55E", fontWeight: "600" },
});
