"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { FONTS } from "@/lib/constants"
import type { StatusVariant } from "@/lib/types"

/** Props for StatusBadge */
interface StatusBadgeProps {
  /** Badge variant controlling colors */
  variant: StatusVariant
  /** Text content of the badge */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

const variantStyles: Record<StatusVariant, { backgroundColor: string; color: string }> = {
  success: { backgroundColor: "rgba(73,87,55,0.15)", color: "#495737" },
  warning: { backgroundColor: "rgba(197,126,10,0.15)", color: "#C57E0A" },
  info: { backgroundColor: "rgba(87,125,145,0.15)", color: "#577D91" },
  error: { backgroundColor: "rgba(197,50,50,0.15)", color: "#C53232" },
}

/**
 * StatusBadge - Inline status indicator with THOR styling.
 * Montserrat 700 10px uppercase. 0px border-radius.
 */
export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  const styles = variantStyles[variant]

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-1", className)}
      style={{
        fontFamily: FONTS.heading,
        fontWeight: 700,
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderRadius: 0,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      }}
    >
      {children}
    </span>
  )
}
