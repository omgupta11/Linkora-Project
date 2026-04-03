import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp} style={styles.box}>
        <Ionicons
          name="checkmark-circle"
          size={80}
          color="#22C55E"
        />

        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>
          Your booking has been confirmed
        </Text>

        <Pressable
          style={styles.btn}
          onPress={() => router.replace("/(consumer)/home")}
        >
          <Text style={styles.btnText}>Go to Home</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  btnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
