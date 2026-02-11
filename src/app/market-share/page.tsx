"use client"

import React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { AppShell } from "@/components/shell"
import { KpiCard, KpiCardGroup } from "@/components/kpi"
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"
import { LineChart } from "@/components/charts/LineChart"
import { DataTable } from "@/components/tables/DataTable"
import { formatPercent } from "@/lib/utils/formatting"
import { COLORS, FONTS } from "@/lib/constants"
import { surveyNavSections, SurveyFilters } from "@/lib/survey-config"
import type { OpCoMarketShareRow } from "@/lib/types"
import {
  marketShareKpis,
  manufacturerMarketShareData,
  t12mMarketShareTrend,
  opCoMarketShareData,
} from "@/lib/mock-data"

/* ------------------------------------------------------------------ */
/*  DataTable column definitions                                       */
/* ------------------------------------------------------------------ */
const msColumns: ColumnDef<OpCoMarketShareRow, unknown>[] = [
  {
    accessorKey: "operatingCompany",
    header: "Operating Company",
    cell: ({ getValue }) => (
      <span style={{ fontWeight: 600, color: COLORS.darkestGrey }}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "travelTrailerMs",
    header: "Travel Trailer MS%",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? formatPercent(v, 1) : "—"
    },
  },
  {
    accessorKey: "fifthWheelMs",
    header: "Fifth Wheel MS%",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? formatPercent(v, 1) : "—"
    },
  },
  {
    accessorKey: "towableMs",
    header: "Towable MS%",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? (
        <span style={{ fontWeight: 600 }}>{formatPercent(v, 1)}</span>
      ) : "—"
    },
  },
  {
    accessorKey: "motorizedMs",
    header: "Motorized MS%",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? formatPercent(v, 1) : "—"
    },
  },
  {
    accessorKey: "t12mTowableMs",
    header: "T12M Towable MS%",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? (
        <span style={{ fontWeight: 700, color: COLORS.darkGreen }}>
          {formatPercent(v, 1)}
        </span>
      ) : "—"
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-light-grey bg-lightest">
      <div className="border-b border-light-grey px-6 py-4">
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
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function MarketSharePage() {
  return (
    <AppShell
      navSections={surveyNavSections}
      activeNavId="market-share"
      headerTitle="Statistical Survey"
      filterContent={<SurveyFilters />}
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
            Market Share Analysis
          </h1>
          <p
            className="mt-1"
            style={{
              fontFamily: FONTS.body,
              fontSize: "14px",
              color: COLORS.grey,
            }}
          >
            THOR market share across RV segments vs industry competitors
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
          Mock data &middot; Fabric connection pending
        </div>
      </div>

      {/* KPI Row */}
      <KpiCardGroup className="mb-6">
        {marketShareKpis.map((kpi) => (
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

      {/* Charts row 1: Horizontal Bar + T12M Trend */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section title="Industry Market Share by Manufacturer">
          <HorizontalBarChart
            data={manufacturerMarketShareData}
            height={340}
            valueFormatter={(v) => formatPercent(v, 1)}
          />
        </Section>

        <Section title="T12M Market Share Trend by Operating Company">
          <LineChart
            data={t12mMarketShareTrend}
            lines={[
              { dataKey: "jayco", name: "Jayco" },
              { dataKey: "keystone", name: "Keystone", color: COLORS.blue },
              { dataKey: "heartland", name: "Heartland", color: COLORS.darkOrange },
              { dataKey: "kzRv", name: "KZ RV", color: COLORS.green },
              { dataKey: "tmc", name: "TMC", color: COLORS.lightOrange },
              { dataKey: "airstream", name: "Airstream", color: COLORS.grey },
              { dataKey: "tiffin", name: "Tiffin", color: COLORS.lightGrey },
            ]}
            xAxisKey="name"
            height={340}
          />
        </Section>
      </div>

      {/* Table */}
      <Section title="THOR Operating Company Market Share Detail">
        <DataTable
          columns={msColumns}
          data={opCoMarketShareData}
          searchable
          searchPlaceholder="Search operating companies..."
          stickyHeader
        />
      </Section>
    </AppShell>
  )
}
