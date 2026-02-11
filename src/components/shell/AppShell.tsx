"use client"

import React, { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Header } from "./Header"
import { Sidebar, type NavSection } from "./Sidebar"
import { FilterPanel } from "./FilterPanel"

interface AppShellProps {
  children: React.ReactNode
  navSections: NavSection[]
  activeNavId?: string
  onNavigate?: (id: string) => void
  headerTitle?: string
  filterContent?: React.ReactNode
  onApplyFilters?: () => void
  onResetFilters?: () => void
  filterCount?: number
  className?: string
}

export function AppShell({
  children,
  navSections,
  activeNavId,
  onNavigate,
  headerTitle,
  filterContent,
  onApplyFilters,
  onResetFilters,
  filterCount = 0,
  className,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleToggleSidebar = useCallback(() => {
    // On mobile: toggle overlay sidebar
    // On desktop: toggle collapse
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => !prev)
    }
  }, [])

  const handleToggleFilterPanel = useCallback(() => {
    setFilterPanelOpen((prev) => !prev)
  }, [])

  return (
    <div className={cn("min-h-screen bg-[#F5F4F1]", className)}>
      {/* Fixed Header */}
      <Header
        title={headerTitle}
        onToggleSidebar={handleToggleSidebar}
        onToggleFilterPanel={handleToggleFilterPanel}
        filterCount={filterCount}
      />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          sections={navSections}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeItemId={activeNavId}
          onNavigate={onNavigate}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          sections={navSections}
          collapsed={false}
          onToggleCollapse={() => setMobileSidebarOpen(false)}
          activeItemId={activeNavId}
          onNavigate={(id) => {
            onNavigate?.(id)
            setMobileSidebarOpen(false)
          }}
        />
      </div>

      {/* Main content area - offset by header and sidebar */}
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-[260px]",
        )}
      >
        <div className="min-h-[calc(100vh-64px)] p-6">
          {children}
        </div>
      </main>

      {/* Filter Panel */}
      {filterContent && (
        <FilterPanel
          open={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          onApply={() => {
            onApplyFilters?.()
            setFilterPanelOpen(false)
          }}
          onReset={onResetFilters}
        >
          {filterContent}
        </FilterPanel>
      )}
    </div>
  )
}
