# COMPONENT API

> Complete API reference for every component in the THOR Dashboard System. Use existing components. Do not create duplicates.

### Barrel Exports

Shell and KPI components can be imported via barrel exports for convenience:

```tsx
// Barrel imports (preferred)
import { AppShell, type NavSection, FilterGroupContainer } from "@/components/shell"
import { KpiCard, KpiCardGroup } from "@/components/kpi"

// Direct imports (also valid)
import { AppShell } from "@/components/shell/AppShell"
import { KpiCard } from "@/components/kpi/KpiCard"
```

All other components MUST be imported from their direct file paths.

---

## Table of Contents

1. [Shell Components](#1-shell-components)
   - [AppShell](#appshell)
   - [Header](#header)
   - [Sidebar](#sidebar)
   - [FilterPanel](#filterpanel)
   - [FilterGroup](#filtergroup)
   - [FilterGroupContainer](#filtergroupcontainer)
2. [KPI Components](#2-kpi-components)
   - [KpiCard](#kpicard)
   - [KpiCardGroup](#kpicardgroup)
3. [Chart Components](#3-chart-components)
   - [BarChart](#barchart)
   - [LineChart](#linechart)
   - [ComboChart](#combochart)
   - [HorizontalBarChart](#horizontalbarchart)
   - [DonutChart](#donutchart)
4. [Table Components](#4-table-components)
   - [DataTable](#datatable)
   - [ExpandableTable](#expandabletable)
5. [Filter Components](#5-filter-components)
   - [MultiSelect](#multiselect)
   - [DateRangePicker](#daterangepicker)
   - [FilterChips](#filterchips)
   - [SegmentToggle](#segmenttoggle)
6. [Feedback Components](#6-feedback-components)
   - [EmptyState](#emptystate)
   - [ErrorState](#errorstate)
   - [LoadingSpinner](#loadingspinner)
   - [KpiSkeleton](#kpiskeleton)
   - [ChartSkeleton](#chartskeleton)
   - [TableSkeleton](#tableskeleton)
7. [Status & Indicators](#7-status--indicators)
   - [StatusBadge](#statusbadge)
   - [TrendIndicator](#trendindicator)
8. [Primitive UI Components](#8-primitive-ui-components-shadcnui)

---

## 1. Shell Components

### AppShell

**File:** `src/components/shell/AppShell.tsx`

The top-level layout component. Every page MUST be wrapped in `AppShell`. Provides the Header, Sidebar, FilterPanel, and content area.

#### Props

```tsx
interface AppShellProps {
  /** Page content */
  children: React.ReactNode
  /** Navigation sections for the sidebar */
  navSections: NavSection[]
  /** ID of the currently active nav item */
  activeNavId?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (id: string) => void
  /** Title displayed in the header subtitle */
  headerTitle?: string
  /** Filter form content rendered inside FilterPanel */
  filterContent?: React.ReactNode
  /** Callback when "Apply Filters" is clicked */
  onApplyFilters?: () => void
  /** Callback when "Reset" is clicked */
  onResetFilters?: () => void
  /** Number of active filters (shown as badge) */
  filterCount?: number
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { AppShell } from "@/components/shell/AppShell"

<AppShell
  navSections={navSections}
  activeNavId="sales"
  onNavigate={handleNav}
  headerTitle="Sales Dashboard"
  filterContent={<MyFilterForm />}
  onApplyFilters={handleApply}
  onResetFilters={handleReset}
  filterCount={3}
>
  {/* Page content */}
</AppShell>
```

#### Do's

- Pass `navSections` from a centralized constant.
- Pass `filterContent` as a React node containing `FilterGroup` components.
- Pass `filterCount` to show the active filter badge.

#### Don'ts

- Do NOT render `Header` or `Sidebar` manually -- `AppShell` renders them.
- Do NOT nest `AppShell` inside another `AppShell`.
- Do NOT use `AppShell` in non-page components (it is for route-level pages only).

---

### Header

**File:** `src/components/shell/Header.tsx`

Fixed top header with THOR logo, search, notifications, filter toggle, settings, and user avatar. Rendered automatically by `AppShell`.

#### Props

```tsx
interface HeaderProps {
  /** Subtitle text displayed next to the logo */
  title?: string               // Default: "Business Intelligence"
  /** Toggle sidebar callback (mobile hamburger) */
  onToggleSidebar?: () => void
  /** Toggle filter panel callback */
  onToggleFilterPanel?: () => void
  /** Number of active filters (badge on filter button) */
  filterCount?: number         // Default: 0
  /** Additional CSS classes */
  className?: string
}
```

#### Don'ts

- Do NOT render `Header` directly. It is managed by `AppShell`.
- Do NOT modify the Header's internal structure.

---

### Sidebar

**File:** `src/components/shell/Sidebar.tsx`

Fixed left sidebar with grouped navigation items. Collapsible to icon-only mode. Rendered automatically by `AppShell`.

#### Types

```tsx
interface NavItem {
  id: string
  label: string
  icon: React.ReactNode   // SVG or Lucide icon element
  href?: string
  badge?: string | number  // Optional badge (e.g., count)
  active?: boolean
}

interface NavSection {
  title: string            // Section heading (e.g., "Analytics")
  items: NavItem[]
}
```

#### Props

```tsx
interface SidebarProps {
  /** Navigation sections with items */
  sections: NavSection[]
  /** Whether sidebar is collapsed (icon-only) */
  collapsed: boolean
  /** Toggle collapse callback */
  onToggleCollapse: () => void
  /** ID of the currently active navigation item */
  activeItemId?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (id: string) => void
  /** Additional CSS classes */
  className?: string
}
```

#### Don'ts

- Do NOT render `Sidebar` directly. It is managed by `AppShell`.
- Do NOT hardcode navigation items. Pass them as `navSections` to `AppShell`.

---

### FilterPanel

**File:** `src/components/shell/FilterPanel.tsx`

Right-side slide-out panel for filter controls. Contains scrollable filter content with pinned "Apply" and "Reset" buttons.

#### Props

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

#### Behavior

- On desktop (>= 1024px): slides in from right as a fixed panel.
- On mobile (< 1024px): renders with a backdrop overlay.
- Scroll: filter content scrolls independently via `ScrollArea`.
- Apply/Reset buttons are pinned to the bottom.

#### Don'ts

- Do NOT render `FilterPanel` directly. Pass `filterContent` to `AppShell`.
- Do NOT create alternative filter panel implementations.

---

### FilterGroup

**File:** `src/components/shell/FilterGroup.tsx`

Collapsible accordion group for organizing filters within `FilterPanel`.

#### Props

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

#### Usage

```tsx
import { FilterGroup } from "@/components/shell/FilterGroup"

<FilterGroup id="brand" label="Brand" defaultOpen={true}>
  {/* Checkbox list, select, or other filter controls */}
</FilterGroup>
```

---

### FilterGroupContainer

**File:** `src/components/shell/FilterGroup.tsx`

Renders multiple filter groups in a single accordion, sharing open/close state.

#### Props

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

#### Usage

```tsx
import { FilterGroupContainer } from "@/components/shell/FilterGroup"

<FilterGroupContainer
  groups={[
    { id: "brand", label: "Brand", content: <BrandCheckboxes /> },
    { id: "region", label: "Region", content: <RegionCheckboxes /> },
    { id: "category", label: "Category", defaultOpen: false, content: <CategorySelect /> },
  ]}
/>
```

---

## 2. KPI Components

### KpiCard

**File:** `src/components/kpi/KpiCard.tsx`

Displays a single key performance indicator with label, value, trend, and optional sparkline.

#### Props

```tsx
interface KpiCardProps {
  /** Metric label (rendered uppercase automatically) */
  label: string
  /** Current numeric value */
  value: number
  /** Previous period value for auto-calculating trend */
  previousValue?: number
  /** Value display format */
  format: MetricFormat  // "currency" | "percentage" | "integer" | "decimal" | "days"
  /** Explicit trend percentage (overrides auto-calculation) */
  trend?: number
  /** Array of numbers for the sparkline mini-chart */
  sparklineData?: number[]
  /** Whether an upward trend is good or bad */
  direction?: TrendDirection  // "up-is-good" | "down-is-good"
  /** Label for comparison (e.g., "vs prior year") */
  comparisonLabel?: string
  /** Optional icon rendered next to the label */
  icon?: React.ReactNode
  /** Show loading skeleton */
  loading?: boolean          // Default: false
  /** Show empty state */
  empty?: boolean            // Default: false
  /** Additional CSS classes */
  className?: string
  /** Identifier for test selectors (data-metric-id) */
  metricId?: string
}
```

#### Usage

```tsx
import { KpiCard } from "@/components/kpi/KpiCard"

<KpiCard
  label="Total Revenue"
  value={14200000000}
  previousValue={13100000000}
  format="currency"
  direction="up-is-good"
  comparisonLabel="vs prior year"
  sparklineData={[10, 12, 11, 14, 13, 15, 14, 16]}
  metricId="total-revenue"
/>
```

#### Three States

```tsx
// Loading
<KpiCard label="Revenue" value={0} format="currency" loading={true} />

// Empty
<KpiCard label="Revenue" value={0} format="currency" empty={true} />

// Populated
<KpiCard label="Revenue" value={14200000000} format="currency" />
```

#### Do's

- Always provide `format` to control number display.
- Always provide `metricId` for test selectors.
- Provide `previousValue` OR `trend`, not both (trend overrides).

#### Don'ts

- Do NOT format the value yourself. The component uses `formatMetricValue()`.
- Do NOT create custom KPI display components.

---

### KpiCardGroup

**File:** `src/components/kpi/KpiCardGroup.tsx`

Responsive grid container for laying out multiple `KpiCard` components.

#### Props

```tsx
interface KpiCardGroupProps {
  /** KpiCard children */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { KpiCardGroup } from "@/components/kpi/KpiCardGroup"
import { KpiCard } from "@/components/kpi/KpiCard"

<KpiCardGroup>
  <KpiCard label="Revenue" value={14200000000} format="currency" />
  <KpiCard label="Units" value={52000} format="integer" />
  <KpiCard label="Avg Price" value={80769} format="currency" />
  <KpiCard label="Margin" value={18.3} format="percentage" />
</KpiCardGroup>
```

#### Grid Behavior

- 4 columns on large screens (`lg:grid-cols-4`)
- 2 columns on medium screens (`md:grid-cols-2`)
- 1 column on mobile (`grid-cols-1`)
- Gap: 16px (`gap-4`)

---

## 3. Chart Components

### BarChart

**File:** `src/components/charts/BarChart.tsx`

Vertical bar chart built on Recharts. Supports multi-series, stacking, click interaction, and cross-filter highlighting.

#### Props

```tsx
interface BarChartProps {
  /** Data array -- each object is one category on the X-axis */
  data: Record<string, unknown>[]
  /** Keys from the data objects to render as bar series */
  dataKeys: string[]
  /** Whether to stack bars */
  stacked?: boolean           // Default: false
  /** Chart height in pixels */
  height?: number             // Default: 350
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
  /** Data key for X-axis category labels */
  xAxisKey?: string           // Default: "name"
  /** Custom colors for each series (overrides CHART_COLORS) */
  colors?: string[]
  /** Click handler for bar segments */
  onBarClick?: (entry: Record<string, unknown>) => void
  /** Set of active X-axis values for cross-filter highlighting */
  activeValues?: Set<string>
}
```

#### Usage

```tsx
import { BarChart } from "@/components/charts/BarChart"

<BarChart
  data={[
    { name: "Jayco", revenue: 4200000000, units: 52000 },
    { name: "Keystone", revenue: 3800000000, units: 48000 },
  ]}
  dataKeys={["revenue"]}
  xAxisKey="name"
  height={350}
  onBarClick={(entry) => console.log(entry)}
/>
```

#### Cross-Filter Highlighting

Pass `activeValues` to dim unselected bars:

```tsx
<BarChart
  data={data}
  dataKeys={["revenue"]}
  activeValues={new Set(["Jayco", "Keystone"])}
/>
// Jayco and Keystone bars at full opacity; others at 0.25 opacity
```

#### Do's

- Wrap in a card or container with a title above the chart.
- Use `CHART_COLORS` order (or let the component default).
- Use `formatCurrency` via the built-in tooltip.

#### Don'ts

- Do NOT use non-THOR colors.
- Do NOT import Recharts directly to build custom bar charts.
- Do NOT set `radius` to non-zero values (bar corners MUST be sharp).

---

### LineChart

**File:** `src/components/charts/LineChart.tsx`

Multi-series line chart with smooth curves, optional area fill, and reference lines.

#### Props

```tsx
interface LineChartProps {
  /** Data array -- each object is one point on the X-axis */
  data: Record<string, unknown>[]
  /** Configuration for each line series */
  lines: LineSeries[]
  /** Data key for X-axis labels */
  xAxisKey?: string           // Default: "name"
  /** Chart height in pixels */
  height?: number             // Default: 350
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
  /** Fill the area beneath each line with a gradient */
  showArea?: boolean          // Default: false
  /** Y-value for a horizontal reference line */
  referenceValue?: number
  /** Label for the reference line */
  referenceLabel?: string
}
```

#### LineSeries Type

```tsx
interface LineSeries {
  /** Key in the data objects for this series */
  dataKey: string
  /** Display name in legend and tooltip */
  name: string
  /** Override color (defaults to CHART_COLORS sequence) */
  color?: string
}
```

#### Usage

```tsx
import { LineChart } from "@/components/charts/LineChart"

<LineChart
  data={monthlyData}
  lines={[
    { dataKey: "revenue", name: "Revenue" },
    { dataKey: "target", name: "Target", color: "#C57E0A" },
  ]}
  xAxisKey="month"
  height={350}
  showArea={true}
  referenceValue={5000000}
  referenceLabel="Budget Target"
/>
```

#### Do's

- Use `showArea={true}` for single-series trend lines (looks better).
- Use `referenceValue` to show target/budget lines.

#### Don'ts

- Do NOT import Recharts directly to build custom line charts.

---

### ComboChart

**File:** `src/components/charts/ComboChart.tsx`

Bar + Line combination chart with dual Y-axes. Bars on left axis (currency), line on right axis (percentage).

#### Props

```tsx
interface ComboChartProps {
  /** Array of data objects containing both bar and line values */
  data: Record<string, unknown>[]
  /** Data key for the bar series (typically a currency value) */
  barDataKey: string
  /** Data key for the line series (typically a percentage) */
  lineDataKey: string
  /** Data key for X-axis categories */
  xAxisKey?: string           // Default: "name"
  /** Display name for the bar series */
  barName?: string            // Default: "Value"
  /** Display name for the line series */
  lineName?: string           // Default: "Percentage"
  /** Height in pixels */
  height?: number             // Default: 350
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { ComboChart } from "@/components/charts/ComboChart"

<ComboChart
  data={[
    { name: "Jayco", revenue: 4200000000, margin: 18.5 },
    { name: "Keystone", revenue: 3800000000, margin: 16.2 },
  ]}
  barDataKey="revenue"
  lineDataKey="margin"
  barName="Revenue"
  lineName="Margin %"
  xAxisKey="name"
  height={350}
/>
```

#### Behavior

- Left Y-axis: formatted as currency (bars).
- Right Y-axis: formatted as percentage, domain 0-100 (line).
- Bar fill: Dark Green `#495737`. Line stroke: Blue `#577D91` (CHART_COLORS[1]).

#### Don'ts

- Do NOT use ComboChart for two metrics of the same unit. Use BarChart with multiple `dataKeys` instead.

---

### HorizontalBarChart

**File:** `src/components/charts/HorizontalBarChart.tsx`

Horizontal bar chart for ranking visualizations. Supports target reference lines, value labels, and cross-filter highlighting.

#### Props

```tsx
interface HorizontalBarChartProps {
  /** Array of objects with name and value keys */
  data: HorizontalBarDatum[]
  /** Height in pixels */
  height?: number             // Default: 400
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
  /** Custom formatter for display values */
  valueFormatter?: (value: number) => string  // Default: formatCurrency
  /** Target value shown as a vertical reference line */
  targetValue?: number
  /** Callback when a bar is clicked */
  onBarClick?: (entry: HorizontalBarDatum) => void
  /** Active values for cross-filter highlighting */
  activeValues?: Set<string>
}
```

#### Usage

```tsx
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"

<HorizontalBarChart
  data={[
    { name: "Indiana", value: 2500000000 },
    { name: "Ohio", value: 1800000000 },
    { name: "Michigan", value: 1200000000 },
  ]}
  height={400}
  targetValue={2000000000}
  onBarClick={(entry) => console.log(entry)}
/>
```

#### Behavior

- Bars are horizontal with labels on Y-axis (120px width) and values on X-axis.
- Value labels appear to the right of each bar.
- Reference line renders as dashed Dark Orange vertical line.
- Max bar size: 32px.

---

### DonutChart

**File:** `src/components/charts/DonutChart.tsx`

Ring/donut chart with center metric display, custom legend, and cross-filter highlighting.

#### Props

```tsx
interface DonutChartProps {
  /** Array of data objects with name, value, optional color */
  data: DonutDatum[]
  /** Height in pixels */
  height?: number             // Default: 350
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
  /** Label text displayed below the center value */
  centerLabel?: string
  /** Value displayed in the center of the ring */
  centerValue?: string
  /** Callback when a slice is clicked */
  onSliceClick?: (datum: DonutDatum) => void
  /** Active values for cross-filter highlighting */
  activeValues?: Set<string>
}
```

#### Usage

```tsx
import { DonutChart } from "@/components/charts/DonutChart"

<DonutChart
  data={[
    { name: "Travel Trailer", value: 6500000000 },
    { name: "Fifth Wheel", value: 3200000000 },
    { name: "Motorhome", value: 2800000000 },
    { name: "Camper Van", value: 1700000000 },
  ]}
  centerValue="$14.2B"
  centerLabel="Total Revenue"
  height={350}
  onSliceClick={(datum) => console.log(datum)}
/>
```

#### Behavior

- Inner radius 60%, outer radius 80%.
- Center displays `centerValue` (Montserrat ExtraBold 24px) and `centerLabel` (Open Sans 12px).
- Custom legend below the chart shows name, formatted currency value, and percentage.
- Slice colors default to CHART_COLORS sequence; override per-datum via `color` field.
- Legend items are clickable when `onSliceClick` is provided.

---

## 4. Table Components

### DataTable

**File:** `src/components/tables/DataTable.tsx`

Sortable, searchable, paginated data table built on TanStack Table v8. Includes column visibility toggle.

#### Props

```tsx
interface DataTableProps<TData> {
  /** Column definitions (TanStack Table ColumnDef) */
  columns: ColumnDef<TData, unknown>[]
  /** Data array */
  data: TData[]
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Enable global search input */
  searchable?: boolean        // Default: false
  /** Placeholder for the search input */
  searchPlaceholder?: string  // Default: "Search..."
  /** Enable pagination controls */
  paginated?: boolean         // Default: false
  /** Default page size */
  pageSize?: number           // Default: 10
  /** Additional CSS classes */
  className?: string
  /** Callback when a row is clicked */
  onRowClick?: (row: TData) => void
  /** Make the header row sticky */
  stickyHeader?: boolean      // Default: false
  /** Active values for cross-filter row highlighting */
  activeValues?: Set<string>
  /** Key on TData to match against activeValues */
  highlightKey?: keyof TData
}
```

#### Usage

```tsx
import { DataTable } from "@/components/tables/DataTable"
import { type ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<DealerRow>[] = [
  { accessorKey: "name", header: "Dealer Name" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "revenue", header: "Revenue", cell: ({ getValue }) => formatCurrency(getValue() as number) },
  { accessorKey: "units", header: "Units", cell: ({ getValue }) => (getValue() as number).toLocaleString() },
]

<DataTable
  columns={columns}
  data={dealerData}
  searchable
  paginated
  pageSize={20}
  onRowClick={(row) => router.push(`/dealers/${row.id}`)}
  stickyHeader
/>
```

#### Features

- **Sorting:** Click column headers to sort. Sort indicator shows asc/desc/unsorted state.
- **Search:** Global filter across all columns when `searchable={true}`.
- **Pagination:** Page size selector (10/20/50/100), first/prev/next/last buttons, page counter.
- **Column visibility:** "Columns" dropdown to show/hide columns.
- **Cross-filter highlighting:** Rows matching `activeValues` stay at full opacity; others dim to 0.4.
- **Striped rows:** Even rows have subtle `rgba(217,214,207,0.15)` background.
- **Row hover:** `rgba(73,87,55,0.05)` on hover.

#### Styling

- Header: Montserrat Bold 11px uppercase, letter-spacing 0.5px, color `#595755`.
- Cells: Open Sans Regular 14px, color `#2A2928`.
- Borders: 1px solid `#D9D6CF`. Border-radius: 0px.
- Page size options: 10, 20, 50, 100 (from `PAGE_SIZES` constant).

#### Do's

- Define columns with TanStack Table `ColumnDef` type.
- Use `formatCurrency`, `formatPercent` in cell renderers.
- Set `paginated={true}` for datasets > 20 rows.

#### Don'ts

- Do NOT use raw `<table>` HTML. Use `DataTable`.
- Do NOT create custom table components.

---

### ExpandableTable

**File:** `src/components/tables/ExpandableTable.tsx`

Hierarchical table with expand/collapse for nested data (Brand > Category > Model drill-down).

#### Props

```tsx
interface ExpandableTableProps {
  /** Hierarchical data with nested children */
  data: HierarchicalRow[]
  /** Show loading skeleton */
  loading?: boolean           // Default: false
  /** Show empty state */
  empty?: boolean             // Default: false
  /** Additional CSS classes */
  className?: string
}
```

#### HierarchicalRow Type

```tsx
interface HierarchicalRow {
  id: string
  name: string
  level: number         // 0 = top level, 1 = second, 2 = third, etc.
  parentId?: string
  units: number
  revenue: number
  margin: number
  avgPrice: number
  yoyGrowth: number
  children?: HierarchicalRow[]
}
```

#### Usage

```tsx
import { ExpandableTable } from "@/components/tables/ExpandableTable"

<ExpandableTable
  data={[
    {
      id: "jayco",
      name: "Jayco",
      level: 0,
      units: 52000,
      revenue: 4200000000,
      margin: 18.5,
      avgPrice: 80769,
      yoyGrowth: 8.3,
      children: [
        {
          id: "jayco-tt",
          name: "Travel Trailer",
          level: 1,
          parentId: "jayco",
          units: 32000,
          revenue: 2400000000,
          margin: 17.2,
          avgPrice: 75000,
          yoyGrowth: 6.1,
          children: [/* ... model-level rows */],
        },
      ],
    },
  ]}
/>
```

#### Features

- **Expand/Collapse All** button in the toolbar.
- Click a parent row to toggle its children.
- Level-based indentation: 24px per level.
- Level-based styling:
  - Level 0 (brand): 15px font, bold 700, subtle grey background.
  - Level 1 (category): 14px font, semibold 600.
  - Level 2+ (model): 13px font, regular 400, muted color.
- Fixed columns: Name, Units, Revenue, Margin %, Avg Price, YoY Growth.
- Sticky header. Row hover state.
- YoY Growth column uses `TrendIndicator` component.

---

## 5. Filter Components

### MultiSelect

**File:** `src/components/filters/MultiSelect.tsx`

Checkbox-based multi-select dropdown with search, Select All, and Clear All.

#### Props

```tsx
interface MultiSelectProps {
  /** Label for the filter */
  label: string
  /** Available options */
  options: SelectOption[]     // { value: string, label: string }
  /** Currently selected values */
  selected: string[]
  /** Callback when selection changes */
  onChange: (selected: string[]) => void
  /** Placeholder when nothing selected */
  placeholder?: string        // Default: "Select..."
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { MultiSelect } from "@/components/filters/MultiSelect"

<MultiSelect
  label="Brand"
  options={[
    { value: "airstream", label: "Airstream" },
    { value: "jayco", label: "Jayco" },
    { value: "keystone", label: "Keystone" },
    { value: "tmc", label: "Thor Motor Coach" },
    { value: "heartland", label: "Heartland" },
  ]}
  selected={selectedBrands}
  onChange={setSelectedBrands}
  placeholder="All Brands"
/>
```

#### Features

- Search input to filter options.
- "Select All" and "Clear All" links.
- Trigger displays: placeholder when empty, single label when 1 selected, "N selected" when > 1, "All [label]" when all selected.
- Count badge shows number of selected items.
- Closes on outside click.

---

### DateRangePicker

**File:** `src/components/filters/DateRangePicker.tsx`

Date range selector with preset buttons (MTD, QTD, YTD, L12M, L30D, Custom) and manual date inputs.

#### Props

```tsx
interface DateRangePickerProps {
  /** Current date range value */
  value: DateRange            // { start: string, end: string, preset: string }
  /** Callback when range changes */
  onChange: (range: DateRange) => void
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { DateRangePicker } from "@/components/filters/DateRangePicker"

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
/>
```

#### Features

- Preset buttons: MTD, QTD, YTD, L12M, L30D, Custom (from `DATE_PRESETS` constant).
- Active preset highlighted with Dark Green background.
- "Custom" preset reveals start/end date inputs with `<input type="date">`.
- Display text shows preset abbreviation and formatted date range.
- Calendar icon in trigger button.
- Closes on outside click.

---

### FilterChips

**File:** `src/components/filters/FilterChips.tsx`

Displays active filters as removable chip/pill elements. Shows "Clear All" when 2+ chips are active.

#### Props

```tsx
interface FilterChipsProps {
  /** Active filter chips */
  filters: FilterChipData[]   // { key: string, label: string, value: string }
  /** Callback when a chip is removed */
  onRemove: (key: string, value: string) => void
  /** Callback to clear all filters */
  onClearAll: () => void
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { FilterChips } from "@/components/filters/FilterChips"

<FilterChips
  filters={[
    { key: "brand", label: "Brand", value: "Jayco" },
    { key: "brand", label: "Brand", value: "Keystone" },
    { key: "region", label: "Region", value: "Midwest" },
  ]}
  onRemove={(key, value) => handleRemoveFilter(key, value)}
  onClearAll={handleClearAllFilters}
/>
```

#### Features

- Each chip shows `label: value` with an X button.
- Chip removal has a 150ms fade-out animation.
- "Clear All" link appears when 2+ chips are active.
- Returns `null` when `filters` array is empty.
- Uses ARIA `role="list"` and `role="listitem"` for accessibility.

---

### SegmentToggle

**File:** `src/components/filters/SegmentToggle.tsx`

Segmented control (radio group) for switching between mutually exclusive options.

#### Props

```tsx
interface SegmentToggleProps {
  /** Available options */
  options: SelectOption[]     // { value: string, label: string }
  /** Currently selected value */
  value: string
  /** Callback when selection changes */
  onChange: (value: string) => void
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { SegmentToggle } from "@/components/filters/SegmentToggle"

<SegmentToggle
  options={[
    { value: "revenue", label: "Revenue" },
    { value: "units", label: "Units" },
    { value: "margin", label: "Margin" },
  ]}
  value={metric}
  onChange={setMetric}
/>
```

#### Features

- Active segment: Dark Green background, Lightest text.
- Inactive segments: transparent background, Grey text.
- Keyboard accessible: Arrow keys to navigate, Enter/Space to select.
- ARIA `role="radiogroup"` and `role="radio"` with `aria-checked`.
- Container has subtle grey background (`rgba(217,214,207,0.3)`).

---

## 6. Feedback Components

### EmptyState

**File:** `src/components/feedback/EmptyState.tsx`

Displayed when a data component has no results.

#### Props

```tsx
interface EmptyStateProps {
  /** Custom icon element */
  icon?: React.ReactNode
  /** Heading text */
  title?: string              // Default: "No data available"
  /** Description text */
  description?: string        // Default: "Try adjusting your date range or filter selection"
  /** Optional action element (e.g., reset button) */
  action?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { EmptyState } from "@/components/feedback/EmptyState"

<EmptyState
  title="No dealers found"
  description="Try adjusting your search criteria or region filter."
  action={<Button onClick={resetFilters}>Reset Filters</Button>}
/>
```

---

### ErrorState

**File:** `src/components/feedback/ErrorState.tsx`

Displayed when a data fetch or render fails.

#### Props

```tsx
interface ErrorStateProps {
  /** Error heading */
  title?: string              // Default: "Something went wrong"
  /** Detailed error message */
  message?: string
  /** Retry callback (renders a "Try again" button) */
  onRetry?: () => void
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { ErrorState } from "@/components/feedback/ErrorState"

<ErrorState
  title="Failed to load data"
  message="The server returned an error. Please try again."
  onRetry={() => refetch()}
/>
```

---

### LoadingSpinner

**File:** `src/components/feedback/LoadingSpinner.tsx`

Inline spinning indicator for small loading contexts.

#### Props

```tsx
interface LoadingSpinnerProps {
  /** Size: sm (16px), md (24px), lg (32px) */
  size?: "sm" | "md" | "lg"   // Default: "md"
  /** Additional CSS classes */
  className?: string
}
```

#### Usage

```tsx
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"

<LoadingSpinner size="sm" />
```

---

### KpiSkeleton

**File:** `src/components/feedback/KpiSkeleton.tsx`

Loading skeleton matching the dimensions of a `KpiCard`.

#### Props

```tsx
interface KpiSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show a sparkline placeholder row */
  showSparkline?: boolean     // Default: true
}
```

---

### ChartSkeleton

**File:** `src/components/feedback/ChartSkeleton.tsx`

Loading skeleton matching the dimensions of a chart widget.

#### Props

```tsx
interface ChartSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Height of the skeleton in pixels */
  height?: number             // Default: 300
}
```

---

### TableSkeleton

**File:** `src/components/feedback/TableSkeleton.tsx`

Loading skeleton matching the dimensions of a data table.

#### Props

```tsx
interface TableSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Number of body rows to display */
  rows?: number               // Default: 8
  /** Number of columns to display */
  columns?: number            // Default: 5
}
```

---

## 7. Status & Indicators

### StatusBadge

**File:** `src/components/StatusBadge.tsx`

Inline status indicator pill with THOR-branded color variants.

#### Props

```tsx
interface StatusBadgeProps {
  /** Visual variant */
  variant: StatusVariant  // "success" | "warning" | "info" | "error"
  /** Badge text */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

#### Variant Styles

| Variant | Background | Text Color |
|---------|-----------|------------|
| `success` | `rgba(73,87,55,0.15)` | `#495737` (Dark Green) |
| `warning` | `rgba(197,126,10,0.15)` | `#C57E0A` (Dark Orange) |
| `info` | `rgba(87,125,145,0.15)` | `#577D91` (Blue) |
| `error` | `rgba(197,50,50,0.15)` | `#C53232` |

#### Usage

```tsx
import { StatusBadge } from "@/components/StatusBadge"

<StatusBadge variant="success">Active</StatusBadge>
<StatusBadge variant="warning">Pending</StatusBadge>
<StatusBadge variant="info">In Review</StatusBadge>
<StatusBadge variant="error">Declined</StatusBadge>
```

#### Styling

- Font: Montserrat Bold, 10px, uppercase, letter-spacing 0.5px
- Padding: 4px 10px
- Border-radius: 0px

---

### TrendIndicator

**File:** `src/components/TrendIndicator.tsx`

Arrow + percentage display with directional color coding.

#### Props

```tsx
interface TrendIndicatorProps {
  /** Trend percentage value (positive or negative) */
  value: number
  /** Whether increase is positive or negative */
  direction?: TrendDirection  // "up-is-good" | "down-is-good" -- Default: "up-is-good"
  /** Size variant */
  size?: "sm" | "md"          // Default: "md"
  /** Additional CSS classes */
  className?: string
}
```

#### Color Logic

| Condition | Color |
|-----------|-------|
| Trend is "good" (up + up-is-good, or down + down-is-good) | Dark Green `#495737` |
| Trend is "bad" (up + down-is-good, or down + up-is-good) | Dark Orange `#C57E0A` |

#### Usage

```tsx
import { TrendIndicator } from "@/components/TrendIndicator"

<TrendIndicator value={8.3} direction="up-is-good" />    // Green up arrow, "8.3%"
<TrendIndicator value={-2.1} direction="up-is-good" />   // Orange down arrow, "2.1%"
<TrendIndicator value={-5.0} direction="down-is-good" /> // Green down arrow, "5.0%"
```

---

## 8. Primitive UI Components (shadcn/ui)

These are the base shadcn/ui primitives installed in `src/components/ui/`. They provide accessible, unstyled foundations that MUST be used instead of raw HTML.

| Component | File | Base Library | Purpose |
|-----------|------|-------------|---------|
| `Button` | `ui/button.tsx` | Radix Slot + CVA | All buttons |
| `Card` | `ui/card.tsx` | -- | Card containers (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) |
| `Input` | `ui/input.tsx` | -- | Text inputs |
| `Select` | `ui/select.tsx` | Radix Select | Dropdown selects |
| `Table` | `ui/table.tsx` | -- | Table primitives (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) |
| `Tabs` | `ui/tabs.tsx` | Radix Tabs | Tab navigation |
| `Dialog` | `ui/dialog.tsx` | Radix Dialog | Modal dialogs |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Radix DropdownMenu | Context menus |
| `Tooltip` | `ui/tooltip.tsx` | Radix Tooltip | Hover tooltips |
| `Sheet` | `ui/sheet.tsx` | Radix Dialog | Slide-out panels |
| `Accordion` | `ui/accordion.tsx` | Radix Accordion | Collapsible sections |
| `Badge` | `ui/badge.tsx` | CVA | Inline badges |
| `Separator` | `ui/separator.tsx` | Radix Separator | Visual dividers |
| `ScrollArea` | `ui/scroll-area.tsx` | Radix ScrollArea | Custom scrollbars |
| `Popover` | `ui/popover.tsx` | Radix Popover | Floating content |
| `Command` | `ui/command.tsx` | cmdk | Command palette |

### Button Variants

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
<Button variant="destructive">Destructive</Button>

<Button size="default">Default (h-9)</Button>
<Button size="sm">Small (h-8)</Button>
<Button size="lg">Large (h-10)</Button>
<Button size="icon">Icon Only (h-9 w-9)</Button>
```

---

## 9. Types Reference

All shared types live in `src/lib/types.ts`.

```tsx
type MetricFormat = "currency" | "percentage" | "integer" | "decimal" | "days"

type TrendDirection = "up-is-good" | "down-is-good"

type StatusVariant = "success" | "warning" | "info" | "error"

interface KpiItem {
  id: string
  label: string
  value: number
  previousValue?: number
  format: MetricFormat
  trend?: number
  sparklineData?: number[]
  direction?: TrendDirection
  comparisonLabel?: string
}

interface LineSeries {
  dataKey: string
  name: string
  color?: string
}

interface DonutDatum {
  name: string
  value: number
  color?: string
}

interface HierarchicalRow {
  id: string
  name: string
  level: number
  parentId?: string
  units: number
  revenue: number
  margin: number
  avgPrice: number
  yoyGrowth: number
  children?: HierarchicalRow[]
}

interface FilterChipData {
  key: string
  label: string
  value: string
}

interface DateRange {
  start: string
  end: string
  preset: string
}

interface SelectOption {
  value: string
  label: string
}

// NavItem as defined in src/lib/types.ts (generic reference type)
interface NavItem {
  key: string
  label: string
  href: string
  icon?: string
  active?: boolean
}

// NavItem as used by the Sidebar component (from @/components/shell/Sidebar)
// Import via: import { type NavItem } from "@/components/shell"
interface SidebarNavItem {
  id: string
  label: string
  icon: React.ReactNode   // SVG or Lucide icon element
  href?: string
  badge?: string | number
  active?: boolean
}

interface NavSection {
  title: string
  items: SidebarNavItem[]
}
```

---

## 10. Constants Reference

All shared constants live in `src/lib/constants.ts`.

```tsx
import { COLORS, CHART_COLORS, BRANDS, FONTS, SPACING, LAYOUT, PAGE_SIZES, DATE_PRESETS } from "@/lib/constants"

COLORS.darkGreen    // "#495737"
COLORS.green        // "#778862"
COLORS.darkestGrey  // "#2A2928"
COLORS.darkGrey     // "#595755"
COLORS.lightest     // "#FFFDFA"
COLORS.grey         // "#8C8A7E"
COLORS.lightGrey    // "#D9D6CF"
COLORS.blue         // "#577D91"
COLORS.darkOrange   // "#C57E0A"
COLORS.lightOrange  // "#D3A165"

CHART_COLORS        // ["#495737", "#577D91", "#C57E0A", "#778862", "#D3A165"]
BRANDS              // ["Airstream", "Jayco", "Keystone", "Thor Motor Coach", "Heartland"]
FONTS.heading       // "'Montserrat', sans-serif"
FONTS.body          // "'Open Sans', sans-serif"

SPACING.xs          // 8
SPACING.sm          // 16
SPACING.md          // 24
SPACING.lg          // 40
SPACING.xl          // 60

LAYOUT.containerMax     // 1680
LAYOUT.sidebarWidth     // 260
LAYOUT.sidebarCollapsed // 64
LAYOUT.headerHeight     // 64

PAGE_SIZES          // [10, 20, 50, 100]
DATE_PRESETS        // ["MTD", "QTD", "YTD", "L12M", "L30D", "Custom"]
```

---

## 11. Utility Functions

### Formatting (`src/lib/utils/formatting.ts`)

```tsx
import { formatCurrency, formatPercent, formatInteger, formatMetricValue } from "@/lib/utils/formatting"

formatCurrency(14200000000)  // "$14.2B"
formatCurrency(3800000)      // "$3.8M"
formatCurrency(52000)        // "$52.0K"
formatCurrency(750)          // "$750"

formatPercent(18.3)          // "18.3%"
formatPercent(18.3, 0)       // "18%"

formatInteger(52000)         // "52,000"

formatMetricValue(14200000000, "currency")   // "$14.2B"
formatMetricValue(18.3, "percentage")         // "18.3%"
formatMetricValue(52000, "integer")           // "52,000"
formatMetricValue(3.14159, "decimal")         // "3.14"
formatMetricValue(45, "days")                 // "45d"
```

### Class Merging (`src/lib/utils.ts`)

```tsx
import { cn } from "@/lib/utils"

cn("base-class", condition && "conditional-class", className)
```
