"use client"

import React, { useCallback } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/formatting"
import { COLORS, FONTS } from "@/lib/constants"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import type { HorizontalBarDatum } from "@/lib/types"

/** Props for HorizontalBarChart */
interface HorizontalBarChartProps {
  /** Array of objects with name and value keys */
  data: HorizontalBarDatum[]
  /** Height in pixels */
  height?: number
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
  /** Custom formatter for display values */
  valueFormatter?: (value: number) => string
  /** Target value shown as a vertical reference line */
  targetValue?: number
  /** Callback when a bar is clicked */
  onBarClick?: (entry: HorizontalBarDatum) => void
  /** Active values for cross-filter highlighting */
  activeValues?: Set<string>
}

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
  formatter,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: HorizontalBarDatum }>
  formatter: (v: number) => string
}) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  return (
    <div style={{ backgroundColor: COLORS.lightest, border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, padding: "12px", fontFamily: FONTS.body }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.darkestGrey, margin: "0 0 4px 0", fontFamily: FONTS.heading }}>
        {entry.payload.name}
      </p>
      <p style={{ fontSize: "13px", color: COLORS.grey, margin: 0 }}>
        Value: <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>{formatter(entry.value)}</span>
      </p>
    </div>
  )
}

/**
 * HorizontalBarChart - Horizontal bars for rankings.
 * Supports target reference line and value labels.
 */
const HorizontalBarChart = React.memo(function HorizontalBarChart({
  data,
  height = 400,
  loading = false,
  empty = false,
  className,
  valueFormatter = formatCurrency,
  targetValue,
  onBarClick,
  activeValues,
}: HorizontalBarChartProps) {
  const handleClick = useCallback(
    (state: unknown) => {
      const s = state as { activePayload?: Array<{ payload: HorizontalBarDatum }> }
      if (onBarClick && s?.activePayload?.[0]?.payload) {
        onBarClick(s.activePayload[0].payload)
      }
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
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 60, left: 0, bottom: 0 }}
          onClick={handleClick}
          style={{ cursor: onBarClick ? "pointer" : undefined }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGrey} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={{ stroke: COLORS.lightGrey }}
            tickFormatter={(value: number) => valueFormatter(value)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: COLORS.grey, fontSize: 12, fontFamily: FONTS.body }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            content={<CustomTooltip formatter={valueFormatter} />}
            cursor={{ fill: "rgba(73,87,55,0.05)" }}
          />
          {targetValue !== undefined && (
            <ReferenceLine
              x={targetValue}
              stroke={COLORS.darkOrange}
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Target: ${valueFormatter(targetValue)}`,
                position: "top",
                fill: COLORS.grey,
                fontSize: 11,
              }}
            />
          )}
          <Bar
            dataKey="value"
            fill={COLORS.darkGreen}
            radius={[0, 0, 0, 0]}
            maxBarSize={32}
          >
            {hasActive &&
              data.map((entry, i) => {
                const isSelected = activeValues!.has(entry.name)
                return (
                  <Cell
                    key={`cell-${i}`}
                    fill={COLORS.darkGreen}
                    opacity={isSelected ? 1 : 0.25}
                  />
                )
              })}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value: unknown) => valueFormatter(Number(value))}
              style={{ fill: COLORS.grey, fontSize: 11, fontWeight: 500, fontFamily: FONTS.body }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

HorizontalBarChart.displayName = "HorizontalBarChart"

export { HorizontalBarChart }
export type { HorizontalBarChartProps }
