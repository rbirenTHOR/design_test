"use client"

import React, { useCallback } from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"
import type { SelectOption } from "@/lib/types"

/** Props for SegmentToggle */
interface SegmentToggleProps {
  /** Available options */
  options: SelectOption[]
  /** Currently selected value */
  value: string
  /** Callback when selection changes */
  onChange: (value: string) => void
  /** Additional CSS classes */
  className?: string
}

/** Segmented control toggle */
export function SegmentToggle({ options, value, onChange, className }: SegmentToggleProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, optionValue: string, index: number) => {
      let targetIndex: number | null = null
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        targetIndex = (index + 1) % options.length
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        targetIndex = (index - 1 + options.length) % options.length
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onChange(optionValue)
        return
      }
      if (targetIndex !== null) {
        onChange(options[targetIndex].value)
        const container = (e.target as HTMLElement).parentElement
        const buttons = container?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
        buttons?.[targetIndex]?.focus()
      }
    },
    [options, onChange]
  )

  return (
    <div
      role="radiogroup"
      aria-label="View mode"
      className={cn("inline-flex items-center p-0.5", className)}
      style={{ backgroundColor: "rgba(217,214,207,0.3)", borderRadius: 0 }}
    >
      {options.map((option, index) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value, index)}
            className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm"
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 600,
              borderRadius: 0,
              border: "none",
              transition: "all 0.2s ease-in-out",
              backgroundColor: isActive ? COLORS.darkGreen : "transparent",
              color: isActive ? COLORS.lightest : COLORS.grey,
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
