"use client"

import React, { useCallback } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/formatting"
import { CHART_COLORS, COLORS, FONTS } from "@/lib/constants"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"

/** Props for BarChart */
interface BarChartProps {
  /** Array of data objects */
  data: Record<string, unknown>[]
  /** Keys to render as bar series */
  dataKeys: string[]
  /** Whether to stack bars */
  stacked?: boolean
  /** Height in pixels */
  height?: number
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
  /** Data key for X-axis categories */
  xAxisKey?: string
  /** Custom colors for each bar series */
  colors?: string[]
  /** Callback when a bar is clicked */
  onBarClick?: (entry: Record<string, unknown>) => void
  /** Active values for cross-filter highlighting */
  activeValues?: Set<string>
}

/** Custom tooltip with THOR styling */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: COLORS.lightest,
        border: `1px solid ${COLORS.lightGrey}`,
        borderRadius: 0,
        padding: "12px",
        fontFamily: FONTS.body,
      }}
    >
      <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.darkestGrey, margin: "0 0 4px 0", fontFamily: FONTS.heading }}>
        {label}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2" style={{ fontSize: "13px" }}>
          <span
            className="inline-block"
            style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: 0 }}
          />
          <span style={{ color: COLORS.grey }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * BarChart - Vertical bar chart with dark-green gradient fill.
 * Uses CHART_COLORS from constants, dashed grid lines, THOR tooltip.
 */
const BarChart = React.memo(function BarChart({
  data,
  dataKeys,
  stacked = false,
  height = 350,
  loading = false,
  empty = false,
  className,
  xAxisKey = "name",
  colors,
  onBarClick,
  activeValues,
}: BarChartProps) {
  const chartColors = colors || [...CHART_COLORS]

  const handleClick = useCallback(
    (entry: Record<string, unknown>) => {
      onBarClick?.(entry)
    },
    [onBarClick]
  )

  if (loading) {
    return <ChartSkeleton height={height} className={className} />
  }

  if (empty || !data || data.length === 0) {
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <EmptyState />
      </div>
    )
  }

  const hasActive = activeValues && activeValues.size > 0

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state: unknown) => {
            const s = state as { activePayload?: Array<{ payload: Record<string, unknown> }> }
            if (s?.activePayload?.[0]?.payload) {
              handleClick(s.activePayload[0].payload)
            }
          }}
          style={{ cursor: onBarClick ? "pointer" : undefined }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.lightGrey}
            vertical={false}
          />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={{ stroke: COLORS.lightGrey }}
          />
          <YAxis
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(73,87,55,0.05)" }} />
          {dataKeys.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONTS.body, color: COLORS.grey }} />
          )}
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              name={key}
              fill={chartColors[index % chartColors.length]}
              radius={[0, 0, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              maxBarSize={56}
            >
              {hasActive &&
                data.map((entry, i) => {
                  const val = String(entry[xAxisKey] ?? "")
                  const isSelected = activeValues!.has(val)
                  return (
                    <Cell
                      key={`cell-${i}`}
                      fill={chartColors[index % chartColors.length]}
                      opacity={isSelected ? 1 : 0.25}
                    />
                  )
                })}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
})

BarChart.displayName = "BarChart"

export { BarChart }
export type { BarChartProps }
