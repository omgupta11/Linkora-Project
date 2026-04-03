import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { getBooking, patchBookingStatus } from "../../../lib/bookings";

export default function ProviderBookingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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

  async function updateStatus(next: string) {
    if (!id) return;
    try {
      setBusy(true);
      const data = await patchBookingStatus(Number(id), next);
      setB(data);
      Alert.alert("Updated", `Status: ${data.status}`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        "Could not update booking.";
      Alert.alert("Error", String(msg));
    } finally {
      setBusy(false);
    }
  }

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
        <Pressable onPress={() => router.back()} style={styles.cancel}>
          <Text style={styles.cancelText}>Go back</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  const canAct = b.status === "pending" || b.status === "accepted";

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <Animated.View entering={FadeInUp} style={styles.card}>
        <Text style={styles.user}>
          Customer: {b.consumer_email || "—"}
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

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{b.status}</Text>
        </View>

        {canAct && !busy ? (
          <View style={styles.actions}>
            {b.status === "pending" ? (
              <>
                <Pressable
                  style={styles.complete}
                  onPress={() => updateStatus("accepted")}
                >
                  <Text style={styles.actionText}>Accept</Text>
                </Pressable>
                <Pressable
                  style={styles.cancel}
                  onPress={() => updateStatus("rejected")}
                >
                  <Text style={styles.cancelText}>Reject</Text>
                </Pressable>
              </>
            ) : null}
            {b.status === "accepted" ? (
              <Pressable
                style={styles.complete}
                onPress={() => updateStatus("done")}
              >
                <Text style={styles.actionText}>Mark Completed</Text>
              </Pressable>
            ) : null}
          </View>
        ) : busy ? (
          <ActivityIndicator color="#22C55E" style={{ marginTop: 12 }} />
        ) : null}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
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
  user: { fontSize: 18, fontWeight: "600", color: "#FFF" },
  service: { fontSize: 14, color: "#9CA3AF" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#9CA3AF", fontSize: 14 },
  value: { color: "#FFF", fontSize: 14 },
  actions: { gap: 12, marginTop: 14 },
  complete: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  cancel: {
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  actionText: { color: "#000", fontWeight: "600" },
  cancelText: { color: "#EF4444", fontWeight: "600" },
});
