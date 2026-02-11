/** Format type for metric values */
export type MetricFormat = "currency" | "percentage" | "integer" | "decimal" | "days"

/** Direction for determining whether a trend is positive or negative */
export type TrendDirection = "up-is-good" | "down-is-good"

/** KPI card data shape */
export interface KpiItem {
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

/** Single line series configuration for LineChart */
export interface LineSeries {
  dataKey: string
  name: string
  color?: string
}

/** Donut chart slice data */
export interface DonutDatum {
  name: string
  value: number
  color?: string
}

/** Horizontal bar chart datum */
export interface HorizontalBarDatum {
  name: string
  value: number
  [key: string]: unknown
}

/** Hierarchical row for expandable tables */
export interface HierarchicalRow {
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

/** Filter chip data */
export interface FilterChipData {
  key: string
  label: string
  value: string
}

/** Date range value */
export interface DateRange {
  start: string
  end: string
  preset: string
}

/** Select option */
export interface SelectOption {
  value: string
  label: string
}

/** Status badge variant */
export type StatusVariant = "success" | "warning" | "info" | "error"

/** Navigation item */
export interface NavItem {
  key: string
  label: string
  href: string
  icon?: string
  active?: boolean
}
