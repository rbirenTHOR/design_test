# DEVELOPMENT RULES

> **This document is THE LAW.** Every rule uses MUST or MUST NOT. There are zero exceptions unless explicitly stated. Violating any rule blocks a PR from merging.

---

## 1. Color Rules

You MUST only use colors from the THOR brand palette. No other hex values, named CSS colors, or arbitrary Tailwind colors are permitted.

### Approved Colors (Exhaustive List)

| Name | Hex | Tailwind Class | CSS Variable | Usage |
|------|-----|----------------|--------------|-------|
| Dark Green | `#495737` | `bg-dark-green` / `text-dark-green` | `--dark-green` | Primary buttons, headers, active nav, primary accents |
| Green | `#778862` | `bg-green` / `text-green` | `--green` | Hover states on primary buttons, secondary accents |
| Darkest Grey | `#2A2928` | `bg-darkest-grey` / `text-darkest-grey` | `--darkest-grey` | Dark backgrounds, primary text on light backgrounds |
| Dark Grey | `#595755` | `bg-dark-grey` / `text-dark-grey` | `--dark-grey` | Secondary text, borders, icons |
| Lightest | `#FFFDFA` | `bg-lightest` / `text-lightest` | `--lightest` | Light backgrounds, text on dark backgrounds, button text |
| Grey | `#8C8A7E` | `bg-grey` / `text-grey` | `--grey` | Muted text, disabled states, placeholder text |
| Light Grey | `#D9D6CF` | `bg-light-grey` / `text-light-grey` | `--light-grey` | Borders, dividers, subtle backgrounds |
| Blue | `#577D91` | `bg-blue` / `text-blue` | `--blue` | Links, informational states, chart series 2 |
| Dark Orange | `#C57E0A` | `bg-dark-orange` / `text-dark-orange` | `--dark-orange` | Warnings, call-to-action highlights, chart series 3 |
| Light Orange | `#D3A165` | `bg-light-orange` / `text-light-orange` | `--light-orange` | Secondary highlights, chart series 5 |

### Derived Colors (Opacity Variants Only)

You MAY use opacity variants of the approved colors for specific purposes:

| Pattern | Example | Allowed Usage |
|---------|---------|---------------|
| `rgba(73, 87, 55, 0.05)` | Row hover background | Table row hover only |
| `rgba(73, 87, 55, 0.15)` | Success badge background | Status badges only |
| `rgba(197, 126, 10, 0.15)` | Warning badge background | Status badges only |
| `rgba(87, 125, 145, 0.15)` | Info badge background | Status badges only |

### Semantic Token Mapping

You MUST use shadcn/ui semantic tokens (defined in `globals.css`) for component-level styling. These tokens MUST map to THOR brand colors:

| Token | Maps To | Purpose |
|-------|---------|---------|
| `--primary` | Dark Green `#495737` | Primary actions, active states |
| `--primary-foreground` | Lightest `#FFFDFA` | Text on primary backgrounds |
| `--secondary` | Light Grey `#D9D6CF` | Secondary surfaces |
| `--muted` | Light Grey `#D9D6CF` | Muted backgrounds |
| `--muted-foreground` | Grey `#8C8A7E` | Muted text |
| `--accent` | Green `#778862` | Hover accents |
| `--border` | Light Grey `#D9D6CF` | All borders |
| `--success` | Dark Green `#495737` | Success states |
| `--warning` | Dark Orange `#C57E0A` | Warning states |
| `--destructive` | `#DC2626` | Error/destructive only (sole exception to palette) |

### What Is FORBIDDEN

- You MUST NOT use Tailwind arbitrary color values like `bg-[#FF0000]` with non-THOR hex codes.
- You MUST NOT use named CSS colors (`red`, `blue`, `green`, `gray`, etc.).
- You MUST NOT use default Tailwind color scales (`bg-gray-100`, `text-blue-500`, `border-slate-200`).
- You MUST NOT use `black` or `white` -- use `darkest-grey` (`#2A2928`) and `lightest` (`#FFFDFA`) instead.

---

## 2. Typography Rules

### Font Families

You MUST use exactly two font families. No substitutions. No additions.

| Purpose | Font | Tailwind Class | CSS Variable |
|---------|------|----------------|--------------|
| Headings, buttons, nav, labels, callouts | **Montserrat** | `font-heading` | `var(--font-heading)` |
| Body text, paragraphs, descriptions, table cells | **Open Sans** | `font-body` | `var(--font-body)` |

### Type Scale

