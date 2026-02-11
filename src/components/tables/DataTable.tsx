"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { COLORS, FONTS, PAGE_SIZES } from "@/lib/constants"
import { TableSkeleton } from "@/components/feedback/TableSkeleton"
import { EmptyState } from "@/components/feedback/EmptyState"

/** Props for DataTable */
interface DataTableProps<TData> {
  /** Column definitions for TanStack Table */
  columns: ColumnDef<TData, unknown>[]
  /** Data array to render */
  data: TData[]
  /** Show loading skeleton */
  loading?: boolean
  /** Show empty state */
  empty?: boolean
  /** Enable global search input */
  searchable?: boolean
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Enable pagination controls */
  paginated?: boolean
  /** Default page size */
  pageSize?: number
  /** Additional CSS classes */
  className?: string
  /** Callback when a row is clicked */
  onRowClick?: (row: TData) => void
  /** Make the header sticky */
  stickyHeader?: boolean
  /** Active values for cross-filter row highlighting */
  activeValues?: Set<string>
  /** Key on TData to match against activeValues */
  highlightKey?: keyof TData
}

/** Search icon SVG */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

/** Sort icon SVGs */
function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
      </svg>
    )
  }
  if (direction === "desc") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.lightGrey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" />
    </svg>
  )
}

/** Chevron icons for pagination */
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
function ChevronsLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
    </svg>
  )
}
function ChevronsRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
    </svg>
  )
}

/** Column visibility dropdown */
function ColumnVisibilityDropdown({
  columns,
  visibility,
  onToggle,
}: {
  columns: { id: string; header: string }[]
  visibility: VisibilityState
  onToggle: (columnId: string) => void
}) {
  const [open, setOpen] = useState(false)
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

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
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
        Columns
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] p-2"
          style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, backgroundColor: COLORS.lightest, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {columns.map((col) => {
            const checked = visibility[col.id] !== false
            return (
              <label
                key={col.id}
                className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm"
                style={{ fontFamily: FONTS.body }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(col.id)}
                  style={{ accentColor: COLORS.darkGreen }}
                />
                {col.header}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Page size selector */
function PageSizeSelector({ value, onChange }: { value: number; onChange: (size: number) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 px-2 text-sm"
      style={{
        border: `1px solid ${COLORS.lightGrey}`,
        borderRadius: 0,
        fontFamily: FONTS.body,
        backgroundColor: COLORS.lightest,
      }}
    >
      {PAGE_SIZES.map((size) => (
        <option key={size} value={size}>{size} / page</option>
      ))}
    </select>
  )
}

/**
 * DataTable - Sortable, paginated data table built on TanStack Table v8.
 * Header: Montserrat 700 11px uppercase letter-spacing:0.5px.
 * Cells: Open Sans 14px. Row hover: rgba(73,87,55,0.05).
 * Border: 1px solid #D9D6CF. 0px border-radius.
 */
function DataTableInner<TData>({
  columns,
  data,
  loading = false,
  empty = false,
  searchable = false,
  searchPlaceholder = "Search...",
  paginated = false,
  pageSize: defaultPageSize = 10,
  className,
  onRowClick,
  stickyHeader = false,
  activeValues,
  highlightKey,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(paginated && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: defaultPageSize } },
    }),
  })

  const columnInfos = useMemo(
    () => table.getAllLeafColumns().map((col) => ({
      id: col.id,
      header: typeof col.columnDef.header === "string" ? col.columnDef.header : col.id,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns]
  )

  const handleColumnToggle = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [columnId]: prev[columnId] === false }))
  }, [])

  if (loading) {
    return <TableSkeleton className={className} />
  }

  if (empty || data.length === 0) {
    return <EmptyState className={className} />
  }

  const rows = table.getRowModel().rows
  const totalRows = table.getFilteredRowModel().rows.length
  const pageIndex = table.getState().pagination?.pageIndex ?? 0
  const currentPageSize = table.getState().pagination?.pageSize ?? defaultPageSize
  const from = paginated ? pageIndex * currentPageSize + 1 : 1
  const to = paginated ? Math.min((pageIndex + 1) * currentPageSize, totalRows) : totalRows

  return (
    <div className={cn("space-y-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-[260px] pl-8 pr-3 text-sm"
                style={{
                  fontFamily: FONTS.body,
                  border: `1px solid ${COLORS.lightGrey}`,
                  borderRadius: 0,
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ColumnVisibilityDropdown
            columns={columnInfos}
            visibility={columnVisibility}
            onToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${COLORS.lightGrey}`, borderRadius: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              ...(stickyHeader ? { position: "sticky" as const, top: 0, zIndex: 10 } : {}),
              backgroundColor: COLORS.lightest,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDir = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: COLORS.darkGrey,
                        padding: "12px 16px",
                        textAlign: "left",
                        borderBottom: `1px solid ${COLORS.lightGrey}`,
                        cursor: canSort ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && <SortIcon direction={sortDir} />}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, idx) => {
                const hasActive = activeValues && activeValues.size > 0 && highlightKey
                const rowValue = highlightKey
                  ? String((row.original as Record<string, unknown>)[highlightKey as string] ?? "")
                  : ""
                const isHighlighted = hasActive ? activeValues!.has(rowValue) : false

                return (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    style={{
                      backgroundColor: idx % 2 === 1 ? "rgba(217,214,207,0.15)" : "transparent",
                      cursor: onRowClick ? "pointer" : "default",
                      opacity: hasActive && !isHighlighted ? 0.4 : 1,
                      transition: "background-color 0.15s",
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(73,87,55,0.05)" }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = idx % 2 === 1 ? "rgba(217,214,207,0.15)" : "transparent" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: "14px",
                          color: COLORS.darkestGrey,
                          padding: "10px 16px",
                          borderBottom: `1px solid ${COLORS.lightGrey}`,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: "14px",
                    color: COLORS.grey,
                    padding: "48px 16px",
                    textAlign: "center",
                  }}
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2" style={{ fontSize: "13px", fontFamily: FONTS.body, color: COLORS.grey }}>
        <span>Showing {from} to {to} of {totalRows} results</span>
        {paginated && (
          <div className="flex items-center gap-2">
            <PageSizeSelector
              value={currentPageSize}
              onChange={(size) => table.setPageSize(size)}
            />
            <div className="flex items-center gap-1">
              {[
                { icon: <ChevronsLeft />, action: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage() },
                { icon: <ChevronLeft />, action: () => table.previousPage(), disabled: !table.getCanPreviousPage() },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  style={{
                    width: 32,
                    height: 32,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${COLORS.lightGrey}`,
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    opacity: btn.disabled ? 0.4 : 1,
                    color: COLORS.darkGrey,
                  }}
                >
                  {btn.icon}
                </button>
              ))}
              <span className="px-2 text-sm" style={{ fontWeight: 600 }}>
                {pageIndex + 1} / {table.getPageCount()}
              </span>
              {[
                { icon: <ChevronRight />, action: () => table.nextPage(), disabled: !table.getCanNextPage() },
                { icon: <ChevronsRight />, action: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  style={{
                    width: 32,
                    height: 32,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${COLORS.lightGrey}`,
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    opacity: btn.disabled ? 0.4 : 1,
                    color: COLORS.darkGrey,
                  }}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const DataTable = React.memo(DataTableInner) as typeof DataTableInner
