"use client"

import React, { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { AppShell, type NavSection, FilterGroupContainer } from "@/components/shell"
import { KpiCard, KpiCardGroup } from "@/components/kpi"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import { DonutChart } from "@/components/charts/DonutChart"
import { DataTable } from "@/components/tables/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { formatCurrency } from "@/lib/utils/formatting"
import { COLORS, FONTS } from "@/lib/constants"
import {
  dashboardKpis,
  monthlyRevenueData,
  yoyTrendData,
  brandMixData,
  topDealersData,
  type DealerRow,
} from "@/lib/mock-data"

/* ------------------------------------------------------------------ */
/*  Sidebar navigation sections                                       */
/* ------------------------------------------------------------------ */
const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        ),
      },
      {
        id: "dealers",
        label: "Dealers",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        id: "sales",
        label: "Sales",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        id: "reports",
        label: "Reports",
        badge: 3,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
        ),
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  DataTable column definitions                                      */
/* ------------------------------------------------------------------ */
const dealerColumns: ColumnDef<DealerRow, unknown>[] = [
  {
    accessorKey: "dealer",
    header: "Dealer",
    cell: ({ getValue }) => (
      <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>
        {getValue() as string}
      </span>
    ),
  },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "region", header: "Region" },
  {
    accessorKey: "units",
    header: "Units",
    cell: ({ getValue }) => (getValue() as number).toLocaleString("en-US"),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: "avgPrice",
    header: "Avg Price",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string
      const variant = status === "active" ? "success" : status === "review" ? "warning" : "info"
      return <StatusBadge variant={variant}>{status}</StatusBadge>
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Filter panel content                                              */
/* ------------------------------------------------------------------ */
function DashboardFilters() {
  const [brands, setBrands] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [dealerTypes, setDealerTypes] = useState<string[]>([])

  const brandOptions = ["Airstream", "Jayco", "Keystone", "Thor Motor Coach", "Heartland"]
  const regionOptions = ["Northeast", "Southeast", "Midwest", "West", "Southwest"]
  const dealerTypeOptions = ["Single", "Multi", "National"]

  function toggleOption(current: string[], value: string, setter: (v: string[]) => void) {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    )
  }

  return (
    <FilterGroupContainer
      groups={[
        {
          id: "date-range",
          label: "Date Range",
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="flex-1 border border-light-grey px-3 py-2 font-body text-sm text-darkest-grey focus:border-dark-green focus:outline-none"
                />
                <span className="text-xs text-grey">to</span>
                <input
                  type="date"
                  defaultValue="2025-12-31"
                  className="flex-1 border border-light-grey px-3 py-2 font-body text-sm text-darkest-grey focus:border-dark-green focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {["MTD", "QTD", "YTD", "L12M"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="border border-light-grey px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey transition-colors hover:border-dark-green hover:text-dark-green"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: "brands",
          label: "Brands",
          content: (
            <div className="space-y-1.5">
              {brandOptions.map((brand) => (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
                >
                  <input
                    type="checkbox"
                    checked={brands.includes(brand)}
                    onChange={() => toggleOption(brands, brand, setBrands)}
                    className="accent-dark-green"
                  />
                  {brand}
                </label>
              ))}
            </div>
          ),
        },
        {
          id: "regions",
          label: "Region",
          content: (
            <div className="space-y-1.5">
              {regionOptions.map((region) => (
                <label
                  key={region}
                  className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
                >
                  <input
                    type="checkbox"
                    checked={regions.includes(region)}
                    onChange={() => toggleOption(regions, region, setRegions)}
                    className="accent-dark-green"
                  />
                  {region}
                </label>
              ))}
            </div>
          ),
        },
        {
          id: "dealer-type",
          label: "Dealer Type",
          content: (
            <div className="space-y-1.5">
              {dealerTypeOptions.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
                >
                  <input
                    type="checkbox"
                    checked={dealerTypes.includes(type)}
                    onChange={() => toggleOption(dealerTypes, type, setDealerTypes)}
                    className="accent-dark-green"
                  />
                  {type}
                </label>
              ))}
            </div>
          ),
        },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                   */
/* ------------------------------------------------------------------ */
function Section({
  title,
  actions,
  children,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="border border-light-grey bg-lightest">
      <div className="flex items-center justify-between border-b border-light-grey px-6 py-4">
        <h2
          style={{
            fontFamily: FONTS.heading,
            fontWeight: 800,
            fontSize: "16px",
            color: COLORS.darkestGrey,
          }}
        >
          {title}
        </h2>
        {actions}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  return (
    <AppShell
      navSections={navSections}
      activeNavId="dashboard"
      headerTitle="Analytics"
      filterContent={<DashboardFilters />}
      filterCount={0}
    >
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 800,
              fontSize: "28px",
              color: COLORS.darkestGrey,
            }}
          >
            Executive Overview
          </h1>
          <p
            className="mt-1"
            style={{
              fontFamily: FONTS.body,
              fontSize: "14px",
              color: COLORS.grey,
            }}
          >
            Key performance metrics across all THOR family brands
          </p>
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{ fontSize: "12px", color: COLORS.grey }}
        >
          <span
            className="inline-block h-2 w-2"
            style={{ backgroundColor: COLORS.green }}
          />
          Live data &middot; Updated just now
        </div>
      </div>

      {/* KPI Row */}
      <KpiCardGroup className="mb-6">
        {dashboardKpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            metricId={kpi.id}
            label={kpi.label}
            value={kpi.value}
            previousValue={kpi.previousValue}
            format={kpi.format}
            sparklineData={kpi.sparklineData}
            direction={kpi.direction}
            comparisonLabel={kpi.comparisonLabel}
          />
        ))}
      </KpiCardGroup>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section title="Monthly Revenue">
          <BarChart
            data={monthlyRevenueData}
            dataKeys={["revenue"]}
            xAxisKey="name"
            height={320}
          />
        </Section>

        <Section title="Year-over-Year Trend">
          <LineChart
            data={yoyTrendData}
            lines={[
              { dataKey: "current", name: "2025" },
              { dataKey: "prior", name: "2024", color: COLORS.lightGrey },
            ]}
            xAxisKey="name"
            height={320}
            showArea
          />
        </Section>
      </div>

      {/* Donut + Table row */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Section title="Brand Mix">
          <DonutChart
            data={brandMixData}
            height={360}
            centerValue="$14.2B"
            centerLabel="Total Revenue"
          />
        </Section>

        <div className="xl:col-span-2">
          <Section title="Top Performing Dealers">
            <DataTable
              columns={dealerColumns}
              data={topDealersData}
              searchable
              searchPlaceholder="Search dealers..."
              paginated
              pageSize={10}
              stickyHeader
            />
          </Section>
        </div>
      </div>
    </AppShell>
  )
}
