"use client"

import React from "react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercent } from "@/lib/utils/formatting"
import { CHART_COLORS, COLORS, FONTS } from "@/lib/constants"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"

/** Props for ComboChart */
interface ComboChartProps {
  /** Array of data objects containing both bar and line values */
  data: Record<string, unknown>[]
  /** Data key for the bar series (typically a currency value) */
  barDataKey: string
  /** Data key for the line series (typically a percentage) */
  lineDataKey: string
  /** Data key for X-axis categories */
  xAxisKey?: string
  /** Display name for the bar series */
  barName?: string
  /** Display name for the line series */
  lineName?: string
  /** Height in pixels */
  height?: number
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
}

/** Custom tooltip for combo chart */
function CustomTooltip({
  active,
  payload,
  label,
  lineName,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
  label?: string
  barName?: string
  lineName: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div style={{ backgroundColor: COLORS.lightest, border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, padding: "12px", fontFamily: FONTS.body }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.darkestGrey, margin: "0 0 4px 0", fontFamily: FONTS.heading }}>
        {label}
      </p>
      {payload.map((entry, index) => {
        const isLine = index === 1 || entry.name === lineName
        const formatted = isLine ? formatPercent(entry.value) : formatCurrency(entry.value)
        return (
          <div key={index} className="flex items-center gap-2" style={{ fontSize: "13px" }}>
            <span className="inline-block" style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: 0 }} />
            <span style={{ color: COLORS.grey }}>{entry.name}:</span>
            <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>{formatted}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * ComboChart - Bar + Line combination with dual Y-axes.
 * Bars on left Y-axis (currency), line on right Y-axis (percentage).
 */
const ComboChart = React.memo(function ComboChart({
  data,
  barDataKey,
  lineDataKey,
  xAxisKey = "name",
  barName = "Value",
  lineName = "Percentage",
  height = 350,
  loading = false,
  empty = false,
  className,
}: ComboChartProps) {
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

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGrey} vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={{ stroke: COLORS.lightGrey }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatPercent(value, 0)}
            domain={[0, 100]}
          />
          <Tooltip
            content={<CustomTooltip barName={barName} lineName={lineName} />}
            cursor={{ fill: "rgba(73,87,55,0.05)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONTS.body, color: COLORS.grey }} />
          <Bar
            yAxisId="left"
            dataKey={barDataKey}
            name={barName}
            fill={COLORS.darkGreen}
            radius={[0, 0, 0, 0]}
            maxBarSize={56}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={lineDataKey}
            name={lineName}
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: CHART_COLORS[1], strokeWidth: 2, fill: COLORS.lightest }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
})

ComboChart.displayName = "ComboChart"

export { ComboChart }
export type { ComboChartProps }
