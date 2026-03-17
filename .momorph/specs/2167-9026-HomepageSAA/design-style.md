# Design Style: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**Figma Link**: [Open in Figma](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=2167-9026)
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-background | #00101A | 100% | Page background (dark navy) |
| --color-surface-dark | #001520 | 100% | Card/section backgrounds |
| --color-surface-card | #0A1E2B | 100% | Award card backgrounds |
| --color-gold-primary | #C8A96E | 100% | Gold accents, headings, borders |
| --color-gold-light | #E8D5A8 | 100% | Lighter gold for highlights |
| --color-gold-gradient-start | #F5D98E | 100% | Gradient start for hero text |
| --color-gold-gradient-end | #A67C3D | 100% | Gradient end for hero text |
| --color-text-primary | #FFFFFF | 100% | Body text, labels |
| --color-text-secondary | #B0BEC5 | 100% | Muted/secondary text |
| --color-text-accent | #C8A96E | 100% | Gold accent text |
| --color-countdown-bg | #1A2A3A | 90% | Countdown box background |
| --color-border-gold | #C8A96E | 30% | Gold subtle borders on cards |
| --color-kudos-orange | #FF6B35 | 100% | Kudos section accent |
| --color-header-bg | #00101A | 95% | Fixed header background (semi-transparent) |
| --color-footer-bg | #000D14 | 100% | Footer background |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-hero-title | Inter | 72px | 800 | 80px | 0.02em |
| --text-section-title | Inter | 36px | 700 | 44px | 0 |
| --text-card-title | Inter | 18px | 700 | 24px | 0 |
| --text-card-subtitle | Inter | 14px | 500 | 20px | 0 |
| --text-body | Inter | 16px | 400 | 24px | 0 |
| --text-body-sm | Inter | 14px | 400 | 20px | 0 |
| --text-countdown-number | Inter | 32px | 700 | 40px | 0 |
| --text-countdown-label | Inter | 12px | 400 | 16px | 0.05em |
| --text-nav | Inter | 14px | 500 | 20px | 0 |
| --text-caption | Inter | 12px | 400 | 16px | 0.01em |
| --text-price | Inter | 16px | 700 | 24px | 0 |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-xs | 4px | Tight gaps |
| --spacing-sm | 8px | Small gaps, card inner padding |
| --spacing-md | 16px | Default gaps |
| --spacing-lg | 24px | Section inner padding |
| --spacing-xl | 32px | Between sections |
| --spacing-2xl | 48px | Major section gaps |
| --spacing-3xl | 64px | Hero section padding |
| --spacing-section | 80px | Between major page sections |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-sm | 4px | Small elements, tags |
| --radius-md | 8px | Buttons, countdown boxes |
| --radius-lg | 12px | Cards |
| --radius-xl | 16px | Large cards, sections |
| --radius-full | 9999px | Avatar, pills |
| --border-width | 1px | Default border |
| --border-gold | 1px solid rgba(200, 169, 110, 0.3) | Gold card border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-card | 0 4px 24px rgba(0, 0, 0, 0.4) | Card elevation |
| --shadow-gold-glow | 0 0 20px rgba(200, 169, 110, 0.15) | Gold glow on hover |
| --shadow-hero | 0 8px 40px rgba(0, 0, 0, 0.6) | Hero section depth |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1,512px | Frame design width |
| max-width | 1512px | Desktop max (design width) |
| padding-x | 16px | Horizontal padding |
| padding-y | 0 | Sections handle own vertical spacing |
| background | #00101A | Dark navy background |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack of sections |
| gap | 0 | Sections have own spacing |
| overflow-x | hidden | Prevent horizontal scroll |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Homepage SAA (w: 1512px, h: 4480px, bg: #00101A)                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [FIXED] A1_Header (h: ~64px, bg: #00101A/95%)              │    │
│  │  Logo | Nav Links | Profile Avatar | Lang Selector           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  3.5_Keyvisual (background decorative graphics)             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Cover (background image layer)                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Bìa / Hero Section (py: 64px)                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  "ROOT FURTHER" (gold gradient, 72px, bold)          │    │    │
│  │  │  Countdown Timer: [DD] [HH] [MM] [SS]               │    │    │
│  │  │  Campaign description text                           │    │    │
│  │  │  Decorative campaign badges/images                   │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Campaign Info Section (px: 24px, py: 48px)                 │    │
│  │  Long description text about SAA 2025                       │    │
│  │  Campaign details and rules                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Hệ thống giải thưởng (Awards System) (py: 48px)           │    │
│  │  Section Title: gold text, centered                         │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │    │
│  │  │ TOP  │ │ TOP  │ │ TOP  │ │ TOP  │  Row 1 (4 cards)      │    │
│  │  │TALENT│ │TALENT│ │TALENT│ │TALENT│                        │    │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                       │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │    │
│  │  │ BEST │ │ BEST │ │ BEST │ │      │  Row 2 (4 cards)      │    │
│  │  │MANGR │ │NEWCMR│ │      │ │ MVP  │                        │    │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Sun* Kudos Section (py: 48px)                              │    │
│  │  "#KUDOS" branding with orange/gold accents                 │    │
│  │  Kudos live board / interaction area                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  7_Footer (h: ~200px, bg: #000D14)                          │    │
│  │  Footer links, copyright, social icons                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A1_Header (Fixed)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | Instance (A1_Header) | - |
| position | fixed | `position: fixed; top: 0; left: 0; right: 0;` |
| height | ~64px | `height: 64px` |
| padding | 0 24px | `padding: 0 24px` |
| background | #00101A / 95% | `background-color: rgba(0, 16, 26, 0.95)` |
| backdrop-filter | blur(8px) | `backdrop-filter: blur(8px)` |
| display | flex | `display: flex; align-items: center; justify-content: space-between;` |
| z-index | 50 | `z-index: 50` |
| border-bottom | 1px solid rgba(200, 169, 110, 0.1) | `border-bottom: 1px solid rgba(200, 169, 110, 0.1)` |

**Children:**
- Logo (left-aligned)
- Navigation links (center/right) - text: 14px, 500, #FFFFFF
- Profile avatar (right) - circular, 32px
- Language selector (right)

**States:**
| State | Changes |
|-------|---------|
| Default | Semi-transparent background |
| Scrolled | background: rgba(0, 16, 26, 1.0), box-shadow: 0 2px 8px rgba(0,0,0,0.3) |

**Nav link states:**
| State | Changes |
|-------|---------|
| Default | color: #FFFFFF, opacity: 0.8 |
| Hover | color: #C8A96E, opacity: 1 |
| Focus | outline: 2px solid #C8A96E, outline-offset: 2px, border-radius: 4px |
| Active | color: #C8A96E, opacity: 1, font-weight: 600 (current page) |

**Profile avatar states:**
| State | Changes |
|-------|---------|
| Default | border: 2px solid transparent |
| Hover | border: 2px solid #C8A96E |
| Focus | outline: 2px solid #C8A96E, outline-offset: 2px |

---

### Global Focus Style

All interactive elements MUST have a visible focus indicator:

| Property | Value | CSS |
|----------|-------|-----|
| outline | 2px solid #C8A96E | `outline: 2px solid var(--color-gold-primary)` |
| outline-offset | 2px | `outline-offset: 2px` |
| border-radius | inherit | matches element's border-radius |

**Touch targets**: All clickable elements MUST have a minimum hit area of 44×44px (WCAG 2.5.5 / Constitution Principle IV). For small text links, use padding to expand the target area.

---

### Hero Section (Bìa)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | Auto layout (Bìa) | - |
| width | 100% | `width: 100%` |
| padding | 64px 24px | `padding: 64px 24px` |
| text-align | center | `text-align: center` |
| display | flex | `display: flex; flex-direction: column; align-items: center;` |
| gap | 24px | `gap: 24px` |

#### "ROOT FURTHER" Title

| Property | Value | CSS |
|----------|-------|-----|
| font-size | 72px | `font-size: 72px` |
| font-weight | 800 | `font-weight: 800` |
| background | linear-gradient(180deg, #F5D98E, #A67C3D) | `background: linear-gradient(180deg, #F5D98E 0%, #A67C3D 100%); -webkit-background-clip: text; color: transparent;` |
| text-transform | uppercase | `text-transform: uppercase` |
| letter-spacing | 0.02em | `letter-spacing: 0.02em` |

#### Countdown Timer

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex; gap: 16px; align-items: center;` |
| box (each) | 80px × 80px | `width: 80px; height: 80px;` |
| background | #1A2A3A / 90% | `background: rgba(26, 42, 58, 0.9)` |
| border-radius | 8px | `border-radius: 8px` |
| border | 1px solid rgba(200, 169, 110, 0.3) | `border: 1px solid rgba(200, 169, 110, 0.3)` |
| number font | 32px, 700, #FFFFFF | `font-size: 32px; font-weight: 700; color: #FFFFFF` |
| label font | 12px, 400, #B0BEC5 | `font-size: 12px; font-weight: 400; color: #B0BEC5` |

---

### Award Card (Hệ thống giải thưởng)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | Various | - |
| width | ~344px (4-col grid) | `width: calc(25% - 18px)` |
| height | auto (~300px) | `height: auto` |
| padding | 16px | `padding: 16px` |
| background | #0A1E2B | `background-color: #0A1E2B` |
| border | 1px solid rgba(200, 169, 110, 0.3) | `border: 1px solid rgba(200, 169, 110, 0.3)` |
| border-radius | 12px | `border-radius: 12px` |
| overflow | hidden | `overflow: hidden` |

**Children:**
- Award image/badge (top, centered)
- Award title: 18px, 700, #C8A96E
- Award subtitle/description: 14px, 400, #B0BEC5
- Prize value: 16px, 700, #FFFFFF (e.g., "7,000,000 VND")

**Grid layout:**
| Property | Value | CSS |
|----------|-------|-----|
| display | grid | `display: grid` |
| grid-template-columns | repeat(4, 1fr) | `grid-template-columns: repeat(4, 1fr)` |
| gap | 24px | `gap: 24px` |
| padding | 0 24px | `padding: 0 24px` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: rgba(200,169,110,0.3) |
| Hover | border: rgba(200,169,110,0.6), box-shadow: --shadow-gold-glow, transform: translateY(-2px) |
| Focus | outline: 2px solid #C8A96E, outline-offset: 2px |
| Active (click) | transform: translateY(0), border: rgba(200,169,110,0.8) |

**Skeleton loading state:**
| Property | Value | CSS |
|----------|-------|-----|
| background | linear-gradient(90deg, #0A1E2B 25%, #132D3F 50%, #0A1E2B 75%) | Shimmer animation |
| animation | shimmer 1.5s infinite | `@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }` |
| border-radius | 12px | same as card |
| height | 300px | approximate card height |

---

### Sun* Kudos Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | Inside Scrolls group | - |
| width | 100% | `width: 100%` |
| padding | 48px 24px | `padding: 48px 24px` |
| background | #00101A | `background-color: #00101A` |
| text-align | center | `text-align: center` |
| display | flex | `display: flex; flex-direction: column; align-items: center; gap: 24px;` |

**Children:**
- Section title "Sun* Kudos": 36px, 700, #FFFFFF
- "#KUDOS" hashtag branding: large stylized text with orange (#FF6B35) accent
- Kudos live board area: scrollable feed of recent kudos entries
- Each kudos entry: sender avatar, sender name, receiver name, message text, timestamp

**Kudos entry card (estimated):**
| Property | Value | CSS |
|----------|-------|-----|
| padding | 16px | `padding: 16px` |
| background | #0A1E2B | `background-color: #0A1E2B` |
| border-radius | 8px | `border-radius: 8px` |
| border | 1px solid rgba(200, 169, 110, 0.15) | subtle gold border |
| display | flex | `display: flex; gap: 12px; align-items: flex-start;` |

> **Note**: Internal layout of the Kudos section is detailed in the separate "Sun* Kudos - Live board" Figma frame. This spec covers only the homepage preview/embed of the kudos board.

---

### 7_Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | Instance (7_Footer) | - |
| width | 100% | `width: 100%` |
| padding | 32px 24px | `padding: 32px 24px` |
| background | #000D14 | `background-color: #000D14` |
| border-top | 1px solid rgba(200, 169, 110, 0.1) | `border-top: 1px solid rgba(200, 169, 110, 0.1)` |
| display | flex | `display: flex; flex-direction: column; align-items: center; gap: 16px;` |

**Children (estimated):**
- Company logo or SAA 2025 branding
- Footer navigation links: text 14px, 400, #B0BEC5
- Social media icons: 24×24px, #B0BEC5
- Copyright text: 12px, 400, #B0BEC5

**Footer link states:**
| State | Changes |
|-------|---------|
| Default | color: #B0BEC5 |
| Hover | color: #FFFFFF |
| Focus | outline: 2px solid #C8A96E, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
Homepage SAA (bg: #00101A, w: 1512px, h: 4480px)
├── [FIXED] A1_Header (h: 64px, bg: rgba(0,16,26,0.95), backdrop-blur, z-50)
│   ├── Logo (h: 32px)
│   ├── Nav Links (flex, gap: 24px, text: 14px/500/#FFF)
│   ├── Profile Avatar (w: 32px, h: 32px, rounded-full)
│   └── Language Selector (text: 14px/500/#FFF)
│
├── [SCROLL] Content Area
│   ├── 3.5_Keyvisual (absolute/decorative background graphics)
│   ├── Cover (background image layer)
│   │
│   ├── Bìa / Hero Section (flex-col, items-center, py: 64px)
│   │   ├── "ROOT FURTHER" Title (72px/800, gold-gradient)
│   │   ├── Subtitle text (16px/400/#B0BEC5)
│   │   ├── Countdown Timer (flex, gap: 16px)
│   │   │   ├── Days Box (80×80, bg: #1A2A3A, rounded-md, border-gold)
│   │   │   ├── Hours Box (same)
│   │   │   ├── Minutes Box (same)
│   │   │   └── Seconds Box (same)
│   │   └── Campaign badges/images
│   │
│   ├── Campaign Info Section (px: 24px, py: 48px)
│   │   └── Description paragraphs (16px/400/#FFFFFF, max-w: 800px, mx-auto)
│   │
│   ├── Hệ thống giải thưởng (py: 48px)
│   │   ├── Section Title "Hệ thống giải thưởng" (36px/700, gold, centered)
│   │   └── Awards Grid (grid, 4-col, gap: 24px, px: 24px)
│   │       ├── Award Card: TOP TALENT (bg: #0A1E2B, border-gold, rounded-lg)
│   │       ├── Award Card: TOP TALENT
│   │       ├── Award Card: TOP TALENT
│   │       ├── Award Card: TOP TALENT
│   │       ├── Award Card: BEST MANAGER
│   │       ├── Award Card: BEST NEWCOMER
│   │       ├── Award Card: (other)
│   │       └── Award Card: MVP
│   │
│   ├── Sun* Kudos Section (py: 48px)
│   │   ├── "Sun* Kudos" Title
│   │   ├── "#KUDOS" Branding
│   │   └── Live Board Area
│   │
│   └── 7_Footer (bg: #000D14, py: 32px, border-top-gold)
│       ├── Footer Links
│       └── Copyright Text
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
| A1_Header | Hamburger menu, logo only visible, padding: 0 16px |
| Hero Title | font-size: 36px, line-height: 44px |
| Countdown boxes | 56×56px, number: 24px |
| Awards Grid | grid-template-columns: repeat(1, 1fr) or 2-col |
| Campaign text | font-size: 14px, padding: 0 16px |
| Section titles | font-size: 24px |
| Footer | Stack vertically, text-align: center |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| A1_Header | Compact nav, padding: 0 24px |
| Hero Title | font-size: 48px |
| Awards Grid | grid-template-columns: repeat(2, 1fr) |
| Container | padding: 0 24px |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Container | max-width: 1512px, margin: 0 auto |
| Awards Grid | grid-template-columns: repeat(4, 1fr) |
| Full layout | As designed |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-logo | ~120×32 | White/Gold | Header logo |
| icon-profile | 32×32 | #FFFFFF | Avatar placeholder |
| icon-language | 20×20 | #FFFFFF | Language selector |
| icon-chevron-down | 16×16 | #FFFFFF | Dropdown indicator |
| icon-social-* | 24×24 | #B0BEC5 | Footer social links |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Award Card | transform, box-shadow, border-color | 200ms | ease-out | Hover |
| Countdown | number change | 300ms | ease-in-out | Timer tick |
| Header | background-color, box-shadow | 150ms | ease-in-out | Scroll |
| Nav links | color, opacity | 150ms | ease-in-out | Hover |
| Hero title | opacity, transform | 600ms | ease-out | Page load |
| Sections | opacity, transform(translateY) | 400ms | ease-out | Scroll into view |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page Container | 2167:9026 | `min-h-screen bg-[#00101A]` | `<HomePage />` |
| Header | A1_Header (Instance) | `fixed top-0 w-full z-50 backdrop-blur` | `<Header />` |
| Hero Section | Bìa (Auto layout) | `flex flex-col items-center py-16` | `<HeroSection />` |
| Hero Title | Inside Bìa | `text-7xl font-extrabold bg-gradient-to-b from-[#F5D98E] to-[#A67C3D] bg-clip-text text-transparent` | `<HeroTitle />` |
| Countdown | Inside Bìa | `flex gap-4` | `<CountdownTimer />` |
| Countdown Box | Inside Countdown | `w-20 h-20 bg-[#1A2A3A]/90 rounded-lg border border-[#C8A96E]/30` | `<CountdownBox />` |
| Awards Section | Hệ thống giải thưởng | `py-12 px-6` | `<AwardsSection />` |
| Award Card | Inside Awards | `bg-[#0A1E2B] border border-[#C8A96E]/30 rounded-xl p-4 hover:border-[#C8A96E]/60` | `<AwardCard />` |
| Awards Grid | Inside Awards | `grid grid-cols-4 gap-6` | grid container |
| Kudos Section | Sun* Kudos | `py-12 px-6 text-center` | `<KudosSection />` |
| Footer | 7_Footer (Instance) | `bg-[#000D14] py-8 px-6 border-t border-[#C8A96E]/10` | `<Footer />` |
| Key Visual | 3.5_Keyvisual | `absolute inset-0 pointer-events-none` | `<KeyVisual />` (decorative) |

---

## Data Accuracy Notice

> **Important**: The following values were **confirmed from Figma properties panel**:
> - Frame dimensions: 1,512px × 4,480px
> - Background color: #00101A
> - Frame name: "Homepage SAA"
>
> All other color, spacing, typography, and dimension values were **estimated from visual analysis** of the Figma screenshot (Figma Dev Mode was not available). These values should be verified against the Figma file when Dev Mode access is granted. Values marked with `~` are approximate.

---

## Notes

- All colors use CSS variables for potential theming support
- The design is a dark luxury/premium theme with gold accents
- Gold gradient text uses `background-clip: text` technique
- Header is fixed and scrolls with the page with glassmorphism effect
- Countdown timer requires real-time updates (client component)
- Award cards grid is responsive: 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- Key visual and cover are decorative background layers using absolute positioning
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Font should be loaded via Google Fonts (Inter) or local files
- Ensure color contrast meets WCAG AA for text on dark backgrounds
- TailwindCSS v4 MUST be used for all styling (Constitution Principle II)
- All images MUST use `next/image` with responsive `sizes` attributes (Constitution Principle IV)
