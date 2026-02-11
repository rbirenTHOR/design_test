"use client"

import React, { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { COLORS, FONTS, CHART_COLORS } from "@/lib/constants"
import { KpiCard, KpiCardGroup } from "@/components/kpi"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import { DonutChart } from "@/components/charts/DonutChart"
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"
import { ComboChart } from "@/components/charts/ComboChart"
import { DataTable } from "@/components/tables/DataTable"
import { ExpandableTable } from "@/components/tables/ExpandableTable"
import { StatusBadge } from "@/components/StatusBadge"
import { TrendIndicator } from "@/components/TrendIndicator"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"
import { KpiSkeleton } from "@/components/feedback/KpiSkeleton"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { TableSkeleton } from "@/components/feedback/TableSkeleton"
import { FilterGroupContainer } from "@/components/shell"
import { formatCurrency } from "@/lib/utils/formatting"
import {
  monthlyRevenueData,
  yoyTrendData,
  brandMixData,
  dashboardKpis,
  topDealersData,
  hierarchicalData,
  type DealerRow,
} from "@/lib/mock-data"

/* ------------------------------------------------------------------ */
/*  Sidebar navigation state & sections                                */
/* ------------------------------------------------------------------ */
const sections = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Status Badges" },
  { id: "trends", label: "Trend Indicators" },
  { id: "kpi-cards", label: "KPI Cards" },
  { id: "bar-chart", label: "Bar Chart" },
  { id: "line-chart", label: "Line Chart" },
  { id: "donut-chart", label: "Donut Chart" },
  { id: "horizontal-bar", label: "Horizontal Bar" },
  { id: "combo-chart", label: "Combo Chart" },
  { id: "data-table", label: "Data Table" },
  { id: "expandable-table", label: "Expandable Table" },
  { id: "filters", label: "Filter Groups" },
  { id: "feedback", label: "Feedback States" },
]

