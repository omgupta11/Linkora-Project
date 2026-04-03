/**
 * SEARCH BAR COMPONENT USAGE EXAMPLES
 * app/components/SearchBar.tsx
 */

// ============================================================================
// EXAMPLE 1: BASIC USAGE (Consumer Home Page)
// ============================================================================

// import SearchBar from "../components/SearchBar";
//
// export default function ConsumerHome() {
//   const handleResultSelect = (result) => {
//     console.log("Selected service:", result.title);
//     router.push(`/service/${result.id}`);
//   };
//
//   return (
//     <View style={{ flex: 1 }}>
//       <Header />
//       <SearchBar onResultSelect={handleResultSelect} />
//       {/* Services list */}
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 2: WITH CUSTOM LOCATION
// ============================================================================

// import SearchBar from "../components/SearchBar";
// import { useState } from "react";
//
// export default function ConsumerHome() {
//   const [location, setLocation] = useState("Mumbai");
//
//   return (
//     <SearchBar 
//       location={location}
//       onLocationChange={setLocation}
//       onResultSelect={(result) => {
//         console.log(`Selected: ${result.title}`);
//       }}
//     />
//   );
// }

// ============================================================================
// EXAMPLE 3: WITH SEARCH CALLBACK
// ============================================================================

// import SearchBar from "../components/SearchBar";
// import { useEffect } from "react";
//
// export default function SearchPage() {
//   const handleSearch = (query) => {
//     console.log(`User searched for: ${query}`);
//     // Do additional filtering or analytics
//   };
//
//   return (
//     <SearchBar 
//       placeholder="Find services..."
//       onSearch={handleSearch}
//     />
//   );
// }

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

// interface SearchBarProps {
//   location?: string;              // Current location (default: "Kanpur")
//   onLocationChange?: (loc) => void;  // Location changed callback
//   onResultSelect?: (result) => void; // Result selected callback
//   placeholder?: string;           // Input placeholder text
//   onSearch?: (query) => void;     // Search query callback
// }

// interface SearchResult {
//   id: number;
//   title: string;
//   category: string;
//   price: number;
//   provider_name?: string;
// }

// ============================================================================
// VISUAL LAYOUT
// ============================================================================

// ┌──────────────────────────────────────────────────────┐
// │ [📍 Kanpur ▼]  [🔍  Search services...          ✕]  │  ← Search Row
// ├──────────────────────────────────────────────────────┤
// │ 💼 Service Name 1                            >       │
// │    Plumbing • ₹500 • John's Services                │
// ├──────────────────────────────────────────────────────┤
// │ 💼 Service Name 2                            >       │
// │    Electrical • ₹800 • Mike's Services              │
// ├──────────────────────────────────────────────────────┤
// │ 💼 Service Name 3                            >       │
// │    Cleaning • ₹300 • Clean Team                     │
// └──────────────────────────────────────────────────────┘  ← Dropdown Results

// ============================================================================
// KEY FEATURES
// ============================================================================

// 1. LOCATION BUTTON
//    - Left side
//    - Shows current location (default: "Kanpur")
//    - Has dropdown arrow
//    - Clickable to change location

// 2. SEARCH INPUT
//    - Right side
//    - Height: 50px
//    - Border radius: 12px
//    - Background: light gray (#F3F4F6)
//    - Search icon on left
//    - Clear (×) button on right (when typing)

// 3. API INTEGRATION
//    - Debounce: 300ms
//    - Endpoint: GET /api/services/?search=query
//    - Shows loading spinner while fetching
//    - Error handling with fallback UI

// 4. RESULTS DROPDOWN
//    - Appears below search bar
//    - Shows up to N results
//    - Each result has icon, title, category, price
//    - Pressing result triggers callback
//    - No results state with helpful text
//    - Auto-dismiss on selection

// ============================================================================
// STYLING REFERENCE
// ============================================================================

// COLORS:
// - Background: White (#FFFFFF)
// - Search background: Light gray (#F3F4F6)
// - Text primary: Dark gray (#111827)
// - Text secondary: Medium gray (#6B7280)
// - Primary accent: Green (#22C55E)
// - Border: Light border (#E5E7EB)

// SPACING:
// - Padding: 16px (spacing.lg)
// - Gap between items: 8px (spacing.sm)

// SHADOWS:
// - Search bar: shadows.xs (subtle)
// - Dropdown: shadows.lg (prominent)

// ============================================================================
// DEBOUNCE BEHAVIOR
// ============================================================================

// User types:
// "p" → wait 300ms, no API call yet
// "pl" → reset timer, wait 300ms
// "plu" → reset timer, wait 300ms
// [300ms passes] → API call with "plu"
// Results appear

// This prevents too many API calls while user is typing.
// Common pattern in search UX.

// ============================================================================
// API ENDPOINT FORMAT
// ============================================================================

// GET /api/services/?search=query
//
// Response format expected:
// [
//   {
//     id: 1,
//     title: "Plumbing Repair",
//     category: "Plumbing",
//     price: 500,
//     provider_name: "John's Services"
//   },
//   ...
// ]

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Network error:
// ┌────────────────────────────────────────┐
// │ ⚠️ Failed to search. Please try again. │
// └────────────────────────────────────────┘

// No results:
// ┌────────────────────────────────────────┐
// │          🔍                             │
// │      No services found                 │
// │    Try different keywords              │
// └────────────────────────────────────────┘

// Loading:
// ┌────────────────────────────────────────┐
// │      ⟳ Searching...                    │
// └────────────────────────────────────────┘

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

// [ ] Import SearchBar component
// [ ] Add to screen JSX
// [ ] Handle onResultSelect callback
// [ ] Test with real API data
// [ ] Check debounce behavior (300ms)
// [ ] Verify error states
// [ ] Test clear button (×)
// [ ] Test location button
// [ ] Check dropdown positioning
// [ ] Test on different screen sizes

// ============================================================================
// FUTURE ENHANCEMENTS
// ============================================================================

// - Add location dropdown selector
// - Add search history/recent searches
// - Add category filters
// - Add price range filter
// - Add rating filter
// - Add favorite services star
// - Add advanced search options
// - Add voice search
// - Add barcode/QR code scan

export {};
