import type { KpiItem, DonutDatum, HierarchicalRow } from "./types"

/* ------------------------------------------------------------------ */
/*  Monthly Revenue Data (for BarChart)                               */
/* ------------------------------------------------------------------ */
export const monthlyRevenueData = [
  { name: "Jan", revenue: 980_000_000 },
  { name: "Feb", revenue: 1_050_000_000 },
  { name: "Mar", revenue: 1_120_000_000 },
  { name: "Apr", revenue: 1_280_000_000 },
  { name: "May", revenue: 1_350_000_000 },
  { name: "Jun", revenue: 1_410_000_000 },
  { name: "Jul", revenue: 1_520_000_000 },
  { name: "Aug", revenue: 1_580_000_000 },
  { name: "Sep", revenue: 1_320_000_000 },
  { name: "Oct", revenue: 1_180_000_000 },
  { name: "Nov", revenue: 1_050_000_000 },
  { name: "Dec", revenue: 1_360_000_000 },
]

/* ------------------------------------------------------------------ */
/*  YoY Trend Data (for LineChart)                                    */
/* ------------------------------------------------------------------ */
export const yoyTrendData = [
  { name: "Jan", current: 980_000_000, prior: 890_000_000 },
  { name: "Feb", current: 1_050_000_000, prior: 940_000_000 },
  { name: "Mar", current: 1_120_000_000, prior: 1_010_000_000 },
  { name: "Apr", current: 1_280_000_000, prior: 1_150_000_000 },
  { name: "May", current: 1_350_000_000, prior: 1_280_000_000 },
  { name: "Jun", current: 1_410_000_000, prior: 1_310_000_000 },
  { name: "Jul", current: 1_520_000_000, prior: 1_420_000_000 },
  { name: "Aug", current: 1_580_000_000, prior: 1_480_000_000 },
  { name: "Sep", current: 1_320_000_000, prior: 1_250_000_000 },
  { name: "Oct", current: 1_180_000_000, prior: 1_100_000_000 },
  { name: "Nov", current: 1_050_000_000, prior: 980_000_000 },
  { name: "Dec", current: 1_360_000_000, prior: 1_190_000_000 },
]

/* ------------------------------------------------------------------ */
/*  Brand Mix Data (for DonutChart)                                   */
/* ------------------------------------------------------------------ */
export const brandMixData: DonutDatum[] = [
  { name: "Jayco", value: 3_100_000_000 },
  { name: "Keystone", value: 2_800_000_000 },
  { name: "Airstream", value: 2_400_000_000 },
  { name: "Thor Motor Coach", value: 2_100_000_000 },
  { name: "Heartland", value: 1_900_000_000 },
]

/* ------------------------------------------------------------------ */
/*  KPI Summary Items                                                 */
/* ------------------------------------------------------------------ */
export const dashboardKpis: KpiItem[] = [
  {
    id: "total-revenue",
    label: "Total Revenue (YTD)",
    value: 14_200_000_000,
    previousValue: 13_100_000_000,
    format: "currency",
    sparklineData: [8.8, 9.2, 9.8, 10.5, 11.2, 11.8, 12.4, 13.0, 12.2, 11.5, 11.0, 14.2],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "units-sold",
    label: "Units Sold",
    value: 127_450,
    previousValue: 121_150,
    format: "integer",
    sparklineData: [9200, 9800, 10200, 10800, 11200, 11500, 12100, 12400, 11000, 10600, 9800, 11450],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "avg-selling-price",
    label: "Avg Selling Price",
    value: 111_420,
    previousValue: 108_140,
    format: "currency",
    sparklineData: [106, 107, 108, 109, 110, 110, 111, 112, 111, 110, 109, 111],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "dealer-count",
    label: "Dealer Network",
    value: 3_842,
    previousValue: 3_718,
    format: "integer",
    sparklineData: [3710, 3720, 3740, 3760, 3780, 3790, 3800, 3810, 3820, 3830, 3835, 3842],
    direction: "up-is-good",
    comparisonLabel: "+124 new dealers",
  },
]

/* ------------------------------------------------------------------ */
/*  Top Dealers Data (for DataTable)                                  */
/* ------------------------------------------------------------------ */
export interface DealerRow {
  id: string
  dealer: string
  brand: string
  region: string
  units: number
  revenue: number
  avgPrice: number
  status: "active" | "review" | "new"
}

