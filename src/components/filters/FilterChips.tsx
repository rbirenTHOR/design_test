"use client"

import React, { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"
import type { FilterChipData } from "@/lib/types"

/** Props for FilterChips */
interface FilterChipsProps {
  /** Active filter chips */
  filters: FilterChipData[]
  /** Callback when a chip is removed */
  onRemove: (key: string, value: string) => void
  /** Callback to clear all filters */
  onClearAll: () => void
  /** Additional CSS classes */
  className?: string
}

/** Single chip */
function FilterChip({
  filter,
  onRemove,
}: {
  filter: FilterChipData
  onRemove: (key: string, value: string) => void
}) {
  const [removing, setRemoving] = useState(false)

  const handleRemove = useCallback(() => {
    setRemoving(true)
    setTimeout(() => {
      onRemove(filter.key, filter.value)
    }, 150)
  }, [filter, onRemove])

  return (
    <span
      className="inline-flex items-center gap-1 py-0.5 pl-2.5 pr-1"
      style={{
        fontFamily: FONTS.body,
        fontSize: "12px",
        fontWeight: 500,
        backgroundColor: "rgba(217,214,207,0.3)",
        borderRadius: 0,
        opacity: removing ? 0 : 1,
        transition: "opacity 150ms ease-in-out",
      }}
    >
      <span style={{ color: COLORS.grey }}>{filter.label}:</span>
      <span style={{ color: COLORS.darkestGrey }}>{filter.value}</span>
      <button
        onClick={handleRemove}
        className="ml-0.5 inline-flex items-center justify-center"
        style={{
          width: 16,
          height: 16,
          borderRadius: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: COLORS.grey,
        }}
        aria-label={`Remove ${filter.label}: ${filter.value}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  )
}

/** Active filter display as removable chips */
export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      role="list"
      aria-label="Active filters"
    >
      {filters.map((filter) => (
        <div key={`${filter.key}-${filter.value}`} role="listitem">
          <FilterChip filter={filter} onRemove={onRemove} />
        </div>
      ))}
      {filters.length >= 2 && (
        <button
          onClick={onClearAll}
          className="ml-1 text-xs font-medium hover:underline"
          style={{
            fontFamily: FONTS.body,
            color: COLORS.grey,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      )}
    </div>
  )
}
