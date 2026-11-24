---
name: NuVision PeMVISH - Dashboard (User Management)
description: Design spec reverse-engineered from a screenshot of the NuVision | PeMVISH admin dashboard with sidebar navigation, tabs, and two data-table cards.
source: 1795435352762_image.png
note: Screenshot is 2x (retina, ~2324 px wide). Pixel values below are given in CSS px (screenshot px / 2). All colors and sizes are visual estimates; verify against the real product before shipping.

colors:
  page-background:     "#EFF2FB"   # app shell, header and sidebar (pale lavender-blue)
  surface:             "#FFFFFF"   # content panel, cards
  surface-subtle:      "#F6F7FB"   # table header row
  border:              "#DDE2EE"   # card outline, row dividers
  text-primary:        "#1F2330"   # body text, headings
  text-secondary:      "#5F6677"   # tabs (inactive), table header labels, footer
  link:                "#0A19E6"   # table links (bold, saturated blue)
  breadcrumb-active:   "#1D55A8"   # current page in breadcrumb
  nav-active-fill:     "#5E9CF2"   # selected sidebar item
  nav-active-text:     "#FFFFFF"
  brand-navy:          "#14285A"   # "Nu" and "PeMVISH" wordmark
  brand-red:           "#C0392B"   # "Vision" and logo lower half
  badge-notification:  "#E8446D"   # notification count bubble
  fab-background:      "#3A3C40"   # floating action button
  user-card-fill:      "#DCE6F7"   # profile card at sidebar bottom
  avatar-blue:         "#4C8DF0"

typography:
  font-family: "Arial / Helvetica-style grotesque sans-serif (system UI sans)"
  page-heading-card:
    size: 15px
    weight: 700
    color: text-primary
  breadcrumb:
    size: 13px
    weight: 600 (parent) / 400 (current)
  nav-item:
    size: 14px
    weight: 400
  tab-active:
    size: 14px
    weight: 700
    color: text-primary
  tab-inactive:
    size: 14px
    weight: 400
    color: text-secondary
  table-header:
    size: 12px
    weight: 700
    transform: uppercase
    letter-spacing: 0.02em
    color: text-secondary
  table-cell:
    size: 13px
    weight: 400
    color: text-primary
  table-link:
    size: 13px
    weight: 700
    color: link
  pagination:
    size: 12px
    weight: 400
  footer:
    size: 11px
    weight: 400
    color: text-secondary

spacing:
  base-unit: 4px
  header-height: 52px
  sidebar-width: 212px
  sidebar-item-height: 36px
  sidebar-item-padding-x: 20px
  content-gutter: 20px
  card-gap: 20px
  card-padding-x: 20px
  table-row-height: 43px
  table-header-height: 47px
  card-header-height: 54px
  pagination-bar-height: 50px

radius:
  card: 12px
  nav-item: 8px
  tab-active: 8px
  user-card: 12px
  avatar: 50%
  fab: 50%
  badge: 50%

elevation:
  card: "1px border #DDE2EE with very soft shadow (0 1px 3px rgba(0,0,0,0.06))"
  tab-active: "soft shadow (0 1px 4px rgba(0,0,0,0.12))"
  fab: "subtle shadow"
---

# NuVision | PeMVISH Dashboard - Design System

## 1. Overview

An enterprise admin dashboard in a **light, airy lavender-blue theme**. A persistent left sidebar handles navigation, a slim top bar carries branding and utilities, and the main area is a large white panel with tabs and two side-by-side data cards.

Design principles:
- **Clear structure** - shell (header + sidebar) in tinted background, content in a white panel.
- **Data first** - tables use uppercase gray headers and bold blue links so names are scannable.
- **Single strong accent** - saturated blue is reserved for the active nav item and clickable names.
- **Soft, low-elevation surfaces** - thin borders and gentle shadows rather than heavy depth.

## 2. Color

| Token | Hex (approx.) | Usage |
|---|---|---|
| `page-background` | `#EFF2FB` | App shell, top bar, sidebar |
| `surface` | `#FFFFFF` | Main panel, cards |
| `surface-subtle` | `#F6F7FB` | Table header row |
| `border` | `#DDE2EE` | Card outlines, row dividers |
| `text-primary` | `#1F2330` | Headings, cell text |
| `text-secondary` | `#5F6677` | Inactive tabs, column headers, footer |
| `link` | `#0A19E6` | Row links (name, report titles) |
| `breadcrumb-active` | `#1D55A8` | Current breadcrumb |
| `nav-active-fill` | `#5E9CF2` | Selected sidebar item background |
| `brand-navy` | `#14285A` | Logo wordmark |
| `brand-red` | `#C0392B` | Logo accent ("Vision") |
| `badge-notification` | `#E8446D` | Notification count |
| `fab-background` | `#3A3C40` | Floating chat/assist button |
| `user-card-fill` | `#DCE6F7` | Profile card |

Accessibility notes:
- White text on `nav-active-fill` is about 2.9:1, which fails WCAG AA for normal text. Consider a darker blue (about `#2F6FD6`) for the active item.
- `link` on white is strong (above 8:1), but links rely on color and weight only, with no underline.

## 3. Typography

Sans-serif system UI family (Arial/Helvetica style). Hierarchy is created with weight and case, not many sizes.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Card title ("My Applications") | 15px | 700 | Near-black |
| Breadcrumb | 13px | 600 / 400 | Parent in dark gray, current in blue |
| Sidebar item | 14px | 400 | Icon + label |
| Tab (active) | 14px | 700 | White pill with soft shadow |
| Tab (inactive) | 14px | 400 | Gray |
| Table header | 12px | 700 | Uppercase, tracked |
| Table cell | 13px | 400 | |
| Table link | 13px | 700 | Blue |
| Pagination | 12px | 400 | |
| Footer | 11px | 400 | Gray |

