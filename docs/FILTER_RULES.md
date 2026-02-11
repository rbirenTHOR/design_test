# FILTER RULES

> Complete specification for the dashboard filter system. All filtering MUST follow this specification. No custom filter implementations are permitted.

---

## 1. Architecture

The filter system has three layers:

1. **URL State** -- Filter values live in the browser URL as query parameters, managed by `nuqs`.
2. **FilterPanel UI** -- The visual filter controls rendered in the collapsible panel.
3. **Data Connection** -- Filter values are read by page components and passed to data queries.

```
URL: /sales?brand=Jayco,Keystone&region=Midwest&dateRange=2024-Q4
        |
        v
  nuqs (URL state management)
        |
        v
  FilterPanel + FilterGroup (UI layer)
        |
        v
  Page component reads filter values
        |
        v
  Data is filtered (mock or Fabric query)
```

---

## 2. URL State Management with nuqs

### Why URL State

- Users MUST be able to share a dashboard URL and the recipient sees the same filtered view.
- Browser back/forward buttons MUST navigate through filter changes.
- Bookmarking a filtered view MUST preserve the filter state.
- Page refresh MUST preserve the current filter state.

### Using nuqs

You MUST use `nuqs` for all filter state. You MUST NOT use `React.useState`, `useReducer`, `zustand`, or any other state management for filter values.

```tsx
"use client"

import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs"

export function useSalesFilters() {
  const [brand, setBrand] = useQueryState(
    "brand",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [region, setRegion] = useQueryState(
    "region",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [dateRange, setDateRange] = useQueryState(
    "dateRange",
    parseAsString.withDefault("2024-Q4")
  )

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("")
  )

  return {
    brand, setBrand,
    region, setRegion,
    dateRange, setDateRange,
    category, setCategory,
  }
}
```

### nuqs Parser Types

| Filter Type | nuqs Parser | URL Format |
|-------------|-------------|------------|
| Single select | `parseAsString` | `?category=Travel+Trailer` |
| Multi select | `parseAsArrayOf(parseAsString)` | `?brand=Jayco,Keystone` |
| Date range | `parseAsString` | `?dateRange=2024-Q4` |
| Boolean toggle | `parseAsBoolean` | `?showInactive=true` |
| Search text | `parseAsString` | `?search=dealership+name` |
| Numeric | `parseAsInteger` or `parseAsFloat` | `?minUnits=100` |

### NuqsAdapter

The root layout MUST include the `NuqsAdapter` provider for nuqs to function with Next.js App Router:

