# FABRIC INTEGRATION

> How to replace mock data with Microsoft Fabric semantic model queries. This document specifies the API patterns, data type mappings, error handling, and loading state requirements.

---

## 1. Architecture Overview

The THOR Dashboard System uses a layered data architecture:

```
+-------------------+     +-------------------+     +-------------------+
|   UI Components   | --> |   Data Hooks      | --> |   Data Source     |
|   (KpiCard, etc.) |     |   (useSalesData)  |     |   (mock or API)  |
+-------------------+     +-------------------+     +-------------------+
                                                             |
                                                    +--------+--------+
                                                    |                 |
                                              Mock Data          Fabric API
                                           (dev/prototype)      (production)
```

### The Swap Pattern

Each page has a data hook (e.g., `useSalesData`) that returns typed data. In development, the hook returns mock data. In production, it fetches from Microsoft Fabric. The UI components MUST NOT know or care which data source is active.

```tsx
// Development: returns mock data
export function useSalesData(filters: SalesFilters): DataResult<SalesData> {
  return useMockSalesData(filters)
}

// Production: fetches from Fabric
export function useSalesData(filters: SalesFilters): DataResult<SalesData> {
  return useFabricQuery<SalesData>("/api/sales", filters)
}
```

---

## 2. Microsoft Fabric Semantic Model

### What Is a Semantic Model

Microsoft Fabric semantic models (formerly Power BI datasets) are curated data layers that provide:
- Pre-defined measures and calculations
- Relationships between tables
- Row-level security
- DAX expressions for complex aggregations

### Connection Method

The dashboard connects to Fabric via REST API endpoints that execute DAX queries against the semantic model.

### API Base URL

```
NEXT_PUBLIC_FABRIC_API_URL=https://<workspace>.fabric.microsoft.com/api/v1
```

This MUST be configured in `.env.local` (never committed to version control).

---

## 3. API Endpoint Patterns

### Standard Query Endpoint

```
POST /api/fabric/query
Content-Type: application/json
Authorization: Bearer <token>

{
  "dataset": "thor-rv-analytics",
  "query": "<DAX query>",
  "filters": {
    "brand": ["Jayco", "Keystone"],
    "region": ["Midwest"],
    "dateRange": "2024-Q4"
  }
}
```

### Response Format

```json
{
  "data": {
    "columns": ["Brand", "Revenue", "Units", "AvgPrice"],
    "rows": [
      ["Jayco", 4200000000, 52000, 80769],
      ["Keystone", 3800000000, 48000, 79167]
    ]
  },
  "metadata": {
    "executionTime": 234,
    "rowCount": 2,
    "lastRefreshed": "2024-12-15T08:00:00Z"
  }
}
```

### Next.js API Routes

Create API routes to proxy Fabric requests (to keep credentials server-side):

```
src/app/api/fabric/query/route.ts     -- General DAX query
src/app/api/fabric/kpis/route.ts      -- KPI aggregations
src/app/api/fabric/chart/route.ts     -- Chart data
src/app/api/fabric/table/route.ts     -- Table data with pagination
```

#### Example API Route

```tsx
// src/app/api/fabric/kpis/route.ts
import { NextRequest, NextResponse } from "next/server"
import type { FabricQueryRequest, FabricResponse } from "@/lib/types"

const FABRIC_API_URL = process.env.FABRIC_API_URL
const FABRIC_TOKEN = process.env.FABRIC_TOKEN

export async function POST(request: NextRequest) {
  const body: FabricQueryRequest = await request.json()

  const response = await fetch(`${FABRIC_API_URL}/datasets/${body.dataset}/executeQueries`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FABRIC_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      queries: [{ query: body.query }],
    }),
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: "Fabric query failed", status: response.status },
      { status: response.status }
    )
  }

  const data: FabricResponse = await response.json()
  return NextResponse.json(data)
}
```

---

## 4. Data Type Mapping

### Fabric to TypeScript

| Fabric Type | TypeScript Type | Transformation |
|-------------|----------------|----------------|
| `Int64` | `number` | Direct |
| `Double` | `number` | Direct |
| `Decimal` | `number` | Direct (JavaScript number) |
| `String` | `string` | Direct |
| `Boolean` | `boolean` | Direct |
| `DateTime` | `string` | ISO 8601 string, parse with `new Date()` when needed |
| `DateTimeOffset` | `string` | ISO 8601 string with timezone offset |
| `Null` | `null` | Map to `null`, handle in UI as empty state |

