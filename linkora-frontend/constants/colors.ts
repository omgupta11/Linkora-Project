/**
 * Global Light Professional Theme (Justdial Style)
 * Clean, modern, minimalist design with soft shadows
 */

export const colors = {
  // Primary Colors
  background: "#FFFFFF",
  surface: "#F9FAFB",
  surfaceAlt: "#F3F4F6",
  
  // Brand Colors
  primary: "#22C55E",     // Green - Primary actions
  primaryLight: "#DCFCE7",
  primaryDark: "#16A34A",
  
  secondary: "#2563EB",   // Blue - Secondary actions
  secondaryLight: "#DBEAFE",
  secondaryDark: "#1D4ED8",
  
  accent: "#EF4444",      // Red - Destructive actions, alerts
  accentLight: "#FEE2E2",
  accentDark: "#DC2626",
  
  // Text Colors
  textPrimary: "#111827",      // Dark text
  textSecondary: "#6B7280",    // Muted text
  textTertiary: "#9CA3AF",     // Light gray text
  textInverse: "#FFFFFF",      // White text (on colored backgrounds)
  
  // Utility Colors
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  divider: "#D1D5DB",
  
  // Status Colors
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#2563EB",
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.1)",
};

/**
 * Shadow utilities for light theme
 */
export const shadows = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};

/**
 * Spacing scale
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

/**
 * Border radius
 */
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

/**
 * Typography
 */
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
    textTransform: "uppercase" as const,
  },
};
