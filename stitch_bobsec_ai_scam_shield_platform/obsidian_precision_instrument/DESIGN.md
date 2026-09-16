---
name: Obsidian Precision Instrument
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1b1c1d'
  surface-container: '#1f2021'
  surface-container-high: '#292a2b'
  surface-container-highest: '#343536'
  on-surface: '#e3e2e3'
  on-surface-variant: '#bdc8cb'
  inverse-surface: '#e3e2e3'
  inverse-on-surface: '#303032'
  outline: '#879395'
  outline-variant: '#3e494b'
  surface-tint: '#74d4e8'
  primary: '#effcff'
  on-primary: '#00363e'
  primary-container: '#8cebff'
  on-primary-container: '#006b7a'
  inverse-primary: '#006877'
  secondary: '#c3c7cd'
  on-secondary: '#2c3136'
  secondary-container: '#454a4f'
  on-secondary-container: '#b4b9bf'
  tertiary: '#eaffef'
  on-tertiary: '#003822'
  tertiary-container: '#6cf6b4'
  on-tertiary-container: '#006f48'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a3eeff'
  primary-fixed-dim: '#74d4e8'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#dfe3e9'
  secondary-fixed-dim: '#c3c7cd'
  on-secondary-fixed: '#171c20'
  on-secondary-fixed-variant: '#43474c'
  tertiary-fixed: '#72fbb9'
  tertiary-fixed-dim: '#52de9e'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#005234'
  background: '#121315'
  on-background: '#e3e2e3'
  surface-variant: '#343536'
typography:
  monumental-numeral:
    fontFamily: Geist
    fontSize: 96px
    fontWeight: '300'
    lineHeight: 96px
    letterSpacing: -0.04em
  monumental-numeral-mobile:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '300'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-verdict:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '500'
    lineHeight: 68px
    letterSpacing: -0.035em
  display-verdict-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 60px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-instrument:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
  label-tabular:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.5rem
  margin-desktop: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system expresses high-assurance luxury, technical supremacy, and absolute defensive permanence. Rejecting the ubiquitous deep-navy SaaS tropes and playful tech graphics, the aesthetic references Swiss haute horlogerie complications, tactical flight instrumentation, and raw monolithic mineral physics.

The experience is defined by:
- **Materiality over Flatness**: Tactile smoked glass plates, physical specular refraction, and titanium edge chamfers.
- **Cinematic Authority**: Unflinching, monumental data readouts flanked by vast voids of obsidian space.
- **Micro-Mechanical Precision**: Every line, border highlight, and luminous indicator functions with the tension and accuracy of an aerospace optical system.

Interfaces should evoke a silent, hermetically sealed operational suite: pristine, unhurried, and definitively sovereign.

## Colors

The palette operates under an uncompromising ratio rule: **80% Obsidian/Graphite/Titanium**, **15% White/Platinum Typography**, and **5% Chromatic Signal Light**. Navy blues and consumer-grade saturated hues are strictly prohibited.

### Tonal Foundations (80%)
- **Absolute Carbon**: `#050607` (Deepest canvas backing)
- **Obsidian Plate**: `#070809` (Base application surface)
- **Substrate Slate**: `#090B0D` (Active panel core)
- **Titanium Edge**: `rgba(255, 255, 255, 0.09)` (Precision boundary stroke)
- **Titanium Specular Highlight**: `rgba(255, 255, 255, 0.16)` (Top edge directional optical incidence)

### Readout & Typographic Silver (15%)
- **Pure Platinum**: `#FFFFFF` (Verdicts, dynamic values, primary metrics)
- **Specular Silver**: `#E5E7EB` (Titles, prominent parameters)
- **Machined Graphite**: `#9CA3AF` (Secondary labels, structural notation)
- **Quenched Ash**: `#4B5563` (Grid scales, unit tags, inactive states)

### Chromatic Signal Accents (5%)
- **Precision Focus Cyan**: `#8CEBFF` (Strictly reserved for active cursor nodes, reticles, laser read lines, and confirmed selection states)
- **Mineral Emerald**: `#35C88A` (Secure perimeter, baseline nominal)
- **Metallic Amber**: `#E8AA42` (Elevated telemetry variance, warning state)
- **Deep Signal Vermilion**: `#F06063` (Breach, critical fault, high-risk status)

## Typography

Typography delivers editorial grandeur juxtaposed against surgical instruments. 

- **Scale & Impact**: Headlines and primary verdicts act as massive architectural anchors rather than simple page headers. All massive numerals must render with CSS font feature settings enabled: `'tnum' on, 'zero' on`.
- **Negative Tracking**: Display and headline styles deploy tight negative kerning (`-0.02em` to `-0.04em`) to consolidate the obsidian density.
- **Instrument Labels**: Micro labels, telemetry keys, and hardware indicators are rendered in sharp, uppercase tracking (`0.12em`), creating the calibrated presence of engraved titanium components.

## Layout & Spacing

The layout is built around deliberate negative space and structural suspension. Rather than cramming data into dense, tiled card dashboards, this design system treats views as wide obsidian navigation canvases hosting floating smoked glass apparatuses.

