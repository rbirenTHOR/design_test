"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { COLORS, FONTS } from "@/lib/constants"
import type { SelectOption } from "@/lib/types"

/** Props for MultiSelect */
interface MultiSelectProps {
  /** Label for the filter */
  label: string
  /** Available options */
  options: SelectOption[]
  /** Currently selected values */
  selected: string[]
  /** Callback when selection changes */
  onChange: (selected: string[]) => void
  /** Placeholder when nothing selected */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
}

/** Checkbox list filter with search */
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const lower = search.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(lower))
  }, [options, search])

  const handleToggle = useCallback(
    (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
      onChange(next)
    },
    [selected, onChange]
  )

  const handleSelectAll = useCallback(() => {
    onChange(options.map((opt) => opt.value))
  }, [options, onChange])

  const handleClearAll = useCallback(() => {
    onChange([])
  }, [onChange])

  const triggerLabel = useMemo(() => {
    if (selected.length === 0) return placeholder
    if (selected.length === options.length) return `All ${label}`
    if (selected.length === 1) {
      const match = options.find((o) => o.value === selected[0])
      return match?.label ?? selected[0]
    }
    return `${selected.length} selected`
  }, [selected, options, label, placeholder])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Filter by ${label}`}
        className="inline-flex items-center justify-between gap-1.5 h-9 px-3 text-sm w-full"
        style={{
          fontFamily: FONTS.body,
          fontWeight: 400,
          border: `1px solid ${COLORS.lightGrey}`,
          borderRadius: 0,
          backgroundColor: "transparent",
          color: selected.length === 0 ? COLORS.grey : COLORS.darkestGrey,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span className="truncate">{triggerLabel}</span>
        <div className="flex shrink-0 items-center gap-1">
          {selected.length > 0 && selected.length < options.length && (
            <span
              className="inline-flex items-center justify-center h-5 px-1 text-[10px]"
              style={{
                fontFamily: FONTS.heading,
                fontWeight: 600,
                backgroundColor: "rgba(73,87,55,0.1)",
                color: COLORS.darkGreen,
                borderRadius: 0,
              }}
            >
              {selected.length}
            </span>
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-60"
          style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, backgroundColor: COLORS.lightest, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {/* Search */}
          <div className="flex items-center px-3 py-2" style={{ borderBottom: `1px solid ${COLORS.lightGrey}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 shrink-0">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ fontFamily: FONTS.body, color: COLORS.darkestGrey }}
              aria-label={`Search ${label}`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="ml-1 p-0.5"
                style={{ color: COLORS.grey, cursor: "pointer", background: "none", border: "none" }}
                aria-label="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Select All / Clear All */}
          <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: `1px solid ${COLORS.lightGrey}` }}>
            <button
              onClick={handleSelectAll}
              className="text-xs font-medium hover:underline"
              style={{ fontFamily: FONTS.body, color: COLORS.darkGreen, background: "none", border: "none", cursor: "pointer" }}
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs font-medium hover:underline"
              style={{ fontFamily: FONTS.body, color: COLORS.grey, background: "none", border: "none", cursor: "pointer" }}
            >
              Clear All
            </button>
          </div>

          {/* Options */}
          <div className="p-1 max-h-56 overflow-y-auto" role="listbox" aria-label={`${label} options`}>
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm" style={{ color: COLORS.grey, fontFamily: FONTS.body }}>
                No results found.
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isChecked = selected.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2.5 px-2.5 py-1.5 text-sm"
                    style={{
                      fontFamily: FONTS.body,
                      fontWeight: isChecked ? 600 : 400,
                      color: COLORS.darkestGrey,
                    }}
                    role="option"
                    aria-selected={isChecked}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(option.value)}
                      style={{ width: 14, height: 14, accentColor: COLORS.darkGreen }}
                      aria-label={option.label}
                    />
                    <span className="truncate">{option.label}</span>
                  </label>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
