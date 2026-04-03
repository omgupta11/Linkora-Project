import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";

/** refresh client (no interceptors) */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/** main api */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/** REQUEST INTERCEPTOR */
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/** RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN) */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await refreshClient.post(
          "/api/auth/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const { access } = response.data;

        await SecureStore.setItemAsync("access_token", access);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access}`;

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;