- **Desktop Structure**: Margins expand up to `56px` (`3.5rem`), creating an aura of luxury and unconstrained operational scale. Central instruments breathe inside wide structural spans (typically 8 or 12 columns across an asymmetric grid).
- **Rhythm & Distance**: Data clusters use compact internal token spacing (`space-xs` through `space-md`), while distinct functional modules are segregated across expansive intervals (`space-xl` or greater) to preserve cinematic legibility.
- **Responsive Transition**: On mobile devices, margins compress to `24px` (`1.5rem`), glass slabs extend across full viewport width, and instrument clusters switch to stacked vertical assemblies with 1px border dividers.

## Elevation & Depth

Visual hierarchy rejects fuzzy, diffused dropped drop shadows in favor of physical optical refraction, ambient occlusion, and directional specular illumination.

- **Base Canvas**: Carbon `#050607` background, devoid of light reflection.
- **Floating Smoked Glass Slabs**: `rgba(16, 18, 21, 0.64)` background with `32px` to `48px` backdrop-filter blur. Boundaries are articulated using a dual-stroke system: a full boundary of `1px solid rgba(255, 255, 255, 0.09)` paired with an inner top-border specular highlight of `1px solid rgba(255, 255, 255, 0.16)`.
- **Refractive Overlays & Flyouts**: Suspended contextual surfaces employ `rgba(20, 22, 25, 0.72)` backed by `48px` to `56px` blur, bordered by a faint titanium hairline and casting an ultra-deep, directional ambient wash: `0 32px 64px -16px rgba(0, 0, 0, 0.85)`.
- **Optical Edge Lighting**: Active states, hovered panels, or critical incidents illuminate the structural perimeter: localized glow radiates inward using an ultra-subtle box-shadow inset (`inset 0 0 16px rgba(140, 235, 255, 0.08)` for primary nodes).

## Shapes

The geometric framework balances mechanical rigor with ergonomic luxury:
- **Major Glass Slabs & Telemetry Consoles**: `16px` to `20px` corner radii (`rounded-xl`), creating the silhouette of polished, heavy mineral crystal ingots.
- **Interactive Controls & Inputs**: Precisely machined `8px` corner radii (`rounded-md`), establishing an unambiguous distinction between structural architecture and touch targets.
- **Indicators & Status Points**: Absolute circles (`9999px`) for precision signal dots and mechanical dials. Sharp, industrial inner dividing lines use crisp `0px` joins.

## Components

### Buttons & Trigger Assemblies
- **Primary Precision Trigger**: Solid pure white or platinum body (`#FFFFFF`), dark carbon label (`#050607`), `8px` radius, `font-weight: 500`. Hover state triggers a subtle titanium glow outline: `0 0 0 1px #FFFFFF, 0 0 24px rgba(255, 255, 255, 0.2)`.
- **Instrument Secondary**: Smoked glass fill (`rgba(255, 255, 255, 0.04)`), `1px solid rgba(255, 255, 255, 0.12)` border, silver text (`#E5E7EB`). On hover: background shifts to `rgba(255, 255, 255, 0.08)`, border illuminates with specular platinum.
- **Destructive/Critical Action**: Smoked glass framed in a hairline vermilion border (`rgba(240, 96, 99, 0.4)`), vermilion label (`#F06063`).

### Signal Status Indicators (No Badges)
Standard SaaS pill badges with solid fills are eliminated. System status is communicated via luminous signal nodes:
- **Format**: `● VERDICT LABEL`
- **Indicator Construction**: A 6px solid circular core with an optical corona (`box-shadow: 0 0 8px currentColor`), accompanied by `label-instrument` uppercase text tracking (`#E5E7EB`).
- **Nominal State**: Emerald dot (`#35C88A`).
- **Elevated / Alert State**: Amber dot (`#E8AA42`).
- **High Risk / Breach State**: Signal vermilion dot (`#F06063`).

### Precision Input Fields
- **Container**: `rgba(9, 11, 13, 0.8)`, `8px` corner radius, `1px solid rgba(255, 255, 255, 0.1)`.
- **Typography**: `Inter` 14px text in platinum with `Geist` tabular input coordinates.
- **Focus Mechanism**: Zero thick borders; the bounding stroke transitions to `#8CEBFF` with an immediate `0 0 16px rgba(140, 235, 255, 0.15)` optical perimeter field.

### Selection Controls (Checkboxes & Radios)
- **Check Frame**: 16x16px titanium square with `3px` radius, bordered in `rgba(255, 255, 255, 0.2)`.
- **Active State**: Inset fills with `#050607` enclosed by a pure `#8CEBFF` reticle border and a 6x6px icy cyan diamond or dot marker at dead center.

### Chrono & Chronograph Complication Modules
- Segmented linear timelines and temporal dials mimicking luxury chronograph movements.
- Grid dividers are strictly `1px solid rgba(255, 255, 255, 0.06)`, running uninterrupted to establish structural cadence without clutter.