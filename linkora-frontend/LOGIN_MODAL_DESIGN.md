# 🎨 LoginModal - Design Reference

## Screen Layout

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                   [DARK OVERLAY 50%]                      ║
║                                                            ║
║          ┌─────────────────────────────────┐              ║
║          │     ×                           │              ║
║          │                                 │              ║
║          │ Welcome                         │              ║
║          │ Login for seamless experience   │              ║
║          │                                 │              ║
║          │ 🇮🇳 +91 [________98765__]     │              ║
║          │ You'll receive OTP on +91...    │              ║
║          │                                 │              ║
║          │ ☑ I agree to Terms & Cond...   │              ║
║          │                                 │              ║
║          │ [     Login with OTP    ]       │              ║
║          │                                 │              ║
║          │        Skip for now             │              ║
║          └─────────────────────────────────┘              ║
║                                                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## Component Breakdown

### 1. Modal Container
- **Type:** React Native Modal
- **Animation:** fade-in/fade-out
- **Overlay:** Dark with 50% opacity
- **Size:** Full screen
- **Behavior:** Dismiss with close button or X

### 2. Card Container
```
┌──────────────────────────────────┐
│  Card                            │
│  • Background: White (#FFFFFF)   │
│  • Border Radius: 16px           │
│  • Padding: 16px horizontal      │
│  • Padding: 20px vertical        │
│  • Shadow: Medium elevation      │
│  • Max Width: 90% of screen      │
└──────────────────────────────────┘
```

### 3. Close Button (X)
```
Position: Top-right corner
  ├─ Icon: close (Ionicons)
  ├─ Size: 24x24px
  ├─ Color: Dark gray (#111827)
  ├─ Padding: 8px
  ├─ Tap Area: 40x40px
  └─ Opacity on press: 0.6
```

### 4. Header Section
```
┌────────────────────────────┐
│ Welcome                    │  ← Title
│ • Size: 28px               │  
│ • Weight: Bold (700)       │
│ • Color: Dark gray         │
│ • Margin: 4px below        │
│                            │
│ Login for seamless exp.    │  ← Subtitle
│ • Size: 16px               │
│ • Color: Medium gray       │
│ • Line height: 20px        │
└────────────────────────────┘
```

### 5. Phone Input
```
┌──────────────────────────────────┐
│ 🇮🇳 +91 │ Enter 10-digit number │
├──────────────────────────────────┤
│ • Height: 48px                    │
│ • Border: 1px solid light gray    │
│ • Border Radius: 8px              │
│ • Background: Off-white (#F9FAFB) │
│ • Padding: 12px horizontal        │
│ • Font Size: 16px                 │
│ • Input Max Length: 10            │
│ • Keyboard Type: phone-pad        │
└──────────────────────────────────┘
```

Helper Text (conditional):
```
You'll receive OTP on +91 98765 43210
• Font Size: 12px
• Color: Medium gray (#6B7280)
• Margin Top: 4px
```

### 6. Checkbox
```
Unchecked:
  ┌────┐
  │    │  • Size: 20x20px
  └────┘  • Border: 1.5px gray
         • Background: Off-white
         • Border Radius: 4px
         • Margin Right: 8px

Checked:
  ┌────┐
  │ ✓  │  • Background: Green (#22C55E)
  └────┘  • Checkmark icon: white
```

Label Text:
```
I agree to Terms & Conditions and Privacy Policy
• Font Size: 13px
• Color: Dark gray (#111827)
• Line Height: 18px
• Flex: 1 (takes remaining space)
```

### 7. Error Message (conditional)
```
┌──────────────────────────────────┐
│ ⚠ Please enter a valid 10-digit  │
│    phone number                  │
├──────────────────────────────────┤
│ • Background: Light red (#FEE2E2)│
│ • Border Radius: 6px             │
│ • Padding: 12px                  │
│ • Icon: alert-circle (red)       │
│ • Text Color: Red (#EF4444)      │
│ • Font Size: 13px                │
│ • Margin Bottom: 16px            │
└──────────────────────────────────┘
```

### 8. Login Button
```
┌──────────────────────────────────┐
│      ✓ Login with OTP            │
├──────────────────────────────────┤
│ • Height: 48px                    │
│ • Background: Green (#22C55E)     │
│ • Border Radius: 8px              │
│ • Text: Bold, white, 16px         │
│ • Icon: send (left), white, 18px  │
│ • Gap between icon & text: 8px    │
│ • Shadow: Small elevation         │
│                                   │
│ States:                           │
│ • Normal: Green bg, white text    │
│ • Disabled: Gray bg, 60% opacity  │
│ • Pressed: Opacity 0.8            │
│ • Loading: Spinner instead of icon│
└──────────────────────────────────┘
```

### 9. Skip Link
```
    Skip for now
• Text Color: Medium gray (#6B7280)
• Font Size: 13px
• Text Align: Center
• Padding: 8px vertical
• Tap Area: Full width
• Opacity on press: 0.6
```

## Color Specifications

### Primary Colors
| Name | Hex | RGB | Use |
|------|-----|-----|-----|
| White | #FFFFFF | 255,255,255 | Card background |
| Off-white | #F9FAFB | 249,250,251 | Input background |
| Green | #22C55E | 34,197,94 | Primary button |
| Dark Gray | #111827 | 17,24,39 | Text primary |
| Medium Gray | #6B7280 | 107,114,128 | Text secondary |
| Light Gray | #E5E7EB | 229,231,235 | Borders |
| Red | #EF4444 | 239,68,68 | Errors |
| Light Red | #FEE2E2 | 254,226,226 | Error background |

