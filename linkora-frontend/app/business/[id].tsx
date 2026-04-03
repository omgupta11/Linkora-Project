// app/business/[id].tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function BusinessDetails() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0B0B0F", "#0F172A", "#0B0B0F"]}
      style={styles.container}
    >
      <View style={styles.imageSection}>
        <Ionicons name="image-outline" size={48} color="#9CA3AF" />
        <Text style={styles.imageText}>Business Images</Text>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <Text style={styles.name}>Glow Salon</Text>
          <Text style={styles.category}>Salon • Beauty</Text>

          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#22C55E" />
            <Text style={styles.ratingText}>4.8 (230 reviews)</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            Glow Salon offers premium beauty and wellness services with certified
            professionals and high‑quality products.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <ServiceItem name="Haircut & Styling" price="₹499+" />
          <ServiceItem name="Facial & Cleanup" price="₹799+" />
          <ServiceItem name="Bridal Package" price="₹4999+" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapBox}>
            <Ionicons name="location-outline" size={26} color="#9CA3AF" />
            <Text style={styles.mapText}>Google Map Preview</Text>
          </View>
          <Pressable>
            <Text style={styles.mapLinkText}>Open in Google Maps</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.action}>
          <Pressable
            style={styles.bookBtn}
            onPress={() => router.push("/service-select")}
          >
            <Text style={styles.bookText}>Book Service</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

function ServiceItem({ name, price }: { name: string; price: string }) {
  return (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.servicePrice}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: {
    height: 240,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: { color: "#9CA3AF", marginTop: 8 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#00000080",
    borderRadius: 20,
    padding: 6,
  },
  section: { paddingHorizontal: 20, marginTop: 24 },
  name: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  category: { fontSize: 14, color: "#9CA3AF", marginTop: 6 },
  rating: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  ratingText: { color: "#D1D5DB", fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 10,
  },
  description: { fontSize: 14, color: "#A1A1AA", lineHeight: 22 },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  serviceName: { color: "#E5E7EB", fontSize: 15 },
  servicePrice: { color: "#22C55E", fontSize: 14 },
  mapBox: {
    height: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  mapText: { color: "#9CA3AF", marginTop: 6 },
  mapLinkText: { color: "#22C55E", fontSize: 14 },
  action: { paddingHorizontal: 20, marginVertical: 30 },
  bookBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  bookText: { color: "#000", fontSize: 16, fontWeight: "600" },
});
