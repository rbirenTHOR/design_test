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

## 2b. Automated Authentication & Schema Discovery

> **This entire section is executed by Claude automatically during the Data Source Gate. No user input is needed for schema discovery.**

### Authentication Priority

Claude acquires a bearer token in this order:

#### 1. Azure CLI (preferred — zero config)
```bash
az account get-access-token --resource https://analysis.windows.net/powerbi/api --query accessToken -o tsv
```
Works if the user has run `az login`. The token is valid for ~60 minutes.

#### 2. Service Principal (fallback)
If Azure CLI is not available, Claude checks `.env.local` for:
```
FABRIC_TENANT_ID=<azure-ad-tenant-id>
FABRIC_CLIENT_ID=<app-registration-client-id>
FABRIC_CLIENT_SECRET=<client-secret>
```

Token request:
```bash
curl -s -X POST "https://login.microsoftonline.com/${FABRIC_TENANT_ID}/oauth2/v2.0/token" \
  -d "grant_type=client_credentials&client_id=${FABRIC_CLIENT_ID}&client_secret=${FABRIC_CLIENT_SECRET}&scope=https://analysis.windows.net/powerbi/api/.default"
```

The response contains `access_token`. Claude stores it in `.env.local` as `FABRIC_TOKEN`.

#### 3. If both fail
Claude tells the user to run `az login` or configure service principal credentials. Discovery cannot proceed without a valid token.

### Dataset Discovery

If the dataset ID is not already known (i.e., not in the Known Models table in `CLAUDE.md`):

**List workspaces:**
```
GET https://api.powerbi.com/v1.0/myorg/groups
Authorization: Bearer <token>
```

**List datasets in a workspace:**
```
GET https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/datasets
Authorization: Bearer <token>
```

Claude matches the user's requested model name against the dataset names in the response.

### Schema Discovery via Fabric getDefinition API

> **WARNING**: Do NOT use `INFO.TABLES()`, `INFO.COLUMNS()`, `INFO.MEASURES()`, or `INFO.RELATIONSHIPS()` via the Power BI REST `executeQueries` endpoint. These DAX INFO functions are **not supported** by that API (error code 3239575574). `COLUMNSTATISTICS()` only returns imported tables, not Direct Lake. The Scanner Admin API requires admin permissions. **The only reliable method is `getDefinition`.**

Once Claude has a valid token and dataset ID (from the Known Models table or dataset discovery above), it retrieves the full TMDL model definition via the Fabric REST API. This is a **3-step async process**:

#### Step 1: Request the definition

```bash
curl -s -D - -X POST \
  "https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/semanticModels/{datasetId}/getDefinition" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Content-Length: 0"
```

Response: **HTTP 202 Accepted** with headers:
- `Location:` → polling URL
- `Retry-After:` → seconds to wait (typically 20)
- `x-ms-operation-id:` → operation ID

#### Step 2: Poll until complete

Wait the `Retry-After` seconds, then GET the `Location` URL:

```bash
sleep 20
curl -s "{location_url}" -H "Authorization: Bearer <token>"
```

Response when done:
```json
{ "status": "Succeeded", "percentComplete": 100 }
```

If `status` is not `Succeeded`, wait and poll again.

#### Step 3: Fetch the result

```bash
curl -s "{location_url}/result" \
  -H "Authorization: Bearer <token>" \
  -o tmdl_raw.json
```

Response: JSON with `definition.parts[]` — each part has a `path` and base64-encoded `payload`:

```json
{
  "definition": {
    "parts": [
      { "path": "definition/tables/MyTable.tmdl", "payload": "<base64>" },
      { "path": "definition/tables/_Measures.tmdl", "payload": "<base64>" },
      { "path": "definition/relationships.tmdl", "payload": "<base64>" },
      { "path": "definition/model.tmdl", "payload": "<base64>" },
      ...
    ]
  }
}
```

### Processing the TMDL Definition

