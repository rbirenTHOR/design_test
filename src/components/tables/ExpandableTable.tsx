"use client"

import React, { useState, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercent } from "@/lib/utils/formatting"
import { COLORS, FONTS } from "@/lib/constants"
import { TrendIndicator } from "@/components/TrendIndicator"
import { TableSkeleton } from "@/components/feedback/TableSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import type { HierarchicalRow } from "@/lib/types"

/** Props for ExpandableTable */
interface ExpandableTableProps {
  /** Hierarchical data with nested children */
  data: HierarchicalRow[]
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Additional CSS classes */
  className?: string
}

/** Flatten a hierarchical tree into a linear array preserving order and levels. */
function flattenTree(rows: HierarchicalRow[]): HierarchicalRow[] {
  const result: HierarchicalRow[] = []
  function walk(nodes: HierarchicalRow[]) {
    for (const node of nodes) {
      result.push(node)
      if (node.children && node.children.length > 0) {
        walk(node.children)
      }
    }
  }
  walk(rows)
  return result
}

/** Collect all IDs with children (for "Expand All"). */
function collectAllIds(rows: HierarchicalRow[]): string[] {
  const ids: string[] = []
  function walk(nodes: HierarchicalRow[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        ids.push(node.id)
        walk(node.children)
      }
    }
  }
  walk(rows)
  return ids
}

/** Chevron icon */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.2s",
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        flexShrink: 0,
        marginRight: 8,
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/** Single expandable row */
const ExpandableRow = React.memo(function ExpandableRow({
  row,
  expanded,
  hasChildren,
  onToggle,
  visible,
}: {
  row: HierarchicalRow
  expanded: boolean
  hasChildren: boolean
  onToggle: (id: string) => void
  visible: boolean
}) {
  const indentPx = row.level * 24
  const isTopLevel = row.level === 0
  const isSecondLevel = row.level === 1

  return (
    <tr
      onClick={hasChildren ? () => onToggle(row.id) : undefined}
      style={{
        display: visible ? undefined : "none",
        cursor: hasChildren ? "pointer" : "default",
        fontFamily: FONTS.body,
        fontSize: isTopLevel ? "15px" : isSecondLevel ? "14px" : "13px",
        fontWeight: isTopLevel ? 700 : isSecondLevel ? 600 : 400,
        backgroundColor: isTopLevel ? "rgba(217,214,207,0.2)" : "transparent",
        color: row.level >= 3 ? COLORS.grey : COLORS.darkestGrey,
        transition: "background-color 0.15s",
      }}
      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(73,87,55,0.05)" }}
      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isTopLevel ? "rgba(217,214,207,0.2)" : "transparent" }}
    >
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}` }}>
        <div className="flex items-center" style={{ paddingLeft: indentPx }}>
          {hasChildren ? <ChevronIcon expanded={expanded} /> : <span style={{ display: "inline-block", width: 24 }} />}
          <span className="truncate">{row.name}</span>
        </div>
      </td>
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {row.units.toLocaleString("en-US")}
      </td>
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(row.revenue)}
      </td>
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {formatPercent(row.margin)}
      </td>
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(row.avgPrice)}
      </td>
      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.lightGrey}`, textAlign: "right" }}>
        <TrendIndicator value={row.yoyGrowth} direction="up-is-good" size="sm" />
      </td>
    </tr>
  )
})

/**
 * ExpandableTable - Hierarchical table with expand/collapse.
 * Rows expand to show nested detail with level-based indentation.
 */
function ExpandableTableInner({ data, loading = false, empty = false, className }: ExpandableTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const flatRows = useMemo(() => flattenTree(data), [data])
  const allExpandableIds = useMemo(() => collectAllIds(data), [data])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleExpandAll = useCallback(() => {
    setExpandedIds(new Set(allExpandableIds))
  }, [allExpandableIds])

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  const visibilityMap = useMemo(() => {
    const map = new Map<string, boolean>()
    for (const row of flatRows) {
      if (row.level === 0) {
        map.set(row.id, true)
      } else {
        const parentVisible = row.parentId ? map.get(row.parentId) ?? false : true
        const parentExpanded = row.parentId ? expandedIds.has(row.parentId) : true
        map.set(row.id, parentVisible && parentExpanded)
      }
    }
    return map
  }, [flatRows, expandedIds])

  if (loading) {
    return <TableSkeleton className={className} columns={6} />
  }

  if (empty || data.length === 0) {
    return <EmptyState className={className} />
  }

  const allExpanded = expandedIds.size >= allExpandableIds.length

  const headerStyle: React.CSSProperties = {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: COLORS.darkGrey,
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: `1px solid ${COLORS.lightGrey}`,
    whiteSpace: "nowrap",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Expand / Collapse controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={allExpanded ? handleCollapseAll : handleExpandAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
          style={{
            fontFamily: FONTS.heading,
            fontWeight: 700,
            border: `1px solid ${COLORS.lightGrey}`,
            borderRadius: 0,
            backgroundColor: "transparent",
            color: COLORS.darkGrey,
            cursor: "pointer",
          }}
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: COLORS.lightest }}>
            <tr>
              <th style={{ ...headerStyle, minWidth: 240 }}>Name</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Units</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Revenue</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Margin %</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Avg Price</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>YoY Growth</th>
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row) => {
              const hasChildren = !!(row.children && row.children.length > 0)
              const isExpanded = expandedIds.has(row.id)
              const isVisible = visibilityMap.get(row.id) ?? false
              return (
                <ExpandableRow
                  key={row.id}
                  row={row}
                  expanded={isExpanded}
                  hasChildren={hasChildren}
                  onToggle={handleToggle}
                  visible={isVisible}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const ExpandableTable = React.memo(ExpandableTableInner)
ExpandableTable.displayName = "ExpandableTable"
