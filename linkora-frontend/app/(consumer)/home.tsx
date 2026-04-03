import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

// Components
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BannerCarousel from "../components/BannerCarousel";
import CategoryGrid from "../components/CategoryGrid";
import ServiceList from "../components/ServiceList";
import LoginModal from "../components/LoginModal";

// Utils
import api from "../../lib/api";
import { colors, spacing } from "../../constants/colors";

// Types
interface Service {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function ConsumerHome() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔄 Refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // 🔐 Login
  const handleLoginPress = () => {
    setShowLoginModal(true);
  };

  const handleLogin = async (phone: string) => {
    setIsLoggingIn(true);
    try {
      const response = await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });

      setShowLoginModal(false);

      router.push({
        pathname: "/(auth)/otp-verify",
        params: {
          phone: "+91" + phone,
          requestId: response?.data?.request_id,
        },
      });
    } catch (error: any) {
      console.log("Login error:", error);
      throw new Error(
        error?.response?.data?.error || "Failed to send OTP"
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSkipLogin = () => {
    setShowLoginModal(false);
  };

  // 🔍 Search
  const handleSearchResultPress = (service: Service) => {
    router.push({
      pathname: "/(consumer)/service-detail",
      params: { serviceId: service.id },
    });
  };

  // 🛠 Service click
  const handleServicePress = (service: Service) => {
    router.push({
      pathname: "/(consumer)/service-detail",
      params: { serviceId: service.id },
    });
  };

  // 📂 Category click
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: "/(consumer)/services",
      params: { category: category.id },
    });
  };

  // 🎯 Banner click
  const handleBannerPress = () => {
    router.push("/(consumer)/services");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <Header
        showLocation
        location="Bengaluru"
        showAuthButtons={!user}
        onLoginPress={handleLoginPress}
        onSignUpPress={handleLoginPress}
      />

      {/* Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ height: spacing.md }} />

        {/* 🔍 Search */}
        <View style={styles.section}>
          <SearchBar
            onResultSelect={handleSearchResultPress} 
            location="Bengaluru"
          />
        </View>

        {/* 🎯 Banner */}
        <View style={styles.section}>
          <BannerCarousel onBannerPress={handleBannerPress} />
        </View>

        {/* 📂 Categories */}
        <View style={styles.section}>
          <CategoryGrid onCategoryPress={handleCategoryPress} />
        </View>

        {/* 🛠 Services */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
          </View>

          <ServiceList
            onServicePress={handleServicePress}
            refreshKey={refreshKey.toString()}
          />
        </View>

        <View style={{ height: spacing.lg }} />
      </ScrollView>

      {/* 🔐 Login Modal */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSkip={handleSkipLogin}
        isLoading={isLoggingIn}
      />
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  servicesSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});