### Fabric Response to Component Props

#### KPI Data

```tsx
// Fabric returns:
// { "columns": ["MetricName", "Value", "PriorValue"], "rows": [["Total Revenue", 14200000000, 13100000000]] }

// Transform to KpiData:
function transformKpi(row: FabricRow): KpiData {
  const value = row[1] as number
  const prior = row[2] as number
  const change = prior > 0 ? ((value - prior) / prior) * 100 : 0

  return {
    id: slugify(row[0] as string),
    label: (row[0] as string).toUpperCase(),
    value: value,
    formattedValue: formatCurrency(value),
    change: parseFloat(change.toFixed(1)),
    changeLabel: "vs prior period",
    trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  }
}
```

#### Chart Data

```tsx
// Fabric returns:
// { "columns": ["Brand", "Revenue"], "rows": [["Jayco", 4200000000], ...] }

// Transform to ChartData:
function transformChartData(response: FabricResponse): ChartDataPoint[] {
  return response.data.rows.map(row => ({
    name: row[0] as string,
    value: row[1] as number,
  }))
}
```

#### Table Data

```tsx
// Fabric returns columns + rows
// Transform to typed array:
function transformTableData(response: FabricResponse): TableRow[] {
  const { columns, rows } = response.data
  return rows.map(row => {
    const obj: Record<string, unknown> = {}
    columns.forEach((col, i) => {
      obj[camelCase(col)] = row[i]
    })
    return obj as TableRow
  })
}
```

---

## 5. Data Hooks

### Hook Pattern

Every page MUST have a data hook that abstracts the data source:

```tsx
// src/hooks/use-sales-data.ts
"use client"

import { useState, useEffect } from "react"
import type { SalesData, SalesFilters, DataResult } from "@/lib/types"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

export function useSalesData(filters: SalesFilters): DataResult<SalesData> {
  const [state, setState] = useState<DataResult<SalesData>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        let data: SalesData

        if (USE_MOCK) {
          // Import mock data
          const mock = await import("@/lib/mock/sales-data")
          data = mock.filterSalesData(filters)
        } else {
          // Fetch from Fabric API
          const response = await fetch("/api/fabric/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataset: "thor-rv-analytics",
              query: buildSalesDAX(filters),
              filters,
            }),
          })

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
          }

          const raw = await response.json()
          data = transformSalesData(raw)
        }

        if (!cancelled) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [filters])

  return state
}
```

### DataResult Type

```tsx
// In src/lib/types.ts
export interface DataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}
```

### Using Data Hooks in Pages

```tsx
export default function SalesPage() {
  const { brand, region, dateRange, category } = useSalesFilters()
  const { data, loading, error } = useSalesData({ brand, region, dateRange, category })

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />
  }

  return (
    <AppShell title="Sales Dashboard" filters={[...]}>
      <div className="grid grid-cols-4 gap-md-space">
        {data?.kpis.map(kpi => (
          <KpiCard key={kpi.id} loading={loading} {...kpi} />
        ))}
      </div>
    </AppShell>
  )
}
```

---

## 6. Error Handling

### Error Types

| Error | HTTP Status | User-Facing Message | Recovery |
|-------|------------|---------------------|----------|
| Network failure | N/A | "Unable to connect. Check your network and try again." | Retry button |
| Authentication expired | 401 | "Session expired. Please sign in again." | Redirect to login |
| Forbidden | 403 | "You do not have access to this data." | Contact admin link |
| Query timeout | 408 | "Query took too long. Try narrowing your filters." | Adjust filters |
| Server error | 500 | "Something went wrong. Our team has been notified." | Retry button |
| Empty result | 200 (empty) | "No data matches your current filters." | Reset filters button |

### Error Handling Rules

- You MUST display user-friendly error messages. Never show raw error strings or stack traces.
- You MUST provide a recovery action (retry, reset filters, contact admin) for every error state.
- You MUST log errors to the console in development mode.
- You MUST NOT silently swallow errors. Every failed request MUST result in visible feedback.
- You MUST implement request cancellation (via `AbortController` or the `cancelled` flag pattern) to prevent state updates after navigation.

