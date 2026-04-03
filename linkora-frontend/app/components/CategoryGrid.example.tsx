/**
 * CATEGORY GRID COMPONENT USAGE EXAMPLES
 * app/components/CategoryGrid.tsx
 */

// ============================================================================
// EXAMPLE 1: BASIC USAGE (Default Categories)
// ============================================================================

// import CategoryGrid from "../components/CategoryGrid";
//
// export default function ConsumerHome() {
//   return (
//     <View>
//       <Header />
//       <SearchBar />
//       <CategoryGrid />
//     </View>
//   );
// }
// 
// This will use the default 8 categories with auto-navigation.

// ============================================================================
// EXAMPLE 2: CUSTOM CATEGORIES
// ============================================================================

// import CategoryGrid from "../components/CategoryGrid";
//
// const CUSTOM_CATEGORIES = [
//   {
//     id: "plumbing",
//     name: "Plumbing",
//     icon: "water",
//     color: "#2563EB",
//   },
//   {
//     id: "electrical",
//     name: "Electrical",
//     icon: "flash",
//     color: "#FDB022",
//   },
//   {
//     id: "cleaning",
//     name: "Cleaning",
//     icon: "sparkles",
//     color: "#10B981",
//   },
// ];
//
// export default function Services() {
//   return <CategoryGrid categories={CUSTOM_CATEGORIES} />;
// }

// ============================================================================
// EXAMPLE 3: WITH CUSTOM CALLBACK
// ============================================================================

// import CategoryGrid from "../components/CategoryGrid";
//
// export default function ConsumerHome() {
//   const handleCategoryPress = (category) => {
//     console.log(`Selected: ${category.name}`);
//     // Do custom logic here
//     router.push(`/services/${category.id}`);
//   };
//
//   return (
//     <CategoryGrid onCategoryPress={handleCategoryPress} />
//   );
// }

// ============================================================================
// EXAMPLE 4: DIFFERENT COLUMN COUNT (2 COLUMNS)
// ============================================================================

// import CategoryGrid from "../components/CategoryGrid";
//
// export default function Screen() {
//   return (
//     <CategoryGrid 
//       numColumns={2}
//     />
//   );
// }
//
// This creates a 2-column layout instead of 4.

// ============================================================================
// EXAMPLE 5: FULL PAGE WITH ALL COMPONENTS
// ============================================================================

// import { ScrollView, View } from "react-native";
// import Header from "../components/Header";
// import SearchBar from "../components/SearchBar";
// import CategoryGrid from "../components/CategoryGrid";
//
// export default function ConsumerHome() {
//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <Header showLocation={true} showAuthButtons={false} />
//       <SearchBar onResultSelect={(service) => {
//         router.push(`/service/${service.id}`);
//       }} />
//       <CategoryGrid onCategoryPress={(category) => {
//         router.push({
//           pathname: "/(consumer)/services",
//           params: { category: category.id },
//         });
//       }} />
//     </ScrollView>
//   );
// }

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

// interface Category {
//   id: string;           // Unique identifier
//   name: string;         // Display name
//   icon: string;         // Ionicons icon name
//   color: string;        // Hex color for icon background
// }
//
// interface CategoryGridProps {
//   categories?: Category[];       // Custom categories (uses defaults if not provided)
//   onCategoryPress?: (category: Category) => void;  // Custom callback on press
//   numColumns?: number;           // Number of columns (default: 4)
// }

// ============================================================================
// DEFAULT CATEGORIES
// ============================================================================

// The component comes with 8 default categories:
// 1. Electrician (#FDB022 - yellow)
// 2. Plumber (#2563EB - blue)
// 3. Cleaning (#10B981 - green)
// 4. Salon (#EC4899 - pink)
// 5. AC Repair (#06B6D4 - cyan)
// 6. Carpenter (#8B5CF6 - purple)
// 7. Painter (#F97316 - orange)
// 8. Pest Control (#EF4444 - red)

// ============================================================================
// VISUAL LAYOUT (4 COLUMNS)
// ============================================================================

