"use client"

import React from "react"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { formatMetricValue } from "@/lib/utils/formatting"
import { COLORS, FONTS } from "@/lib/constants"
import { KpiSkeleton } from "@/components/feedback/KpiSkeleton"
import { TrendIndicator } from "@/components/TrendIndicator"
import type { MetricFormat, TrendDirection } from "@/lib/types"

/** Props for KpiCard */
interface KpiCardProps {
  /** Metric label (rendered uppercase) */
  label: string
  /** Current numeric value */
  value: number
  /** Previous period value for trend calculation */
  previousValue?: number
  /** Format for the display value */
  format: MetricFormat
  /** Explicit trend override (percentage) */
  trend?: number
  /** Sparkline data points */
  sparklineData?: number[]
  /** Whether increase is good or bad */
  direction?: TrendDirection
  /** Label for the comparison period */
  comparisonLabel?: string
  /** Optional icon element displayed next to the label */
  icon?: React.ReactNode
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
  /** Metric identifier for test selectors */
  metricId?: string
}

function KpiCardInner({
  label,
  value,
  previousValue,
  format,
  trend,
  sparklineData,
  direction = "up-is-good",
  comparisonLabel,
  icon,
  loading = false,
  empty = false,
  className,
  metricId,
}: KpiCardProps) {
  if (loading) {
    return (
      <div
        className={cn("relative overflow-hidden p-5", className)}
        style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0 }}
      >
        <KpiSkeleton />
      </div>
    )
  }

  if (empty) {
    return (
      <div
        className={cn("relative overflow-hidden p-5", className)}
        style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0 }}
      >
        <p style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.grey }}>
          {label}
        </p>
        <p className="mt-3 text-sm" style={{ color: COLORS.grey, fontFamily: FONTS.body }}>
          No data
        </p>
      </div>
    )
  }

  const computedTrend =
    trend !== undefined
      ? trend
      : previousValue !== undefined && previousValue !== 0
        ? ((value - previousValue) / previousValue) * 100
        : undefined

  const chartData = sparklineData?.map((v, i) => ({ index: i, value: v }))

  return (
    <div
      className={cn("relative overflow-hidden p-5", className)}
      style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, backgroundColor: COLORS.lightest }}
      data-metric-id={metricId}
    >
      {/* Label */}
      <div className="flex items-center gap-1.5">
        {icon && <span style={{ color: COLORS.grey }}>{icon}</span>}
        <p style={{
          fontFamily: FONTS.heading,
          fontWeight: 700,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: COLORS.grey,
          margin: 0,
        }}>
          {label}
        </p>
      </div>

      {/* Value and trend row */}
      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p
            className="truncate"
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 800,
              fontSize: "28px",
              lineHeight: 1.2,
              color: COLORS.darkestGrey,
              margin: 0,
            }}
          >
            {formatMetricValue(value, format)}
          </p>

          {/* Trend and comparison */}
          <div className="mt-1 flex items-center gap-2">
            {computedTrend !== undefined && (
              <TrendIndicator value={computedTrend} direction={direction} size="sm" />
            )}
            {comparisonLabel && (
              <span style={{ fontSize: "12px", color: COLORS.grey, fontFamily: FONTS.body }}>
                {comparisonLabel}
              </span>
            )}
          </div>
        </div>

        {/* Sparkline */}
        {chartData && chartData.length > 1 && (
          <div className="h-10 w-20 flex-shrink-0">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`sparkFill-${metricId ?? label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.darkGreen} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.darkGreen} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.darkGreen}
                  strokeWidth={1.5}
                  fill={`url(#sparkFill-${metricId ?? label})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export const KpiCard = React.memo(KpiCardInner)
KpiCard.displayName = "KpiCard"
