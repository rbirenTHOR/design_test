/**
 * THOR Brand Constants for test assertions.
 * These values come directly from CLAUDE.md and must be enforced in every test.
 */

/** Approved THOR hex colors (case-insensitive comparison) */
export const THOR_COLORS_HEX = [
  '#495737', // Dark Green
  '#778862', // Green
  '#2A2928', // Darkest Grey
  '#595755', // Dark Grey
  '#FFFDFA', // Lightest
  '#8C8A7E', // Grey
  '#D9D6CF', // Light Grey
  '#577D91', // Blue
  '#C57E0A', // Dark Orange
  '#D3A165', // Light Orange
] as const;

/** Approved THOR color RGB values (for computed style comparison) */
export const THOR_COLORS_RGB = [
  'rgb(73, 87, 55)',     // Dark Green #495737
  'rgb(119, 136, 98)',   // Green #778862
  'rgb(42, 41, 40)',     // Darkest Grey #2A2928
  'rgb(89, 87, 85)',     // Dark Grey #595755
  'rgb(255, 253, 250)',  // Lightest #FFFDFA
  'rgb(140, 138, 126)',  // Grey #8C8A7E
  'rgb(217, 214, 207)',  // Light Grey #D9D6CF
  'rgb(87, 125, 145)',   // Blue #577D91
  'rgb(197, 126, 10)',   // Dark Orange #C57E0A
  'rgb(211, 161, 101)',  // Light Orange #D3A165
] as const;

/** Colors allowed beyond THOR palette (browser defaults, transparent, inherit, etc.) */
export const ALLOWED_NON_BRAND_COLORS = [
  'rgba(0, 0, 0, 0)',       // transparent
  'rgb(0, 0, 0)',            // black (for text/borders context)
  'rgb(255, 255, 255)',      // white
  'transparent',
  'inherit',
  'currentcolor',
  'currentColor',
] as const;

/** Approved font families */
export const APPROVED_FONTS = {
  heading: 'Montserrat',
  body: 'Open Sans',
} as const;

/** Layout dimensions */
export const LAYOUT = {
  headerHeight: 64,
  sidebarExpanded: 260,
  sidebarCollapsed: 64,
  filterPanelWidth: 320,
} as const;

/** CSS variable names used in the THOR design system */
export const CSS_VARIABLES = [
  '--dark-green',
  '--green',
  '--darkest-grey',
  '--dark-grey',
  '--lightest',
  '--grey',
  '--light-grey',
  '--blue',
  '--dark-orange',
  '--light-orange',
  '--font-heading',
  '--font-body',
] as const;
