import type { KpiItem, DonutDatum, HierarchicalRow, OpCoRegistrationRow, OpCoMarketShareRow } from "./types"

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

/* ================================================================== */
/*  STATISTICAL SURVEY — Registration Overview (Page 1)               */
/* ================================================================== */

export const registrationKpis: KpiItem[] = [
  {
    id: "total-registrations",
    label: "Total Registrations",
    value: 385_200,
    previousValue: 371_400,
    format: "integer",
    sparklineData: [28900, 29400, 31200, 33800, 35100, 36400, 34200, 33500, 32100, 30800, 29200, 30500],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "towable-registrations",
    label: "Towable Registrations",
    value: 327_420,
    previousValue: 315_690,
    format: "integer",
    sparklineData: [24600, 25000, 26500, 28700, 29800, 30900, 29100, 28500, 27300, 26200, 24800, 25920],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "motorized-registrations",
    label: "Motorized Registrations",
    value: 57_780,
    previousValue: 55_710,
    format: "integer",
    sparklineData: [4300, 4400, 4700, 5100, 5300, 5500, 5100, 5000, 4800, 4600, 4400, 4580],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "thor-registrations",
    label: "THOR Registrations",
    value: 162_784,
    previousValue: 153_078,
    format: "integer",
    sparklineData: [12200, 12400, 13200, 14300, 14800, 15400, 14400, 14100, 13500, 13000, 12300, 12884],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
]

export const registrationByTypeData = [
  { name: "Travel Trailer", registrations: 186_246 },
  { name: "Fifth Wheel", registrations: 141_174 },
  { name: "Class C", registrations: 21_186 },
  { name: "Class A", registrations: 19_260 },
  { name: "Class B", registrations: 17_334 },
]

export const motorizedVsTowableData: DonutDatum[] = [
  { name: "Towable", value: 327_420 },
  { name: "Motorized", value: 57_780 },
]

export const monthlyRegistrationTrend = [
  { name: "Jan", total: 28_900, thor: 12_200 },
  { name: "Feb", total: 29_400, thor: 12_400 },
  { name: "Mar", total: 31_200, thor: 13_200 },
  { name: "Apr", total: 33_800, thor: 14_300 },
  { name: "May", total: 35_100, thor: 14_800 },
  { name: "Jun", total: 36_400, thor: 15_400 },
  { name: "Jul", total: 34_200, thor: 14_400 },
  { name: "Aug", total: 33_500, thor: 14_100 },
  { name: "Sep", total: 32_100, thor: 13_500 },
  { name: "Oct", total: 30_800, thor: 13_000 },
  { name: "Nov", total: 29_200, thor: 12_300 },
  { name: "Dec", total: 30_500, thor: 12_884 },
]

export const opCoRegistrationData: OpCoRegistrationRow[] = [
  { id: "jayco", operatingCompany: "Jayco Inc", travelTrailer: 24_810, fifthWheel: 18_940, towable: 43_750, motorized: 8_120, total: 51_870 },
  { id: "keystone", operatingCompany: "Keystone RV", travelTrailer: 21_340, fifthWheel: 22_180, towable: 43_520, motorized: 0, total: 43_520 },
  { id: "heartland", operatingCompany: "Heartland RV", travelTrailer: 12_640, fifthWheel: 15_820, towable: 28_460, motorized: 0, total: 28_460 },
  { id: "kz-rv", operatingCompany: "KZ RV", travelTrailer: 8_920, fifthWheel: 6_140, towable: 15_060, motorized: 0, total: 15_060 },
  { id: "airstream", operatingCompany: "Airstream", travelTrailer: 5_280, fifthWheel: 0, towable: 5_280, motorized: 1_840, total: 7_120 },
  { id: "tmc", operatingCompany: "THOR Motor Coach", travelTrailer: 0, fifthWheel: 0, towable: 0, motorized: 10_854, total: 10_854 },
  { id: "tiffin", operatingCompany: "Tiffin Motor Homes", travelTrailer: 0, fifthWheel: 1_240, towable: 1_240, motorized: 4_660, total: 5_900 },
]

/* ================================================================== */
/*  STATISTICAL SURVEY — Market Share (Page 2)                        */
/* ================================================================== */

export const marketShareKpis: KpiItem[] = [
  {
    id: "thor-ms-towable",
    label: "THOR MS% (Towable)",
    value: 42.3,
    previousValue: 41.2,
    format: "percentage",
    sparklineData: [41.0, 41.2, 41.5, 42.0, 42.4, 42.8, 42.5, 42.3, 42.1, 41.8, 41.4, 42.3],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "thor-ms-motorized",
    label: "THOR MS% (Motorized)",
    value: 38.5,
    previousValue: 37.1,
    format: "percentage",
    sparklineData: [36.8, 37.0, 37.4, 38.0, 38.5, 39.0, 38.7, 38.4, 38.1, 37.8, 37.3, 38.5],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "thor-ms-tt",
    label: "THOR MS% (Travel Trailer)",
    value: 40.1,
    previousValue: 38.9,
    format: "percentage",
    sparklineData: [38.5, 38.8, 39.2, 39.8, 40.2, 40.6, 40.3, 40.0, 39.7, 39.4, 39.0, 40.1],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
  {
    id: "thor-ms-fw",
    label: "THOR MS% (Fifth Wheel)",
    value: 45.2,
    previousValue: 44.1,
    format: "percentage",
    sparklineData: [43.8, 44.0, 44.4, 44.9, 45.3, 45.7, 45.4, 45.1, 44.8, 44.5, 44.1, 45.2],
    direction: "up-is-good",
    comparisonLabel: "vs prior year",
  },
]

export const manufacturerMarketShareData = [
  { name: "THOR Industries", value: 42.3 },
  { name: "Forest River", value: 28.5 },
  { name: "Winnebago", value: 14.2 },
  { name: "Alliance RV", value: 3.8 },
  { name: "Brinkley RV", value: 2.4 },
  { name: "Other", value: 8.8 },
]

export const t12mMarketShareTrend = [
  { name: "Jan", jayco: 13.1, keystone: 12.8, heartland: 7.2, kzRv: 3.8, airstream: 1.5, tmc: 2.8, tiffin: 1.5 },
  { name: "Feb", jayco: 13.2, keystone: 12.9, heartland: 7.3, kzRv: 3.8, airstream: 1.5, tmc: 2.8, tiffin: 1.5 },
  { name: "Mar", jayco: 13.3, keystone: 13.0, heartland: 7.3, kzRv: 3.9, airstream: 1.6, tmc: 2.9, tiffin: 1.5 },
  { name: "Apr", jayco: 13.4, keystone: 13.1, heartland: 7.4, kzRv: 3.9, airstream: 1.6, tmc: 2.9, tiffin: 1.5 },
  { name: "May", jayco: 13.5, keystone: 13.2, heartland: 7.4, kzRv: 3.9, airstream: 1.6, tmc: 2.9, tiffin: 1.5 },
  { name: "Jun", jayco: 13.6, keystone: 13.3, heartland: 7.5, kzRv: 4.0, airstream: 1.6, tmc: 3.0, tiffin: 1.5 },
  { name: "Jul", jayco: 13.5, keystone: 13.2, heartland: 7.4, kzRv: 3.9, airstream: 1.6, tmc: 2.9, tiffin: 1.6 },
  { name: "Aug", jayco: 13.4, keystone: 13.1, heartland: 7.4, kzRv: 3.9, airstream: 1.6, tmc: 2.9, tiffin: 1.5 },
  { name: "Sep", jayco: 13.3, keystone: 13.0, heartland: 7.3, kzRv: 3.9, airstream: 1.6, tmc: 2.8, tiffin: 1.5 },
  { name: "Oct", jayco: 13.2, keystone: 12.9, heartland: 7.3, kzRv: 3.8, airstream: 1.5, tmc: 2.8, tiffin: 1.5 },
  { name: "Nov", jayco: 13.1, keystone: 12.8, heartland: 7.2, kzRv: 3.8, airstream: 1.5, tmc: 2.8, tiffin: 1.5 },
  { name: "Dec", jayco: 13.5, keystone: 13.1, heartland: 7.4, kzRv: 3.9, airstream: 1.6, tmc: 2.8, tiffin: 1.5 },
]

export const opCoMarketShareData: OpCoMarketShareRow[] = [
  { id: "jayco", operatingCompany: "Jayco Inc", travelTrailerMs: 13.3, fifthWheelMs: 13.4, towableMs: 13.4, motorizedMs: 14.0, t12mTowableMs: 13.5 },
  { id: "keystone", operatingCompany: "Keystone RV", travelTrailerMs: 11.5, fifthWheelMs: 15.7, towableMs: 13.3, motorizedMs: 0, t12mTowableMs: 13.1 },
  { id: "heartland", operatingCompany: "Heartland RV", travelTrailerMs: 6.8, fifthWheelMs: 11.2, towableMs: 8.7, motorizedMs: 0, t12mTowableMs: 7.4 },
  { id: "kz-rv", operatingCompany: "KZ RV", travelTrailerMs: 4.8, fifthWheelMs: 4.3, towableMs: 4.6, motorizedMs: 0, t12mTowableMs: 3.9 },
  { id: "airstream", operatingCompany: "Airstream", travelTrailerMs: 2.8, fifthWheelMs: 0, towableMs: 1.6, motorizedMs: 3.2, t12mTowableMs: 1.6 },
  { id: "tmc", operatingCompany: "THOR Motor Coach", travelTrailerMs: 0, fifthWheelMs: 0, towableMs: 0, motorizedMs: 18.8, t12mTowableMs: 0 },
  { id: "tiffin", operatingCompany: "Tiffin Motor Homes", travelTrailerMs: 0, fifthWheelMs: 0.9, towableMs: 0.4, motorizedMs: 8.1, t12mTowableMs: 1.5 },
]

/* ================================================================== */
/*  STATISTICAL SURVEY — Filter Options                               */
/* ================================================================== */

export const surveyFilterOptions = {
  rvType: ["Travel Trailer", "Fifth Wheel", "Class A", "Class B", "Class C"],
  motorizedOrTowable: ["Motorized", "Towable"],
  rvSubtype: ["Conventional", "Toy Hauler", "Sport Utility", "Expandable", "A-Frame", "Truck Camper", "Type A Gas", "Type A Diesel", "Super C"],
  thorOperatingCompany: ["Jayco Inc", "Keystone RV", "Heartland RV", "KZ RV", "Airstream", "THOR Motor Coach", "Tiffin Motor Homes"],
  modelYear: ["2026", "2025", "2024", "2023", "2022"],
  rvModel: ["Jay Flight", "Cougar", "North Trail", "Montana", "Passport", "Basecamp", "Interstate", "Quantum", "Chateau", "Wayfinder", "Phaeton", "Open Range"],
  priceGroup: ["Under $25K", "$25K-$50K", "$50K-$75K", "$75K-$100K", "Over $100K"],
  chassisModel: ["Ford E-450", "Ford F-53", "Freightliner XC-S", "Ram ProMaster", "Mercedes Sprinter"],
  grossVehicleWeight: ["Under 5,000", "5,001-10,000", "10,001-16,000", "16,001-26,000", "Over 26,000"],
  driveType: ["4x2", "4x4", "AWD"],
  numberOfAxles: ["1", "2", "3"],
  isRental: ["Yes", "No"],
  isThor: ["Yes", "No"],
  placementState: ["IN", "TX", "FL", "CA", "OH", "MI", "PA", "NY", "AZ", "CO", "NC", "GA", "TN", "MO", "OR", "WA", "VA", "IL", "MN", "WI"],
  placementBta: ["Indianapolis", "Dallas-Fort Worth", "Tampa-St Pete", "Los Angeles", "Columbus", "Phoenix", "Denver", "Atlanta", "Nashville", "Portland"],
  placementCity: ["Elkhart", "Dallas", "Tampa", "Orlando", "Phoenix", "Denver", "Atlanta", "Nashville", "Houston", "Portland"],
  placementCounty: ["Elkhart", "Dallas", "Hillsborough", "Maricopa", "Denver", "Fulton", "Davidson", "Harris", "Multnomah", "Hamilton"],
  placementZip: ["46516", "75001", "33601", "85001", "80201", "30301", "37201", "77001", "97201", "45201"],
  dealerGroup: ["Camping World", "General RV", "La Mesa RV", "Fun Town RV", "Lazydays", "ExploreUSA", "Bish's RV", "Windish RV"],
  dealershipState: ["IN", "TX", "FL", "CA", "OH", "MI", "PA", "NY", "AZ", "CO"],
  dealershipBta: ["Elkhart-Goshen", "Dallas-Fort Worth", "Tampa-St Pete", "Los Angeles", "Columbus", "Phoenix", "Denver"],
  dealershipCity: ["Elkhart", "Dallas", "Tampa", "Orlando", "Phoenix", "Denver", "Grand Rapids"],
  dealershipCounty: ["Elkhart", "Dallas", "Hillsborough", "Maricopa", "Denver", "Kent"],
  dealershipCountry: ["United States", "Canada"],
}

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
