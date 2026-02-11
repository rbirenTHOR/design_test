"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title?: string
  onToggleSidebar?: () => void
  onToggleFilterPanel?: () => void
  filterCount?: number
  className?: string
}

export function Header({
  title = "Business Intelligence",
  onToggleSidebar,
  onToggleFilterPanel,
  filterCount = 0,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] flex h-16 items-center justify-between px-6",
        "bg-dark-green",
        className,
      )}
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-lightest lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-green">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-7 w-7 text-lightest"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <span className="font-heading text-xl font-extrabold tracking-wide text-lightest">
            THOR
          </span>
          <div className="mx-2 hidden h-8 w-px bg-green sm:block" />
          <span className="hidden font-heading text-sm font-bold uppercase tracking-widest text-light-grey sm:block">
            {title}
          </span>
        </div>
      </div>

      {/* Center: intentionally empty or can be extended */}

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-lightest opacity-80 transition-opacity hover:opacity-100"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center text-lightest opacity-80 transition-opacity hover:opacity-100"
          aria-label="Notifications"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center bg-dark-orange px-1 font-heading text-[10px] font-bold text-lightest">
            3
          </span>
        </button>

        {/* Filter toggle */}
        <button
          type="button"
          className="hidden items-center gap-2 border border-green px-3 py-1.5 text-lightest transition-colors hover:bg-green sm:flex"
          onClick={onToggleFilterPanel}
          aria-label="Toggle filters"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <span className="font-heading text-xs font-bold uppercase tracking-wide">
            Filters
          </span>
          {filterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center bg-dark-orange px-1.5 font-heading text-[10px] font-bold text-lightest">
              {filterCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center text-lightest opacity-80 transition-opacity hover:opacity-100 sm:flex"
          aria-label="Settings"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* User avatar */}
        <div className="flex h-9 w-9 items-center justify-center bg-dark-orange font-heading text-sm font-bold text-lightest">
          JD
        </div>
      </div>
    </header>
  )
}
