# THOR Dashboard Design System — Development Rules

> **STRICT ENFORCEMENT**: These rules are NON-NEGOTIABLE. Every instruction uses MUST or MUST NOT. Zero exceptions unless explicitly stated. Violating any rule blocks a PR.

---

## Startup Protocol (READ THIS FIRST)

**Goal: Minimize token usage on startup. Do NOT read every file in the codebase.**

### On every new conversation:

1. **Read ONLY this file (`CLAUDE.md`)**. It contains the component map, color palette, typography, spacing, and all design rules you need. Do NOT read individual component source files unless you need to debug or extend a specific component.

2. **Check the data source config**: Read `src/config/data-source.json`.
   - If `"configured": false` → **STOP**. You MUST run the Data Source Gate (below) before building any data-driven pages.
   - If `"configured": true` → Read `src/config/schema-cache.json` for the semantic model schema (tables, columns, measures). Use this to generate types and mock data.

3. **For page building**: Reference the component map table (below) and `docs/COMPONENT_API.md` for prop signatures. Only read a component's `.tsx` source if you need implementation details not covered in the docs.

4. **For styling questions**: Everything is in this file (colors, fonts, spacing, shadows, border-radius). Do NOT read `tailwind.config.ts` or `globals.css` unless debugging a build issue.

### What NOT to do on startup:
- Do NOT read all files in `src/components/` — the Component Map below has what you need
- Do NOT read `src/lib/mock-data.ts` until you need to add data
- Do NOT read `docs/*.md` unless you need a specific deep-dive
- Do NOT invent data types — they MUST come from the schema cache or the user

---

## Data Source Gate (MANDATORY before building pages)

Before creating any data-driven page, you MUST check `src/config/data-source.json`.

```
If configured === true  → Read src/config/schema-cache.json, then build.
If configured === false → Run automated discovery (see below), then build.
```

