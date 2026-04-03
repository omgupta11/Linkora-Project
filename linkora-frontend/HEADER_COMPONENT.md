# 📱 Header Component (Justdial Style)

## Component Location
`app/components/Header.tsx`

## Visual Layout

```
┌─────────────────────────────────────────┐
│ Linkora          Login      Sign Up     │  ← Header Bar
│ (blue+green)     (outline)  (solid)     │
├─────────────────────────────────────────┤
│ 📍 Kanpur                               │  ← Location Bar (optional)
└─────────────────────────────────────────┘
```

## Quick Usage

```tsx
import Header from "../components/Header";

// Basic header with auth buttons
<Header showAuthButtons={true} />

// Header with location
<Header showLocation={true} location="Mumbai" />

// Header without buttons (logged-in screens)
<Header showAuthButtons={false} />

// Full featured
<Header 
  showLocation={true} 
  location="Kanpur"
  showAuthButtons={true}
  onLoginPress={() => console.log("Login")}
  onSignUpPress={() => console.log("Sign Up")}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showLocation` | boolean | false | Show location bar below header |
| `location` | string | "Kanpur" | Location text to display |
| `showAuthButtons` | boolean | true | Show Login/Sign Up buttons |
| `onLoginPress` | () => void | - | Custom login callback |
| `onSignUpPress` | () => void | - | Custom signup callback |

## Design Details

**Colors:**
- Background: `colors.background` (#FFFFFF)
- Logo: Blue "Link" + Green "ora"
- Login button: Outlined green (border + text)
- Sign Up button: Solid green (filled)
- Location: Muted gray text

**Typography:**
- Logo: 28px, bold, letter-spaced
- Buttons: 14px, bold
- Location: 14px, bold

**Spacing:**
- Horizontal padding: 16px (spacing.lg)
- Vertical padding: 12px (spacing.md)
- Button gap: 8px (spacing.sm)

**Shadows:**
- Header bar: shadows.sm (subtle elevation)
- Sign Up button: shadows.sm

## Default Behavior

**Login Button:**
- Navigates to role selection
- Default: `/role-select?role=consumer`

**Sign Up Button:**
- Navigates to consumer registration
- Default: `/(auth)/register-consumer`

## Usage in Screens

### Landing Page
```tsx
import Header from "../components/Header";

export default function Landing() {
  return (
    <>
      <Header showAuthButtons={true} showLocation={false} />
      {/* Hero section */}
    </>
  );
}
```

### Consumer Home
```tsx
export default function ConsumerHome() {
  return (
    <>
      <Header 
        showLocation={true} 
        location="Kanpur"
        showAuthButtons={false}
      />
      {/* Services list */}
    </>
  );
}
```

### Global Header in Stack Navigator
```tsx
import { Stack } from "expo-router";
import Header from "../components/Header";

export default function ConsumerLayout() {
  return (
    <Stack screenOptions={{
      header: () => <Header 
        showLocation={true} 
        showAuthButtons={false}
      />,
    }}>
      {/* Screens */}
    </Stack>
  );
}
```

## Customization Examples

**Different location:**
```tsx
<Header showLocation={true} location="Mumbai" />
```

**Custom login behavior:**
```tsx
<Header 
  onLoginPress={() => {
    console.log("Custom login");
    router.push("/(auth)/login-provider");
  }}
/>
```

**No location bar:**
```tsx
<Header showLocation={false} />
```

## Features

✅ Justdial-style design
✅ Responsive buttons with press feedback
✅ Light theme (white background)
✅ Soft shadows (not dark theme)
✅ Mobile-optimized sizing
✅ Optional location bar
✅ Customizable callbacks
✅ TypeScript support

## Accessibility

- Touch targets: 44px minimum
- Color contrast: WCAA compliant
- Supports user text scaling
- Visual feedback on button press

## Future Enhancements

- Add search bar for consumer screens
- Add notification badge
- Add user profile dropdown
- Add cart icon
- Add hamburger menu for mobile