## 4. Layout

```
+--------------------------------------------------------------+
| Header (logo left | bell with badge, app-grid icon right)    |
+-----------+--------------------------------------------------+
| Sidebar   | Breadcrumb bar (white)                           |
| 212px     |--------------------------------------------------|
|           | Content panel (white, rounded)                   |
| Collapse  |  Tabs: Default | Geo Usage2 | My Activities      |
| Dashboard |  +------------------------+ +-----------------+  |
| App Portal|  | My Applications (card) | | My Reports      |  |
|           |  | table, 5 rows          | | table, 3 rows   |  |
|           |  | pagination             | | pagination      |  |
| Help      |  +------------------------+ +-----------------+  |
| Announce  |                                      (FAB)       |
| User card |                                                  |
+-----------+--------------------------------------------------+
| Footer: (c) 2026 PeMVISH LLC; Version 3.10.2 | Privacy | Support |
+--------------------------------------------------------------+
```

- **Two-column card grid** with equal widths and a 20px gap.
- Cards have a 20px inner horizontal padding; the card title sits in its own 54px header band.
- Large empty space below the cards; the panel stretches to fill the viewport.
- The Applications card scrolls horizontally (visible scrollbar at its bottom); columns are clipped ("To be verifie...").

## 5. Components

### 5.1 Top Bar
- Height about 52px, background `page-background`.
- Left: diamond logo mark (navy top, red bottom) + wordmark "NuVision | PeMVISH", with a thin vertical divider between the two names.
- Right: bell icon (navy) with a pink circular badge showing the count (2), and a 3x3 dot "app launcher" grid icon.

### 5.2 Sidebar Navigation
- Items: Collapse (double-chevron icon), Dashboard, Application Portal. Bottom group: Help center, Announcements.
- Item height about 36px, icon 20px at the left, 12px gap to label.
- **Active item:** full-width rounded (8px) fill in `nav-active-fill` with white icon and label.
- **Default item:** transparent background, dark text, no hover state visible.
- A thin divider separates the main items from the bottom group.
- **Profile card:** rounded 12px, `user-card-fill`, circular avatar (about 36px) at left, name in bold ("Karthik, Abhay D"), role in small gray ("Admin"), right chevron.

### 5.3 Breadcrumb
- "User Management > Dashboard". Parent in semi-bold dark gray, separator `>` in light gray, current page in `breadcrumb-active`.
- Sits on a white bar with a thin bottom border.

### 5.4 Tabs
- Three tabs: Default (active), Geo Usage2, My Activities.
- Active tab: white rounded pill with soft shadow and bold dark text.
- Inactive tabs: no background, gray regular text, about 32px horizontal spacing.
- The tab group sits on a very light tinted strip.

### 5.5 Data Card with Table
| Part | Spec |
|---|---|
| Container | White, 1px `border`, 12px radius, soft shadow |
| Title band | 54px, bold 15px title, bottom border |
| Header row | `surface-subtle`, uppercase gray 12px bold labels, 47px high, top and bottom borders |
| Body rows | 43px, 1px `border` dividers, text vertically centered |
| First column | Bold blue link (`link`) |
| Other columns | Regular text, `text-primary` |
| Empty cells | Left blank (no placeholder dash) |
| Pagination bar | Top border, right-aligned: "Items per page: 5", "1 - 5 of 5", then prev/next chevrons in light gray (disabled look) |

Columns shown: **My Applications** - NAME, APPLICATION STATUS, ARB STATUS, QUALITY (clipped). **My Reports** - NAME.

Sample rows: 112 / Archived (Read only); Appfire / Archived (Read only); Test-21 / Retired / Gap Fulfilment / Approved; 006 / In Production; Test - 1 / In Production. Reports: Application Storage Cost (Custom), All Applications, Report 1.

### 5.6 Floating Action Button
- Dark circle (about 36px) at the lower right of the content panel, overlapping the corner of the Reports card, with a white chat/assist glyph.

### 5.7 Footer
- Left-aligned, 11px gray: "NuVision (c) 2026 PeMVISH LLC; All rights reserved. Version: 3.10.2", followed by "Privacy" and "Support" text links.

## 6. Do and Don't

**Do**
- Keep the shell tinted and the content panel white for clear separation.
- Use bold blue only for clickable record names and the active nav item.
- Keep table headers uppercase, small and gray.
- Keep cards equal width with a consistent 20px gap.

**Don't**
- Add heavy shadows or dark borders to cards.
- Use more than one saturated accent color in the content area.
- Clip meaningful cell text; prefer ellipsis with a tooltip, or wrap.
- Rely on color alone to indicate links; consider adding an underline on hover and focus.

## 7. Observations and Issues

- Text in the QUALITY column is cut off ("To be verifie..."); the card needs a horizontal scroll, which is easy to miss.
- Active nav contrast (white on light blue) is below AA.
- The Reports card has two empty rows, so the card looks unfinished at 3 of 5 rows.
- The disabled pagination chevrons are very faint.

## 8. Open Questions (not determinable from the screenshot)

- Exact font and token values (estimated by eye).
- Hover, focus, pressed and disabled states for nav items, tabs and rows.
- Responsive behavior, including the collapsed sidebar.
- Dark theme.
- Content of the other tabs (Geo Usage2, My Activities).