### Automated discovery (when `configured === false`):
1. Look up the model name in the **Known Models** table (bottom of this file)
2. Get a bearer token via `az account get-access-token --resource https://analysis.windows.net/powerbi/api --query accessToken -o tsv`
3. Call the **Fabric getDefinition API** (NOT DAX INFO functions — those don't work via REST). Full steps in `docs/FABRIC_INTEGRATION.md` Section 2b. Summary:
   - `POST https://api.fabric.microsoft.com/v1/workspaces/{id}/semanticModels/{id}/getDefinition` (with `Content-Length: 0` header)
   - Poll the `Location` response header URL until `status: Succeeded`
   - `GET {location}/result` → save to `tmdl_raw.json`
   - Parse TMDL with Python (`/c/Users/rbiren/AppData/Local/anaconda3/python.exe`) — decode base64, extract tables/columns/measures/relationships
4. Write `src/config/schema-cache.json` and update `src/config/data-source.json` to `configured: true`
5. Generate types in `src/lib/types.ts`, mock data in `src/lib/mock-data.ts`
6. Delete `tmdl_raw.json` when done

**NEVER** invent column names, ask the user to paste schema, or skip discovery.
**NEVER** use `INFO.TABLES()`, `INFO.COLUMNS()`, `INFO.MEASURES()`, or `COLUMNSTATISTICS()` via the executeQueries REST API — they are not supported.

---

## Quick Reference

- **Colors**: ONLY the 10 THOR brand colors (see below). No Tailwind defaults, no named CSS colors, no `#000`/`#FFF`.
- **Fonts**: ONLY Montserrat (headings) + Open Sans (body). No Inter, Geist, Roboto, Arial, etc.
- **Border-radius**: `0px` on ALL elements. No `rounded-*` Tailwind classes. No exceptions.
- **Shadows**: NONE on resting state. `shadow-sm` on hover ONLY.
- **Components**: Use ONLY components from `src/components/`. NEVER create duplicates.
- **Layout**: Every page MUST use `AppShell`. NEVER bypass it.
- **Filters**: MUST use `FilterPanel` + `FilterGroup`. State via `nuqs` (URL params). NEVER `useState` for filters.
- **Icons**: `lucide-react` ONLY. No other icon libraries.
- **Charts**: `recharts` ONLY. No d3, plotly, chart.js, nivo.
- **Tables**: `DataTable` (TanStack) ONLY. No raw `<table>` HTML.
- **TypeScript**: Strict mode. No `any`. No `@ts-ignore` without justification.
- **Brand**: Always "THOR" (never "Thor" or "thor"). Brands: Airstream, Jayco, Keystone, Thor Motor Coach, Heartland.

---

## Color Palette (Exhaustive — NO other colors allowed)

| Name | Hex | CSS Variable | Tailwind | Usage |
|------|-----|-------------|----------|-------|
| Dark Green | `#495737` | `--dark-green` | `bg-dark-green` / `text-dark-green` | Primary buttons, headers, active nav |
| Green | `#778862` | `--green` | `bg-green` / `text-green` | Hover states, secondary accents |
| Darkest Grey | `#2A2928` | `--darkest-grey` | `bg-darkest-grey` / `text-darkest-grey` | Dark backgrounds, primary text |
| Dark Grey | `#595755` | `--dark-grey` | `bg-dark-grey` / `text-dark-grey` | Secondary text, borders |
| Lightest | `#FFFDFA` | `--lightest` | `bg-lightest` / `text-lightest` | Light backgrounds, button text |
| Grey | `#8C8A7E` | `--grey` | `bg-grey` / `text-grey` | Muted text, disabled states |
| Light Grey | `#D9D6CF` | `--light-grey` | `bg-light-grey` / `text-light-grey` | Borders, dividers, backgrounds |
| Blue | `#577D91` | `--blue` | `bg-blue` / `text-blue` | Links, info states, chart series 2 |
| Dark Orange | `#C57E0A` | `--dark-orange` | `bg-dark-orange` / `text-dark-orange` | Warnings, CTAs, chart series 3 |
| Light Orange | `#D3A165` | `--light-orange` | `bg-light-orange` / `text-light-orange` | Secondary highlights, chart series 5 |

**Allowed opacity variants**: `rgba(73,87,55,0.05)` table hover, `rgba(73,87,55,0.15)` success badge, `rgba(197,126,10,0.15)` warning badge, `rgba(87,125,145,0.15)` info badge.

**FORBIDDEN**: `#000000`, `#FFFFFF`, Tailwind color scales (`gray-100`, `blue-500`), named CSS colors (`red`, `white`).

---

## Typography

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| H1 / Hero | Montserrat | 800 | 36px / 54px | Page titles |
| H2 | Montserrat | 800 | 36px | Section headers |
| H3 | Montserrat | 700-800 | 18px | Subsections, card titles |
| Body | Open Sans | 400 | 16px | General text |
| Body Small | Open Sans | 400 | 14px | Secondary text, table cells |
| Caption | Open Sans | 400 | 12px | Labels, meta |
| Callout/Label | Montserrat | 700 | varies | ALL CAPS, letter-spacing 0.5px |
| KPI Label | Montserrat | 700 | 10px | ALL CAPS, uppercase |
| Table Header | Montserrat | 700 | 11px | ALL CAPS, letter-spacing 0.5px |

**FORBIDDEN**: Any font other than Montserrat and Open Sans. No Geist, Inter, Roboto, Arial, Helvetica.

---

## Component Map (Use these — NEVER recreate)

| Need | Component | Import Path |
|------|-----------|-------------|
| Page layout | `AppShell` | `@/components/shell/AppShell` |
| Header | `Header` | `@/components/shell/Header` |
| Side navigation | `Sidebar` | `@/components/shell/Sidebar` |
| Filter panel | `FilterPanel` | `@/components/shell/FilterPanel` |
| Filter accordion | `FilterGroup` | `@/components/shell/FilterGroup` |
| KPI card | `KpiCard` | `@/components/kpi/KpiCard` |
| KPI row | `KpiCardGroup` | `@/components/kpi/KpiCardGroup` |
| Bar chart | `BarChart` | `@/components/charts/BarChart` |
| Line chart | `LineChart` | `@/components/charts/LineChart` |
| Donut chart | `DonutChart` | `@/components/charts/DonutChart` |
| Combo chart | `ComboChart` | `@/components/charts/ComboChart` |
| Horizontal bars | `HorizontalBarChart` | `@/components/charts/HorizontalBarChart` |
| Data table | `DataTable` | `@/components/tables/DataTable` |
| Expandable table | `ExpandableTable` | `@/components/tables/ExpandableTable` |
| Multi-select filter | `MultiSelect` | `@/components/filters/MultiSelect` |
| Date range | `DateRangePicker` | `@/components/filters/DateRangePicker` |
| Filter chips | `FilterChips` | `@/components/filters/FilterChips` |
| Segment toggle | `SegmentToggle` | `@/components/filters/SegmentToggle` |
| Status badge | `StatusBadge` | `@/components/StatusBadge` |
| Trend indicator | `TrendIndicator` | `@/components/TrendIndicator` |
| Skeletons | `KpiSkeleton`, `ChartSkeleton`, `TableSkeleton` | `@/components/feedback/*` |
| Empty state | `EmptyState` | `@/components/feedback/EmptyState` |
| Error state | `ErrorState` | `@/components/feedback/ErrorState` |
| Loading spinner | `LoadingSpinner` | `@/components/feedback/LoadingSpinner` |

---

## Page Structure Rules

Every page MUST follow this structure:

```tsx
<AppShell
  navSections={[...]}
  filterContent={<>{/* FilterGroups */}</>}
  onApplyFilters={handleApply}
  onResetFilters={handleReset}
>
  <div className="space-y-md-space">
    <KpiCardGroup items={kpis} />
    <div className="grid grid-cols-2 gap-md-space">
      <BarChart {...} />
      <LineChart {...} />
    </div>
    <DataTable columns={columns} data={data} />
  </div>
</AppShell>
```

- Header: FIXED, 64px, z-1000, NEVER scrolls
- Sidebar: 260px expanded, 64px collapsed, smooth transition
- FilterPanel: Slides from right, contains collapsible FilterGroups
- Content: Scrollable, max-width 1680px

---

## Three-State Pattern (MANDATORY)

Every data component MUST handle three states:
1. **Loading** — Show skeleton (KpiSkeleton, ChartSkeleton, TableSkeleton)
2. **Populated** — Show data normally
3. **Empty** — Show EmptyState with message and optional action

NEVER show a blank area when data is absent.

---

## Chart Color Series (in order)

1. `#495737` Dark Green
2. `#577D91` Blue
3. `#C57E0A` Dark Orange
4. `#778862` Green
5. `#D3A165` Light Orange

Grid lines: dashed (`strokeDasharray="3 3"`), color `#D9D6CF` (light) or `#3a3938` (dark).

---

## Approved Dependencies (NO others allowed)

`next` 14.x, `react`/`react-dom` 18.x, `tailwindcss` 3.4.x, `@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`, `recharts` 3.x, `@tanstack/react-table` 8.x, `nuqs` 2.x, `lucide-react`, `tailwindcss-animate`

**FORBIDDEN**: `@mui/*`, `antd`, `@chakra-ui/*`, `@mantine/*`, `bootstrap`, `styled-components`, `emotion`, `react-icons`, `fontawesome`, `heroicons`, `plotly`, `d3`, `chart.js`, `nivo`, `victory`, `ag-grid`, `redux`, `zustand`, `jotai`, `recoil`

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 8px | Icon gaps, badge padding |
| sm-space | 16px | Related element gaps |
| md-space | 24px | Card padding, section gaps |
| lg-space | 40px | Button horiz padding, section padding |
| xl-space | 60px | Major section breaks |

Button padding: `13px 40px`. No arbitrary values (`p-[37px]`).

---

## Detailed Documentation

For complete specifications, see `docs/`:
- `DEVELOPMENT_RULES.md` — Full rules with violations checklist
- `COMPONENT_API.md` — Every component's TypeScript interface and usage
- `PAGE_SHELL.md` — Step-by-step page creation guide
- `FILTER_RULES.md` — Filter system specification
- `FABRIC_INTEGRATION.md` — Microsoft Fabric semantic model connection
- `STYLE_GUIDE.md` — Complete visual design specification

---

## Fabric Integration

For all Fabric details (auth, schema discovery, API routes, DAX patterns, data hooks, error handling, env vars), see **`docs/FABRIC_INTEGRATION.md`**. Do NOT read it unless building a data-driven page.

### Known Models (used by Data Source Gate):
| Name | Workspace ID | Dataset ID |
|------|-------------|-----------|
| Statistical Survey | `9c727ce4-5f7e-4008-b31e-f3e3bd8e0adc` | `27df7e8c-17d4-45a5-9267-4f4e971dfd7f` |
