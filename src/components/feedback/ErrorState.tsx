"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"

/** Props for ErrorState */
interface ErrorStateProps {
  /** Error heading text */
  title?: string
  /** Optional detailed error message */
  message?: string
  /** Callback invoked when the retry button is clicked */
  onRetry?: () => void
  /** Additional CSS classes */
  className?: string
}

/** Alert triangle icon SVG */
function AlertTriangleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C57E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

/** Component-level error display with retry button */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}
      role="alert"
    >
      <div
        className="p-4 mb-4"
        style={{ backgroundColor: "rgba(197,126,10,0.1)", borderRadius: 0 }}
      >
        <AlertTriangleIcon />
      </div>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: FONTS.heading, color: COLORS.darkestGrey }}
      >
        {title}
      </h3>
      {message && (
        <p
          className="text-sm max-w-sm mb-4"
          style={{ fontFamily: FONTS.body, color: COLORS.grey }}
        >
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
          style={{
            fontFamily: FONTS.heading,
            fontWeight: 700,
            backgroundColor: COLORS.darkGreen,
            color: COLORS.lightest,
            border: "none",
            borderRadius: 0,
            padding: "13px 40px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => { (e.target as HTMLElement).style.backgroundColor = COLORS.green }}
          onMouseOut={(e) => { (e.target as HTMLElement).style.backgroundColor = COLORS.darkGreen }}
        >
          Try again
        </button>
      )}
    </div>
  )
}