// ┌──────┬──────┬──────┬──────┐
// │  ⚡  │  💧  │  ✨  │  ✂️  │
// │Electric│Plumber│Clean│Salon│
// ├──────┼──────┼──────┼──────┤
// │  ❄️  │  🔨  │  🎨  │  🛡️  │
// │ AC    │ Carp │Paint│Pest  │
// └──────┴──────┴──────┴──────┘

// ============================================================================
// AVAILABLE IONICONS FOR CATEGORIES
// ============================================================================

// Common service icons:
// - "flash" - Electrician
// - "water" - Plumber
// - "sparkles" - Cleaning
// - "cut" - Salon
// - "snow" - AC Repair
// - "hammer" - Carpenter
// - "brush" - Painter
// - "shield-checkmark" - Pest Control
// - "home" - Home Services
// - "build" - Construction
// - "fitness" - Gym/Fitness
// - "restaurant" - Catering
// - "school" - Education
// - "medical" - Medical
// - "car" - Auto Services
// - "paw" - Pet Services
// - "flower" - Garden

// See: https://ionicons.com/

// ============================================================================
// STYLING REFERENCE
// ============================================================================

// LAYOUT:
// - Grid: 4 columns
// - Spacing: 8px between items (spacing.sm)
// - Padding: 16px horizontal, 16px vertical (spacing.lg)
// - Container width: dynamic based on screen width

// CARD:
// - Background: White (#FFFFFF)
// - Border: 1px light gray (#F3F4F6)
// - Border radius: 12px (radius.lg)
// - Shadow: shadows.sm (subtle)
// - Padding: 12px (spacing.md)

// ICON:
// - Size: 32px
// - Container: 56x56px
// - Container radius: 12px
// - Container background: Color with 20% opacity

// LABEL:
// - Font size: 12px
// - Font weight: 600
// - Color: Dark gray (#111827)
// - Text align: center
// - Max lines: 2

// ============================================================================
// ANIMATIONS
// ============================================================================

// Each item has:
// - FadeInUp animation
// - 50ms stagger between items
// - Press feedback: scale 0.95 + opacity 0.8
// - No animation performance impact (uses react-native-reanimated)

// ============================================================================
// PRESS BEHAVIOR
// ============================================================================

// On press:
// 1. Visual feedback: Card scales down to 0.95 + opacity 0.8
// 2. Console log: "📂 Selected category: {name}"
// 3. Callback: onCategoryPress called if provided
// 4. Default: Navigate to /(consumer)/services with category params

// ============================================================================
// RESPONSIVE BEHAVIOR
// ============================================================================

// - Automatically adjusts column width based on screen width
// - Maintains 4-column layout on most phones
// - Recalculates on orientation change
// - Gap between items: always 8px

// ============================================================================
// CUSTOMIZATION IDEAS
// ============================================================================

// 1. Add category count badge
//    <View style={{position: 'absolute', top: 4, right: 4}}>
//      <Text>123</Text>
//    </View>

// 2. Add favorite star icon
//    <Ionicons name={isFavorite ? "star" : "star-outline"} />

// 3. Add category image instead of icon
//    <Image source={require('./category.png')} />

// 4. Add hover effect with gradient background
//    Use LinearGradient on pressed state

// 5. Show category description on press
//    <Modal visible={selectedCategory}>
//      <CategoryDetail category={selectedCategory} />
//    </Modal>

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

// [ ] Import CategoryGrid component
// [ ] Add to screen JSX
// [ ] Test default categories display
// [ ] Test press interaction
// [ ] Verify navigation works
// [ ] Check animation performance
// [ ] Test on different screen sizes
// [ ] Customize colors if needed
// [ ] Customize categories if needed
// [ ] Test custom callback if used
// [ ] Verify touch feedback (scale + opacity)

// ============================================================================
// PERFORMANCE NOTES
// ============================================================================

// - Uses FlatList for efficient rendering
// - Animations use react-native-reanimated (60fps)
// - No unnecessary re-renders (memoization ready)
// - Optimized for lists of 8-20 categories
// - Lazy loads if needed with ScrollView

// ============================================================================
// ACCESSIBILITY
// ============================================================================

// - Touch targets: 56px icon containers (44px+ minimum)
// - Color contrast: AAA compliant
// - Icon + text: Clear visual hierarchy
// - Supports larger text sizes
// - No animation flashing

export {};
