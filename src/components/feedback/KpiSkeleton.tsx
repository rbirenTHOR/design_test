"use client"

import { cn } from "@/lib/utils"

/** Props for KpiSkeleton */
interface KpiSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show a sparkline placeholder */
  showSparkline?: boolean
}

/** Loading skeleton that mimics a KPI card layout */
export function KpiSkeleton({ className, showSparkline = true }: KpiSkeletonProps) {
  return (
    <div
      className={cn("border p-4", className)}
      style={{ borderColor: "#D9D6CF", borderRadius: 0 }}
      role="status"
      aria-label="Loading KPI"
    >
      <div className="flex flex-col gap-3">
        {/* Metric label */}
        <div className="h-3.5 w-24 animate-pulse" style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }} />

        {/* Large metric value */}
        <div className="h-8 w-36 animate-pulse" style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }} />

        {/* Trend indicator row */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse" style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }} />
          <div className="h-3.5 w-16 animate-pulse" style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }} />
          <div className="h-3 w-20 animate-pulse" style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }} />
        </div>

        {/* Optional sparkline */}
        {showSparkline && (
          <div className="mt-2 flex items-end gap-0.5 h-10">
            {[30, 45, 35, 55, 50, 60, 40, 65, 55, 70, 50, 75, 60, 80, 65].map((h, i) => (
              <div
                key={i}
                className="flex-1 animate-pulse"
                style={{ height: `${h}%`, backgroundColor: "#D9D6CF", borderRadius: 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
