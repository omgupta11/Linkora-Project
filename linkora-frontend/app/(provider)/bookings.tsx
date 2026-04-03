// app/(provider)/bookings.tsx

import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { getProviderBookings, patchBookingStatus, type BookingRow } from "../../lib/bookings";

function formatWhen(b: BookingRow) {
  try {
    const d = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
    return d.toLocaleString();
  } catch {
    return `${b.scheduled_date} ${b.scheduled_time}`;
  }
}

function displayStatus(status: string) {
  if (status === "completed" || status === "done") return "Completed";
  if (status === "accepted") return "Accepted";
  if (status === "pending") return "Pending";
  if (status === "cancelled" || status === "rejected") return "Cancelled";
  return status;
}

function statusBadgeStyle(status: string) {
  if (status === "pending") return { backgroundColor: "#FACC15" };
  if (status === "accepted") return { backgroundColor: "#3B82F6" };
  if (status === "completed" || status === "done") return { backgroundColor: "#22C55E" };
  if (status === "cancelled" || status === "rejected") return { backgroundColor: "#EF4444" };
  return { backgroundColor: "#6B7280" };
}

export default function ProviderBookings() {
  const router = useRouter();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getProviderBookings();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const updateStatus = async (bookingId: number, status: string) => {
    setActionLoading(bookingId);
    try {
      const updated = await patchBookingStatus(bookingId, status);
      setRows((prev) => prev.map((r) => (r.id === bookingId ? updated : r)));
    } catch {
      // no-op
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={[styles.container, styles.centered]}
      >
        <ActivityIndicator size="large" color="#22C55E" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <Text style={styles.title}>Bookings</Text>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings yet.</Text>
        }
        renderItem={({ item, index }) => (
          <BookingCard
            item={item}
            index={index}
            onAccept={item.status === "pending" ? () => updateStatus(item.id, "accepted") : undefined}
            onComplete={item.status === "accepted" ? () => updateStatus(item.id, "completed") : undefined}
            actionLoading={actionLoading === item.id}
            onPress={() =>
              router.push(`/(provider)/booking/${item.id}` as any)
            }
          />
        )}
      />
    </LinearGradient>
  );
}

function BookingCard({
  item,
  index,
  onPress,
  onAccept,
  onComplete,
  actionLoading,
}: {
  item: BookingRow;
  index: number;
  onPress: () => void;
  onAccept?: () => void;
  onComplete?: () => void;
  actionLoading?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const statusLabel = displayStatus(item.status);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80)}
      style={[styles.card, animatedStyle]}
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.03))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.user}>{item.consumer_email || "Customer"}</Text>
            <Text style={styles.service}>{item.service_title}</Text>
            <Text style={styles.time}>{formatWhen(item)}</Text>
          </View>

          <View
            style={[
              styles.status,
              statusBadgeStyle(item.status),
            ]}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          {onAccept ? (
            <Pressable
              style={styles.acceptButton}
              onPress={onAccept}
              disabled={actionLoading}
            >
              <Text style={styles.actionText}>
                {actionLoading ? "Working..." : "Accept"}
              </Text>
            </Pressable>
          ) : null}
          {onComplete ? (
            <Pressable
              style={styles.completeButton}
              onPress={onComplete}
              disabled={actionLoading}
            >
              <Text style={styles.actionText}>
                {actionLoading ? "Working..." : "Mark Completed"}
              </Text>
            </Pressable>
          ) : null}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  empty: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 24,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  user: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  service: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  done: {
    backgroundColor: "#14532D",
  },
  upcoming: {
    backgroundColor: "#1E3A8A",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completeButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
