# 🔍 Search Bar Component (Justdial Style)

## Component Location
`app/components/SearchBar.tsx`

## Visual Layout

```
┌─────────────────────────────────────────────────┐
│ [📍 Kanpur ▼]  [🔍  Search services...    ✕]  │  ← Search Row
├─────────────────────────────────────────────────┤
│ 💼 Service 1                              >    │
│    Category • ₹Price • Provider Name           │
├─────────────────────────────────────────────────┤
│ 💼 Service 2                              >    │
│    Category • ₹Price • Provider Name           │
└─────────────────────────────────────────────────┘  ← Dropdown (auto-dismiss)
```

## Quick Usage

```tsx
import SearchBar from "../components/SearchBar";

// Basic
<SearchBar />

// With callbacks
<SearchBar 
  location="Mumbai"
  onResultSelect={(result) => {
    console.log("Selected:", result.title);
    router.push(`/service/${result.id}`);
  }}
/>

// Custom placeholder
<SearchBar 
  placeholder="Find plumber, electrician, etc..."
  onSearch={(query) => console.log("Searching:", query)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | string | "Kanpur" | Current location display |
| `onLocationChange` | function | - | Called when location changes |
| `onResultSelect` | function | - | Called when user selects a result |
| `placeholder` | string | "Search services..." | Input placeholder text |
| `onSearch` | function | - | Called after 300ms debounce |

## Features

### 🔍 Search Input
- Height: 50px
- Border radius: 12px
- Background: #F3F4F6 (light gray)
- Search icon on left
- Clear button (×) on right
- Light theme (white, no dark colors)

### 📍 Location Button
- Left side of search bar
- Shows current location
- Has dropdown arrow
- Rounded corners

### ⚡ Debounce
- 300ms delay before API call
- Prevents excessive requests while typing
- Clears previous timers on new input

### 🎯 Results Dropdown
- Auto-shows below search bar
- Each item has icon, title, category, price
- Press to select and dismiss
- Loading spinner while fetching
- Error message on failure
- "No results" state with helpful text

### 🧹 Smart States
- **Loading:** Spinner + "Searching..."
- **Error:** Alert icon + error message
- **No Results:** Search icon + "No services found"
- **Results:** Scrollable list with click handlers

## API Integration

**Endpoint:** `GET /api/services/?search=query`

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Plumbing Repair",
    "category": "Plumbing",
    "price": 500,
    "provider_name": "John's Services"
  }
]
```

**Debounce Behavior:**
- User types "p" → timer starts (300ms)
- User types "pl" → timer resets
- User types "plu" → timer resets
- 300ms passes with no more input → API call made
- Results appear

## Integration Example

```tsx
import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";

export default function ConsumerHome() {
  const router = useRouter();
  const [location, setLocation] = useState("Kanpur");

  const handleResultSelect = (result) => {
    // Navigate to service detail page
    router.push(`/service/${result.id}`);
  };

  const handleSearch = (query) => {
    // Optional: Log for analytics
    console.log(`Searched: ${query} in ${location}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <SearchBar 
        location={location}
        onLocationChange={setLocation}
        onResultSelect={handleResultSelect}
        onSearch={handleSearch}
        placeholder="Find plumber, electrician..."
      />
      {/* Rest of page content */}
    </View>
  );
}
```

## Styling Details

**Colors:**
- Background: `colors.background` (#FFFFFF)
- Search BG: `colors.surfaceAlt` (#F3F4F6)
- Text Primary: `colors.textPrimary` (#111827)
- Text Secondary: `colors.textSecondary` (#6B7280)
- Primary Color: `colors.primary` (#22C55E)
- Border: `colors.border` (#E5E7EB)

**Spacing:**
- Horizontal padding: 16px (spacing.lg)
- Item gaps: 8px (spacing.sm)
- Icon size: 20px (search), 18px (location)

**Shadows:**
- Search bar: shadows.xs (subtle)
- Dropdown: shadows.lg (prominent)

**Border Radius:**
- Search box: 12px (radius.lg)
- Location: 12px (radius.lg)

## States & Feedback

### Empty State
```
🔍
No services found
Try different keywords
```

### Loading State
```
⟳ Searching...
```

### Error State
```
⚠️ Failed to search. Please try again.
```

### Results State
```
💼 Service Title
   Category • ₹Price • Provider Name  >
```

## Keyboard Handling

- Return key type: "search"
- Auto-focus when dropdown opens
- Blur closes dropdown
- Clear button (×) clears all and closes

## Performance

- Debounce: 300ms (configurable via setTimeout)
- No API calls until user stops typing
- Results cached in component state
- Auto-cleanup of timers on unmount

## Accessibility

- Text input is labeled implicitly
- Touch targets > 44px
- Icons have meaningful colors
- Color contrast meets WCAG standards
- Proper hit areas for buttons

## Browser/Platform Notes

- Works on iOS and Android (React Native)
- Uses platform-aware positioning
- Proper z-index for dropdown overlay
- Handles safe areas automatically

## Common Issues & Solutions

**Issue:** Dropdown doesn't appear
- Check: `showResults` state is true
- Check: Results array has data
- Check: Search query is not empty

**Issue:** API never called
- Check: 300ms debounce timer
- Check: Search query is being updated
- Check: Network connectivity

**Issue:** Old results showing
- Clear results on new search
- Clear on component unmount
- Timer cleanup in useEffect

## Future Enhancements

- [ ] Location dropdown selector
- [ ] Recent searches history
- [ ] Category filters
- [ ] Price range filter
- [ ] Rating filter
- [ ] Voice search
- [ ] Barcode scanner
- [ ] Search suggestions/autocomplete