You MUST use the pre-defined type scale. Do not invent custom font sizes.

| Element | Tailwind Class | Font | Weight | Size | Line Height |
|---------|---------------|------|--------|------|-------------|
| Hero heading | `text-hero` | Montserrat | 800 | 54px | 1.2 |
| H1 page title | `text-h1` | Montserrat | 800 | 36px | 1.2 |
| H2 section header | `text-h2` | Montserrat | 800 | 36px | 1.2 |
| H3 subsection | `text-h3` | Montserrat | 700 | 18px | 1.33 |
| H3 card title | `text-h3-card` | Montserrat | 800 | 16px | 1.0 |
| Body large | `text-body-lg` | Open Sans | 400 | 18px | 1.5 |
| Body default | `text-base` | Open Sans | 400 | 16px | 1.5 |
| Body small | `text-body-sm` | Open Sans | 400 | 14px | 1.5 |
| Caption | `text-caption` | Open Sans | 400 | 12px | 1.5 |

### Callouts and Labels

- KPI labels, table headers, status badges, and category labels MUST use Montserrat Bold (700) or ExtraBold (800) in ALL CAPS.
- You MUST add `uppercase` and `tracking-wider` (or `letter-spacing: 0.5px`) to callout text.

### What Is FORBIDDEN

- You MUST NOT use any font family other than Montserrat and Open Sans.
- You MUST NOT use Geist, Inter, Roboto, Arial, Helvetica, or any system font for visible text.
- You MUST NOT use arbitrary Tailwind font sizes like `text-[22px]`. Use the defined scale only.

---

## 3. Border Radius Rules

**All elements MUST have `border-radius: 0px`.** No rounded corners anywhere.

This applies to:
- Buttons
- Cards
- Inputs and selects
- Badges
- Tooltips and popovers
- Dialogs and modals
- Dropdowns
- Tabs
- Every other UI element

### Implementation

The global `--radius` CSS variable is set to `0px` in `globals.css`. All shadcn/ui components inherit from this.

You MUST ensure:
- `--radius: 0px;` in `:root`
- No component overrides `border-radius` to any non-zero value
- No Tailwind `rounded-*` classes are used (not `rounded-sm`, not `rounded-md`, not `rounded-lg`, not `rounded-xl`, not `rounded-full`)

### Sole Exception

None. There are no exceptions.

---

## 4. Shadow Rules

