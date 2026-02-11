/** Format a number as USD currency (compact for large values). */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Format a number as a percentage string. */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/** Format a number with locale-aware separators. */
export function formatInteger(value: number): string {
  return value.toLocaleString("en-US")
}

/** Format a metric value based on its format type. */
export function formatMetricValue(
  value: number,
  format: "currency" | "percentage" | "integer" | "decimal" | "days"
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value)
    case "percentage":
      return formatPercent(value)
    case "integer":
      return formatInteger(value)
    case "decimal":
      return value.toFixed(2)
    case "days":
      return `${Math.round(value)}d`
    default:
      return String(value)
  }
}
