// app/(provider)/services.tsx

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
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import api from "../../lib/api";

type ServiceRow = {
  id: number;
  title: string;
  price: string | number;
  is_active: boolean;
};

export default function ProviderServices() {
  const router = useRouter();
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.get<ServiceRow[]>("/api/services/");
      setRows(Array.isArray(res.data) ? res.data : []);
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
      <View style={styles.header}>
        <Text style={styles.title}>My Services</Text>

        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/(provider)/add-service")}
        >
          <Ionicons name="add" size={22} color="#000" />
        </Pressable>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No services yet. Tap + to add.</Text>
        }
        renderItem={({ item }) => (
          <ServiceCard
            item={item}
            onPress={() =>
              router.push(`/(provider)/add-service?editId=${item.id}` as any)
            }
          />
        )}
      />
    </LinearGradient>
  );
}

function ServiceCard({
  item,
  onPress,
}: {
  item: ServiceRow;
  onPress: () => void;
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
        onPress={onPress}
      >
        <View style={styles.row}>
          <View>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.price}>₹ {item.price}</Text>
          </View>

          <View style={styles.right}>
            <View
              style={[
                styles.status,
                item.is_active ? styles.active : styles.inactive,
              ]}
            >
              <Text style={styles.statusText}>
                {item.is_active ? "Active" : "Hidden"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9CA3AF"
            />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    padding: 10,
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
  price: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  active: {
    backgroundColor: "#14532D",
  },
  inactive: {
    backgroundColor: "#374151",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});
