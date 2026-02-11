"use client"

import React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/formatting"
import { CHART_COLORS, COLORS, FONTS } from "@/lib/constants"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import type { LineSeries } from "@/lib/types"

/** Props for LineChart */
interface LineChartProps {
  /** Array of data objects for the time series */
  data: Record<string, unknown>[]
  /** Configuration for each line series */
  lines: LineSeries[]
  /** Data key for X-axis (typically a date field) */
  xAxisKey?: string
  /** Height in pixels */
  height?: number
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
  /** Fill the area beneath each line */
  showArea?: boolean
  /** Optional target reference line value */
  referenceValue?: number
  /** Label for the reference line */
  referenceLabel?: string
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
            style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: "50%" }}
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
 * LineChart - Multi-series line chart with smooth curves.
 * Uses CHART_COLORS, dashed gridlines, optional area fill.
 */
const LineChart = React.memo(function LineChart({
  data,
  lines,
  xAxisKey = "name",
  height = 350,
  loading = false,
  empty = false,
  className,
  showArea = false,
  referenceValue,
  referenceLabel,
}: LineChartProps) {
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
        <RechartsLineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            {lines.map((line, index) => {
              const color = line.color || CHART_COLORS[index % CHART_COLORS.length]
              return (
                <linearGradient
                  key={line.dataKey}
                  id={`area-gradient-${line.dataKey}`}
                  x1="0" y1="0" x2="0" y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              )
            })}
          </defs>
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
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: COLORS.grey, strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          {lines.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONTS.body, color: COLORS.grey }} />
          )}
          {referenceValue !== undefined && (
            <ReferenceLine
              y={referenceValue}
              stroke={COLORS.darkOrange}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: referenceLabel || `Target: ${formatCurrency(referenceValue)}`,
                position: "insideTopRight",
                fill: COLORS.grey,
                fontSize: 11,
              }}
            />
          )}
          {showArea &&
            lines.map((line) => {
              return (
                <Area
                  key={`area-${line.dataKey}`}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke="none"
                  fill={`url(#area-gradient-${line.dataKey})`}
                  fillOpacity={1}
                  isAnimationActive={false}
                  legendType="none"
                  tooltipType="none"
                />
              )
            })}
          {lines.map((line, index) => {
            const color = line.color || CHART_COLORS[index % CHART_COLORS.length]
            return (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: COLORS.lightest }}
              />
            )
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
})

LineChart.displayName = "LineChart"

export { LineChart }
export type { LineChartProps }
