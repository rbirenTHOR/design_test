"use client"

import React, { useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS, DATE_PRESETS } from "@/lib/constants"
import type { DateRange } from "@/lib/types"

type PresetKey = (typeof DATE_PRESETS)[number]

/** Props for DateRangePicker */
interface DateRangePickerProps {
  /** Current date range value */
  value: DateRange
  /** Callback when range changes */
  onChange: (range: DateRange) => void
  /** Additional CSS classes */
  className?: string
}

function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getPresetRange(preset: PresetKey): { start: string; end: string } {
  const today = new Date()
  const end = formatDateISO(today)

  switch (preset) {
    case "MTD": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      return { start: formatDateISO(start), end }
    }
    case "QTD": {
      const quarterMonth = Math.floor(today.getMonth() / 3) * 3
      const start = new Date(today.getFullYear(), quarterMonth, 1)
      return { start: formatDateISO(start), end }
    }
    case "YTD": {
      const start = new Date(today.getFullYear(), 0, 1)
      return { start: formatDateISO(start), end }
    }
    case "L12M": {
      const start = new Date(today)
      start.setMonth(start.getMonth() - 12)
      return { start: formatDateISO(start), end }
    }
    case "L30D": {
      const start = new Date(today)
      start.setDate(start.getDate() - 30)
      return { start: formatDateISO(start), end }
    }
    case "Custom":
    default:
      return { start: end, end }
  }
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ""
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/** Date range selector with preset buttons */
export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const handlePresetClick = useCallback(
    (preset: PresetKey) => {
      if (preset === "Custom") {
        onChange({ ...value, preset: "Custom" })
      } else {
        const range = getPresetRange(preset)
        onChange({ start: range.start, end: range.end, preset })
      }
    },
    [onChange, value]
  )

  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, start: e.target.value, preset: "Custom" })
    },
    [onChange, value]
  )

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, end: e.target.value, preset: "Custom" })
    },
    [onChange, value]
  )

  const displayText = useMemo(() => {
    if (!value.start || !value.end) return "Select date range"
    if (value.preset && value.preset !== "Custom") {
      return `${value.preset}: ${formatDisplayDate(value.start)} - ${formatDisplayDate(value.end)}`
    }
    return `${formatDisplayDate(value.start)} - ${formatDisplayDate(value.end)}`
  }, [value])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 h-9 px-3 text-sm"
        style={{
          fontFamily: FONTS.body,
          fontWeight: 400,
          border: `1px solid ${COLORS.lightGrey}`,
          borderRadius: 0,
          backgroundColor: "transparent",
          color: value.start ? COLORS.darkestGrey : COLORS.grey,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="0" ry="0" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="truncate">{displayText}</span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 p-4"
          style={{
            border: `1px solid ${COLORS.lightGrey}`,
            borderRadius: 0,
            backgroundColor: COLORS.lightest,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div className="space-y-3">
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className="h-7 px-2.5 text-xs"
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    border: value.preset === preset ? "none" : `1px solid ${COLORS.lightGrey}`,
                    borderRadius: 0,
                    backgroundColor: value.preset === preset ? COLORS.darkGreen : "transparent",
                    color: value.preset === preset ? COLORS.lightest : COLORS.darkGrey,
                    cursor: "pointer",
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            {value.preset === "Custom" && (
              <div className="flex items-center gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: COLORS.grey, fontFamily: FONTS.body }}>Start</label>
                  <input
                    type="date"
                    value={value.start}
                    onChange={handleStartChange}
                    max={value.end || undefined}
                    className="h-8 w-full px-2 py-1 text-xs"
                    style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, fontFamily: FONTS.body, outline: "none" }}
                  />
                </div>
                <span className="mt-5 text-xs" style={{ color: COLORS.grey }}>to</span>
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: COLORS.grey, fontFamily: FONTS.body }}>End</label>
                  <input
                    type="date"
                    value={value.end}
                    onChange={handleEndChange}
                    min={value.start || undefined}
                    className="h-8 w-full px-2 py-1 text-xs"
                    style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, fontFamily: FONTS.body, outline: "none" }}
                  />
                </div>
              </div>
            )}

            {/* Display Range Summary */}
            {value.start && value.end && (
              <div className="pt-2" style={{ borderTop: `1px solid ${COLORS.lightGrey}` }}>
                <p className="text-xs" style={{ color: COLORS.grey, fontFamily: FONTS.body }}>
                  {formatDisplayDate(value.start)} - {formatDisplayDate(value.end)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
