"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  onApply?: () => void
  onReset?: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function FilterPanel({
  open,
  onClose,
  onApply,
  onReset,
  title = "Filters",
  children,
  className,
}: FilterPanelProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-16 bottom-0 z-[70] flex w-80 flex-col border-l border-light-grey bg-lightest transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-light-grey px-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-darkest-grey">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-grey transition-colors hover:text-darkest-grey"
            aria-label="Close filters"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable filter content */}
        <ScrollArea className="flex-1 px-5 py-4">
          {children}
        </ScrollArea>

        {/* Pinned bottom actions */}
        <div className="flex shrink-0 items-center gap-3 border-t border-light-grey p-4">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 bg-dark-green px-6 py-3 font-heading text-xs font-bold uppercase tracking-wide text-lightest transition-colors hover:bg-green"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onReset}
            className="border-2 border-darkest-grey px-6 py-[10px] font-heading text-xs font-extrabold uppercase tracking-wide text-darkest-grey transition-colors hover:bg-darkest-grey hover:text-lightest"
          >
            Reset
          </button>
        </div>
      </aside>
    </>
  )
}
