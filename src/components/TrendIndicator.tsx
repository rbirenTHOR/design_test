"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"
import type { TrendDirection } from "@/lib/types"

type TrendSize = "sm" | "md"

/** Props for TrendIndicator */
interface TrendIndicatorProps {
  /** Trend percentage value */
  value: number
  /** Whether increase is good or bad */
  direction?: TrendDirection
  /** Size variant */
  size?: TrendSize
  /** Additional CSS classes */
  className?: string
}

/** Arrow-up SVG */
function ArrowUp({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

/** Arrow-down SVG */
function ArrowDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

/**
 * TrendIndicator - Arrow + percentage with positive/negative coloring.
 * Green for positive (when up-is-good), orange/red for negative.
 */
export function TrendIndicator({
  value,
  direction = "up-is-good",
  size = "md",
  className,
}: TrendIndicatorProps) {
  const isPositive = value >= 0
  const isGood = direction === "up-is-good" ? isPositive : !isPositive
  const color = isGood ? COLORS.darkGreen : COLORS.darkOrange

  const iconSize = size === "sm" ? 12 : 14
  const fontSize = size === "sm" ? "12px" : "13px"

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      style={{ color, fontFamily: FONTS.body, fontWeight: 600, fontSize }}
    >
      {isPositive ? <ArrowUp size={iconSize} /> : <ArrowDown size={iconSize} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}
