/**
 * Search Bar Component (Justdial Style)
 * app/components/SearchBar.tsx
 * 
 * Features:
 * - Location selector on left
 * - Search input with debounce
 * - Dropdown results
 * - API integration
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../lib/api";
import { colors, spacing, radius, shadows } from "../../constants/colors";

interface SearchResult {
  id: number;
  title: string;
  category: string;
  price: number;
  provider_name?: string;
}

interface SearchBarProps {
  location?: string;
  onLocationChange?: (location: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  location = "Kanpur",
  onLocationChange,
  onResultSelect,
  placeholder = "Search services, providers...",
  onSearch,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ===== DEBOUNCED SEARCH =====
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset if query is empty
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    // Set new timer for debounced search
    setIsLoading(true);
    setError(null);

    debounceTimer.current = setTimeout(async () => {
      try {
        console.log(`🔍 Searching for: "${searchQuery}"`);
        
        const response = await api.get<SearchResult[]>("/api/services/", {
          params: {
            search: searchQuery.trim(),
          },
        });

        console.log(`✅ Found ${response.data.length} results`);
        setResults(response.data);
        setShowResults(true);
        onSearch?.(searchQuery);
      } catch (err: any) {
        console.log(`❌ Search error: ${err?.message}`);
        setError("Failed to search. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, onSearch]);

  // ===== HANDLE RESULT SELECT =====
  const handleResultSelect = (result: SearchResult) => {
    console.log(`📍 Selected: ${result.title}`);
    setSearchQuery(result.title);
    setShowResults(false);
    onResultSelect?.(result);
  };

  // ===== RENDER SEARCH RESULT ITEM =====
  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <Pressable
      onPress={() => handleResultSelect(item)}
      style={({ pressed }) => [
        styles.resultItem,
        pressed && styles.resultItemPressed,
      ]}
    >
      <View style={styles.resultIconContainer}>
        <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
      </View>

      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultMeta}>
          {item.category} • ₹{item.price}
          {item.provider_name && ` • ${item.provider_name}`}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textTertiary}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Location + Search Row */}
      <View style={styles.searchRow}>
        {/* Location Button */}
        <Pressable style={styles.locationButton}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>

        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                setResults([]);
                setShowResults(false);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Results Dropdown */}
      {showResults && (
        <View style={styles.dropdownContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderResultItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons
                name="search-outline"
                size={24}
                color={colors.textTertiary}
              />
              <Text style={styles.noResultsText}>No services found</Text>
              <Text style={styles.noResultsSubText}>
                Try different keywords
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ===== MAIN CONTAINER =====
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },

  // ===== SEARCH ROW =====
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },

  // ===== LOCATION BUTTON =====
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  locationText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },

  // ===== SEARCH INPUT CONTAINER =====
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.xs,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },

  // ===== DROPDOWN CONTAINER =====
  dropdownContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 65,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    maxHeight: 400,
    zIndex: 1000,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ===== RESULT ITEM =====
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  resultItemPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  resultMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  // ===== SEPARATOR =====
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // ===== LOADING STATE =====
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // ===== ERROR STATE =====
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    margin: spacing.md,
  },
  errorText: {
    color: colors.accent,
    fontSize: 14,
    flex: 1,
  },

  // ===== NO RESULTS STATE =====
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  noResultsText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  noResultsSubText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
