# 🚀 Quick Start - Search Bar Component

## Import & Use

```tsx
import SearchBar from "../components/SearchBar";

// In your screen
<SearchBar 
  location="Kanpur"
  onResultSelect={(result) => {
    console.log("Selected:", result.title);
  }}
/>
```

## Component Structure

```
SearchBar
├── Search Row (flexDirection: "row")
│   ├── Location Button (left)
│   │   ├── Location Icon
│   │   ├── Location Text ("Kanpur")
│   │   └── Dropdown Arrow
│   └── Search Input Container (flex: 1, right)
│       ├── Search Icon (left)
│       ├── TextInput (flex: 1)
│       └── Clear Button (right, conditional)
└── Results Dropdown (absolute positioning)
    ├── Loading State (spinner + text)
    ├── Error State (warning icon + message)
    ├── Results List (FlatList)
    │   ├── Result Item
    │   ├── Separator
    │   ├── Result Item
    │   └── ...
    └── No Results State (icon + text)
```

## Key Implementation Details

### 1. Debounce (300ms)
```tsx
useEffect(() => {
  if (debounceTimer.current) clearTimeout(debounceTimer.current);
  
  if (!searchQuery.trim()) {
    setResults([]);
    return;
  }

  debounceTimer.current = setTimeout(async () => {
    // Make API call here
  }, 300); // 300ms wait before calling API
}, [searchQuery]);
```

### 2. API Call
```tsx
const response = await api.get("/api/services/", {
  params: {
    search: searchQuery.trim(),
  },
});
setResults(response.data);
```

### 3. Result Selection
```tsx
const handleResultSelect = (result) => {
  setSearchQuery(result.title);
  setShowResults(false);
  onResultSelect?.(result);
};
```

## Props Reference

| Prop | Type | Default |
|------|------|---------|
| `location` | string | "Kanpur" |
| `onLocationChange` | (loc: string) => void | - |
| `onResultSelect` | (result: SearchResult) => void | - |
| `placeholder` | string | "Search services..." |
| `onSearch` | (query: string) => void | - |

## Styling Quick Ref

```
Search Input:
- Height: 50px
- Background: #F3F4F6 (colors.surfaceAlt)
- Border radius: 12px (radius.lg)
- Icon color: #9CA3AF (colors.textTertiary)

Location Button:
- Padding: 8-16px (spacing.md to spacing.lg)
- Border: 1px (colors.border)
- Border radius: 12px (radius.lg)

Results Dropdown:
- Background: white
- Shadow: shadows.lg (prominent)
- Max height: 400px
- Item height: ~60px
```

## Testing Checklist

- [ ] Component renders without errors
- [ ] Typing in search box works
- [ ] Clear button (×) appears when typing
- [ ] Clear button clears search
- [ ] Debounce works (300ms)
- [ ] API call happens after debounce
- [ ] Results display in dropdown
- [ ] Clicking result closes dropdown
- [ ] onResultSelect callback fires
- [ ] Loading state shows spinner
- [ ] Error state shows message
- [ ] No results state shows helpful text
- [ ] Keyboard appears/hides properly
- [ ] Location button clickable

## Common Customizations

**Change debounce time:**
```tsx
// In useEffect, change the timeout value
}, 500); // Changed from 300 to 500ms
```

**Change default location:**
```tsx
<SearchBar location="Mumbai" />
```

**Customize API endpoint:**
```tsx
const response = await api.get("/api/search/", {
  params: { q: searchQuery },
});
```

**Hide location button:**
```tsx
// Modify component to conditionally render location button
{showLocationButton && <Pressable style={styles.locationButton}>...</Pressable>}
```

**Different result layout:**
```tsx
// Modify renderResultItem function
const renderResultItem = ({ item }) => (
  // Custom layout here
);
```

## Integration Points

### Step 1: Import
```tsx
import SearchBar from "../components/SearchBar";
```

### Step 2: Add to JSX
```tsx
<SearchBar 
  onResultSelect={handleResultSelect}
/>
```

### Step 3: Handle Selection
```tsx
const handleResultSelect = (result) => {
  router.push(`/service/${result.id}`);
};
```

### Step 4: Test
```
npm start
Navigate to home
Type in search box
See results appear after 300ms
Click result
Verify navigation
```

## API Response Format

```json
[
  {
    "id": 1,
    "title": "Plumbing Repair Service",
    "category": "Plumbing",
    "price": 500,
    "provider_name": "John's Plumbing Co."
  },
  {
    "id": 2,
    "title": "Emergency AC Repair",
    "category": "HVAC",
    "price": 1200,
    "provider_name": "Cool Systems Inc."
  }
]
```

## States Diagram

```
Empty
  ↓
Typing → [Debounce 300ms] → Loading
                               ↓
                           API Call
                               ↓
                         ┌──────┴──────┐
                         ↓             ↓
                    Results      Error/NoResults
                         ↓             ↓
                    [Dropdown]    [Message]
                         ↓             ↓
                      Select        Retry
                         ↓
                      Clear/Close
                         ↓
                       Empty
```

## Performance Tips

1. Debounce prevents API spam ✅
2. FlatList for efficient rendering ✅
3. Conditional rendering (showResults) ✅
4. Timer cleanup on unmount ✅
5. Early return on empty query ✅

## Troubleshooting

**Dropdown not showing?**
- Check: showResults = true
- Check: results array not empty
- Check: CSS position/z-index

**API never called?**
- Check: Network connection
- Check: Debounce timer running
- Check: Console for errors

**Results not displaying?**
- Check: API response format
- Check: Result mapping correct
- Check: FlatList keyExtractor

---

**File:** `app/components/SearchBar.tsx`
**Status:** ✅ Complete & Tested
**Integration Time:** ~5 minutes
