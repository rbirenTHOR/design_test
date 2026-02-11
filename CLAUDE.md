# THOR Dashboard Design System — Development Rules

> **STRICT ENFORCEMENT**: These rules are NON-NEGOTIABLE. Every instruction uses MUST or MUST NOT. Zero exceptions unless explicitly stated. Violating any rule blocks a PR.

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

## Fabric Semantic Model Integration

Mock data lives in `src/lib/mock-data.ts`. To connect to a real Fabric semantic model, follow this guide. See `docs/FABRIC_INTEGRATION.md` for implementation patterns.

### Two Token Scopes

| Scope | Resource URL | Used For |
|-------|-------------|----------|
| **Power BI** | `https://analysis.windows.net/powerbi/api` | List datasets, execute DAX queries |
| **Fabric** | `https://api.fabric.microsoft.com` | Model definitions (getDefinition) |

Get tokens via: `az account get-access-token --resource <URL> --query accessToken -o tsv`
Tokens expire ~60 min. Production: use MSAL client-credentials (Service Principal).

### API Endpoints

| Action | Method | URL |
|--------|--------|-----|
| List workspaces | GET | `https://api.powerbi.com/v1.0/myorg/groups` |
| List models in workspace | GET | `https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/datasets` |
| Pull schema (async) | POST | `https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/semanticModels/{datasetId}/getDefinition` |
| Execute DAX | POST | `https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/datasets/{datasetId}/executeQueries` |

### Schema Retrieval (async 3-step)

1. POST `getDefinition` → returns `202` with `x-ms-operation-id` header
2. Poll `GET /v1/operations/{operationId}` until `status: "Succeeded"` (5-20 sec)
3. GET `/v1/operations/{operationId}/result` → base64-encoded TMDL files

### TMDL Format (What You Get Back)

Schema comes as base64-encoded TMDL files. Decode and parse:

- **Table files** (`tables/*.tmdl`): table name, columns (`dataType`, `sourceColumn`, `isHidden`, `displayFolder`), measures (DAX expression, `formatString`), partitions (`directLake`/`import`)
- **Relationships** (`relationships.tmdl`): `fromColumn` → `toColumn` (fact FK → dim PK)
- **Model** (`model.tmdl`): list of all tables in the model

Key fields to extract:
- `table` name → use in DAX (wrap in single quotes if spaces)
- `column` name → DAX reference: `'Table'[Column]`
- `sourceColumn` → actual Lakehouse delta table column
- `dataType` → `string`, `int64`, `double`, `dateTime`
- `measure` → pre-built DAX calc (use these first, don't reinvent)
- `formatString` → `#,0` = int, `0.0%` = pct, `$#,0` = currency
- `displayFolder` → logical grouping (map to FilterGroup sections in UI)

### DAX Query Patterns

```dax
-- Sample rows
EVALUATE TOPN(5, 'Table Name')

-- Row count
EVALUATE ROW("Count", COUNTROWS('Table Name'))

-- Aggregation with grouping
EVALUATE SUMMARIZECOLUMNS('Table'[GroupBy], "Total", SUM('Table'[Value]))

-- Use pre-built measures (preferred)
EVALUATE ROW("KPI 1", [Measure Name], "KPI 2", [Another Measure])

-- Time series
EVALUATE SUMMARIZECOLUMNS('Date'[Month - Year], 'Date'[month_key], "Value", [Measure])
ORDER BY 'Date'[month_key]
```

DAX response rows are keyed as `Table[Column]` — strip the prefix for clean object keys.

### DAX → Dashboard Component Mapping

| DAX Pattern | Dashboard Component | Notes |
|-------------|-------------------|-------|
| `ROW("label", [Measure])` | `KpiCard` | One row, one value per KPI |
| `SUMMARIZECOLUMNS(dim, "val", agg)` | `BarChart` / `DonutChart` | Group by dimension |
| `SUMMARIZECOLUMNS('Date'[...], "val", measure)` | `LineChart` | Time series |
| `TOPN(N, table)` | `DataTable` | Ranked list |
| `SUMMARIZECOLUMNS(dim1, dim2, "val", agg)` | `ComboChart` | Two dimensions |

### Known Workspace & Model IDs

| Workspace | ID | Model | Dataset ID |
|-----------|-----|-------|------------|
| THOR BI | `9c727ce4-5f7e-4008-b31e-f3e3bd8e0adc` | Statistical Survey | `27df7e8c-17d4-45a5-9267-4f4e971dfd7f` |

### Limitations

- `INFO.TABLES()`/`INFO.COLUMNS()` may fail on Direct Lake — use `getDefinition` instead
- DAX response capped at ~1MB — use `TOPN()` or filters for large result sets
- Rate limits: Power BI ~200 req/hr, Fabric ~100 req/min — cache aggressively
- Full Node.js service module: `C:\Users\rbiren\Desktop\FABRIC_SETUP.md` section 9
