---
name: Min Arbejdsplads
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#4a5f7f'
  primary: '#001229'
  on-primary: '#ffffff'
  primary-container: '#0f2744'
  on-primary-container: '#798fb1'
  inverse-primary: '#b2c8ed'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000d38'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f66'
  on-tertiary-container: '#7189de'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#b2c8ed'
  on-primary-fixed: '#021c39'
  on-primary-fixed-variant: '#324866'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#264191'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system embodies a modern, restrained Nordic B2B aesthetic tailored specifically for Android enterprise environments. Rooted in Scandinavian functionalism, the visual tone prioritizes extreme clarity, quiet authority, and friction-free operational efficiency. The user interface creates a calm, structured workplace atmosphere that respects the worker's time and cognitive load.

The overarching design philosophy leans into **Minimalism blended with Soft Surface Tactility**. It balances structural precision with generous touch surfaces, subtle tonal framing, and purposeful Emerald accents. Rather than visually demanding visual effects, it establishes structure through deliberate whitespace, crisp typographic cadence, and tactile cards that feel organic to modern edge-to-edge Android display standards.

## Colors
The color architecture reinforces trust, operational clarity, and high-contrast legibility across bright Scandinavian daylight and indoor office settings.

- **Primary (`#0F2744` / Deep Nordic Navy):** The structural anchor. Applied to top app bars, primary brand touchpoints, critical headers, and primary interaction surfaces.
- **Secondary (`#10B981` / Emerald Green):** Reserved exclusively for positive states, check-ins, approvals, active shift confirmations, and key success indicators. Supported by `#059669` for pressed and accessible text states.
- **Tertiary (`#1E3A8A` / Cobalt Slate Navy):** Used for interactive secondary elements, focused indicators, and subtle informational highlights.
- **Neutral (`#64748B` / Slate):** Guides secondary metadata, non-active icon fills, and subtle border strokes.

### Background & Surface Hierarchy
- **Canvas Base:** `#F8FAFC` (Off-white Slate canvas ensuring zero eye fatigue).
- **Surface Elevation 1 (Cards, sheets):** `#FFFFFF` (Pure white).
- **Surface Elevation 2 (Groupings, nested lists):** `#F1F5F9` (Muted container background).
- **Text High-Contrast:** `#0B192C` on light surfaces; `#FFFFFF` on navy surfaces.

## Typography
Typography uses **Inter** systematically across all roles to achieve neutral, ultra-legible communication under Danish orthographic requirements (handling æ, ø, å cleanly at all scales).

- Display and headline levels feature tight tracking (`-0.01em` to `-0.02em`) to maintain an authoritative architectural presence on mobile viewports.
- Body copy relies on generous line heights (`1.4` to `1.5`) to maximize readability when reviewing shift schedules, work logs, or employment notices.
- Label roles emphasize medium and semibold weights with slight positive letter spacing to keep operational metadata, timestamps, and status chips immediately scan-friendly on smaller Android screens.

## Layout & Spacing
The layout adheres to an Android-first fluid 4-column system on compact screens (under 600dp), adapting smoothly to 8 columns on tablets (600dp–840dp) and 12 columns on large foldables or desktop displays.

### Grid Rhythm & Screen Anchors
- **Safe Area Insets:** Content respects the Android status bar (`top: 24dp–48dp`) and system navigation pill (`bottom: 16dp–32dp` dynamic inset).
- **Margins & Gutters:** Base mobile layout enforces a strict `1rem` (16px) margin and gutter. On tablet surfaces, margins expand to `1.5rem` (24px).
- **Vertical Rhythm:** Multiples of 8px govern element separation. `space-xs` (4px) and `space-sm` (8px) handle micro-element alignments inside list items; `space-md` (16px) and `space-lg` (24px) structure inter-component card stacks.

## Elevation & Depth
This design system avoids heavy skeuomorphic drops and harsh elevation tiers in favor of a clean, ambient-diffused depth model combined with subtle containment strokes.