Use Python (anaconda path: `C:\Users\rbiren\AppData\Local\anaconda3\python.exe`, bash path: `/c/Users/rbiren/AppData/Local/anaconda3/python.exe`) to decode and parse the TMDL files.

**Decode all .tmdl files:**
```python
import json, base64
d = json.load(open('tmdl_raw.json'))
parts = {
    p['path']: base64.b64decode(p['payload']).decode('utf-8')
    for p in d['definition']['parts']
    if p['path'].endswith('.tmdl')
}
```

**Extract tables and columns from each `definition/tables/*.tmdl` file:**

TMDL format uses indentation-based structure:
```
table 'Table Name'
    column 'Column Name'
        dataType: string
        isHidden                    ← if present, column is hidden
        displayFolder: FolderName   ← grouping for filters
        sourceColumn: source_col
    measure 'Measure Name' = DAX_EXPRESSION
        formatString: #,0
        displayFolder: FolderPath
    partition TableName = entity
        mode: directLake
```

**Parsing rules:**
- **Tables**: Each `definition/tables/*.tmdl` file is one table. Skip `_Measures` table (only holds base measures).
- **Columns**: Lines starting with `column`. Skip columns where `isHidden` is present or `displayFolder` contains "Hidden".
- **Data types**: Read from `dataType:` line. Values: `string`, `int64`, `double`, `dateTime`, `boolean`.
- **Display folders**: Read from `displayFolder:` line. Use these to group filters (e.g., `01 - Attributes\RV Attributes`, `01 - Calendar`).
- **Measures**: Lines starting with `measure`. The DAX expression follows `=`. Read `formatString` and `displayFolder`.
- **Relationships**: In `definition/relationships.tmdl`. Format: `fromColumn: 'Table'.column` → `toColumn: 'Table'.column`.

**Data type mapping (TMDL → TypeScript):**

| TMDL Type | TypeScript Type |
|-----------|----------------|
| `string` | `string` |
| `int64` | `number` |
| `double` | `number` |
| `dateTime` | `string` (ISO 8601) |
| `boolean` | `boolean` |

### Writing the Cache

After processing, Claude writes:

**`src/config/schema-cache.json`:**
```json
{
  "tables": [
    {
      "name": "TableName",
      "columns": [
        { "name": "ColumnName", "dataType": "String", "description": "..." }
      ]
    }
  ],
  "measures": [
    { "name": "MeasureName", "expression": "DAX expression", "table": "TableName" }
  ],
  "relationships": [
    { "from": "Table1.Column", "to": "Table2.Column", "type": "many-to-one" }
  ],
  "discoveredAt": "ISO-8601 timestamp"
}
```

**`src/config/data-source.json`:**
```json
{
  "configured": true,
  "workspace": "Workspace Name",
  "workspaceId": "...",
  "dataset": "Dataset Name",
  "datasetId": "...",
  "schemaDiscovered": true,
  "lastSynced": "ISO-8601 timestamp"
}
```

### Re-discovery

If the schema needs to be refreshed (model changed, new tables added):
1. Set `configured: false` in `data-source.json`
2. Re-run the Data Source Gate — Claude will re-authenticate and re-discover

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
| `FABRIC_TOKEN` | Bearer token (server-side only, auto-generated by Section 2b) | For production |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `"true"` for mock data, `"false"` for Fabric | Always |
| `NEXT_PUBLIC_FABRIC_WORKSPACE` | Fabric workspace ID (client-safe) | For production |
| `FABRIC_TENANT_ID` | Azure AD tenant ID (server-side only) | Service principal only |
| `FABRIC_CLIENT_ID` | App registration client ID (server-side only) | Service principal only |
| `FABRIC_CLIENT_SECRET` | Client secret (server-side only) | Service principal only |

> Authentication method priority and token acquisition are defined in **Section 2b** above. `FABRIC_TOKEN` is auto-generated — do not set it manually.

### Rules

- Prefix client-accessible variables with `NEXT_PUBLIC_`.
- NEVER prefix server-only secrets with `NEXT_PUBLIC_`.
- NEVER commit `.env.local` to version control.

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
