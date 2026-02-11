# STYLE GUIDE

> Complete visual specification for the THOR Dashboard System. Every value in this document is authoritative. When in doubt, this document wins.

---

## 1. Color System

### 1.1 Primary Colors

These are the main colors. Use them for all primary UI elements.

#### Dark Green `#495737`
- **RGB:** `rgb(73, 87, 55)`
- **HSL:** `hsl(86, 23%, 28%)`
- **Tailwind:** `bg-dark-green`, `text-dark-green`, `border-dark-green`
- **CSS Variable:** `var(--dark-green)`
- **Usage:** Primary buttons, header background, sidebar active state, primary accents, success badges, chart series 1
- **Accessible on:** Lightest (`#FFFDFA`) -- contrast ratio 7.2:1

#### Green `#778862`
- **RGB:** `rgb(119, 136, 98)`
- **HSL:** `hsl(87, 16%, 46%)`
- **Tailwind:** `bg-green`, `text-green`, `border-green`
- **CSS Variable:** `var(--green)`
- **Usage:** Primary button hover state, secondary accents, chart series 4
- **Accessible on:** Lightest (`#FFFDFA`) -- contrast ratio 3.5:1 (large text only)

#### Darkest Grey `#2A2928`
- **RGB:** `rgb(42, 41, 40)`
- **HSL:** `hsl(30, 2%, 16%)`
- **Tailwind:** `bg-darkest-grey`, `text-darkest-grey`, `border-darkest-grey`
- **CSS Variable:** `var(--darkest-grey)`
- **Usage:** Dark backgrounds, primary text on light surfaces, secondary button borders
- **Accessible on:** Lightest (`#FFFDFA`) -- contrast ratio 14.5:1

#### Dark Grey `#595755`
- **RGB:** `rgb(89, 87, 85)`
- **HSL:** `hsl(30, 2%, 34%)`
- **Tailwind:** `bg-dark-grey`, `text-dark-grey`, `border-dark-grey`
- **CSS Variable:** `var(--dark-grey)`
- **Usage:** Secondary text, border color, icon color, subtle labels
- **Accessible on:** Lightest (`#FFFDFA`) -- contrast ratio 6.4:1

#### Lightest `#FFFDFA`
- **RGB:** `rgb(255, 253, 250)`
- **HSL:** `hsl(36, 100%, 99%)`
- **Tailwind:** `bg-lightest`, `text-lightest`, `border-lightest`
- **CSS Variable:** `var(--lightest)`
- **Usage:** Light page backgrounds, button text on dark backgrounds, body text on dark surfaces
- **Note:** Use instead of `#FFFFFF` (pure white). This warm off-white is the THOR brand background.

### 1.2 Secondary Colors

Supporting elements only. MUST NOT be used for primary UI elements or branding.

#### Grey `#8C8A7E`
- **RGB:** `rgb(140, 138, 126)`
- **Tailwind:** `bg-grey`, `text-grey`
- **CSS Variable:** `var(--grey)`
- **Usage:** Muted text, disabled states, placeholder text, tertiary labels

#### Light Grey `#D9D6CF`
- **RGB:** `rgb(217, 214, 207)`
- **Tailwind:** `bg-light-grey`, `text-light-grey`, `border-light-grey`
- **CSS Variable:** `var(--light-grey)`
- **Usage:** Borders, dividers, table grid lines, subtle surface backgrounds

#### Blue `#577D91`
- **RGB:** `rgb(87, 125, 145)`
- **Tailwind:** `bg-blue`, `text-blue`
- **CSS Variable:** `var(--blue)`
- **Usage:** Hyperlinks, informational badges, chart series 2

#### Dark Orange `#C57E0A`
- **RGB:** `rgb(197, 126, 10)`
- **Tailwind:** `bg-dark-orange`, `text-dark-orange`
- **CSS Variable:** `var(--dark-orange)`
- **Usage:** Warnings, attention-required states, chart series 3, CTA highlights

#### Light Orange `#D3A165`
- **RGB:** `rgb(211, 161, 101)`
- **Tailwind:** `bg-light-orange`, `text-light-orange`
- **CSS Variable:** `var(--light-orange)`
- **Usage:** Secondary highlights, chart series 5

### 1.3 Chart Color Series

When displaying multi-series data, you MUST use colors in this exact order:

