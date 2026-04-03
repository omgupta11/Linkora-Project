import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RoleSelect() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: "consumer" | "provider" }>();

  const isConsumer = role === "consumer";

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons
          name={isConsumer ? "person-outline" : "briefcase-outline"}
          size={48}
          color="#22C55E"
        />

        <Text style={styles.title}>
          {isConsumer ? "Consumer Access" : "Provider Access"}
        </Text>

        <Text style={styles.subtitle}>
          {isConsumer
            ? "Discover and book trusted local businesses"
            : "Grow your business and reach more customers"}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.primary]}
          onPress={() =>
            router.push(
              isConsumer
                ? "/(auth)/login-consumer"
                : "/(auth)/login-provider"
            )
          }
        >
          <Text style={styles.primaryText}>Login</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() =>
            router.push(
              isConsumer
                ? "/(auth)/register-consumer"
                : "/(auth)/register-provider"
            )
          }
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    marginTop: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#A1A1AA",
    marginTop: 10,
    textAlign: "center",
    maxWidth: "85%",
  },
  actions: {
    gap: 16,
  },
  button: {
    height: 52,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#22C55E",
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#374151",
  },
  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
