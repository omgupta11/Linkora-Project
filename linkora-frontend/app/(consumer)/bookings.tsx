// app/(consumer)/bookings.tsx

import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { getMyBookings, patchBookingStatus, type BookingRow } from "../../lib/bookings";

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
  if (status === "rejected" || status === "cancelled") return "Cancelled";
  if (status === "accepted") return "Accepted";
  if (status === "pending") return "Pending";
  return status;
}

function statusBadgeStyle(status: string) {
  if (status === "pending") return { backgroundColor: "#FACC15" };
  if (status === "accepted") return { backgroundColor: "#3B82F6" };
  if (status === "completed" || status === "done") return { backgroundColor: "#22C55E" };
  if (status === "cancelled" || status === "rejected") return { backgroundColor: "#EF4444" };
  return { backgroundColor: "#6B7280" };
}

export default function Bookings() {
  const router = useRouter();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getMyBookings();
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
  
  const handleCancel = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      const updated = await patchBookingStatus(bookingId, "cancelled");
      setRows((prev) => prev.map((row) => (row.id === bookingId ? updated : row)));
    } catch {
      // silent error for now
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
      <Text style={styles.title}>My Bookings</Text>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings yet.</Text>
        }
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onPress={() =>
              router.push(`/(consumer)/booking/${item.id}` as any)
            }
            onCancel={item.status === "pending" ? () => handleCancel(item.id) : undefined}
            cancelLoading={actionLoading === item.id}
          />
        )}
      />
    </LinearGradient>
  );
}

function BookingCard({
  item,
  onPress,
  onCancel,
  cancelLoading,
}: {
  item: BookingRow;
  onPress: () => void;
  onCancel?: () => void;
  cancelLoading?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label = displayStatus(item.status);

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(1.03))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.business}>
              {item.provider_business_name || "Provider"}
            </Text>
            <Text style={styles.service}>{item.service_title}</Text>
            <Text style={styles.date}>{formatWhen(item)}</Text>
          </View>

          <View style={styles.right}>
            <View
              style={[
                styles.badge,
                  statusBadgeStyle(item.status),
              ]}
            >
              <Text style={styles.badgeText}>{label}</Text>
            </View>
            {onCancel ? (
              <Pressable
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={cancelLoading}
              >
                <Text style={styles.cancelButtonText}>
                  {cancelLoading ? "Cancelling..." : "Cancel"}
                </Text>
              </Pressable>
            ) : null}
          </View>
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
  },
  business: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  service: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  badge: {
    marginTop: 0,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  done: {
    backgroundColor: "#14532D",
  },
  upcoming: {
    backgroundColor: "#1E3A8A",
  },
  badgeText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});
