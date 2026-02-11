"use client"

import React from "react"
import { cn } from "@/lib/utils"

/** Props for KpiCardGroup */
interface KpiCardGroupProps {
  /** KpiCard children */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/** Horizontal flex row that lays out KPI cards with equal spacing */
function KpiCardGroupInner({ children, className }: KpiCardGroupProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
      style={{ minHeight: "120px" }}
    >
      {children}
    </div>
  )
}

export const KpiCardGroup = React.memo(KpiCardGroupInner)
KpiCardGroup.displayName = "KpiCardGroup"