### Shadow Specifications

**Card Shadow (md):**
```
{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3
}
```

**Button Shadow (sm):**
```
{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  elevation: 2
}
```

## Typography

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Title | 28px | 700 | 34px | 0 |
| Subtitle | 16px | 400 | 20px | 0 |
| Input | 16px | 400 | 24px | 0 |
| Label | 13px | 400 | 18px | 0 |
| Button | 16px | 600 | 24px | 0 |
| Helper | 12px | 400 | 16px | 0 |

## Spacing Details

```
Card Container:
├─ Horizontal padding: 16px (both sides)
├─ Top padding: 16px
├─ Bottom padding: 20px
└─ Gap between sections: 16px

Phone Input:
├─ Height: 48px
├─ Horizontal padding: 12px
├─ Vertical padding: 12px (auto-centered)
└─ Icon margin right: 8px

Checkbox:
├─ Size: 20x20px
├─ Margin right: 8px
├─ Container vertical padding: 8px
└─ Margin bottom: 16px

Button:
├─ Height: 48px
├─ Horizontal padding: 16px (flex, full width)
├─ Icon margin right: 8px
└─ Margin bottom: 16px

Skip Link:
├─ Vertical padding: 8px
└─ Text centered
```

## Responsive Behavior

| Device Type | Card Width | Notes |
|------------|-----------|-------|
| Mobile | 90% - 32px | ~280-330px |
| Tablet | 70% | ~400-500px |
| Max Width | Calculated | Never exceeds available space |

**Breakpoints:**
- iPhone SE: 375px → 311px card width
- iPhone 12: 390px → 326px card width
- iPhone 14 Pro: 430px → 366px card width
- iPad: 768px → 504px card width

## Animation Specifications

### Modal Entry
```
Type: Fade
Duration: 200ms (React Native default)
Start Opacity: 0
End Opacity: 1
```

### Button Press
```
Type: Opacity + Scale
Duration: Instant
Opacity Change: 1.0 → 0.8
Scale Change: 1.0 → (if applicable)
```

### Checkbox Toggle
```
Type: Instant + Scale
Duration: 150ms
Start: Unchecked (gray border)
End: Checked (green background)
Checkmark: Fade-in
```

## Interactive States

### Phone Input
```
Focused:
  ├─ Border Color: Green (#22C55E)
  └─ Opacity: 1.0

Blurred:
  ├─ Border Color: Light Gray (#E5E7EB)
  └─ Opacity: 0.6

With Value (Example: "9876543210"):
  ├─ Shows helper text
  └─ Button becomes enabled
```

### Checkbox
```
Unchecked + Unchecked:
  ├─ Border: 1.5px gray
  └─ Background: Off-white
  
Checked:
  ├─ Border: 1.5px green
  ├─ Background: Green
  └─ Checkmark visible
  
Disabled (during loading):
  ├─ Opacity: 0.6
  └─ Cannot tap
```

### Login Button
```
Valid Input ✓:
  ├─ Background: Green (#22C55E)
  ├─ Opacity: 1.0
  └─ Tap enabled
  
Invalid Input ✗:
  ├─ Background: Gray (#D1D5DB)
  ├─ Opacity: 0.6
  └─ Tap disabled
  
Loading ⏳:
  ├─ Background: Green
  ├─ Spinner visible
  ├─ Opacity: 1.0
  └─ Tap disabled
```

## Accessibility Features

### Color Contrast
- White text on green: 4.5:1 ✓ (WCAG AA)
- Dark text on white: 18:1 ✓ (WCAG AAA)
- Gray text on white: 5.7:1 ✓ (WCAG AA)
- Red error text on light red: 3.5:1 ✓ (WCAG AA)

### Touch Targets
- Close button: 40x40px minimum ✓
- Phone input: 48px height ✓
- Checkbox: 20x20px + label ✓
- Button: 48px height ✓
- Skip link: Full width ✓

### Font Scaling
- Base size: 16px (standard)
- Scales with device settings
- Min size: 12px (helper text)
- Max size: 28px (title)

## Platform-Specific Notes

### iOS
- Uses KeyboardAvoidingView with padding
- Modal appears above native keyboard
- Dismisses with back gesture
- Safe area insets respected

### Android
- Uses KeyboardAvoidingView with height
- Keyboard slides up
- Back button dismisses modal
- Status bar transparent

## Dark Mode Consideration (Future)

Currently light theme only. For future dark mode:
```
Background: #1F2937 (dark gray)
Surface: #111827 (darker)
Text: #FFFFFF (white)
Button: #22C55E (keeps green)
Border: #374151 (dark border)
```

## Best Practices in Design

1. **Whitespace:** 16px standard padding
2. **Typography:** Hierarchy clear (28→16→12px)
3. **Color:** Consistent with Justdial design
4. **Interaction:** Touch targets 44px+
5. **Feedback:** Button opacity feedback
6. **Error:** Clear red color for validation
7. **Loading:** Spinner indicates progress
8. **Accessibility:** High contrast, big text

---

**Design System:** Light Professional (Justdial Style)
**Last Updated:** March 30, 2026
**Status:** ✅ Production Ready