- You MUST NOT use `box-shadow` on any element in its default (resting) state.
- Cards, containers, and surfaces MUST be flat with no shadow.
- You MAY use a subtle shadow ONLY on hover states for interactive cards: `shadow-sm` or `0 2px 8px rgba(0,0,0,0.08)`.
- You MUST NOT use `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, or `shadow-2xl` on any resting element.
- Drop shadows on text are FORBIDDEN.

---

## 5. Component Usage Rules

### Use Existing Components Only

You MUST use the components provided in `src/components/`. You MUST NOT create custom components that duplicate existing functionality.

| Need | Use This Component | Location |
|------|--------------------|----------|
| Page layout | `AppShell` | `@/components/shell/AppShell` |
| Page header | `Header` | `@/components/shell/Header` |
| Side navigation | `Sidebar` | `@/components/shell/Sidebar` |
| Filter panel | `FilterPanel` + `FilterGroup` | `@/components/shell/FilterPanel`, `@/components/shell/FilterGroup` |
| KPI display | `KpiCard` | `@/components/kpi/KpiCard` |
| KPI row layout | `KpiCardGroup` | `@/components/kpi/KpiCardGroup` |
| Data table | `DataTable` | `@/components/tables/DataTable` |
| Hierarchical table | `ExpandableTable` | `@/components/tables/ExpandableTable` |
| Bar chart (vertical) | `BarChart` | `@/components/charts/BarChart` |
| Bar chart (horizontal) | `HorizontalBarChart` | `@/components/charts/HorizontalBarChart` |
| Line chart | `LineChart` | `@/components/charts/LineChart` |
| Combo chart (bar + line) | `ComboChart` | `@/components/charts/ComboChart` |
| Donut/ring chart | `DonutChart` | `@/components/charts/DonutChart` |
| Status indicator | `StatusBadge` | `@/components/StatusBadge` |
| Trend arrow + percentage | `TrendIndicator` | `@/components/TrendIndicator` |
| Multi-select filter | `MultiSelect` | `@/components/filters/MultiSelect` |
| Date range filter | `DateRangePicker` | `@/components/filters/DateRangePicker` |
| Active filter chips | `FilterChips` | `@/components/filters/FilterChips` |
| Segment toggle | `SegmentToggle` | `@/components/filters/SegmentToggle` |
| Loading skeleton (KPI) | `KpiSkeleton` | `@/components/feedback/KpiSkeleton` |
| Loading skeleton (chart) | `ChartSkeleton` | `@/components/feedback/ChartSkeleton` |
| Loading skeleton (table) | `TableSkeleton` | `@/components/feedback/TableSkeleton` |
| Loading spinner | `LoadingSpinner` | `@/components/feedback/LoadingSpinner` |
| Empty state | `EmptyState` | `@/components/feedback/EmptyState` |
| Error state | `ErrorState` | `@/components/feedback/ErrorState` |
| Buttons | `Button` | `@/components/ui/button` |
| Form inputs | `Input`, `Select` | `@/components/ui/input`, `@/components/ui/select` |

### Three-State Pattern

Every data-displaying component MUST implement three visual states:

1. **Loading** - Skeleton placeholder matching the component's dimensions
2. **Populated** - Displays data normally
3. **Empty** - Shows a meaningful empty state message with guidance

You MUST pass `loading` and `empty` props (or equivalent) to every data component. You MUST NOT show a blank area when data is absent.

### What Is FORBIDDEN

- You MUST NOT install new UI component libraries (`@mui/material`, `antd`, `chakra-ui`, `mantine`, etc.).
- You MUST NOT create custom card, button, table, or chart components that bypass the provided ones.
- You MUST NOT use raw HTML `<table>`, `<button>`, or `<input>` elements. Use the shadcn/ui primitives.

---

## 6. Page Shell Rules

Every dashboard page MUST use the `AppShell` layout component.

### Required Structure

```tsx
<AppShell>
  {/* Header is automatically rendered by AppShell - locked to top */}
  {/* Sidebar is automatically rendered by AppShell - collapsible */}
  {/* FilterPanel is optionally rendered based on page config */}

  {/* Your page content goes in the content area */}
  <div className="space-y-md-space">
    {/* KPI cards row */}
    {/* Charts grid */}
    {/* Data table */}
  </div>
