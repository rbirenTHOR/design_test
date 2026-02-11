"use client"

import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg"

/** Props for LoadingSpinner */
interface LoadingSpinnerProps {
  /** Size of the spinner: sm (16px), md (24px), lg (32px) */
  size?: SpinnerSize
  /** Additional CSS classes */
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

/** Inline spinning loading indicator */
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", sizeClasses[size], className)}
      style={{ color: "#8C8A7E" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
