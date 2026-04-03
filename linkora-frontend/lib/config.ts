import Constants from "expo-constants";

/**
 * 🔥 HARD + SMART BASE URL HANDLING
 * Priority:
 * 1. ENV (EXPO_PUBLIC_API_URL)
 * 2. app.json (expo.extra.apiUrl)
 * 3. FALLBACK (your local IP)
 */

function stripTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}

function normalizeApiBase(raw?: string): string {
  if (!raw) return "";
  let url = raw.trim();

  // remove trailing slash
  url = stripTrailingSlash(url);

  // remove /api if mistakenly added
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }

  return stripTrailingSlash(url);
}

// 🔹 ENV
const fromEnv = normalizeApiBase(process.env.EXPO_PUBLIC_API_URL);

// 🔹 app.json extra
const fromExtra = normalizeApiBase(
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl
);

// 🔥 FINAL FALLBACK (VERY IMPORTANT FOR YOU)
const FALLBACK_URL = "http://172.20.10.2:8000";

// ✅ FINAL BASE URL
export const API_BASE_URL =
  fromEnv || fromExtra || FALLBACK_URL;

console.log("🌐 API BASE URL:", API_BASE_URL);

/**
 * ✅ IMAGE URL HELPER
 */
export function getImageUrl(
  relativePath: string | null | undefined
): string | null {
  if (!relativePath) return null;

  if (relativePath.startsWith("http")) {
    return relativePath;
  }

  return `${API_BASE_URL}${relativePath}`;
}