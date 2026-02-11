# THOR Dashboard Design System

Strict component library and dashboard framework for THOR Industries BI applications. Pre-built components, locked-down style guide, and Playwright compliance tests ensure zero brand deviation.

## Quick Start

```bash
npm install
npm run dev
```

- **Dashboard**: http://localhost:3000 — Universal template with KPIs, charts, table, filters
- **Style Guide**: http://localhost:3000/showcase — Every component in every state

## Before You Write Any Code

**Read `CLAUDE.md` first.** It contains the strict rules that govern this codebase — colors, fonts, components, layout, and what's forbidden. If you're using Claude to assist development, it will enforce these rules automatically.

## Project Structure

```
src/
  app/
    page.tsx                  ← Universal dashboard (clone for new pages)
    showcase/page.tsx         ← Living style guide
    globals.css               ← THOR CSS variables + resets
  components/
    shell/                    ← AppShell, Header, Sidebar, FilterPanel, FilterGroup
    kpi/                      ← KpiCard, KpiCardGroup
    charts/                   ← BarChart, LineChart, DonutChart, ComboChart, HorizontalBarChart
    tables/                   ← DataTable, ExpandableTable
    filters/                  ← MultiSelect, DateRangePicker, FilterChips, SegmentToggle
    feedback/                 ← Skeletons, EmptyState, ErrorState, LoadingSpinner
    ui/                       ← shadcn/ui primitives (Button, Card, Input, etc.)
  lib/
    types.ts                  ← All TypeScript interfaces
    constants.ts              ← THOR brand constants, chart colors
    mock-data.ts              ← Realistic sample data (swap for Fabric)
    utils/formatting.ts       ← Currency, percent, number formatters
docs/
  DEVELOPMENT_RULES.md        ← THE LAW — all rules with violations checklist
  COMPONENT_API.md            ← Every component's props and usage examples
  PAGE_SHELL.md               ← How to create a new dashboard page
  FILTER_RULES.md             ← Filter system specification
  FABRIC_INTEGRATION.md       ← How to connect to Microsoft Fabric
  STYLE_GUIDE.md              ← Complete visual design specification
tests/
  compliance/                 ← Brand compliance tests (colors, fonts, radius)
  components/                 ← Component interaction tests
  pages/                      ← Full page tests
  screenshots/                ← Reference screenshots
```

## Creating a New Dashboard Page

1. Copy `src/app/page.tsx` to `src/app/your-page/page.tsx`
2. Update nav items, filter groups, and content
3. Use ONLY components from `src/components/` (see `CLAUDE.md` for the full map)
4. Run `npx playwright test` to verify compliance

See `docs/PAGE_SHELL.md` for the full step-by-step guide.

## Connecting to Fabric

Mock data in `src/lib/mock-data.ts` is designed to match the shape of real Fabric semantic model data. To swap:

1. Create API routes in `app/api/` that query your Fabric semantic model via DAX
2. Replace mock data imports with `fetch()` calls
3. Data types in `src/lib/types.ts` define the exact shape — Fabric responses MUST conform

See `docs/FABRIC_INTEGRATION.md` and `CLAUDE.md` (Fabric section) for full patterns, endpoints, and known model IDs.

## Running Tests

```bash
npx playwright test              # Run all 55 tests
npx playwright test --ui         # Interactive test runner
npx playwright show-report       # View last test report
```

Tests verify: brand compliance (colors, fonts, 0px radius), component behavior, page rendering, and interaction flows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS custom properties |
| Components | shadcn/ui (Radix primitives) |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Filter State | nuqs (URL-based) |
| Icons | Lucide React |
| Testing | Playwright |
