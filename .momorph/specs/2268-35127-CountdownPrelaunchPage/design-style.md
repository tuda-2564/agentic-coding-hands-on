# Design Style: Countdown — Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: [Open in Figma](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2268:35127)
**Extracted At**: 2026-03-13

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background |
| --color-digit-card-border | #FFEA9E | 100% | Digit card border (gold) |
| --color-digit-card-bg-start | #FFFFFF | 100% | Digit card gradient start |
| --color-digit-card-bg-end | #FFFFFF | 10% | Digit card gradient end |
| --color-text-white | #FFFFFF | 100% | Title, digits, labels |
| --color-gradient-start | #00101A | 100% | Bottom gradient overlay start |
| --color-gradient-mid | #00121D | 46% | Gradient overlay mid |
| --color-gradient-end | #001320 | 0% | Gradient overlay end |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-title | Montserrat | 36px | 700 | 48px | 0px |
| --text-digit | Digital Numbers | 73.73px | 400 | auto | 0% |
| --text-label | Montserrat | 36px | 700 | 48px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-px | 144px | Page horizontal padding (desktop) |
| --spacing-page-py | 96px | Page vertical padding (desktop) |
| --spacing-title-to-timer | 24px | Gap between title and countdown timer |
| --spacing-unit-gap | 60px | Gap between countdown units (DAYS, HOURS, MINUTES) |
| --spacing-card-gap | 21px | Gap between two digit cards within a unit |
| --spacing-cards-to-label | 21px | Gap between digit cards and label text |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-digit-card | 12px | Digit card border-radius |
| --border-digit-card | 0.75px solid rgba(255,234,158,0.5) | Digit card border (gold at 50% opacity) |

### Shadows & Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --blur-digit-card | blur(24.96px) | Digit card backdrop-filter (glass-morphism) |
| --opacity-digit-card | 0.5 | Digit card background opacity — apply via semi-transparent background, NOT container `opacity` property, to keep digit text fully opaque |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 100vw | Full viewport |
| height | 100vh | Full viewport (1077px in Figma) |
| background | #00101A | Dark navy |
| position | relative | For absolute positioned layers |

### Background Image Layer

| Property | Value | Notes |
|----------|-------|-------|
| position | absolute | Full bleed |
| inset | 0 | Covers entire page |
| background | url(bg-image) | Artistic colorful pattern |
| background-size | cover | Fill container |
| background-position | center | Centered |
| z-index | 0 | Behind content |

### Gradient Overlay

| Property | Value | Notes |
|----------|-------|-------|
| position | absolute | Full bleed |
| inset | 0 | Covers entire page |
| background | linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%) | Bottom-left to upper-right fade |
| z-index | 1 | Above BG, below content |

### Content Section ("Bìa")

| Property | Value | Notes |
|----------|-------|-------|
| width | 100% | Full width |
| min-height | 100vh | Fullscreen (456px is inner countdown content height in Figma) |
| padding | 96px 144px | Generous padding |
| display | flex | Column layout |
| flex-direction | column | Vertical stack |
| align-items | center | Horizontally centered |
| justify-content | center | Vertically centered |
| z-index | 2 | Above overlays |

### Countdown Container

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Column layout |
| flex-direction | column | Title above timer |
| align-items | center | Centered |
| gap | 24px | Between title and timer |

### Timer Row

| Property | Value | Notes |
|----------|-------|-------|
| width | 644px | Timer container width |
| display | flex | Horizontal layout |
| flex-direction | row | Units side by side |
| align-items | center | Vertically centered |
| gap | 60px | Between DAYS/HOURS/MINUTES |

### Countdown Unit (DAYS/HOURS/MINUTES)

| Property | Value | Notes |
|----------|-------|-------|
| width | 175px | Unit width |
| height | 192px | Unit height |
| display | flex | Column layout |
| flex-direction | column | Cards above label |
| align-items | center | Centered under digit pair |
| justify-content | center | Vertically centered |
| gap | 21px (internal) | Between card row and label |

### Digit Card Pair Row

| Property | Value | Notes |
|----------|-------|-------|
| width | 175px | Row width |
| height | 123px | Row height |
| display | flex | Horizontal layout |
| flex-direction | row | Two cards side by side |
| align-items | center | Vertically centered |
| gap | 21px | Between first and second digit card |

### Digit Card (Single)