/* ------------------------------------------------------------------ */
/*  Code snippet display                                               */
/* ------------------------------------------------------------------ */
function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        backgroundColor: COLORS.darkestGrey,
        color: COLORS.lightest,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: "12px",
        lineHeight: 1.6,
        padding: "16px",
        borderRadius: 0,
        overflow: "auto",
        maxHeight: 300,
        whiteSpace: "pre",
      }}
    >
      <code>{code}</code>
    </pre>
  )
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */
function ShowcaseSection({
  id,
  title,
  componentName,
  filePath,
  description,
  children,
  code,
}: {
  id: string
  title: string
  componentName: string
  filePath: string
  description: string
  children: React.ReactNode
  code?: string
}) {
  const [showCode, setShowCode] = useState(false)

  return (
    <section id={id} className="scroll-mt-8">
      <div className="border border-light-grey bg-lightest">
        {/* Section header */}
        <div className="border-b border-light-grey px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  fontSize: "18px",
                  color: COLORS.darkestGrey,
                  margin: 0,
                }}
              >
                {title}
              </h2>
              <p
                className="mt-1"
                style={{
                  fontFamily: FONTS.body,
                  fontSize: "13px",
                  color: COLORS.grey,
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
            {code && (
              <button
                onClick={() => setShowCode((p) => !p)}
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "6px 14px",
                  border: `1px solid ${COLORS.lightGrey}`,
                  borderRadius: 0,
                  backgroundColor: showCode ? COLORS.darkGreen : "transparent",
                  color: showCode ? COLORS.lightest : COLORS.darkGrey,
                  cursor: "pointer",
                }}
              >
                {showCode ? "Hide Code" : "Show Code"}
              </button>
            )}
          </div>
          {/* Component meta */}
          <div className="mt-2 flex flex-wrap gap-3">
            <span
              style={{
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "3px 8px",
                backgroundColor: "rgba(73,87,55,0.15)",
                color: COLORS.darkGreen,
              }}
            >
              {componentName}
            </span>
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: "12px",
                color: COLORS.grey,
              }}
            >
              {filePath}
            </span>
          </div>
        </div>

        {/* Visual example */}
        <div className="p-6">{children}</div>

        {/* Code snippet */}
        {code && showCode && (
          <div className="border-t border-light-grey px-6 py-4">
            <CodeBlock code={code} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Sample data for showcase                                           */
/* ------------------------------------------------------------------ */
const comboData = [
  { name: "Jan", revenue: 980_000_000, margin: 17.2 },
  { name: "Feb", revenue: 1_050_000_000, margin: 17.8 },
  { name: "Mar", revenue: 1_120_000_000, margin: 18.1 },
  { name: "Apr", revenue: 1_280_000_000, margin: 18.5 },
  { name: "May", revenue: 1_350_000_000, margin: 18.2 },
  { name: "Jun", revenue: 1_410_000_000, margin: 17.9 },
]

const horizontalBarData = [
  { name: "Jayco", value: 3_100_000_000 },
  { name: "Keystone", value: 2_800_000_000 },
  { name: "Airstream", value: 2_400_000_000 },
  { name: "Thor Motor Coach", value: 2_100_000_000 },
  { name: "Heartland", value: 1_900_000_000 },
]

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
/*  Color palette data                                                 */
/* ------------------------------------------------------------------ */
const primaryColors = [
  { name: "Dark Green", hex: "#495737", variable: "--dark-green", key: "darkGreen" },
  { name: "Green", hex: "#778862", variable: "--green", key: "green" },
  { name: "Darkest Grey", hex: "#2A2928", variable: "--darkest-grey", key: "darkestGrey" },
  { name: "Dark Grey", hex: "#595755", variable: "--dark-grey", key: "darkGrey" },
  { name: "Lightest", hex: "#FFFDFA", variable: "--lightest", key: "lightest" },
]

const secondaryColors = [
  { name: "Grey", hex: "#8C8A7E", variable: "--grey", key: "grey" },
  { name: "Light Grey", hex: "#D9D6CF", variable: "--light-grey", key: "lightGrey" },
  { name: "Blue", hex: "#577D91", variable: "--blue", key: "blue" },
  { name: "Dark Orange", hex: "#C57E0A", variable: "--dark-orange", key: "darkOrange" },
  { name: "Light Orange", hex: "#D3A165", variable: "--light-orange", key: "lightOrange" },
]

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function ShowcasePage() {
  const [activeSection, setActiveSection] = useState("colors")

  function scrollToSection(id: string) {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F4F0" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col overflow-y-auto border-r border-light-grey lg:flex"
        style={{ backgroundColor: COLORS.darkestGrey }}
      >
        {/* Logo area */}
        <div
          className="flex items-center gap-2 px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,253,250,0.1)" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center"
            style={{ backgroundColor: COLORS.darkGreen }}
          >
            <span style={{ color: COLORS.lightest, fontFamily: FONTS.heading, fontWeight: 800, fontSize: "14px" }}>
              T
            </span>
          </div>
          <span style={{ fontFamily: FONTS.heading, fontWeight: 800, fontSize: "14px", color: COLORS.lightest }}>
            Style Guide
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="flex w-full items-center px-3 py-2 text-left transition-colors"
              style={{
                fontFamily: FONTS.body,
                fontSize: "13px",
                fontWeight: activeSection === section.id ? 600 : 400,
                color: activeSection === section.id ? COLORS.lightest : COLORS.grey,
                backgroundColor: activeSection === section.id ? "rgba(73,87,55,0.3)" : "transparent",
                borderLeft: activeSection === section.id ? `3px solid ${COLORS.green}` : "3px solid transparent",
                borderRadius: 0,
                cursor: "pointer",
                border: "none",
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(255,253,250,0.1)" }}>
          <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey }}>
            THOR Design System v1.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-[240px]">
        {/* Page header */}
        <div className="border-b border-light-grey bg-lightest px-8 py-6">
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 800,
              fontSize: "28px",
              color: COLORS.darkestGrey,
              margin: 0,
            }}
          >
            THOR Design System - Component Showcase
          </h1>
          <p
            className="mt-1"
            style={{
              fontFamily: FONTS.body,
              fontSize: "14px",
              color: COLORS.grey,
              margin: 0,
            }}
          >
            Living style guide with all component variants, states, props, and usage examples
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 p-8">
          {/* ---- COLORS ---- */}
          <ShowcaseSection
            id="colors"
            title="Color Palette"
            componentName="COLORS"
            filePath="src/lib/constants.ts"
            description="THOR Industries primary and secondary brand colors. All colors are exported as a const object."
            code={`import { COLORS } from "@/lib/constants"

// Primary: darkGreen, green, darkestGrey, darkGrey, lightest
// Secondary: grey, lightGrey, blue, darkOrange, lightOrange
// Chart series: CHART_COLORS (darkGreen, blue, darkOrange, green, lightOrange)

<div style={{ backgroundColor: COLORS.darkGreen }}>...</div>`}
          >
            <div className="space-y-6">
              <div>
                <h3
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: COLORS.darkGrey,
                    marginBottom: 12,
                  }}
                >
                  Primary Colors
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {primaryColors.map((c) => (
                    <div key={c.key}>
                      <div
                        className="h-20 w-full"
                        style={{
                          backgroundColor: c.hex,
                          border: c.key === "lightest" ? `1px solid ${COLORS.lightGrey}` : "none",
                        }}
                      />
                      <p
                        className="mt-2"
                        style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", color: COLORS.darkestGrey }}
                      >
                        {c.name}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: "12px", color: COLORS.grey }}>
                        {c.hex}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey }}>
                        {c.variable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: COLORS.darkGrey,
                    marginBottom: 12,
                  }}
                >
                  Secondary Colors
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {secondaryColors.map((c) => (
                    <div key={c.key}>
                      <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
                      <p
                        className="mt-2"
                        style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", color: COLORS.darkestGrey }}
                      >
                        {c.name}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: "12px", color: COLORS.grey }}>
                        {c.hex}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey }}>
                        {c.variable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: COLORS.darkGrey,
                    marginBottom: 12,
                  }}
                >
                  Chart Colors (Data Visualization Series)
                </h3>
                <div className="flex gap-3">
                  {CHART_COLORS.map((color, i) => (
                    <div key={i} className="text-center">
                      <div className="h-12 w-12" style={{ backgroundColor: color }} />
                      <p className="mt-1" style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey }}>
                        {color}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- TYPOGRAPHY ---- */}
          <ShowcaseSection
            id="typography"
            title="Typography"
            componentName="FONTS"
            filePath="src/lib/constants.ts"
            description="Montserrat for headings (700-800 weight), Open Sans for body text. Sharp, bold, high contrast."
            code={`import { FONTS } from "@/lib/constants"

// FONTS.heading = "'Montserrat', sans-serif"
// FONTS.body = "'Open Sans', sans-serif"

<h1 style={{ fontFamily: FONTS.heading, fontWeight: 800 }}>Title</h1>
<p style={{ fontFamily: FONTS.body }}>Body text</p>`}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    H1 Hero / 54px / 800
                  </span>
                  <span style={{ fontFamily: FONTS.heading, fontWeight: 800, fontSize: "54px", color: COLORS.darkestGrey, lineHeight: 1.1 }}>
                    Go Everywhere
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    H1 / 36px / 800
                  </span>
                  <span style={{ fontFamily: FONTS.heading, fontWeight: 800, fontSize: "36px", color: COLORS.darkestGrey }}>
                    Executive Overview
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    H2 / 28px / 800
                  </span>
                  <span style={{ fontFamily: FONTS.heading, fontWeight: 800, fontSize: "28px", color: COLORS.darkestGrey }}>
                    Key Performance Metrics
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    H3 / 18px / 700
                  </span>
                  <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "18px", color: COLORS.darkestGrey }}>
                    Monthly Revenue Breakdown
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    Body Large / 18px
                  </span>
                  <span style={{ fontFamily: FONTS.body, fontSize: "18px", color: COLORS.darkestGrey }}>
                    Key performance metrics across all THOR family brands
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    Body / 16px
                  </span>
                  <span style={{ fontFamily: FONTS.body, fontSize: "16px", color: COLORS.darkestGrey }}>
                    Connecting people with nature and one another through innovative RV products.
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    Body Small / 14px
                  </span>
                  <span style={{ fontFamily: FONTS.body, fontSize: "14px", color: COLORS.grey }}>
                    Updated just now. Data reflects year-to-date performance.
                  </span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-light-grey pb-3">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    Caption / 12px
                  </span>
                  <span style={{ fontFamily: FONTS.body, fontSize: "12px", color: COLORS.grey }}>
                    Source: Internal analytics platform, Q4 2025
                  </span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, minWidth: 120 }}>
                    Callout / 11px / 700
                  </span>
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: COLORS.darkGrey,
                    }}
                  >
                    Total Revenue (YTD)
                  </span>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- BUTTONS ---- */}
          <ShowcaseSection
            id="buttons"
            title="Buttons"
            componentName="Button Styles"
            filePath="CLAUDE.md (Brand Guidelines)"
            description="All buttons use 0px border-radius, Montserrat 700, 13px 40px padding. No rounded corners."
            code={`// Primary CTA
<button style={{
  backgroundColor: COLORS.darkGreen,
  color: COLORS.lightest,
  fontFamily: FONTS.heading,
  fontWeight: 700,
  padding: "13px 40px",
  border: "none",
  borderRadius: 0,
}}>Primary Action</button>

// Secondary / Outline
<button style={{
  backgroundColor: "transparent",
  color: COLORS.darkestGrey,
  border: "2px solid #2A2928",
  fontWeight: 800,
  padding: "13px 40px",
  borderRadius: 0,
}}>Secondary</button>`}
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  style={{
                    backgroundColor: COLORS.darkGreen,
                    color: COLORS.lightest,
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    padding: "13px 40px",
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Primary CTA
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.darkestGrey,
                    fontFamily: FONTS.heading,
                    fontWeight: 800,
                    padding: "13px 40px",
                    border: `2px solid ${COLORS.darkestGrey}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Secondary
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.darkGreen,
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    padding: "13px 40px",
                    border: `1px solid ${COLORS.darkGreen}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Outline Green
                </button>
                <button
                  disabled
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    color: COLORS.grey,
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    padding: "13px 40px",
                    border: "none",
                    borderRadius: 0,
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                >
                  Disabled
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  style={{
                    backgroundColor: COLORS.darkGreen,
                    color: COLORS.lightest,
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Small Primary
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.darkGrey,
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    padding: "6px 14px",
                    border: `1px solid ${COLORS.lightGrey}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Toolbar Button
                </button>
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- STATUS BADGES ---- */}
          <ShowcaseSection
            id="badges"
            title="Status Badges"
            componentName="StatusBadge"
            filePath="src/components/StatusBadge.tsx"
            description="Inline status indicators. Montserrat 700 10px uppercase. 0px border-radius. Four variants: success, warning, info, error."
            code={`import { StatusBadge } from "@/components/StatusBadge"

// Props: variant ("success" | "warning" | "info" | "error"), children, className?

<StatusBadge variant="success">Active</StatusBadge>
<StatusBadge variant="warning">Review</StatusBadge>
<StatusBadge variant="info">New</StatusBadge>
<StatusBadge variant="error">Inactive</StatusBadge>`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge variant="success">Active</StatusBadge>
              <StatusBadge variant="warning">Review</StatusBadge>
              <StatusBadge variant="info">New</StatusBadge>
              <StatusBadge variant="error">Inactive</StatusBadge>
            </div>
          </ShowcaseSection>

          {/* ---- TREND INDICATORS ---- */}
          <ShowcaseSection
            id="trends"
            title="Trend Indicators"
            componentName="TrendIndicator"
            filePath="src/components/TrendIndicator.tsx"
            description="Arrow + percentage with positive/negative coloring. Green for positive (up-is-good), orange for negative."
            code={`import { TrendIndicator } from "@/components/TrendIndicator"

// Props: value (number), direction? ("up-is-good" | "down-is-good"), size? ("sm" | "md"), className?

<TrendIndicator value={8.4} direction="up-is-good" />
<TrendIndicator value={-3.2} direction="up-is-good" />
<TrendIndicator value={5.1} direction="down-is-good" />  // shows orange (up is bad)`}
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <TrendIndicator value={8.4} direction="up-is-good" />
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 4 }}>
                  up-is-good (md)
                </p>
              </div>
              <div className="text-center">
                <TrendIndicator value={-3.2} direction="up-is-good" />
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 4 }}>
                  negative (md)
                </p>
              </div>
              <div className="text-center">
                <TrendIndicator value={8.4} direction="up-is-good" size="sm" />
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 4 }}>
                  small size
                </p>
              </div>
              <div className="text-center">
                <TrendIndicator value={5.1} direction="down-is-good" />
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 4 }}>
                  down-is-good
                </p>
              </div>
              <div className="text-center">
                <TrendIndicator value={-2.8} direction="down-is-good" />
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 4 }}>
                  down + good
                </p>
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- KPI CARDS ---- */}
          <ShowcaseSection
            id="kpi-cards"
            title="KPI Cards"
            componentName="KpiCard / KpiCardGroup"
            filePath="src/components/kpi/KpiCard.tsx"
            description="Metric display with label, value, sparkline, and trend. Supports loading and empty states. KpiCardGroup provides responsive grid layout."
            code={`import { KpiCard, KpiCardGroup } from "@/components/kpi"

// KpiCard Props:
//   label, value, format ("currency"|"percentage"|"integer"|"decimal"|"days"),
//   previousValue?, trend?, sparklineData?, direction?, comparisonLabel?,
//   icon?, loading?, empty?, className?, metricId?

<KpiCardGroup>
  <KpiCard
    label="Total Revenue"
    value={14_200_000_000}
    previousValue={13_100_000_000}
    format="currency"
    sparklineData={[8.8, 9.2, 9.8, 10.5, 11.2, 14.2]}
    direction="up-is-good"
    comparisonLabel="vs prior year"
  />
</KpiCardGroup>`}
          >
            <div className="space-y-6">
              {/* Populated state */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Populated
                </h3>
                <KpiCardGroup>
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
              </div>
              {/* Loading state */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Loading State
                </h3>
                <KpiCardGroup>
                  <KpiCard label="Loading..." value={0} format="currency" loading />
                  <KpiCard label="Loading..." value={0} format="integer" loading />
                </KpiCardGroup>
              </div>
              {/* Empty state */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Empty State
                </h3>
                <KpiCardGroup>
                  <KpiCard label="Total Revenue" value={0} format="currency" empty />
                  <KpiCard label="Units Sold" value={0} format="integer" empty />
                </KpiCardGroup>
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- BAR CHART ---- */}
          <ShowcaseSection
            id="bar-chart"
            title="Bar Chart"
            componentName="BarChart"
            filePath="src/components/charts/BarChart.tsx"
            description="Vertical bar chart with dark-green gradient fill, dashed grid lines, THOR-styled tooltip. Supports stacked, loading, empty, and cross-filter highlighting."
            code={`import { BarChart } from "@/components/charts/BarChart"

// Props: data, dataKeys, xAxisKey?, stacked?, height?, loading?, empty?,
//        colors?, onBarClick?, activeValues?, className?

<BarChart
  data={monthlyRevenueData}
  dataKeys={["revenue"]}
  xAxisKey="name"
  height={300}
/>`}
          >
            <div className="space-y-6">
              <BarChart data={monthlyRevenueData} dataKeys={["revenue"]} xAxisKey="name" height={300} />
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Loading State
                </h3>
                <BarChart data={[]} dataKeys={["revenue"]} loading height={200} />
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- LINE CHART ---- */}
          <ShowcaseSection
            id="line-chart"
            title="Line Chart"
            componentName="LineChart"
            filePath="src/components/charts/LineChart.tsx"
            description="Multi-series line chart with smooth curves, optional area fill, and reference line. Uses CHART_COLORS for series."
            code={`import { LineChart } from "@/components/charts/LineChart"

// Props: data, lines (LineSeries[]), xAxisKey?, height?, showArea?,
//        referenceValue?, referenceLabel?, loading?, empty?, className?

<LineChart
  data={yoyTrendData}
  lines={[
    { dataKey: "current", name: "2025" },
    { dataKey: "prior", name: "2024", color: COLORS.lightGrey },
  ]}
  xAxisKey="name"
  height={300}
  showArea
/>`}
          >
            <LineChart
              data={yoyTrendData}
              lines={[
                { dataKey: "current", name: "2025" },
                { dataKey: "prior", name: "2024", color: COLORS.lightGrey },
              ]}
              xAxisKey="name"
              height={300}
              showArea
            />
          </ShowcaseSection>

          {/* ---- DONUT CHART ---- */}
          <ShowcaseSection
            id="donut-chart"
            title="Donut Chart"
            componentName="DonutChart"
            filePath="src/components/charts/DonutChart.tsx"
            description="Ring chart with center metric display and custom legend. Uses CHART_COLORS. Supports click-to-filter and cross-filter highlighting."
            code={`import { DonutChart } from "@/components/charts/DonutChart"

// Props: data (DonutDatum[]), height?, centerLabel?, centerValue?,
//        onSliceClick?, activeValues?, loading?, empty?, className?

<DonutChart
  data={brandMixData}
  height={360}
  centerValue="$14.2B"
  centerLabel="Total Revenue"
/>`}
          >
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
              <DonutChart
                data={brandMixData}
                height={360}
                centerValue="$14.2B"
                centerLabel="Total Revenue"
              />
            </div>
          </ShowcaseSection>

          {/* ---- HORIZONTAL BAR CHART ---- */}
          <ShowcaseSection
            id="horizontal-bar"
            title="Horizontal Bar Chart"
            componentName="HorizontalBarChart"
            filePath="src/components/charts/HorizontalBarChart.tsx"
            description="Horizontal bars for rankings with value labels. Supports target reference line and cross-filter highlighting."
            code={`import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"

// Props: data (HorizontalBarDatum[]), height?, valueFormatter?,
//        targetValue?, onBarClick?, activeValues?, loading?, empty?, className?

<HorizontalBarChart
  data={[
    { name: "Jayco", value: 3_100_000_000 },
    { name: "Keystone", value: 2_800_000_000 },
  ]}
  height={280}
/>`}
          >
            <HorizontalBarChart data={horizontalBarData} height={280} />
          </ShowcaseSection>

          {/* ---- COMBO CHART ---- */}
          <ShowcaseSection
            id="combo-chart"
            title="Combo Chart"
            componentName="ComboChart"
            filePath="src/components/charts/ComboChart.tsx"
            description="Bar + Line combination with dual Y-axes. Bars on left axis (currency), line on right axis (percentage)."
            code={`import { ComboChart } from "@/components/charts/ComboChart"

// Props: data, barDataKey, lineDataKey, xAxisKey?, barName?, lineName?,
//        height?, loading?, empty?, className?

<ComboChart
  data={comboData}
  barDataKey="revenue"
  lineDataKey="margin"
  barName="Revenue"
  lineName="Margin %"
  height={300}
/>`}
          >
            <ComboChart
              data={comboData}
              barDataKey="revenue"
              lineDataKey="margin"
              barName="Revenue"
              lineName="Margin %"
              height={300}
            />
          </ShowcaseSection>

          {/* ---- DATA TABLE ---- */}
          <ShowcaseSection
            id="data-table"
            title="Data Table"
            componentName="DataTable"
            filePath="src/components/tables/DataTable.tsx"
            description="Sortable, paginated data table built on TanStack Table v8. Header: Montserrat Bold 11px uppercase. Cells: Open Sans 14px. Supports search, column visibility, pagination, row click, sticky header, and cross-filter highlighting."
            code={`import { DataTable } from "@/components/tables/DataTable"
import { type ColumnDef } from "@tanstack/react-table"

// Props: columns (ColumnDef[]), data, searchable?, searchPlaceholder?,
//        paginated?, pageSize?, stickyHeader?, onRowClick?,
//        activeValues?, highlightKey?, loading?, empty?, className?

const columns: ColumnDef<MyRow, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "value", header: "Value" },
]

<DataTable columns={columns} data={myData} searchable paginated pageSize={5} />`}
          >
            <div className="space-y-6">
              <DataTable
                columns={dealerColumns}
                data={topDealersData.slice(0, 8)}
                searchable
                searchPlaceholder="Search dealers..."
                paginated
                pageSize={5}
              />
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Loading State
                </h3>
                <DataTable columns={dealerColumns} data={[]} loading />
              </div>
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Empty State
                </h3>
                <DataTable columns={dealerColumns} data={[]} />
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- EXPANDABLE TABLE ---- */}
          <ShowcaseSection
            id="expandable-table"
            title="Expandable Table"
            componentName="ExpandableTable"
            filePath="src/components/tables/ExpandableTable.tsx"
            description="Hierarchical table with expand/collapse. Rows expand to show nested detail with level-based indentation. Includes Expand All / Collapse All controls."
            code={`import { ExpandableTable } from "@/components/tables/ExpandableTable"
import type { HierarchicalRow } from "@/lib/types"

// Props: data (HierarchicalRow[]), loading?, empty?, className?
// HierarchicalRow: { id, name, level, parentId?, units, revenue, margin, avgPrice, yoyGrowth, children? }

<ExpandableTable data={hierarchicalData} />`}
          >
            <div className="space-y-6">
              <ExpandableTable data={hierarchicalData} />
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Loading State
                </h3>
                <ExpandableTable data={[]} loading />
              </div>
            </div>
          </ShowcaseSection>

          {/* ---- FILTERS ---- */}
          <ShowcaseSection
            id="filters"
            title="Filter Groups"
            componentName="FilterGroupContainer"
            filePath="src/components/shell/FilterGroup.tsx"
            description="Accordion-based filter groups using shadcn/ui Accordion. Each group has a collapsible header with chevron animation. Used inside FilterPanel for sidebar filter flyouts."
            code={`import { FilterGroupContainer } from "@/components/shell"

// FilterGroupContainer Props:
//   groups: { id, label, defaultOpen?, content (ReactNode) }[]
//   className?

<FilterGroupContainer
  groups={[
    { id: "brands", label: "Brands", content: <div>Checkboxes here</div> },
    { id: "regions", label: "Region", content: <div>Checkboxes here</div> },
  ]}
/>`}
          >
            <div style={{ maxWidth: 360 }}>
              <FilterGroupContainer
                groups={[
                  {
                    id: "brands",
                    label: "Brands",
                    content: (
                      <div className="space-y-1.5">
                        {["Airstream", "Jayco", "Keystone", "Thor Motor Coach", "Heartland"].map((b) => (
                          <label
                            key={b}
                            className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
                          >
                            <input type="checkbox" className="accent-dark-green" />
                            {b}
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
                        {["Northeast", "Southeast", "Midwest", "West", "Southwest"].map((r) => (
                          <label
                            key={r}
                            className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
                          >
                            <input type="checkbox" className="accent-dark-green" />
                            {r}
                          </label>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: "presets",
                    label: "Date Presets",
                    content: (
                      <div className="flex flex-wrap gap-1">
                        {["MTD", "QTD", "YTD", "L12M"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            className="border border-light-grey px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey transition-colors hover:border-dark-green hover:text-dark-green"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </ShowcaseSection>

          {/* ---- FEEDBACK STATES ---- */}
          <ShowcaseSection
            id="feedback"
            title="Feedback States"
            componentName="EmptyState / ErrorState / LoadingSpinner / Skeletons"
            filePath="src/components/feedback/"
            description="Component-level feedback for loading, empty, and error states. Skeletons mimic the layout of their parent components."
            code={`import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"
import { KpiSkeleton } from "@/components/feedback/KpiSkeleton"
import { ChartSkeleton } from "@/components/feedback/ChartSkeleton"
import { TableSkeleton } from "@/components/feedback/TableSkeleton"

// EmptyState Props: icon?, title?, description?, action?, className?
// ErrorState Props: title?, message?, onRetry?, className?
// LoadingSpinner Props: size? ("sm" | "md" | "lg"), className?
// KpiSkeleton Props: showSparkline?, className?
// ChartSkeleton Props: height?, className?
// TableSkeleton Props: rows?, columns?, className?`}
          >
            <div className="space-y-8">
              {/* Empty State */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Empty State
                </h3>
                <div className="border border-light-grey">
                  <EmptyState />
                </div>
              </div>

              {/* Error State */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Error State (with Retry)
                </h3>
                <div className="border border-light-grey">
                  <ErrorState
                    title="Failed to load data"
                    message="There was an error connecting to the analytics API. Please try again."
                    onRetry={() => {}}
                  />
                </div>
              </div>

              {/* Loading Spinners */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Loading Spinners
                </h3>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <LoadingSpinner size="sm" />
                    <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 8 }}>sm</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" />
                    <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 8 }}>md</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: COLORS.grey, marginTop: 8 }}>lg</p>
                  </div>
                </div>
              </div>

              {/* Skeletons */}
              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  KPI Skeleton
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KpiSkeleton />
                  <KpiSkeleton showSparkline={false} />
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Chart Skeleton
                </h3>
                <ChartSkeleton height={200} />
              </div>

              <div>
                <h3 style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.darkGrey, marginBottom: 12 }}>
                  Table Skeleton
                </h3>
                <TableSkeleton rows={4} columns={5} />
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </main>
    </div>
  )
}