</AppShell>
```

### Layout Rules

- The `Header` MUST be fixed to the top of the viewport at all times. It MUST NOT scroll with content.
- The `Sidebar` MUST be present on every page. It MUST be collapsible. It pushes content when expanded.
- The `FilterPanel` MUST push content (not overlay) when open. See `docs/FILTER_RULES.md`.
- The content area MUST be scrollable independently of the header and sidebar.
- Maximum content width MUST be `1680px` (the `--container-max` variable).

### What Is FORBIDDEN

- You MUST NOT create pages that bypass `AppShell`.
- You MUST NOT create custom headers, sidebars, or navigation components.
- You MUST NOT use overlay/modal filter panels on desktop viewports.
- You MUST NOT hardcode sidebar width or header height -- use the design tokens.

---

## 7. Filter Rules

All filtering MUST use the `FilterPanel` and `FilterGroup` system. See `docs/FILTER_RULES.md` for the complete specification.

- You MUST NOT build custom filter UI outside the FilterPanel.
- You MUST use `nuqs` for URL-based filter state management.
- You MUST NOT use React `useState` for filter values (use URL state via nuqs).
- Filter changes MUST be reflected in the browser URL.
- Users MUST be able to share a URL and see the same filtered view.

---

## 8. TypeScript Rules

- TypeScript strict mode is enabled in `tsconfig.json`. You MUST NOT disable it.
- You MUST NOT use `any` type. Use `unknown` if the type is truly unknown, then narrow it.
- You MUST NOT use `@ts-ignore` or `@ts-expect-error` without a comment explaining why.
- You MUST NOT use `as` type assertions unless there is no alternative (e.g., type narrowing after a guard).
- All component props MUST have explicit TypeScript interfaces.
- All mock data MUST conform to the types defined in `src/lib/types.ts`.
- All API response shapes MUST be defined in `src/lib/types.ts`.

---

## 9. Dependency Rules

### Approved Dependencies (Exhaustive)

| Package | Purpose | Version |
|---------|---------|---------|
| `next` | Framework | 14.x |
| `react` / `react-dom` | UI library | 18.x |
| `tailwindcss` | Styling | 3.4.x |
| `@radix-ui/*` | Accessible primitives (via shadcn/ui) | Latest |
| `class-variance-authority` | Variant styling | Latest |
| `clsx` | Class merging | Latest |
| `tailwind-merge` | Tailwind class deduplication | Latest |
| `cmdk` | Command palette (via shadcn/ui) | Latest |
| `recharts` | Charts | 3.x |
| `@tanstack/react-table` | Data tables | 8.x |
| `nuqs` | URL state management | 2.x |
| `lucide-react` | Icons | Latest |
| `tailwindcss-animate` | Animations | Latest |

### What Is FORBIDDEN

- You MUST NOT install CSS libraries (`bootstrap`, `bulma`, `foundation`, `styled-components`, `emotion`).
- You MUST NOT install additional icon libraries (`react-icons`, `fontawesome`, `heroicons`).
- You MUST NOT install additional charting libraries (`plotly`, `d3`, `chart.js`, `nivo`, `victory`).
- You MUST NOT install additional table libraries (`ag-grid`, `react-data-grid`).
- You MUST NOT install additional state management libraries (`redux`, `zustand`, `jotai`, `recoil`).
- You MUST NOT install additional UI component libraries (`@mui/*`, `antd`, `@chakra-ui/*`, `@mantine/*`).
- Adding any new dependency requires explicit approval. If a new dependency is genuinely needed, document the justification before adding it.

---

## 10. Icon Rules

- You MUST use `lucide-react` for all icons. No exceptions.
- You MUST NOT use inline SVG icons unless Lucide does not provide the required icon AND no reasonable Lucide alternative exists.
- You MUST NOT install or use `react-icons`, `@heroicons/react`, `@fortawesome/*`, or any other icon library.
- Icon size MUST match the surrounding text context: 16px for body, 20px for headers, 24px for standalone icons.
- Icon color MUST follow the THOR color palette rules (Section 1).

---

## 11. File Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| React components | `PascalCase.tsx` | `KpiCard.tsx`, `AppShell.tsx` |
| TypeScript modules | `kebab-case.ts` | `mock-data.ts` |
| Page routes | `page.tsx` in folder | `app/sales/page.tsx` |
| Layout routes | `layout.tsx` in folder | `app/sales/layout.tsx` |
| Types | `types.ts` | `lib/types.ts` |
| Constants | `constants.ts` | `lib/constants.ts` |
| Utilities | `kebab-case.ts` or descriptive name | `lib/utils/formatting.ts` |
| Barrel exports | `index.ts` | `components/shell/index.ts` |
| Test files | `*.spec.ts` or `*.spec.tsx` | `KpiCard.spec.tsx` |

- Component files MUST use PascalCase matching the default export name (`KpiCard.tsx` exports `KpiCard`).
- Non-component modules (types, constants, utilities, mock data) MUST use kebab-case.
- You MUST NOT use camelCase for file names (`kpiCard.tsx` is wrong).

---

## 12. Import Ordering Rules

Imports MUST follow this order, with a blank line between each group:

```tsx
// 1. React and Next.js
import * as React from "react"
import { useRouter } from "next/navigation"

// 2. Third-party libraries
import { BarChart, Bar } from "recharts"
import { useQueryState } from "nuqs"

// 3. Internal aliases (@/ paths) - components
import { AppShell, type NavSection } from "@/components/shell"
import { KpiCard, KpiCardGroup } from "@/components/kpi"
import { BarChart } from "@/components/charts/BarChart"
import { DataTable } from "@/components/tables/DataTable"
import { Button } from "@/components/ui/button"

// 4. Internal aliases (@/ paths) - lib/utils
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/formatting"
import type { KpiItem } from "@/lib/types"

// 5. Relative imports (if any)
import { localHelper } from "./helpers"
```

---

## 13. Chart Rules

- You MUST use `recharts` for all data visualization.
- Chart colors MUST follow this series order:
  1. Dark Green `#495737`
  2. Blue `#577D91`
  3. Dark Orange `#C57E0A`
  4. Green `#778862`
  5. Light Orange `#D3A165`
- Grid lines MUST be dashed: `strokeDasharray="3 3"`.
- Grid line color on light backgrounds: `#D9D6CF`.
- Grid line color on dark backgrounds: `#3a3938`.
- Font inside charts MUST use the `--font-body` (Open Sans) variable.
- Chart font size MUST be 12px for axis labels, 14px for tooltips.
- You MUST NOT use gradient fills on charts unless the specific chart component supports it.

---

## 14. Table Rules

- Table header text MUST use Montserrat Bold, 11px, uppercase, with `letter-spacing: 0.5px`.
- Table cell text MUST use Open Sans Regular, 14px.
- Table row hover background MUST be `rgba(73, 87, 55, 0.05)`.
- Table borders MUST be `1px solid #D9D6CF`.
- You MUST use the `DataTable` component (built on TanStack Table). You MUST NOT use raw `<table>` HTML.
- Sortable columns MUST show a sort indicator icon.
- Tables with more than 20 rows MUST implement pagination.

---

## 15. Spacing Rules

You MUST use the spacing scale defined in `tailwind.config.ts`:

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| xs | 8px | `p-xs`, `gap-xs`, `m-xs` | Tight spacing: icon gaps, badge padding |
| sm-space | 16px | `p-sm-space`, `gap-sm-space` | Default gap between related elements |
| md-space | 24px | `p-md-space`, `gap-md-space` | Card padding, section gaps |
| lg-space | 40px | `p-lg-space`, `gap-lg-space` | Button horizontal padding, section padding |
| xl-space | 60px | `p-xl-space` | Major section breaks |

- You MUST NOT use arbitrary spacing values like `p-[37px]` or `gap-[22px]`.
- Button padding MUST be `13px 40px` (vertical horizontal) as defined in the brand guide.

---

## 16. Accessibility Rules

- All interactive elements MUST be keyboard accessible.
- All images and icons MUST have appropriate `alt` text or `aria-label`.
- Color contrast MUST meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).
- Focus indicators MUST be visible. You MUST NOT remove `outline` on focus without providing an alternative.
- All form inputs MUST have associated `<label>` elements or `aria-label` attributes.

---

## 17. Performance Rules

- You MUST use Next.js `Image` component for all images (not `<img>`).
- You MUST use dynamic imports (`next/dynamic`) for heavy chart components.
- You MUST NOT import entire libraries when only a subset is needed (e.g., import specific Lucide icons, not the full package).
- Components that do not need client-side interactivity MUST be Server Components (the default in App Router).
- Client Components MUST include `"use client"` directive at the top of the file.

---

## 18. THOR Brand Writing Rules

- You MUST capitalize THOR in all situations. Never write "Thor" or "thor".
- You MUST refer to subsidiary brands as the "THOR family of companies".
- You MUST NOT refer to THOR as a "holding company" or "collection of brands".
- Approved brand names: Airstream, Jayco, Keystone, Thor Motor Coach (TMC), Heartland.
- Use RV industry terminology: "RV", "Travel Trailer", "Coach", "Class B", "Camper Van". MUST NOT use the word "trailer" alone for RVs.

---

## Violations Checklist

**Every developer MUST verify all items below before opening a PR.**

### Colors
- [ ] I used ONLY hex values from the approved THOR palette (Section 1)
- [ ] I did NOT use default Tailwind color scales (`gray-100`, `blue-500`, etc.)
- [ ] I did NOT use named CSS colors (`red`, `blue`, `white`, `black`)
- [ ] I did NOT use `#000000` or `#FFFFFF` -- I used `#2A2928` and `#FFFDFA`

### Typography
- [ ] I used ONLY Montserrat and Open Sans
- [ ] Headings use Montserrat with weight 700 or 800
- [ ] Body text uses Open Sans with weight 400
- [ ] I used ONLY the defined type scale (no arbitrary font sizes)
- [ ] Callout/label text is ALL CAPS Montserrat Bold

### Layout
- [ ] My page uses `AppShell` as the layout wrapper
- [ ] The header is fixed and never scrolls
- [ ] The sidebar is present and collapsible
- [ ] Filters use `FilterPanel` + `FilterGroup` (not custom UI)
- [ ] Filter state is managed via nuqs (URL parameters)

### Components
- [ ] I used existing components from `@/components/`
- [ ] I did NOT create custom components that duplicate existing ones
- [ ] Every data component has loading, populated, and empty states
- [ ] I did NOT install any new dependencies

### Styling
- [ ] `border-radius` is `0px` on ALL elements (no rounded corners)
- [ ] No `box-shadow` on resting elements (shadows on hover only)
- [ ] I used the spacing scale (no arbitrary spacing values)
- [ ] Icons are from `lucide-react` only

### Code Quality
- [ ] TypeScript strict mode passes with no errors
- [ ] No `any` types
- [ ] No `@ts-ignore` without justification
- [ ] Imports follow the ordering rules (Section 12)
- [ ] Component file names are PascalCase; module file names are kebab-case
- [ ] THOR is capitalized correctly everywhere
