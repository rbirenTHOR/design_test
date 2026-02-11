"use client"

import { cn } from "@/lib/utils"

/** Props for ChartSkeleton */
interface ChartSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Height of the skeleton in pixels */
  height?: number
}

/** Loading skeleton that mimics a bar chart layout */
export function ChartSkeleton({ className, height = 300 }: ChartSkeletonProps) {
  return (
    <div
      className={cn("w-full border p-4", className)}
      style={{ height, borderColor: "#D9D6CF", borderRadius: 0 }}
      role="status"
      aria-label="Loading chart"
    >
      <div className="flex flex-col h-full">
        {/* Fake chart title */}
        <div
          className="h-4 w-32 animate-pulse mb-4"
          style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }}
        />

        {/* Fake vertical bars */}
        <div className="flex-1 flex items-end gap-2">
          {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse"
              style={{
                height: `${h}%`,
                backgroundColor: "#D9D6CF",
                borderRadius: 0,
              }}
            />
          ))}
        </div>

        {/* Fake axis labels */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-8 animate-pulse"
              style={{ backgroundColor: "#D9D6CF", borderRadius: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
