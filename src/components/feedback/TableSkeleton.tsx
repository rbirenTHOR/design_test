"use client"

import { cn } from "@/lib/utils"

/** Props for TableSkeleton */
interface TableSkeletonProps {
  /** Additional CSS classes */
  className?: string
  /** Number of body rows to display */
  rows?: number
  /** Number of columns to display */
  columns?: number
}

const columnWidths = [
  [75, 50, 60, 40, 55],
  [60, 70, 45, 65, 50],
  [80, 40, 55, 70, 45],
  [55, 65, 50, 45, 70],
  [70, 55, 65, 50, 60],
  [45, 80, 40, 60, 55],
  [65, 50, 70, 55, 45],
  [50, 60, 55, 75, 65],
]

/** Loading skeleton that mimics a data table layout */
export function TableSkeleton({ className, rows = 8, columns = 5 }: TableSkeletonProps) {
  return (
    <div
      className={cn("w-full border overflow-hidden", className)}
      style={{ borderColor: "#D9D6CF", borderRadius: 0 }}
      role="status"
      aria-label="Loading table"
    >
      {/* Header row */}
      <div className="flex gap-4 px-4 py-3 border-b" style={{ borderColor: "#D9D6CF", backgroundColor: "rgba(217,214,207,0.15)" }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse"
            style={{
              flex: i === 0 ? 2 : 1,
              backgroundColor: "#D9D6CF",
              borderRadius: 0,
            }}
          />
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn("flex gap-4 px-4 py-3", rowIndex < rows - 1 && "border-b")}
          style={{ borderColor: "#D9D6CF" }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => {
            const widthPercent =
              columnWidths[rowIndex % columnWidths.length]?.[colIndex % 5] ?? 60
            return (
              <div
                key={colIndex}
                className="flex items-center"
                style={{ flex: colIndex === 0 ? 2 : 1 }}
              >
                <div
                  className="h-3.5 animate-pulse"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: "#D9D6CF",
                    borderRadius: 0,
                  }}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
