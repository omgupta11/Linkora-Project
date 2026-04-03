// app/(provider)/dashboard.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../lib/config";

// ===== TYPES =====
interface DashboardStats {
  total_bookings: number;
  pending_requests: number;
  completed_jobs: number;
  earnings: number;
}

interface Service {
  id: number;
  title: string;
  price: number;
  image: string | null;
  rating: number | null;
  total_reviews: number;
  category: string;
  is_active: boolean;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // ===== STATE =====
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== FETCH DATA =====
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        console.log("📊 Fetching dashboard stats from /api/bookings/provider/dashboard/...");
        const statsRes = await api.get<DashboardStats>(
          "/api/bookings/provider/dashboard/"
        );
        console.log("✅ Stats received:", statsRes.data);

        if (!cancelled) {
          setStats(statsRes.data);
        }

        console.log("📋 Fetching provider services from /api/services/provider/services/...");
        const servicesRes = await api.get<Service[]>(
          "/api/services/provider/services/"
        );
        console.log("✅ Services received:", servicesRes.data);

        if (!cancelled) {
          setServices(servicesRes.data);
        }
      } catch (err: any) {
        console.error("❌ Error loading dashboard:", err?.response?.data || err.message);
        if (!cancelled) {
          setError(
            err?.response?.data?.error ||
            err?.response?.data?.detail ||
            "Failed to load dashboard"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const businessName =
    user?.provider_profile?.business_name?.trim() || user?.email || "Business";

  // ===== RENDER STATS CARD =====
  function StatCard({
    label,
    value,
    icon,
    color,
  }: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }) {
    return (
      <Animated.View entering={FadeInUp} style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={24} color="#FFF" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  }

  // ===== DELETE SERVICE =====
  async function handleDeleteService(id: number, title: string) {
    Alert.alert("Delete Service", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            setLoading(true);
            console.log(`🗑️ Deleting service ${id}...`);
            await api.delete(`/api/services/${id}/`);
            console.log(`✅ Service ${id} deleted successfully`);
            // Refresh services list
            const response = await api.get("/api/services/provider/services/");
            setServices(response.data);
            Alert.alert("Success", "Service deleted successfully");
          } catch (err) {
            console.log(`❌ Failed to delete service: ${err}`);
            Alert.alert("Error", "Failed to delete service. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  }

  // ===== RENDER SERVICE CARD =====
  function ServiceCard({ item, index }: { item: Service; index: number }) {
    return (
      <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.serviceCard}>
        {item.image ? (
          <Image
            source={{ uri: getImageUrl(item.image) || "" }}
            style={styles.serviceImage}
          />
        ) : (
          <View style={styles.serviceImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>

          <View style={styles.serviceRow}>
            <Text style={styles.servicePrice}>₹{item.price}</Text>
            {item.rating ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FDB022" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.total_reviews})
                </Text>
              </View>
            ) : (
              <Text style={styles.noRating}>No reviews</Text>
            )}
          </View>
        </View>

        <View style={styles.serviceActions}>
          <Pressable
            onPress={() => router.push(`/(provider)/add-service?editId=${item.id}`)}
            style={styles.actionBtn}
          >
            <Ionicons name="pencil" size={18} color="#22C55E" />
          </Pressable>
          <Pressable
            onPress={() => handleDeleteService(item.id, item.title)}
            style={styles.actionBtn}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </LinearGradient>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.errorContainer}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  // ===== LOADING SPINNER =====
  if (loading && stats === null && services.length === 0) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== BUSINESS HEADER ===== */}
        <View style={styles.businessHeader}>
          {/* Cover Image */}
          {user?.provider_profile?.cover_image ? (
            <Image
              source={{
                uri:
                  getImageUrl(user.provider_profile.cover_image) ||
                  "https://via.placeholder.com/400x120",
              }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.coverImagePlaceholder}>
              <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            </View>
          )}

          {/* Owner Image & Info */}
          <View style={styles.businessInfoContainer}>
            {user?.provider_profile?.owner_image ? (
              <Image
                source={{
                  uri: getImageUrl(user.provider_profile.owner_image) || "",
                }}
                style={styles.ownerImage}
              />
            ) : (
              <View style={styles.ownerImagePlaceholder}>
                <Ionicons name="person-circle-outline" size={64} color="#22C55E" />
              </View>
            )}

            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{businessName}</Text>
              {user?.provider_profile?.category && (
                <Text style={styles.businessCategory}>
                  {user.provider_profile.category}
                </Text>
              )}
              <Pressable
                onPress={() =>
                  Alert.alert("Logout", "Are you sure?", [
                    { text: "Cancel" },
                    {
                      text: "Logout",
                      onPress: () => logout(),
                      style: "destructive",
                    },
                  ])
                }
                style={styles.logoutBtn}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ===== STATS CARDS ===== */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Bookings"
            value={stats?.total_bookings || 0}
            icon="calendar"
            color="#3B82F6"
          />
          <StatCard
            label="Pending"
            value={stats?.pending_requests || 0}
            icon="time"
            color="#F59E0B"
          />
          <StatCard
            label="Completed"
            value={stats?.completed_jobs || 0}
            icon="checkmark-circle"
            color="#10B981"
          />
          <StatCard
            label="Earnings"
            value={`₹${stats?.earnings || 0}`}
            icon="wallet"
            color="#8B5CF6"
          />
        </View>

        {/* ===== SERVICES SECTION ===== */}
        <View style={styles.servicesHeader}>
          <Text style={styles.sectionTitle}>My Services</Text>
          <Pressable
            onPress={() => router.push("/(provider)/add-service")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={20} color="#000" />
          </Pressable>
        </View>

        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No services yet</Text>
            <Text style={styles.emptySubText}>
              Create your first service to get started
            </Text>
            <Pressable
              onPress={() => router.push("/(provider)/add-service")}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Add Service</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <ServiceCard item={item} index={index} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#EF4444",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#22C55E",
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "600",
  },

  // ===== HEADER =====
  businessHeader: {
    marginBottom: 32,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#111827",
  },
  coverImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  coverImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  businessInfoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  ownerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#22C55E",
  },
  ownerImagePlaceholder: {
    marginBottom: 12,
  },
  businessInfo: {
    alignItems: "center",
  },
  businessName: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  businessCategory: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "500",
  },

  // ===== STATS =====
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
  },

  // ===== SERVICES =====
  servicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
  },
  emptyButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#22C55E",
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#000",
    fontWeight: "600",
  },

  // ===== SERVICE CARD =====
  serviceCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  serviceImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  serviceCategory: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePrice: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1F2937",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  ratingText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  noRating: {
    color: "#6B7280",
    fontSize: 12,
  },
  serviceActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
});