| Series | Color | Hex |
|--------|-------|-----|
| 1 | Dark Green | `#495737` |
| 2 | Blue | `#577D91` |
| 3 | Dark Orange | `#C57E0A` |
| 4 | Green | `#778862` |
| 5 | Light Orange | `#D3A165` |

For single-series charts, use Dark Green (`#495737`). For bar chart gradients, transition from Dark Green to Green.

### 1.4 Status Colors

| State | Background | Text |
|-------|-----------|------|
| Success | `rgba(73, 87, 55, 0.15)` | `#495737` (Dark Green) |
| Warning | `rgba(197, 126, 10, 0.15)` | `#C57E0A` (Dark Orange) |
| Info | `rgba(87, 125, 145, 0.15)` | `#577D91` (Blue) |
| Error | `rgba(220, 38, 38, 0.15)` | `#DC2626` |
| Neutral | `rgba(140, 138, 126, 0.15)` | `#8C8A7E` (Grey) |

### 1.5 Surface Colors

| Surface | Light Theme | Dark Theme |
|---------|------------|------------|
| Page background | `#FFFDFA` (Lightest) | `#2A2928` (Darkest Grey) |
| Card background | `#FFFFFF` | `#333130` |
| Sidebar background | `#2A2928` (Darkest Grey) | `#2A2928` (Darkest Grey) |
| Header background | `#495737` (Dark Green) | `#495737` (Dark Green) |

---

## 2. Typography

### 2.1 Font Families

