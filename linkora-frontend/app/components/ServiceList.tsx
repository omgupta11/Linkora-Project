import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/config";
import { colors, spacing, radius, shadows, typography } from "../../constants/colors";

interface Service {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  provider_profile: {
    owner_name: string;
    owner_image?: string;
  };
  average_rating?: number;
  review_count?: number;
}

interface ServiceListProps {
  onServicePress?: (service: Service) => void;
  refreshKey?: string;
}

export default function ServiceList({
  onServicePress,
  refreshKey,
}: ServiceListProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchServices = useCallback(
    async (pageNum: number = 1, refresh: boolean = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else if (pageNum === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await api.get("/api/services/", {
          params: {
            page: pageNum,
            limit: 10,
          },
        });

        const newServices = response.data.results || response.data;
        const nextPage = response.data.next ? pageNum + 1 : null;

        if (pageNum === 1 || refresh) {
          setServices(newServices);
        } else {
          setServices((prev) => [...prev, ...newServices]);
        }

        setHasMore(!!nextPage);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchServices(1);
  }, [fetchServices, refreshKey]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      fetchServices(page + 1);
    }
  };

  const handleRefresh = () => {
    fetchServices(1, true);
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => onServicePress?.(item)}
      activeOpacity={0.8}
    >
      {/* Service Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageUrl(item.image) }}
          style={styles.image}
          defaultSource={require("../../assets/images/placeholder.png")}
        />
        {item.average_rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FDB022" />
            <Text style={styles.ratingText}>
              {item.average_rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Service Info */}
      <View style={styles.infoContainer}>
        {/* Title & Category */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.category}>{item.category}</Text>

        {/* Price & Provider */}
        <View style={styles.footerRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.provider}>
            {item.provider_profile.owner_name}
          </Text>
        </View>

        {/* Reviews Count */}
        {item.review_count !== undefined && (
          <Text style={styles.reviewCount}>
            {item.review_count} reviews
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (services.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="search-outline"
          size={48}
          color={colors.textSecondary}
          style={{ marginBottom: spacing.md }}
        />
        <Text style={styles.emptyText}>No services found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={services}
      renderItem={renderServiceCard}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      scrollEnabled={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.loadMoreContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    overflow: "hidden",
    ...shadows.sm,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: colors.surface,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    ...shadows.sm,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  infoContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  category: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  provider: {
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: "50%",
  },
  reviewCount: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  loadMoreContainer: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
});
