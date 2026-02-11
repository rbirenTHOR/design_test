"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"

/** Props for EmptyState */
interface EmptyStateProps {
  /** Custom icon element to display */
  icon?: React.ReactNode
  /** Heading text */
  title?: string
  /** Descriptive text below the heading */
  description?: string
  /** Optional action element (e.g. a button) */
  action?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/** Default inbox icon SVG */
function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

/** Component displayed when no data is available */
export function EmptyState({
  icon,
  title = "No data available",
  description = "Try adjusting your date range or filter selection",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}
    >
      <div className="p-4 mb-4" style={{ backgroundColor: "rgba(217,214,207,0.3)", borderRadius: 0 }}>
        {icon || <InboxIcon />}
      </div>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: FONTS.heading, color: COLORS.darkestGrey }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-4"
        style={{ fontFamily: FONTS.body, color: COLORS.grey }}
      >
        {description}
      </p>
      {action}
    </div>
  )
}
