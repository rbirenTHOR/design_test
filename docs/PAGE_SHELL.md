# PAGE SHELL

> Step-by-step guide to creating a new dashboard page. Follow every step exactly. Do not skip steps. Do not improvise.

---

## 1. Architecture Overview

Every page in the THOR Dashboard System uses the `AppShell` layout component. The shell provides:

- **Header** -- Fixed at the top. Contains logo, global nav, and user menu. 64px tall.
- **Sidebar** -- Fixed on the left. Contains page-level navigation. 260px wide when expanded, 64px when collapsed.
- **FilterPanel** -- Optional. Slides in from the right. Pushes content area when open.
- **Content Area** -- Scrollable main area. Contains KPIs, charts, tables, and other widgets.

```
+----------------------------------------------------------+
| HEADER (fixed, 64px, full width)                         |
+----------+-----------------------------------------------+
| SIDEBAR  | CONTENT AREA                    | FILTER     |
| (260px   | (scrollable, max 1680px)        | PANEL      |
| or 64px  |                                  | (optional) |
| collapsed)|                                 |            |
+----------+-----------------------------------------------+
```

---

## 2. Step-by-Step: Create a New Page

### Step 1: Create the Route Directory

Create a new directory under `src/app/` for your page.

```
src/app/[your-page-name]/page.tsx
```

Example for a "Sales" dashboard:
```
src/app/sales/page.tsx
```

### Step 2: Create the Page File

Create `page.tsx` with this exact template:

```tsx
"use client"

import React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { AppShell, type NavSection, FilterGroupContainer } from "@/components/shell"
import { KpiCard, KpiCardGroup } from "@/components/kpi"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import { DataTable } from "@/components/tables/DataTable"
import { formatCurrency } from "@/lib/utils/formatting"
import type { KpiItem } from "@/lib/types"

// Import your page-specific mock data
import { salesKpis, salesChartData, salesTableData } from "@/lib/mock-data"

// Define sidebar navigation sections
const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <>{/* Lucide icon */}</> },
      { id: "sales", label: "Sales", icon: <>{/* Lucide icon */}</> },
    ],
  },
]

// Define filter content
function SalesFilters() {
  // Use nuqs for filter state -- see docs/FILTER_RULES.md
  return (
    <FilterGroupContainer
      groups={[
        { id: "date-range", label: "Date Range", content: <>{/* DateRangePicker */}</> },
        { id: "brands", label: "Brands", content: <>{/* MultiSelect */}</> },
        { id: "regions", label: "Region", content: <>{/* MultiSelect */}</> },
      ]}
    />
  )
}

export default function SalesPage() {
  return (
    <AppShell
      navSections={navSections}
      activeNavId="sales"
      headerTitle="Sales"
      filterContent={<SalesFilters />}
      filterCount={0}
    >
      {/* KPI Row */}
      <KpiCardGroup className="mb-6">
        {salesKpis.map((kpi) => (
          <KpiCard key={kpi.id} metricId={kpi.id} {...kpi} />
        ))}
      </KpiCardGroup>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarChart
          data={salesChartData.revenueByBrand}
          dataKeys={["revenue"]}
          xAxisKey="name"
          height={320}
        />
        <LineChart
          data={salesChartData.monthlyTrend}
          lines={[{ dataKey: "value", name: "Revenue" }]}
          xAxisKey="month"
          height={320}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={salesColumns}
        data={salesTableData}
        searchable
        paginated
        pageSize={10}
      />
    </AppShell>
  )
}
```

### Step 3: Define Navigation Sections

Define a `NavSection[]` array and pass it to `AppShell` via the `navSections` prop. Each section has a title and an array of `NavItem` objects:

```tsx
import { type NavSection } from "@/components/shell"

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
      { id: "sales", label: "Sales", icon: <DollarSign className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "inventory", label: "Inventory", icon: <Package className="h-[18px] w-[18px]" /> },
      { id: "dealers", label: "Dealers", icon: <Users className="h-[18px] w-[18px]" /> },
    ],
  },
]
```

Icons MUST be `lucide-react` components or inline SVGs sized at `h-[18px] w-[18px]`. Navigation items accept an optional `badge` property (string or number) and optional `href`.

### Step 4: Configure Filters

Create a filter component that renders `FilterGroupContainer` (or individual `FilterGroup` components). Pass it to `AppShell` via the `filterContent` prop:

```tsx
import { FilterGroupContainer } from "@/components/shell"

function MyFilters() {
  // Use nuqs for filter state -- see docs/FILTER_RULES.md
  return (
    <FilterGroupContainer
      groups={[
        { id: "date-range", label: "Date Range", content: <DateRangePicker ... /> },
        { id: "brands", label: "Brands", content: <MultiSelect ... /> },
        { id: "regions", label: "Region", content: <MultiSelect ... /> },
      ]}
    />
  )
}
```

See `docs/FILTER_RULES.md` for complete filter specification.

### Step 5: Create Mock Data

Add mock data to `src/lib/mock-data.ts` (the central mock data file). All data MUST conform to the types in `src/lib/types.ts`.