export const topDealersData: DealerRow[] = [
  { id: "d1", dealer: "Lazydays RV", brand: "Airstream", region: "Southeast", units: 1642, revenue: 187_400_000, avgPrice: 114_128, status: "active" },
  { id: "d2", dealer: "Camping World - Denver", brand: "Keystone", region: "West", units: 1384, revenue: 156_800_000, avgPrice: 113_295, status: "active" },
  { id: "d3", dealer: "General RV Center", brand: "Jayco", region: "Midwest", units: 1248, revenue: 142_100_000, avgPrice: 113_862, status: "active" },
  { id: "d4", dealer: "Fun Town RV", brand: "Keystone", region: "Southwest", units: 1127, revenue: 128_600_000, avgPrice: 114_108, status: "review" },
  { id: "d5", dealer: "ExploreUSA RV", brand: "Thor Motor Coach", region: "Southwest", units: 1036, revenue: 118_200_000, avgPrice: 114_093, status: "active" },
  { id: "d6", dealer: "Motor Home Specialist", brand: "Thor Motor Coach", region: "Southwest", units: 412, revenue: 94_700_000, avgPrice: 229_854, status: "active" },
  { id: "d7", dealer: "Byerly RV", brand: "Airstream", region: "Midwest", units: 987, revenue: 89_300_000, avgPrice: 90_476, status: "active" },
  { id: "d8", dealer: "Colonial Airstream", brand: "Airstream", region: "Northeast", units: 834, revenue: 86_200_000, avgPrice: 103_358, status: "active" },
  { id: "d9", dealer: "Crestview RV", brand: "Heartland", region: "Southeast", units: 921, revenue: 78_400_000, avgPrice: 85_125, status: "new" },
  { id: "d10", dealer: "Bill Plemmons RV", brand: "Jayco", region: "Southeast", units: 876, revenue: 74_800_000, avgPrice: 85_388, status: "active" },
  { id: "d11", dealer: "Windish RV", brand: "Keystone", region: "West", units: 812, revenue: 71_200_000, avgPrice: 87_685, status: "active" },
  { id: "d12", dealer: "Bish's RV", brand: "Heartland", region: "West", units: 798, revenue: 68_900_000, avgPrice: 86_341, status: "active" },
  { id: "d13", dealer: "National Indoor RV", brand: "Thor Motor Coach", region: "Southeast", units: 345, revenue: 65_400_000, avgPrice: 189_565, status: "review" },
  { id: "d14", dealer: "TerryTown RV", brand: "Jayco", region: "Midwest", units: 745, revenue: 63_200_000, avgPrice: 84_832, status: "active" },
  { id: "d15", dealer: "Meyer's RV", brand: "Keystone", region: "Northeast", units: 712, revenue: 60_800_000, avgPrice: 85_393, status: "active" },
  { id: "d16", dealer: "Sherman RV Center", brand: "Heartland", region: "Midwest", units: 698, revenue: 58_400_000, avgPrice: 83_667, status: "active" },
  { id: "d17", dealer: "PPL Motorhomes", brand: "Thor Motor Coach", region: "Southwest", units: 289, revenue: 56_200_000, avgPrice: 194_464, status: "active" },
  { id: "d18", dealer: "Veurink's RV", brand: "Jayco", region: "Midwest", units: 654, revenue: 54_800_000, avgPrice: 83_792, status: "new" },
  { id: "d19", dealer: "Vogt RV", brand: "Airstream", region: "Southwest", units: 623, revenue: 52_400_000, avgPrice: 84_109, status: "active" },
  { id: "d20", dealer: "Lichtsinn RV", brand: "Jayco", region: "Midwest", units: 612, revenue: 50_100_000, avgPrice: 81_863, status: "active" },
]

/* ------------------------------------------------------------------ */
/*  Hierarchical Data (for ExpandableTable showcase)                  */
/* ------------------------------------------------------------------ */
export const hierarchicalData: HierarchicalRow[] = [
  {
    id: "tt", name: "Travel Trailers", level: 0, units: 52_400, revenue: 4_100_000_000, margin: 18.2, avgPrice: 78_244, yoyGrowth: 8.7,
    children: [
      { id: "tt-jayco", name: "Jayco", level: 1, parentId: "tt", units: 18_200, revenue: 1_450_000_000, margin: 19.1, avgPrice: 79_670, yoyGrowth: 10.2, children: [] },
      { id: "tt-keystone", name: "Keystone", level: 1, parentId: "tt", units: 22_100, revenue: 1_620_000_000, margin: 17.8, avgPrice: 73_303, yoyGrowth: 7.4, children: [] },
      { id: "tt-heartland", name: "Heartland", level: 1, parentId: "tt", units: 12_100, revenue: 1_030_000_000, margin: 17.5, avgPrice: 85_124, yoyGrowth: 8.1, children: [] },
    ],
  },
  {
    id: "fw", name: "Fifth Wheels", level: 0, units: 28_400, revenue: 2_800_000_000, margin: 16.5, avgPrice: 98_592, yoyGrowth: 6.2,
    children: [
      { id: "fw-keystone", name: "Keystone", level: 1, parentId: "fw", units: 16_800, revenue: 1_680_000_000, margin: 16.8, avgPrice: 100_000, yoyGrowth: 5.8, children: [] },
      { id: "fw-heartland", name: "Heartland", level: 1, parentId: "fw", units: 11_600, revenue: 1_120_000_000, margin: 16.1, avgPrice: 96_552, yoyGrowth: 6.8, children: [] },
    ],
  },
  {
    id: "mh", name: "Motorhomes", level: 0, units: 12_850, revenue: 2_100_000_000, margin: 14.2, avgPrice: 163_424, yoyGrowth: 4.8,
    children: [
      { id: "mh-tmc", name: "Thor Motor Coach", level: 1, parentId: "mh", units: 12_850, revenue: 2_100_000_000, margin: 14.2, avgPrice: 163_424, yoyGrowth: 4.8, children: [] },
    ],
  },
]
