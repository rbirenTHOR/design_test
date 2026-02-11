/* ------------------------------------------------------------------ */
/*  THOR Brand Constants                                              */
/* ------------------------------------------------------------------ */

/** Primary brand colors */
export const COLORS = {
  darkGreen: "#495737",
  green: "#778862",
  darkestGrey: "#2A2928",
  darkGrey: "#595755",
  lightest: "#FFFDFA",
  grey: "#8C8A7E",
  lightGrey: "#D9D6CF",
  blue: "#577D91",
  darkOrange: "#C57E0A",
  lightOrange: "#D3A165",
} as const

/** Chart color series (ordered for data viz) */
export const CHART_COLORS = [
  COLORS.darkGreen,
  COLORS.blue,
  COLORS.darkOrange,
  COLORS.green,
  COLORS.lightOrange,
] as const

/** THOR subsidiary brands */
export const BRANDS = [
  "Airstream",
  "Jayco",
  "Keystone",
  "Thor Motor Coach",
  "Heartland",
] as const

/** Font families */
export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Open Sans', sans-serif",
} as const

/** Spacing scale (px) */
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 60,
} as const

/** Layout dimensions (px) */
export const LAYOUT = {
  containerMax: 1680,
  sidebarWidth: 260,
  sidebarCollapsed: 64,
  headerHeight: 64,
  filterPanelHeight: 52,
} as const

/** Table page size options */
export const PAGE_SIZES = [10, 20, 50, 100] as const

/** Date range presets */
export const DATE_PRESETS = ["MTD", "QTD", "YTD", "L12M", "L30D", "Custom"] as const