| Family | Import | Purpose |
|--------|--------|---------|
| **Montserrat** | Google Fonts | Headings, buttons, navigation, labels, callouts, badges |
| **Open Sans** | Google Fonts | Body text, paragraphs, descriptions, table cells, form inputs |

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Open+Sans:ital,wght@0,400;0,700;1,400&display=swap');
```

### 2.2 Type Scale

| Level | Font | Weight | Size | Line Height | Tailwind | Usage |
|-------|------|--------|------|-------------|----------|-------|
| Hero | Montserrat | 800 (ExtraBold) | 54px | 1.2 | `text-hero font-heading` | Hero sections, landing page headlines |
| H1 | Montserrat | 800 (ExtraBold) | 36px | 1.2 | `text-h1 font-heading` | Page titles |
| H2 | Montserrat | 800 (ExtraBold) | 36px | 1.2 | `text-h2 font-heading` | Section headers |
| H3 | Montserrat | 700 (Bold) | 18px | 1.33 | `text-h3 font-heading` | Subsection headers, widget titles |
| H3 Card | Montserrat | 800 (ExtraBold) | 16px | 1.0 | `text-h3-card font-heading` | Card titles, compact headings |
| Body Large | Open Sans | 400 (Regular) | 18px | 1.5 | `text-body-lg font-body` | Lead paragraphs, introductions |
| Body | Open Sans | 400 (Regular) | 16px | 1.5 | `text-base font-body` | Default body text |
| Body Small | Open Sans | 400 (Regular) | 14px | 1.5 | `text-body-sm font-body` | Secondary text, metadata |
| Caption | Open Sans | 400 (Regular) | 12px | 1.5 | `text-caption font-body` | Labels, timestamps, fine print |

### 2.3 Special Text Treatments

#### KPI Labels
```
Font: Montserrat
Weight: 700 (Bold)
Size: 11px
Transform: uppercase
Letter-spacing: 0.5px
Color: Grey (#8C8A7E) on light bg, Light Grey (#D9D6CF) on dark bg
```

#### KPI Values
```
Font: Montserrat
Weight: 800 (ExtraBold)
Size: 36px (primary) or 24px (secondary)
Color: Darkest Grey (#2A2928) on light bg, Lightest (#FFFDFA) on dark bg
```

#### Table Headers
```
Font: Montserrat
Weight: 700 (Bold)
Size: 11px
Transform: uppercase
Letter-spacing: 0.5px
Color: Dark Grey (#595755)
```

#### Table Cells
```
Font: Open Sans
Weight: 400 (Regular)
Size: 14px
Color: Darkest Grey (#2A2928)
```

#### Status Badges
```
Font: Montserrat
Weight: 700 (Bold)
Size: 10px
Transform: uppercase
Padding: 4px 10px
Border-radius: 0px
```

---

## 3. Spacing System

### 3.1 Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `xs` | 8px | `p-xs`, `m-xs`, `gap-xs` | Icon-to-text gap, tight padding, badge internal padding |
| `sm-space` | 16px | `p-sm-space`, `m-sm-space`, `gap-sm-space` | Default element gap, input padding, compact card padding |
| `md-space` | 24px | `p-md-space`, `m-md-space`, `gap-md-space` | Standard card padding, section internal spacing |
| `lg-space` | 40px | `p-lg-space`, `m-lg-space`, `gap-lg-space` | Button horizontal padding, major section padding |
| `xl-space` | 60px | `p-xl-space`, `m-xl-space` | Page section breaks, hero section padding |

### 3.2 Component Spacing

| Component | Padding | Gap |
|-----------|---------|-----|
| Card | 24px (`md-space`) all sides | -- |
| Button (primary) | 13px top/bottom, 40px left/right | 8px icon gap |
| Button (icon) | 8px all sides | -- |
| Table cell | 12px vertical, 16px horizontal | -- |
| Filter group | 16px (`sm-space`) internal | 8px between items |
| KPI card | 24px (`md-space`) all sides | 8px between label and value |
| Section (standard) | 60px vertical | 24px between items |
| Section (hero) | 80-120px vertical | -- |
| Sidebar item | 12px vertical, 16px horizontal | 12px icon-to-label |

### 3.3 Grid

| Context | Columns | Gap |
|---------|---------|-----|
| KPI row | 4 columns (responsive: 2 on tablet, 1 on mobile) | 24px |
| Chart grid | 2 columns (responsive: 1 on mobile) | 24px |
| Content area max width | 1680px | -- |

---

## 4. Buttons

### 4.1 Primary Button

```
Background: #495737 (Dark Green)
Text color: #FFFDFA (Lightest)
Font: Montserrat, 700 (Bold), 16px
Padding: 13px 40px
Border: none
Border-radius: 0px
Transition: background-color 0.3s ease

Hover:
  Background: #778862 (Green)

Focus:
  Ring: 2px solid #495737, 2px offset

Disabled:
  Opacity: 0.5
  Cursor: not-allowed
```

### 4.2 Secondary Button (Outline)

```
Background: transparent
Text color: #2A2928 (Darkest Grey)
Font: Montserrat, 800 (ExtraBold), 16px
Padding: 13px 40px
Border: 2px solid #2A2928
Border-radius: 0px

Hover:
  Background: rgba(42, 41, 40, 0.05)

Disabled:
  Opacity: 0.5
```

### 4.3 Ghost Button

```
Background: transparent
Text color: inherits
Font: Montserrat, 700 (Bold), 14px
Padding: 8px 16px
Border: none
Border-radius: 0px

Hover:
  Background: rgba(73, 87, 55, 0.05)
```

### 4.4 Icon Button

```
Size: 36px x 36px
Padding: 8px
Background: transparent
Border: none
Border-radius: 0px
Icon size: 20px

Hover:
  Background: rgba(73, 87, 55, 0.05)
```

---

## 5. Cards

### 5.1 Default Card

```
Background: white (#FFFFFF in light theme)
Border: 1px solid #D9D6CF (Light Grey)
Border-radius: 0px
Box-shadow: none
Padding: 24px (md-space)

Hover (when interactive):
  Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
  Transition: box-shadow 0.2s ease
```

### 5.2 KPI Card

```
Background: white
Border: 1px solid #D9D6CF
Border-radius: 0px
Padding: 24px

Internal structure:
  Label: Montserrat Bold 11px uppercase, Grey (#8C8A7E), tracking 0.5px
  Value: Montserrat ExtraBold 36px, Darkest Grey (#2A2928)
  Change indicator: Open Sans 14px
    Positive: Dark Green (#495737), with up-arrow icon
    Negative: #DC2626 (red), with down-arrow icon
    Neutral: Grey (#8C8A7E), with minus icon
```

---

## 6. Tables

```
Header row:
  Background: transparent
  Font: Montserrat Bold, 11px, uppercase
  Color: Dark Grey (#595755)
  Letter-spacing: 0.5px
  Padding: 12px 16px
  Border-bottom: 2px solid #D9D6CF

Body rows:
  Font: Open Sans Regular, 14px
  Color: Darkest Grey (#2A2928)
  Padding: 12px 16px
  Border-bottom: 1px solid #D9D6CF

  Hover:
    Background: rgba(73, 87, 55, 0.05)

Striped (optional):
  Even rows: rgba(217, 214, 207, 0.2)

Sort indicator:
  Active: Dark Green (#495737)
  Inactive: Grey (#8C8A7E)
```

---

## 7. Form Elements

### Inputs

```
Background: white
Border: 1px solid #D9D6CF (Light Grey)
Border-radius: 0px
Font: Open Sans Regular, 16px
Color: Darkest Grey (#2A2928)
Padding: 10px 16px
Height: 40px

Placeholder:
  Color: Grey (#8C8A7E)

Focus:
  Border-color: #495737 (Dark Green)
  Ring: 2px solid rgba(73, 87, 55, 0.2)

Disabled:
  Background: #F5F3EF
  Color: Grey (#8C8A7E)
  Cursor: not-allowed
```

### Select

Same as Input, with a chevron-down icon (Lucide `ChevronDown`) on the right at 16px.

---

## 8. Icons

### Library

You MUST use **Lucide React** (`lucide-react`) exclusively.

### Sizes

| Context | Size | Example |
|---------|------|---------|
| Inline with body text | 16px | Status indicators in table cells |
| Button with text | 16px | Button icons |
| Standalone interactive | 20px | Sidebar nav icons, toolbar icons |
| Standalone decorative | 24px | Empty state illustrations, feature icons |

### Colors

Icons MUST use the same color as their surrounding text, or the specific color assigned to their function:
- Navigation icons: `#FFFDFA` (Lightest) in header/sidebar, `#595755` (Dark Grey) in content
- Action icons: `#495737` (Dark Green) for primary, `#595755` (Dark Grey) for secondary
- Status icons: Match the status color (success = Dark Green, warning = Dark Orange, info = Blue)

### Stroke Width

Default Lucide stroke width (2px) is correct. You MUST NOT change `strokeWidth` unless creating a specific visual effect.

---

## 9. Shadows

| State | Shadow | Usage |
|-------|--------|-------|
| Resting | `none` | All elements by default |
| Hover (interactive cards) | `0 2px 8px rgba(0, 0, 0, 0.08)` | Cards that are clickable |
| Dropdown/Popover | `0 4px 16px rgba(0, 0, 0, 0.12)` | Floating elements (menus, tooltips) |
| Header (fixed) | `0 1px 0 rgba(0, 0, 0, 0.1)` | Subtle bottom edge on fixed header |

You MUST NOT use any other shadow values.

---

## 10. Transitions

| Property | Duration | Easing |
|----------|----------|--------|
| `background-color` | 0.3s | `ease` |
| `color` | 0.2s | `ease` |
| `box-shadow` | 0.2s | `ease` |
| `transform` | 0.3s | `ease` |
| `opacity` | 0.2s | `ease` |
| `width` (sidebar/filter) | 0.3s | `ease-in-out` |

You MUST NOT use transitions longer than 0.5s. You MUST NOT use `ease-out` only -- always use `ease` or `ease-in-out` for layout transitions.

---

## 11. Responsive Breakpoints

| Name | Min-width | Target |
|------|-----------|--------|
| sm | 576px | Small devices |
| md | 768px | Tablets |
| lg | 992px | Desktops |
| xl | 1200px | Large desktops |
| 2xl | 1400px | Extra large |

### Responsive Behavior

| Element | Desktop (>= 992px) | Tablet (768-991px) | Mobile (< 768px) |
|---------|--------------------|--------------------|-------------------|
| Sidebar | Visible, collapsible | Collapsed (icon only) | Hidden (sheet overlay) |
| Filter panel | Push layout (pushes content) | Push layout | Full-screen overlay |
| KPI cards | 4 columns | 2 columns | 1 column |
| Chart grid | 2 columns | 1 column | 1 column |
| Header | Full with text labels | Compact | Compact with hamburger |

---

## 12. Dark Theme

The dashboard system supports a dark theme via the `.dark` class on `<html>`.

| Element | Light Theme | Dark Theme |
|---------|------------|------------|
| Page background | `#FFFDFA` | `#2A2928` |
| Card background | `#FFFFFF` | `#333130` |
| Primary text | `#2A2928` | `#FFFDFA` |
| Secondary text | `#595755` | `#8C8A7E` |
| Muted text | `#8C8A7E` | `#8C8A7E` |
| Border | `#D9D6CF` | `#3a3938` |
| Chart grid lines | `#D9D6CF` | `#3a3938` |
| Table row hover | `rgba(73,87,55,0.05)` | `rgba(119,136,98,0.08)` |

Header and sidebar colors remain the same in both themes.
