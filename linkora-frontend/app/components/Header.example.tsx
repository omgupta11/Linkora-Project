/**
 * HEADER COMPONENT USAGE EXAMPLES
 * app/components/Header.tsx
 */

// ============================================================================
// EXAMPLE 1: BASIC HEADER WITH AUTH BUTTONS (Landing Page)
// ============================================================================

// import Header from "../components/Header";
//
// export default function LandingPage() {
//   return (
//     <View style={{ flex: 1 }}>
//       <Header 
//         showAuthButtons={true}
//         showLocation={false}
//       />
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 2: HEADER WITH LOCATION (Consumer Home Page)
// ============================================================================

// import Header from "../components/Header";
// import { useState } from "react";
//
// export default function ConsumerHome() {
//   const [location, setLocation] = useState("Kanpur");
//
//   return (
//     <View style={{ flex: 1 }}>
//       <Header 
//         showLocation={true}
//         location={location}
//         showAuthButtons={false}
//       />
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 3: HEADER WITH CUSTOM CALLBACKS
// ============================================================================

// import Header from "../components/Header";
// import { useRouter } from "expo-router";
//
// export default function CustomHeader() {
//   const router = useRouter();
//
//   const handleLogin = () => {
//     console.log("Custom login logic");
//     router.push("/(auth)/login-consumer");
//   };
//
//   const handleSignUp = () => {
//     console.log("Custom signup logic");
//     router.push("/(auth)/register-consumer");
//   };
//
//   return (
//     <View>
//       <Header 
//         showAuthButtons={true}
//         showLocation={true}
//         location="Mumbai"
//         onLoginPress={handleLogin}
//         onSignUpPress={handleSignUp}
//       />
//     </View>
//   );
// }

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

// interface HeaderProps {
//   showLocation?: boolean;      // Show location bar (default: false)
//   location?: string;           // Location text (default: "Kanpur")
//   showAuthButtons?: boolean;   // Show Login/Sign Up (default: true)
//   onLoginPress?: () => void;   // Custom login callback
//   onSignUpPress?: () => void;  // Custom signup callback
// }

// ============================================================================
// STYLING REFERENCE
// ============================================================================

// LAYOUT:
// ┌─────────────────────────────────────────┐
// │ Logo (Left)          Login    Sign Up    │ ← Header Bar
// │                      (right)             │
// ├─────────────────────────────────────────┤
// │ 📍 Kanpur                               │ ← Location Bar (optional)
// └─────────────────────────────────────────┘

// COLORS:
// - Background: White (#FFFFFF)
// - Logo: Blue "Link" + Green "ora"
// - Login button: White bg, green border, green text
// - Sign Up button: Green bg, white text
// - Location: Muted text on light background

// SPACING:
// - Horizontal padding: 16px (spacing.lg)
// - Vertical padding: 12px (spacing.md)
// - Button gap: 8px (spacing.sm)

// SHADOWS:
// - Header bar: shadows.sm (subtle)
// - Sign Up button: shadows.sm

// ============================================================================
// QUICK INTEGRATION STEPS
// ============================================================================

// Step 1: Import Header in your screen
// import Header from "../components/Header";

// Step 2: Add to JSX
// <View style={{ flex: 1 }}>
//   <Header showLocation={true} />
// </View>

// Step 3: For Stack Navigator (global header)
// In _layout.tsx:
// screenOptions={{
//   header: () => <Header showLocation={true} />,
// }}

// Step 4: Customize callbacks if needed
// <Header 
//   onLoginPress={() => router.push("/(auth)/login-consumer")}
//   onSignUpPress={() => router.push("/(auth)/register-consumer")}
// />

// ============================================================================
// RESPONSIVE DESIGN NOTES
// ============================================================================

// The header is optimized for mobile (Expo/React Native).
// For tablet/larger screens, consider:
// - Increasing fontSize for logo
// - Adding more horizontal padding
// - Adjusting button sizes
// 
// Future enhancements:
// - Add hamburger menu for mobile
// - Add search bar for consumer home
// - Add notification icon
// - Add user profile dropdown

// ============================================================================
// ACCESSIBILITY
// ============================================================================

// - Buttons have appropriate touch targets (44px minimum)
// - Color contrast meets WCAG standards
// - Text is scalable with user settings
// - Buttons use pressable state for feedback

export {};
