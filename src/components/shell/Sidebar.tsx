"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string | number
  active?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  sections: NavSection[]
  collapsed: boolean
  onToggleCollapse: () => void
  activeItemId?: string
  onNavigate?: (id: string) => void
  className?: string
}

export function Sidebar({
  sections,
  collapsed,
  onToggleCollapse,
  activeItemId,
  onNavigate,
  className,
}: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 z-50 flex flex-col border-r border-[#3a3938] bg-darkest-grey transition-all duration-300",
          collapsed ? "w-16" : "w-[260px]",
          className,
        )}
      >
        {/* Search (expanded only) */}
        {!collapsed && (
          <div className="border-b border-[#3a3938] px-5 py-4">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search dashboards..."
                className="w-full border border-[#3a3938] bg-[#2f2e2d] py-2.5 pl-10 pr-3 font-body text-[13px] text-lightest placeholder:text-grey focus:border-dark-green focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto py-3">
          {sections.map((section) => (
            <div key={section.title} className="mb-2">
              {/* Section title */}
              {!collapsed && (
                <div className="px-5 pb-2 pt-3 font-heading text-[10px] font-bold uppercase tracking-wider text-grey">
                  {section.title}
                </div>
              )}
              {collapsed && (
                <div className="mx-auto my-2 h-px w-8 bg-[#3a3938]" />
              )}

              {/* Nav items */}
              {section.items.map((item) => {
                const isActive = item.active || item.id === activeItemId

                const navButton = (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-l-[3px] border-transparent px-5 py-3 text-left text-sm text-light-grey transition-all duration-200",
                      "hover:bg-[#2f2e2d] hover:text-lightest",
                      isActive &&
                        "border-l-green bg-[rgba(73,87,55,0.3)] text-lightest",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto shrink-0 bg-dark-orange px-1.5 py-0.5 font-heading text-[10px] font-bold text-lightest">
                            {item.badge}
                          </span>
                        )}
                        {isActive && !item.badge && (
                          <span className="ml-auto h-2 w-2 shrink-0 bg-green" />
                        )}
                      </>
                    )}
                  </button>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <span className="font-heading text-xs font-bold">
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span className="ml-2 bg-dark-orange px-1 py-0.5 text-[10px] font-bold text-lightest">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return navButton
              })}
            </div>
          ))}
        </nav>

        {/* Footer: User info + collapse toggle */}
        <div className="border-t border-[#3a3938] px-4 py-4">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-dark-green font-heading text-sm font-bold text-lightest">
                JD
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-lightest">
                  John Doe
                </div>
                <div className="truncate text-xs text-grey">
                  Operations Manager
                </div>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "flex items-center justify-center text-grey transition-colors hover:text-lightest",
              collapsed ? "mx-auto h-8 w-8" : "ml-auto h-8 w-8",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