- **Level 0 (Flat / Canvas):** `#F8FAFC`, zero shadow.
- **Level 1 (Default Cards & Lists):** Pure white `#FFFFFF` surface accompanied by a hairline border: `1px solid rgba(15, 39, 68, 0.06)` and an ambient, low-contrast shadow: `0px 2px 8px -2px rgba(15, 39, 68, 0.04)`.
- **Level 2 (Floating Action Buttons, Active Bottom Sheets, Popovers):** Elevated with `0px 10px 24px -4px rgba(15, 39, 68, 0.08)`, retaining crisp surface boundaries.
- **Status Bar & Android Top Bar:** Uses a subtle backdrop blur (`backdrop-filter: blur(12px)`) with `rgba(248, 250, 252, 0.85)` surface overlay when scrolling beneath.

## Shapes
The shape system prioritizes modern Android ergonomics using organic, soft radii that feel comfortable to thumb-driven navigation.

- Interactive buttons and inputs use `rounded-lg` (16px / 1rem) for an approachable, tactile perimeter.
- Cards, schedule cards, and operational modules use `rounded-xl` to `rounded-2xl` (16px to 24px), providing clear visual containment for dense enterprise data.
- Small indicators, status chips, and avatar containers utilize pill and circle shapes (`rounded-full`) to contrast against rectangular card geometry.

## Components

### Buttons
- **Touch Target:** Mandatory minimum height of `48px` (ideally `52px` on phone viewports) to ensure Android accessibility compliance.
- **Primary Button:** Navy `#0F2744` background with pure white text and an inner corner radius of `16px`. Active press state darkens to `#0A1C30` with subtle scale-down (`scale(0.98)`).
- **Success / Action Button (e.g., 'Godkend', 'Tjek ind'):** Emerald `#10B981` background with white text, providing distinct prominence for operational commitments.
- **Secondary Button:** Surface `#FFFFFF` with a `1px` border of `rgba(15, 39, 68, 0.12)` and navy `#0F2744` text.

### Chips & Badges
- **Status Chips (Vagt, Sygemeldt, Godkendt):** Height `28px` to `32px`, pill radius (`rounded-full`), `space-xs` vertical and `space-sm` horizontal padding.
- **Tone Pairing:** Emerald chips utilize `#ECFDF5` background with `#065F46` label. Pending states use `#FFFBEB` with `#92400E`. Muted category chips rely on `#F1F5F9` with `#475569`.

### Cards & Operational Tiles
- Rendered on `#FFFFFF` with `rounded-2xl` (20px) corners, `space-md` (16px) internal padding, and hairline slate borders.
- Cards group critical workforce actions into clear headers, tabular time/shift breakdowns, and bottom trailing status actions.

### Lists & Shift Items
- Minimalist separator style (`1px solid #F1F5F9`) with `56px` minimum row height.
- Left-aligned primary avatar or shift glyph, followed by vertical label stack (Shift title in `label-lg`, hours in `body-sm` neutral), with trailing context (chevron or status chip).

### Checkboxes, Radio Buttons & Switches
- **Form Controls:** Emerald `#10B981` active fill states with white icon indicators.
- **Android Switches:** Track in `#E2E8F0` with white thumb when inactive; thumb shifts over an Emerald track when toggled active. Minimum 48px touch bounding box.

### Input Fields
- Height `52px` with `16px` corner radius. Crisp `#FFFFFF` background with `1px solid rgba(15, 39, 68, 0.12)`.
- Focused state applies a `2px` border in `#1E3A8A` with zero harsh glowing rings. Placeholder text in `#94A3B8`.

### Android Bottom Navigation Bar
- Height `64px` plus safe-area-inset bottom padding.
- `#FFFFFF` surface with hairline divider (`1px solid rgba(15, 39, 68, 0.05)`).
- 4 to 5 key destinations (e.g., *Oversigt*, *Vagter*, *Stempelur*, *Beskeder*, *Profil*). Active item renders in `#0F2744` with a subtle `#F1F5F9` pill highlight; inactive items render in `#64748B`.