# 🎨 Linkora Light Professional Theme

## Theme Object

```typescript
// Import at top of file:
import { colors, shadows, spacing, radius, typography } from "../../constants/colors";
```

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | #22C55E | Primary actions, success states |
| **Secondary** | #2563EB | Secondary actions, info states |
| **Accent** | #EF4444 | Destructive actions, errors |
| **Background** | #FFFFFF | Main background |
| **Surface** | #F9FAFB | Cards, modals |
| **Text Primary** | #111827 | Main text content |
| **Text Secondary** | #6B7280 | Muted/secondary text |
| **Border** | #E5E7EB | Card borders, dividers |

## Spacing Scale

```
xs: 4px
sm: 8px
md: 12px
lg: 16px (default for padding/margin)
xl: 20px
2xl: 24px
3xl: 32px
```

## Border Radius

```
xs: 4px
sm: 6px
md: 8px
lg: 12px (default)
xl: 16px
full: 999px (pill buttons)
```

## Shadows

```
shadows.xs  - Subtle (inputs, small cards)
shadows.sm  - Medium (regular cards)
shadows.md  - Strong (prominent cards)
shadows.lg  - Very strong (modals)
```

## Quick Component Examples

### Button
```tsx
<Pressable style={styles.button}>
  <Text style={styles.buttonText}>Click Me</Text>
</Pressable>

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  buttonText: {
    color: colors.textInverse,
    fontWeight: "600",
  },
});
```

### Card
```tsx
<View style={styles.card}>
  <Text style={styles.title}>Card Title</Text>
  <Text style={styles.description}>Description text</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
```

### Input Field
```tsx
<TextInput
  style={styles.input}
  placeholder="Enter text..."
  placeholderTextColor={colors.textTertiary}
/>

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    color: colors.textPrimary,
    ...shadows.sm,
  },
});
```

### Error Banner
```tsx
<View style={styles.errorBanner}>
  <Ionicons name="alert-circle" color={colors.accent} size={20} />
  <Text style={styles.errorText}>{error}</Text>
</View>

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  errorText: {
    color: colors.accent,
    fontSize: 14,
  },
});
```

## Design Rules

✅ **DO:**
- Use white cards on light background
- Apply soft shadows (shadows.sm/md)
- Use green (#22C55E) for positive actions
- Use red (#EF4444) for destructive actions
- Use blue (#2563EB) for secondary information
- Use spacing.lg (16px) as standard padding
- Use radius.lg (12px) for all major components
- Maintain consistent text hierarchy

❌ **DON'T:**
- Use dark backgrounds (old dark theme)
- Use hard/dark shadows
- Use bright neon colors
- Create dark cards
- Use inconsistent spacing
- Mix different shadow levels randomly

## Current Updated Files

✅ Updated to light theme:
- `app/index.tsx` - Landing page
- `app/(auth)/login-consumer.tsx` - Consumer login
- `app/(auth)/login-provider.tsx` - Provider login
- `constants/colors.ts` - Theme definition

⏳ Still need update:
- `app/(auth)/register-consumer.tsx`
- `app/(auth)/register-provider.tsx`
- `app/(consumer)/` screens
- `app/(provider)/` screens
- Any other dark-themed components

## How to Apply Theme to Existing Files

1. **Import theme:**
   ```tsx
   import { colors, shadows, spacing, radius } from "../../constants/colors";
   ```

2. **Replace hardcoded colors:**
   ```tsx
   // Before
   backgroundColor: "#1F2937"
   
   // After
   backgroundColor: colors.surface
   ```

3. **Use spacing constants:**
   ```tsx
   // Before
   padding: 16,
   marginBottom: 20,
   
   // After
   padding: spacing.lg,
   marginBottom: spacing.xl,
   ```

4. **Apply shadows:**
   ```tsx
   // Before
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 2 },
   
   // After
   ...shadows.sm,
   ```

## Theme File Location

`constants/colors.ts` - Contains all theme definitions