```tsx
import type { KpiItem, DonutDatum, HierarchicalRow } from "./types"

export const salesKpis: KpiItem[] = [
  {
    id: "total-revenue",
    label: "Total Revenue (YTD)",
    value: 14_200_000_000,
    previousValue: 13_100_000_000,
    format: "currency",
    sparklineData: [8.8, 9.2, 9.8, 10.5, 11.2, 11.8, 12.4, 13.0, 12.2, 11.5, 11.0, 14.2],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  // ... more KPIs
]

// Bar chart data: array of objects with a name key + numeric value keys
export const revenueByBrand = [
  { name: "Jayco", revenue: 4_200_000_000 },
  { name: "Keystone", revenue: 3_800_000_000 },
  // ...
]

// Line chart data: array of objects with a name key + numeric series keys
export const monthlyTrend = [
  { name: "Jan", current: 980_000_000, prior: 890_000_000 },
  { name: "Feb", current: 1_050_000_000, prior: 940_000_000 },
  // ...
]

// Donut chart data: uses DonutDatum type
export const brandMixData: DonutDatum[] = [
  { name: "Jayco", value: 3_100_000_000 },
  { name: "Keystone", value: 2_800_000_000 },
  // ...
]
```

You MUST NOT define inline data objects that bypass the type system.

### Step 6: Verify

Run the following checks:

```bash
npm run build    # Must compile without errors
npm run lint     # Must pass without warnings
```

---

## 3. Content Area Layout Rules

### Grid System

The content area uses CSS Grid via Tailwind. Standard layouts:

```tsx
{/* 4-column KPI row */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md-space">

{/* 2-column chart grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-md-space">

{/* Full-width section */}
<div className="w-full">

{/* 3-column layout */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md-space">
```

### Section Spacing

Vertical spacing between content sections MUST use the `space-y-md-space` utility on the parent container, OR explicit `mt-md-space` / `mt-lg-space` margins.

```tsx
<div className="space-y-md-space">
  {/* KPI section */}
  <div>...</div>

  {/* Chart section */}
  <div>...</div>

  {/* Table section */}
  <div>...</div>
</div>
```

### Maximum Width

Content MUST NOT exceed `1680px` wide. The `AppShell` enforces this via the `container` class from Tailwind config:

```tsx
// Already handled by AppShell -- you do NOT need to add this yourself
<div className="container mx-auto">
```

---

## 4. Page Variants

### Standard Dashboard Page

KPIs on top, charts in the middle, table at the bottom. Use the template in Step 2.

### Detail Page

Master-detail layout with a primary entity view. Use a 2-column grid:

```tsx
<AppShell navSections={navSections} activeNavId="dealers" headerTitle="Dealer Detail" filterContent={<DealerFilters />}>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-md-space">
    {/* Left column: 2/3 width */}
    <div className="lg:col-span-2 space-y-md-space">
      <KpiCard ... />
      <BarChart ... />
      <DataTable ... />
    </div>

    {/* Right column: 1/3 width */}
    <div className="space-y-md-space">
      {/* Summary card */}
      {/* Activity feed */}
      {/* Related items */}
    </div>
  </div>
</AppShell>
```

### Comparison Page

Side-by-side layout for comparing two entities:

```tsx
<AppShell navSections={navSections} activeNavId="brands" headerTitle="Brand Comparison" filterContent={<BrandFilters />}>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-md-space">
    <div className="space-y-md-space">
      <h2 className="text-h3 font-heading font-bold">Brand A</h2>
      {/* Brand A content */}
    </div>
    <div className="space-y-md-space">
      <h2 className="text-h3 font-heading font-bold">Brand B</h2>
      {/* Brand B content */}
    </div>
  </div>
</AppShell>
```

---

## 5. Header Configuration

The `Header` component is rendered by `AppShell`. It displays:

- THOR logo and subtitle text (left) -- subtitle is set via `headerTitle` prop on `AppShell`
- Search icon (right)
- Notifications icon (right)
- Filter toggle button with active count badge (right)
- Settings icon (right)
- User avatar (right)

You MUST NOT render `Header` directly. You MUST NOT modify the header from within a page component. The only per-page configuration is the `headerTitle` string passed to `AppShell`.

---

## 6. Sidebar Configuration

The `Sidebar` is rendered by `AppShell` automatically. You configure it by passing `navSections` to `AppShell`. The `NavSection` type is exported from `@/components/shell`:

```tsx
import { type NavSection } from "@/components/shell"

const navSections: NavSection[] = [
  {
    title: "Analytics",
    items: [
      { id: "dashboard", label: "Executive", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
      { id: "sales", label: "Sales", icon: <DollarSign className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "inventory", label: "Inventory", icon: <Package className="h-[18px] w-[18px]" /> },
      { id: "dealers", label: "Dealers", icon: <Users className="h-[18px] w-[18px]" /> },
    ],
  },
]
```

Pass the active page ID via `activeNavId` to highlight it in the sidebar. Handle navigation via the `onNavigate` callback.

### NavItem Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the nav item |
| `label` | `string` | Yes | Display text |
| `icon` | `React.ReactNode` | Yes | Lucide icon or inline SVG, sized `h-[18px] w-[18px]` |
| `href` | `string` | No | Optional route URL |
| `badge` | `string \| number` | No | Optional badge (e.g., notification count) |
| `active` | `boolean` | No | Override active state (normally set by `activeNavId`) |

---

## 7. Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|-----------------|---------------------|
| Creating a page without `AppShell` | Breaks layout consistency | Always wrap in `AppShell` |
| Hardcoding nav links inside Sidebar | Creates maintenance burden, risks inconsistency | Pass `navSections` to `AppShell` |
| Using `useState` for filters | Filters not in URL, not shareable | Use `nuqs` via the filter system |
| Adding custom CSS for layout | Bypasses design system | Use Tailwind utility classes |
| Using `rounded-*` classes | Violates 0px border-radius rule | Never use rounded classes |
| Nesting `AppShell` inside `AppShell` | Double headers/sidebars | Only one `AppShell` per page |
| Using `<img>` tag | Missing Next.js optimization | Use `next/image` `Image` component |