| Property | Value | Notes |
|----------|-------|-------|
| width | 76.8px (≈77px) | Card width |
| height | 122.88px (≈123px) | Card height |
| border | 0.75px solid rgba(255,234,158,0.5) | Gold border at 50% opacity |
| border-radius | 12px | Rounded corners |
| background | linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%) | Semi-transparent white fade (opacity baked in, NOT on container) |
| backdrop-filter | blur(24.96px) | Glass-morphism effect |
| display | flex | Center content |
| align-items | center | Vertically centered |
| justify-content | center | Horizontally centered |

### Layout Structure (ASCII)

```
Page (100vw × 100vh, bg: #00101A, relative)
┌─────────────────────────────────────────────────────────────────────┐
│  BG Image (absolute, inset-0, z-0, object-cover)                    │
│  Gradient Overlay (absolute, inset-0, z-1, linear-gradient 18deg)   │
│                                                                     │
│  Content Section (z-2, flex col, center, p-96px-144px)              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Title: "Sự kiện sẽ bắt đầu sau"                            │    │
│  │  (Montserrat 700, 36px/48px, white, text-center)             │    │
│  │                                                               │    │
│  │  gap-24px                                                     │    │
│  │                                                               │    │
│  │  Timer Row (flex row, gap-60px, w-644px, centered)            │    │
│  │  ┌───────────┐   ┌───────────┐   ┌───────────┐              │    │
│  │  │ 1_Days    │   │ 2_Hours   │   │ 3_Minutes │              │    │
│  │  │ (175×192) │   │ (175×192) │   │ (175×192) │              │    │
│  │  │           │   │           │   │           │              │    │
│  │  │ ┌──┐ ┌──┐│   │ ┌──┐ ┌──┐│   │ ┌──┐ ┌──┐│              │    │
│  │  │ │00│ │00││   │ │05│ │05││   │ │20│ │20││              │    │
│  │  │ └──┘ └──┘│   │ └──┘ └──┘│   │ └──┘ └──┘│              │    │
│  │  │  77×123   │   │  77×123   │   │  77×123   │              │    │
│  │  │  gap-21   │   │  gap-21   │   │  gap-21   │              │    │
│  │  │           │   │           │   │           │              │    │
│  │  │  DAYS     │   │  HOURS    │   │  MINUTES  │              │    │
│  │  │  (36px)   │   │  (36px)   │   │  (36px)   │              │    │
│  │  └───────────┘   └───────────┘   └───────────┘              │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Title Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35137` | - |
| width | 100% | `w-full` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 36px | `text-4xl` (closest: 36px) |
| font-weight | 700 | `font-bold` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | default |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |

---

### Digit Card (Glass-morphism)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I2268:35141;186:2616` (instance) | - |
| **Component ID** | `186:2619` | - |
| width | 76.8px (~77px) | `w-[77px]` |
| height | 122.88px (~123px) | `h-[123px]` |
| border | 0.75px solid rgba(255,234,158,0.5) | `border-[0.75px] border-[rgba(255,234,158,0.5)]` |
| border-radius | 12px | `rounded-xl` |
| background | linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%) | Semi-transparent gradient (opacity baked into bg, NOT on container) |
| backdrop-filter | blur(24.96px) | `backdrop-blur-[25px]` |
| display | flex | `flex items-center justify-center` |

---

### Digit Text (LED Number)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I2268:35141;186:2617` (instance) | - |
| font-family | Digital Numbers | `font-digital` (custom font needed) |
| font-size | 73.73px | `text-[73.73px]` |
| font-weight | 400 | `font-normal` |
| color | #FFFFFF | `text-white` |
| text-align | left | default |

---

### Unit Label (DAYS / HOURS / MINUTES)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35143` (DAYS), `2268:35148` (HOURS), `2268:35153` (MINUTES) | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 36px | `text-4xl` |
| font-weight | 700 | `font-bold` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | default |
| color | #FFFFFF | `text-white` |
| text-transform | uppercase | `uppercase` |

---

## Component Hierarchy with Styles