```tsx
// src/app/layout.tsx
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

---

## 3. FilterPanel Component

### Overview

`FilterPanel` is the container for all filters. It renders as a collapsible panel that pushes the content area.

### Props

```tsx
interface FilterPanelProps {
  /** Whether the panel is open */
  open: boolean
  /** Close callback */
  onClose: () => void
  /** Apply filters callback */
  onApply?: () => void
  /** Reset filters callback */
  onReset?: () => void
  /** Panel heading text */
  title?: string              // Default: "Filters"
  /** Filter form content (FilterGroup components) */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

> **Note:** You MUST NOT render `FilterPanel` directly. Pass `filterContent` to `AppShell`, which manages the panel open/close state internally. The `filterCount` prop on `AppShell` controls the badge on the filter toggle button in the header.

### Behavior

- **Open state:** Panel slides in from the right, content area adjusts.
- **Closed state:** Panel is hidden, content area takes full width.
- **Toggle:** Controlled by the filter button in the `Header` (managed by `AppShell`).
- On desktop (>= 1024px): slides in from right as a fixed panel.
- On mobile (< 1024px): renders with a backdrop overlay.
- Scroll: filter content scrolls independently via `ScrollArea`.
- Apply/Reset buttons are pinned to the bottom.

### Active Filter Count

The toggle button MUST display a badge showing the number of active filters (filters with non-default values). When the count is 0, the badge MUST be hidden.

---

## 4. FilterGroup Component

### Overview

`FilterGroup` renders a labeled group of filter controls within the `FilterPanel`.

### Props (FilterGroup)

```tsx
interface FilterGroupProps {
  /** Unique identifier for the accordion item */
  id: string
  /** Display label for the group heading */
  label: string
  /** Whether the group starts expanded */
  defaultOpen?: boolean       // Default: true
  /** Filter controls inside the group */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

### Props (FilterGroupContainer)

For rendering multiple groups in a single accordion, use `FilterGroupContainer`:

```tsx
interface FilterGroupContainerProps {
  /** Array of group configurations */
  groups: Array<{
    id: string
    label: string
    defaultOpen?: boolean
    content: React.ReactNode
  }>
  /** Additional CSS classes */
  className?: string
}
```

### Usage

The recommended pattern is to create a filter component and pass it to `AppShell` via `filterContent`:

```tsx
import { FilterGroupContainer } from "@/components/shell"
import { MultiSelect } from "@/components/filters/MultiSelect"
import { DateRangePicker } from "@/components/filters/DateRangePicker"

function SalesFilters() {
  // Use nuqs for filter state
  const [brand, setBrand] = useQueryState("brand", parseAsArrayOf(parseAsString).withDefault([]))
  const [region, setRegion] = useQueryState("region", parseAsArrayOf(parseAsString).withDefault([]))

  return (
    <FilterGroupContainer
      groups={[
        {
          id: "date-range",
          label: "Date Range",
          content: <DateRangePicker value={dateRange} onChange={setDateRange} />,
        },
        {
          id: "brands",
          label: "Brand",
          content: (
            <MultiSelect
              label="Brand"
              options={[
                { value: "airstream", label: "Airstream" },
                { value: "jayco", label: "Jayco" },
                { value: "keystone", label: "Keystone" },
                { value: "tmc", label: "Thor Motor Coach" },
                { value: "heartland", label: "Heartland" },
              ]}
              selected={brand}
              onChange={setBrand}
            />
          ),
        },
        {
          id: "regions",
          label: "Region",
          content: (
            <MultiSelect
              label="Region"
              options={[
                { value: "northeast", label: "Northeast" },
                { value: "southeast", label: "Southeast" },
                { value: "midwest", label: "Midwest" },
                { value: "west", label: "West" },
                { value: "southwest", label: "Southwest" },
              ]}
              selected={region}
              onChange={setRegion}
            />
          ),
        },
      ]}
    />
  )
}

// In your page component:
<AppShell filterContent={<SalesFilters />} filterCount={activeCount} ...>
  {/* page content */}
</AppShell>
```

---

## 5. Filter Types

### 5.1 Select Filter (Single)

Dropdown that allows selecting one value.

```tsx
interface SelectFilterProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
```

- Uses the shadcn/ui `Select` component.
- Placeholder text MUST be displayed when no value is selected.
- You MUST include an "All" or clear option to deselect.

### 5.2 Multi-Select Filter

Allows selecting multiple values with checkboxes.

```tsx
interface MultiSelectFilterProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxDisplay?: number  // Max items shown before "+N more"
}
```

- Each option renders with a checkbox.
- Selected values display as pills/chips in the trigger.
- When more than `maxDisplay` items are selected, show "+N more".

### 5.3 Date Range Filter

Selects a time period.

```tsx
interface DateRangeFilterProps {
  value: string
  onChange: (value: string) => void
  presets?: Array<{ label: string; value: string }>
}
```

- Presets MUST include common ranges: "This Quarter", "Last Quarter", "YTD", "Last 12 Months", "Custom".
- Default preset: "Last 12 Months" or the most recent complete quarter.

### 5.4 Search Filter

Free-text search input.

```tsx
interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number  // Default: 300ms
}
```

- MUST debounce input to avoid excessive URL updates.
- Default debounce: 300ms.
- Shows a clear (X) button when text is present.

### 5.5 Toggle Filter

Boolean on/off switch.

```tsx
interface ToggleFilterProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}
```

---

## 6. Default Values

Every filter MUST have a sensible default value defined in the nuqs parser:

| Filter | Default | Rationale |
|--------|---------|-----------|
| Date Range | Most recent complete quarter | Show current data by default |
| Brand | `[]` (all brands) | No exclusion by default |
| Region | `[]` (all regions) | No exclusion by default |
| Category | `""` (all categories) | No exclusion by default |
| Search | `""` (empty) | No text filter by default |

When the URL has no query parameters, the dashboard MUST display the default view with all data visible.

---

## 7. Reset Behavior

### Reset All

The "Reset" button in `FilterPanel` MUST:
1. Clear all URL query parameters for the current page.
2. Return all filters to their default values.
3. Update the UI immediately.
4. The URL MUST become the base path (e.g., `/sales` with no query string).

### Reset Individual

Each filter group MAY include a "Clear" link that resets only that filter to its default value.

### Implementation

```tsx
function handleResetAll() {
  // Clear all filter state
  setBrand([])
  setRegion([])
  setDateRange("2024-Q4")
  setCategory("")
}
```

---

## 8. Filter-to-Data Connection

### With Mock Data

When using mock data, filter values are applied client-side:

```tsx
const filteredData = useMemo(() => {
  let result = allData

  if (brand.length > 0) {
    result = result.filter(row => brand.includes(row.brand))
  }

  if (region.length > 0) {
    result = result.filter(row => region.includes(row.region))
  }

  if (category) {
    result = result.filter(row => row.category === category)
  }

  return result
}, [allData, brand, region, category])
```

### With Microsoft Fabric

When connected to Fabric semantic models, filter values are passed as query parameters to the API. See `docs/FABRIC_INTEGRATION.md`.

---

## 9. Adding a New Filter

Follow these exact steps:

### Step 1: Define the URL Parameter

In your page's filter hook (e.g., `useSalesFilters`), add a new `useQueryState` call:

```tsx
const [tier, setTier] = useQueryState(
  "tier",
  parseAsString.withDefault("")
)
```

### Step 2: Add to FilterPanel

Add a new `FilterGroup` with the appropriate filter component:

```tsx
<FilterGroup label="Price Tier">
  <SelectFilter
    options={["Economy", "Mid-Range", "Premium", "Luxury"]}
    value={tier}
    onChange={setTier}
    placeholder="All Tiers"
  />
</FilterGroup>
```

### Step 3: Connect to Data

Add the filter logic to your data filtering:

```tsx
if (tier) {
  result = result.filter(row => row.tier === tier)
}
```

### Step 4: Include in Reset

Add the new filter to the reset function:

```tsx
function handleResetAll() {
  // ... existing resets
  setTier("")
}
```

### Step 5: Update Active Filter Count

The active filter count MUST include the new filter:

```tsx
const activeCount = [
  brand.length > 0,
  region.length > 0,
  category !== "",
  tier !== "",  // new filter
].filter(Boolean).length
```

---

## 10. What Is FORBIDDEN

- You MUST NOT use `React.useState` for filter state. All filter values MUST live in the URL.
- You MUST NOT build filter UI outside of `FilterPanel`. No inline dropdowns in the content area for filtering.
- You MUST NOT create overlay/modal filter panels on desktop viewports (>= 768px). Filters MUST push content.
- You MUST NOT create filter components that bypass the `FilterGroup` composition pattern.
- You MUST NOT store filter state in `localStorage`, `sessionStorage`, cookies, or any non-URL mechanism.
- You MUST NOT create separate filter components per page. Reuse the shared filter components from `@/components/shell/`.
