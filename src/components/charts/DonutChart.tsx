"use client"

import React, { useCallback } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/formatting"
import { CHART_COLORS, COLORS, FONTS } from "@/lib/constants"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import type { DonutDatum } from "@/lib/types"

/** Props for DonutChart */
interface DonutChartProps {
  /** Array of data objects with name, value, optional color */
  data: DonutDatum[]
  /** Height in pixels */
  height?: number
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
  /** Label above the center value */
  centerLabel?: string
  /** Value displayed in the center */
  centerValue?: string
  /** Callback when a slice is clicked */
  onSliceClick?: (datum: DonutDatum) => void
  /** Active values for cross-filter highlighting */
  activeValues?: Set<string>
}

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: DonutDatum & { fill: string } }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  return (
    <div style={{ backgroundColor: COLORS.lightest, border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, padding: "12px", fontFamily: FONTS.body }}>
      <div className="flex items-center gap-2" style={{ fontSize: "13px" }}>
        <span className="inline-block" style={{ width: 10, height: 10, backgroundColor: entry.payload.fill, borderRadius: 0 }} />
        <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>{entry.name}</span>
      </div>
      <p style={{ fontSize: "13px", color: COLORS.grey, marginTop: 4 }}>
        {formatCurrency(entry.value)}
      </p>
    </div>
  )
}

/**
 * DonutChart - Ring chart with center metric display.
 * Uses CHART_COLORS, hover highlight, custom legend.
 */
const DonutChart = React.memo(function DonutChart({
  data,
  height = 350,
  loading = false,
  empty = false,
  className,
  centerLabel,
  centerValue,
  onSliceClick,
  activeValues,
}: DonutChartProps) {
  const handleClick = useCallback(
    (_: unknown, index: number) => {
      if (onSliceClick && data[index]) {
        onSliceClick(data[index])
      }
    },
    [onSliceClick, data]
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

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const hasActive = activeValues && activeValues.size > 0
  const chartHeight = height - 80

  return (
    <div className={cn("w-full", className)}>
      <div style={{ position: "relative", width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              onClick={handleClick}
              style={{ cursor: onSliceClick ? "pointer" : undefined }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="none"
                  opacity={hasActive ? (activeValues!.has(entry.name) ? 1 : 0.25) : 1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            {centerValue && (
              <span style={{ fontSize: "24px", fontWeight: 800, fontFamily: FONTS.heading, color: COLORS.darkestGrey }}>
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span style={{ fontSize: "12px", color: COLORS.grey, fontFamily: FONTS.body, marginTop: 2 }}>
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Custom legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-2">
        {data.map((entry, index) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0"
          const color = entry.color || CHART_COLORS[index % CHART_COLORS.length]
          const dimmed = hasActive && !activeValues!.has(entry.name)
          return (
            <div
              key={entry.name}
              className="flex items-center gap-1.5 transition-opacity"
              style={{
                fontSize: "12px",
                fontFamily: FONTS.body,
                opacity: dimmed ? 0.25 : 1,
                cursor: onSliceClick ? "pointer" : undefined,
              }}
              onClick={() => onSliceClick?.(entry)}
            >
              <span className="inline-block" style={{ width: 8, height: 8, backgroundColor: color, borderRadius: 0 }} />
              <span style={{ color: COLORS.grey }}>{entry.name}</span>
              <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>{formatCurrency(entry.value)}</span>
              <span style={{ color: COLORS.grey }}>({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

DonutChart.displayName = "DonutChart"

export { DonutChart }
export type { DonutChartProps }