```
PrelaunchPage (relative, w-full, min-h-screen, bg-[#00101A], overflow-hidden)
├── BGImage (absolute, inset-0, z-0, object-cover)
├── GradientOverlay (absolute, inset-0, z-[1], bg-gradient 18deg)
│
└── ContentSection (relative, z-[2], flex, flex-col, items-center, justify-center, min-h-screen, px-[144px] py-[96px])
    │
    └── CountdownContainer (flex, flex-col, items-center, gap-6)
        │
        ├── Title (font-bold, text-4xl, leading-[48px], text-white, text-center)
        │   "Sự kiện sẽ bắt đầu sau"
        │
        └── TimerRow (flex, flex-row, items-center, gap-[60px])
            │
            ├── CountdownUnit [DAYS] (flex, flex-col, items-center, gap-[21px], w-[175px])
            │   ├── DigitPairRow (flex, flex-row, items-center, gap-[21px])
            │   │   ├── DigitCard (w-[77px], h-[123px], rounded-xl, border-[0.75px]-gold-50%, glass-gradient-bg, backdrop-blur-[25px])
            │   │   │   └── DigitText (font-digital, text-[73.73px], text-white)
            │   │   └── DigitCard (same)
            │   │       └── DigitText
            │   └── UnitLabel (font-bold, text-4xl, leading-[48px], text-white, uppercase)
            │       "DAYS"
            │
            ├── CountdownUnit [HOURS] (same structure)
            │   └── UnitLabel "HOURS"
            │
            └── CountdownUnit [MINUTES] (same structure)
                └── UnitLabel "MINUTES"
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Content padding | px: 24px, py: 48px |
| Title | font-size: 20px, leading: 28px |
| Timer Row | flex-wrap or flex-col, gap: 24px |
| Digit Card | w: 48px, h: 77px |
| Digit Text | font-size: 46px |
| Unit Label | font-size: 16px, leading: 24px |
| Unit gap | 16px |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Content padding | px: 48px, py: 64px |
| Title | font-size: 28px |
| Digit Card | w: 60px, h: 96px |
| Digit Text | font-size: 57px |
| Unit Label | font-size: 24px |
| Unit gap | 32px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| All | Use Figma values (1512px design) |

---

## Icon Specifications

No icons in this design.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Digit text | opacity, transform | 300ms | ease-in-out | Number change (countdown tick) |
| Page | opacity | 500ms | ease-out | Page load (fade in) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Class | React Component |
|----------------|---------------|----------------|-----------------|
| Page Container | `2268:35127` | `relative w-full min-h-screen bg-[#00101A] overflow-hidden` | `<PrelaunchPage />` |
| BG Image | `2268:35129` | `absolute inset-0 z-0 object-cover` | `<Image>` (next/image) or CSS bg |
| Gradient Overlay | `2268:35130` | `absolute inset-0 z-[1]` + CSS gradient | `<div>` with inline gradient |
| Content Section | `2268:35131` | `relative z-[2] flex flex-col items-center justify-center min-h-screen` | `<main>` |
| Title | `2268:35137` | `font-bold text-4xl leading-[48px] text-white text-center` | `<h1>` |
| Timer Row | `2268:35138` | `flex flex-row items-center gap-[60px]` | `<div>` |
| Countdown Unit | `2268:35139` etc. | `flex flex-col items-center gap-[21px] w-[175px]` | `<CountdownUnit />` |
| Digit Pair Row | `2268:35140` etc. | `flex flex-row items-center gap-[21px]` | `<div>` |
| Digit Card | `I2268:35141;186:2616` | `w-[77px] h-[123px] rounded-xl border-[0.75px] border-[rgba(255,234,158,0.5)] backdrop-blur-[25px]` | `<div>` with semi-transparent gradient bg |
| Digit Text | `I2268:35141;186:2617` | `font-digital text-[73.73px] text-white` | `<span>` |
| Unit Label | `2268:35143` etc. | `font-bold text-4xl leading-[48px] text-white uppercase` | `<span>` |

---

## Notes

- **Custom font required**: "Digital Numbers" font must be loaded for LED-style digit display. If unavailable, use a monospace alternative with tabular-nums.
- The BG image is tagged `MM_MEDIA_BG` in Figma — download via `get_media_files` tool.
- Glass-morphism effect: semi-transparent gradient background (opacity baked into rgba values) + `backdrop-blur-[25px]` + gold border at 50% opacity. Do NOT use `opacity-50` on the container — this would make digit text semi-transparent too. Instead, bake the 50% opacity into the background gradient and border color rgba values.
- This page replaces the normal homepage when the event has not started yet (prelaunch state).
- No header or footer visible in the design — this is a standalone fullscreen countdown.
- The gradient overlay direction is 18deg (nearly bottom-to-top with slight rightward tilt).
