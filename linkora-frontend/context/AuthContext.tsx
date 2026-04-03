import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

import api from "../lib/api";

export type User = {
  id: number;
  email: string;
  username?: string;
  phone?: string | null;
  role: "consumer" | "provider";
  is_verified?: boolean;
  consumer_profile?: any;
  provider_profile?: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginProvider: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginConsumer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerProvider: (data: any) => Promise<{ success: boolean; error?: string }>;
  registerConsumer: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

async function clearTokens() {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function fetchMe(): Promise<User> {
    const res = await api.get("/api/auth/me/");
    return res.data;
  }

  async function loadUser() {
    const token = await SecureStore.getItemAsync("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      await clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 MAIN LOGIN FIX
  async function loginWithRole(
    email: string,
    password: string,
    expectedRole: "consumer" | "provider"
  ) {
    try {
      console.log("LOGIN CALL START");

      const res = await api.post("/api/auth/login/", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { access, refresh } = res.data;

      // ✅ SAVE TOKENS
      await SecureStore.setItemAsync("access_token", access);
      await SecureStore.setItemAsync("refresh_token", refresh);

      const me = await fetchMe();

      console.log("USER DATA:", me);

      if (me.role !== expectedRole) {
        await clearTokens();
        setUser(null);
        return {
          success: false,
          error: `Use ${me.role} login instead`,
        };
      }

      setUser(me);

      // ✅ NAVIGATION FIX
      if (expectedRole === "provider") {
        router.replace("/(provider)/dashboard");
      } else {
        router.replace("/(consumer)/home");
      }

      return { success: true };
    } catch (error: any) {
      console.log("LOGIN ERROR FULL:", error?.response?.data || error.message);

      await clearTokens();
      setUser(null);

      return {
        success: false,
        error:
          error?.response?.data?.detail ||
          error.message ||
          "Login failed",
      };
    }
  }

  async function loginConsumer(email: string, password: string) {
    return loginWithRole(email, password, "consumer");
  }

  async function loginProvider(email: string, password: string) {
    return loginWithRole(email, password, "provider");
  }

  async function registerConsumer(data: any) {
    try {
      await api.post("/api/auth/register/", data);
      return loginConsumer(data.email, data.password);
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.detail || "Register failed",
      };
    }
  }

  async function registerProvider(data: any) {
    try {
      await api.post("/api/auth/register/", data);
      return loginProvider(data.email, data.password);
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.detail || "Register failed",
      };
    }
  }

  async function updateUser(userData: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  }

  async function refreshUser() {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      await clearTokens();
      setUser(null);
    }
  }

  async function logout() {
    await clearTokens();
    setUser(null);
    router.replace("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginProvider,
        loginConsumer,
        registerProvider,
        registerConsumer,
        updateUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);