/**
 * THEME USAGE GUIDE - Light Professional Theme (Justdial Style)
 * 
 * All colors, shadows, spacing, and typography are centralized in:
 * constants/colors.ts
 */

// ============================================================================
// IMPORT THE THEME
// ============================================================================

import { colors, shadows, spacing, radius, typography } from "../../constants/colors";
import { StyleSheet } from "react-native";

// ============================================================================
// EXAMPLE 1: BASIC LOGIN SCREEN
// ============================================================================

/*
export default function LoginScreen() {
  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textTertiary}
        placeholder="Enter email"
      />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
});
*/

// ============================================================================
// EXAMPLE 2: CARD WITH CONTENT
// ============================================================================

/*
<View style={styles.card}>
  <Text style={styles.title}>Service Name</Text>
  <Text style={styles.description}>Description text here</Text>
  
  <Pressable style={styles.actionButton}>
    <Text style={styles.actionButtonText}>View Details</Text>
  </Pressable>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  actionButtonText: {
    color: colors.textInverse,
    fontWeight: "600",
  },
});
*/

// ============================================================================
// EXAMPLE 3: ERROR STATE
// ============================================================================

/*
{error && (
  <View style={styles.errorBanner}>
    <Ionicons name="alert-circle" size={20} color={colors.accent} />
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  errorText: {
    color: colors.accent,
    fontSize: 14,
    flex: 1,
  },
});
*/

// ============================================================================
// EXAMPLE 4: BUTTON VARIANTS
// ============================================================================

/*
// Primary Button
<Pressable style={styles.primaryButton}>
  <Text style={styles.primaryButtonText}>Primary Action</Text>
</Pressable>

// Secondary Button
<Pressable style={styles.secondaryButton}>
  <Text style={styles.secondaryButtonText}>Secondary Action</Text>
</Pressable>

// Danger Button
<Pressable style={styles.dangerButton}>
  <Text style={styles.dangerButtonText}>Delete</Text>
</Pressable>

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontWeight: "600",
    fontSize: 16,
  },
  
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  secondaryButtonText: {
    color: colors.textInverse,
    fontWeight: "600",
    fontSize: 16,
  },
  
  dangerButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  dangerButtonText: {
    color: colors.textInverse,
    fontWeight: "600",
    fontSize: 16,
  },
});
*/

// ============================================================================
// EXAMPLE 5: LIST ITEM / ROW
// ============================================================================

/*
<View style={styles.listItem}>
  <View style={styles.listItemContent}>
    <Text style={styles.listItemTitle}>Item Title</Text>
    <Text style={styles.listItemSubtitle}>Subtitle</Text>
  </View>
  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
</View>

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xs,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  listItemSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
*/

// ============================================================================
// COLOR PALETTE REFERENCE
// ============================================================================

/*
PRIMARY COLORS:
- colors.background: #FFFFFF (main background)
- colors.surface: #F9FAFB (card/surface background)
- colors.surfaceAlt: #F3F4F6 (alternate surface)

BRAND COLORS:
- colors.primary: #22C55E (green - main actions)
- colors.primaryLight: #DCFCE7 (light green background)
- colors.primaryDark: #16A34A (dark green hover)

- colors.secondary: #2563EB (blue - secondary actions)
- colors.secondaryLight: #DBEAFE (light blue background)
- colors.secondaryDark: #1D4ED8 (dark blue hover)

- colors.accent: #EF4444 (red - destructive/alerts)
- colors.accentLight: #FEE2E2 (light red background)
- colors.accentDark: #DC2626 (dark red hover)

TEXT COLORS:
- colors.textPrimary: #111827 (main text, darkest)
- colors.textSecondary: #6B7280 (secondary text, muted)
- colors.textTertiary: #9CA3AF (tertiary text, lightest)
- colors.textInverse: #FFFFFF (text on colored backgrounds)

UTILITY:
- colors.border: #E5E7EB (borders)
- colors.borderLight: #F3F4F6 (light borders)
- colors.divider: #D1D5DB (dividers)

STATUS:
- colors.success: #22C55E (green)
- colors.warning: #F59E0B (orange)
- colors.error: #EF4444 (red)
- colors.info: #2563EB (blue)
*/

// ============================================================================
// SHADOW REFERENCE
// ============================================================================

/*
Shadows come in 4 levels:

shadows.xs - Very subtle (1px shadow)
  Use for: Slight elevation, hover states

shadows.sm - Subtle (2px shadow)
  Use for: Input fields, small cards, buttons

shadows.md - Medium (4px shadow)
  Use for: Regular cards, modals, floating buttons

shadows.lg - Strong (8px shadow)
  Use for: Modals, overlays, prominent cards

Apply with spread operator:
  ...shadows.md
*/

// ============================================================================
// SPACING REFERENCE
// ============================================================================

/*
spacing.xs: 4px
spacing.sm: 8px
spacing.md: 12px
spacing.lg: 16px
spacing.xl: 20px
spacing['2xl']: 24px
spacing['3xl']: 32px

Use consistently for margins and padding throughout the app.
*/

// ============================================================================
// BORDER RADIUS REFERENCE
// ============================================================================

/*
radius.xs: 4px (subtle)
radius.sm: 6px (small)
radius.md: 8px (medium)
radius.lg: 12px (large)
radius.xl: 16px (extra large)
radius.full: 999px (pill/circle)

Use radius.lg (12px) as default for most components.
*/

// ============================================================================
// COMPONENT TEMPLATE
// ============================================================================

/*
// Template for new components:

import { StyleSheet } from "react-native";
import { colors, shadows, spacing, radius } from "../constants/colors";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Title</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Action</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  buttonText: {
    color: colors.textInverse,
    fontWeight: "600",
  },
});
*/
