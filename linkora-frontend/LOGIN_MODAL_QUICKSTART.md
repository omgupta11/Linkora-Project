# 🔐 LoginModal - Quick Start Guide

## 30-Second Setup

```tsx
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import LoginModal from "./components/LoginModal";
import api from "../lib/api";

export default function YourScreen() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowLogin(true)}>
        <Text>Login</Text>
      </TouchableOpacity>

      <LoginModal
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </>
  );
}
```

## File Locations

| File | Purpose |
|------|---------|
| `app/components/LoginModal.tsx` | Main component |
| `LOGIN_MODAL_COMPONENT.md` | Full documentation |
| `app/components/LoginModal.example.tsx` | 6 usage examples |

## Props at a Glance

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `visible` | boolean | ✅ | Show/hide modal |
| `onClose` | () => void | ✅ | Handle close |
| `onLogin` | (phone: string) => Promise<void> | ✅ | API handler |
| `onSkip` | () => void | ❌ | Guest mode |
| `isLoading` | boolean | ❌ | Loading spinner |

## Features at a Glance

✅ **Phone Validation** - Only accepts 10 digits
✅ **Terms Checkbox** - User must agree
✅ **Error Messages** - Displays validation + API errors
✅ **Loading State** - Spinner button
✅ **Skip Option** - Continue as guest
✅ **Clean Design** - Justdial style, white card, green button
✅ **Keyboard Handling** - Auto-adjusts on iOS/Android
✅ **Accessibility** - AAA compliant, 48px touch targets

## Visual Components

```
Modal Overlay (semi-transparent black)
    ↓
White Card (centered, 16px radius)
    ├─ Close Button (X)
    ├─ Title: "Welcome"
    ├─ Subtitle: "Login for seamless experience"
    ├─ Phone Input (🇮🇳 +91 [10 digits])
    ├─ Helper Text (shows formatted phone)
    ├─ Checkbox (with Terms text)
    ├─ Error Message (red, if any)
    ├─ Green Login Button
    └─ Skip Link
```

## Color Palette

| Usage | Color | Hex |
|-------|-------|-----|
| Card Background | White | #FFFFFF |
| Text | Dark Gray | #111827 |
| Subtle Text | Medium Gray | #6B7280 |
| Login Button | Green | #22C55E |
| Error | Red | #EF4444 |
| Borders | Light Gray | #E5E7EB |
| Overlay | Black (50%) | rgba(0,0,0,0.5) |

## Button States

| State | Background | Text | Clickable |
|-------|-----------|------|-----------|
| Valid Input ✓ | Green | White | ✅ Yes |
| Invalid Input | Gray | Gray | ❌ No |
| Loading ⏳ | Green | Spinner | ❌ No |
| Terms Not Checked | Gray | Gray | ❌ No |

## Phone Input Behavior

| Input | Validation | Status |
|-------|------------|--------|
| Empty | ✗ Invalid | Button disabled |
| "123" | ✗ Invalid (< 10) | Button disabled |
| "9876543210" | ✓ Valid | Button enabled |
| "abc123" | Auto-cleaned | Only digits kept |
| "9876543210" + more | Max 10 | Extra chars ignored |

## Example: Complete Setup in Home Screen

```tsx
// app/index.tsx or app/(consumer)/home.tsx
import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import LoginModal from "./components/LoginModal";
import Header from "./components/Header";
import api from "../lib/api";
import { router } from "expo-router";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/send-otp/", {
        phone: "+91" + phone,
      });
      
      // Navigate to OTP verification
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { phone: "+91" + phone },
      });
      
      setShowLoginModal(false);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header 
        onLoginPress={() => setShowLoginModal(true)}
      />
      
      {/* Rest of your home content */}

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </View>
  );
}
```

## API Integration

### Send OTP Endpoint

```
POST /api/auth/send-otp/
Content-Type: application/json

Request:
{
  "phone": "+91" + phone  // e.g. "+919876543210"
}

Response (200):
{
  "message": "OTP sent successfully",
  "request_id": "xyz123"  // Optional, for verification
}

Error (400):
{
  "error": "Phone number already registered"
}
```

### In Your Component

```tsx
const handleLogin = async (phone: string) => {
  try {
    const response = await api.post("/api/auth/send-otp/", {
      phone: "+91" + phone,  // IMPORTANT: Add country code
    });

    // Success - navigate to OTP screen
    router.push({
      pathname: "/(auth)/otp-verify",
      params: {
        phone: "+91" + phone,
        requestId: response.data.request_id,
      },
    });
  } catch (error: any) {
    // Error is caught by LoginModal
    throw error;
  }
};
```

## Common Patterns

### Pattern 1: Simple Button Click

```tsx
<Button 
  title="Login" 
  onPress={() => setShowLogin(true)} 
/>
<LoginModal visible={showLogin} onClose={() => setShowLogin(false)} ... />
```

### Pattern 2: In Header

```tsx
<Header onLoginPress={() => setShowLogin(true)} />
<LoginModal visible={showLogin} ... />
```

### Pattern 3: On App Launch (Auto-show)

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setShowLogin(true);
  }, 1500); // Show after 1.5s

  return () => clearTimeout(timer);
}, []);
```

### Pattern 4: With Skip Handler

```tsx
const handleSkip = () => {
  // User wants to continue without login
  router.push("/(consumer)/home");
};

<LoginModal
  onSkip={handleSkip}
  ...
/>
```

## Testing Checklist

- [ ] Modal appears when `visible={true}`
- [ ] Modal closes when clicking X
- [ ] Phone input only accepts digits
- [ ] Button disabled with < 10 digits
- [ ] Button disabled if checkbox unchecked
- [ ] Error displays if API fails
- [ ] Loading spinner shows during request
- [ ] Form resets on successful login
- [ ] Skip button closes modal
- [ ] Keyboard doesn't overlap inputs
- [ ] Works on iPhone and Android
- [ ] Text scales with device settings

## Performance Tips

1. **Don't create multiple modals** - Reuse one in each screen
2. **Use setIsLoading** - Prevents multiple submissions
3. **Reset error on input** - Auto-clear error text
4. **Memoize handlers** - Use useCallback for expensive operations

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Button won't enable | Check phone is 10 digits AND checkbox is checked |
| Keyboard overlaps input | Modal uses KeyboardAvoidingView - should auto-fix |
| Error doesn't clear | Error clears on new input or modal close |
| Phone number lost | Check your onClose handler - it resets the form |
| Modal won't show | Verify `visible={true}` prop is set |
| API not called | Check onLogin handler is throwing errors correctly |

## Next Steps

1. ✅ Copy LoginModal component
2. ✅ Add to your home/landing screen
3. ✅ Create API endpoint for `/api/auth/send-otp/`
4. ✅ Create OTP verification screen
5. ✅ Link navigation to verification
6. ✅ Test on device

## Integration Timeline

| Step | Time |
|------|------|
| Copy component | 1 min |
| Add to screen | 2 min |
| Wire up states | 2 min |
| API integration | 5 min |
| Test validation | 3 min |
| **Total** | **~15 min** |

## File Dependencies

```
LoginModal.tsx depends on:
├── react-native (core)
├── expo-vector-icons (Ionicons)
└── constants/colors.ts (theme)

No other dependencies! ✨
```

---

**Status:** Ready to Use ✅
**Lines of Code:** ~400 LOC
**Component Type:** Modal Dialog
**Theme:** Light Professional
**OTP Validation:** Server-side recommended