### Error Boundary

Wrap page content in an error boundary to catch rendering errors:

```tsx
// src/components/shell/error-boundary.tsx
"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-lg-space text-center">
          <h2 className="text-h3 font-heading font-bold text-darkest-grey">
            Something went wrong
          </h2>
          <p className="text-body-sm font-body text-dark-grey mt-sm-space">
            An unexpected error occurred. Please refresh the page.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
```

---

## 7. Loading States

### Three-State Pattern

Every data-displaying component MUST implement three states:

#### Loading State
- Display skeleton placeholders matching the component's dimensions.
- Skeletons MUST animate with a shimmer effect.
- Skeletons MUST NOT cause layout shift when data loads.

```tsx
<KpiCard loading={true} />
// Renders a skeleton: grey rectangle for label, larger grey rectangle for value

<DataTable loading={true} />
// Renders skeleton rows matching the expected number of visible rows
```

#### Populated State
- Display the data normally.

#### Empty State
- Display a meaningful message explaining why there is no data.
- Include a suggestion or action (e.g., "Try adjusting your filters").

```tsx
<DataTable data={[]} empty={true} />
// Renders: "No results found. Try adjusting your filters or date range."
```

### Loading Sequence

1. Page mounts -> all components show loading state
2. Data hook fires request
3. Response arrives -> components transition to populated or empty state
4. If error -> error state is shown instead

You MUST NOT show a full-page loading spinner. Each section loads independently with its own skeleton.

---

## 8. Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `FABRIC_API_URL` | Fabric REST API base URL (server-side only) | For production |
| `FABRIC_TOKEN` | Authentication token for Fabric (server-side only) | For production |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `"true"` to use mock data, `"false"` for Fabric | Always |
| `NEXT_PUBLIC_FABRIC_WORKSPACE` | Fabric workspace ID (client-safe) | For production |

### Rules

- You MUST prefix client-accessible variables with `NEXT_PUBLIC_`.
- You MUST NOT prefix server-only secrets (tokens, API keys) with `NEXT_PUBLIC_`.
- You MUST NOT commit `.env.local` to version control.
- You MUST include a `.env.example` file with all required variables (without values).

### .env.example

```
# Data Source Toggle
NEXT_PUBLIC_USE_MOCK_DATA=true

# Microsoft Fabric (production only)
FABRIC_API_URL=
FABRIC_TOKEN=
NEXT_PUBLIC_FABRIC_WORKSPACE=
```

---

## 9. DAX Query Patterns

### KPI Query

```dax
EVALUATE
SUMMARIZECOLUMNS(
  "TotalRevenue", [Total Revenue],
  "TotalUnits", [Total Units Sold],
  "AvgDealerPrice", [Average Dealer Price],
  "ActiveDealers", [Active Dealer Count]
)
```

### Filtered Query

```dax
EVALUATE
CALCULATETABLE(
  SUMMARIZECOLUMNS(
    'Brand'[BrandName],
    "Revenue", [Total Revenue],
    "Units", [Total Units Sold]
  ),
  'Brand'[BrandName] IN {"Jayco", "Keystone"},
  'Geography'[Region] IN {"Midwest"},
  'Calendar'[Quarter] = "2024-Q4"
)
```

### Time Series Query

```dax
EVALUATE
SUMMARIZECOLUMNS(
  'Calendar'[Month],
  "Revenue", [Total Revenue],
  "PriorYearRevenue", CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Calendar'[Date]))
)
ORDER BY 'Calendar'[Month]
```

---

## 10. Migration Checklist

When transitioning from mock data to Fabric:

- [ ] Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
- [ ] Configure `FABRIC_API_URL` and `FABRIC_TOKEN` in `.env.local`
- [ ] Create API route files under `src/app/api/fabric/`
- [ ] Implement DAX query builders for each page's data requirements
- [ ] Implement response transformers that map Fabric output to TypeScript types
- [ ] Update data hooks to call API routes instead of importing mock data
- [ ] Test all three states (loading, populated, empty) with the Fabric connection
- [ ] Test error states (network failure, auth expired, timeout)
- [ ] Verify filter values are correctly passed through to DAX queries
- [ ] Verify URL sharing works with Fabric-backed data
- [ ] Remove `USE_MOCK` flag and mock data imports from production build
