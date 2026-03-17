# Design Style: Hệ thống giải (Award System)

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-12
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=313:8436

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-bg-primary | #00101A | 100% | Page background |
| --color-header-bg | #101417 | 80% | Header background (semi-transparent) |
| --color-gold-primary | #FFEA9E | 100% | Headings, labels, active nav, award titles |
| --color-gold-glow | #FAE287 | 100% | Text glow/shadow effects, border glow |
| --color-gold-secondary | #998C5F | 100% | Secondary gold accents |
| --color-gold-muted | #DBD1C1 | 100% | Kudos section text |
| --color-text-white | #FFFFFF | 100% | Body text, nav links, descriptions |
| --color-divider | #2E3940 | 100% | Horizontal separators, borders |
| --color-gold-bg-subtle | #FFEA9E | 10% | Active nav item background (footer) |
| --color-notification | #D4271D | 100% | Notification badge dot |
| --color-transparent | #000000 | 0% | Transparent backgrounds |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-hero | SVN-Gotham | 96px | 400 | 24px | -13% |
| --text-page-title | Montserrat | 57px | 700 | auto | 0px |
| --text-prize-value | Montserrat | 36px | 700 | 44px | 0px |
| --text-award-title | Montserrat | 24px | 700 | 32px | 0px |
| --text-section-label | Montserrat | 24px | 700 | 32px | 0px |
| --text-nav-primary | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-body | Montserrat | 16px | 700 | 24px | 0.5px |
| --text-nav-secondary | Montserrat | 14px | 700 | 20px | 0.25px |
| --text-caption | Montserrat | 14px | 700 | 20px | 0.1px |
| --text-footer-copyright | Montserrat Alternates | 16px | 700 | 24px | 0% |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-x | 144px | Main content horizontal padding |
| --spacing-header-y | 12px | Header vertical padding |
| --spacing-section-gap | 80px | Gap between award cards |
| --spacing-card-inner-gap | 40px | Gap between image and content in card |
| --spacing-content-gap | 32px | Gap between content sections in card |
| --spacing-text-gap | 24px | Gap between text blocks |
| --spacing-nav-gap | 24px | Gap between header nav items |
| --spacing-nav-item-padding | 16px | Nav item internal padding |
| --spacing-footer-x | 90px | Footer horizontal padding |
| --spacing-footer-y | 40px | Footer vertical padding |
| --spacing-footer-nav-gap | 48px | Footer nav items gap |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-none | 0px | Page, header, rectangles |
| --radius-sm | 4px | Nav buttons, language selector |
| --radius-md | 16px | Content blocks, award card sections |
| --radius-lg | 24px | Award image frame |
| --radius-full | 100px | Notification badge dot |
| --border-divider | 1px solid #2E3940 | Section dividers, footer top border |
| --border-award-image | 0.955px solid #FFEA9E | Award picture frame border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-award-image | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Award picture frame glow |
| --shadow-text-gold | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Active nav text glow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Full desktop width |
| height | 6410px | Full page height |
| background | #00101A | Dark navy background |

### Page Structure

| Property | Value | Notes |
|----------|-------|-------|
| Header | 1440 x 80px | Fixed top, semi-transparent |
| Keyvisual | 1440 x 627px | Hero banner with gradient overlay |
| Awards Section | ~5200px | Main content area |
| Kudos Section | ~500px | Promotion block |
| Footer | 1440 x 144px | Bottom navigation |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│  Page (1440px, bg: #00101A)                                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Header (1440x80px, bg: rgba(16,20,23,0.8), px: 144px)      ││
│  │  ┌──────┐  ┌─────────────────────────┐  ┌──────────────────┐││
│  │  │ Logo │  │ About | Award* | Kudos  │  │ Bell | VN▼ | 👤 │││
│  │  │52x48 │  │   (gap: 24px)           │  │  (gap: 16px)     │││
│  │  └──────┘  └─────────────────────────┘  └──────────────────┘││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Keyvisual (1440x627px)                                      ││
│  │  ┌──────────────────────────────┐                            ││
│  │  │  "ROOT FURTHER" (hero text)  │                            ││
│  │  │  Gradient overlay bottom     │                            ││
│  │  └──────────────────────────────┘                            ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Section Title (px: 144px)                                   ││
│  │  "Sun* Annual Awards 2025" (subtitle)                        ││
│  │  "Hệ thống giải thưởng SAA 2025" (title, gold)              ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Awards Section (px: 144px)                                  ││
│  │  ┌────────────┐  ┌──────────────────────────────────────┐   ││
│  │  │ Menu List  │  │ Award Cards (853px, gap: 80px)       │   ││
│  │  │ (178px w)  │  │                                      │   ││
│  │  │            │  │ ┌──────────────────────────────────┐ │   ││
│  │  │ • Top      │  │ │ Card (856px)                     │ │   ││
│  │  │   Talent*  │  │ │ ┌──────┐  ┌──────────────────┐  │ │   ││
│  │  │ • Top      │  │ │ │Image │  │ Title (gold)     │  │ │   ││
│  │  │   Project  │  │ │ │336x  │  │ Description      │  │ │   ││
│  │  │ • Top PL   │  │ │ │336   │  │ ─── divider ──── │  │ │   ││
│  │  │ • Best Mgr │  │ │ │      │  │ 🔷 Quantity: N   │  │ │   ││
│  │  │ • Sig 2025 │  │ │ │      │  │ ─── divider ──── │  │ │   ││
│  │  │ • MVP      │  │ │ │      │  │ 💎 Value: X VNĐ  │  │ │   ││
│  │  │            │  │ │ └──────┘  │ "cho mỗi giải"   │  │ │   ││
│  │  │            │  │ │           └──────────────────┘  │ │   ││
│  │  │            │  │ └──────────────────────────────────┘ │   ││
│  │  │            │  │                                      │   ││
│  │  │            │  │ (repeat for 6 categories)            │   ││
│  │  └────────────┘  └──────────────────────────────────────┘   ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Sun* Kudos Section (px: 144px)                              ││
│  │  ┌───────────────────────────┐  ┌────────────────────────┐  ││
│  │  │ Content                   │  │ Kudos Logo + Image     │  ││
│  │  │ "Phong trào ghi nhận"    │  │                        │  ││
│  │  │ "Sun* Kudos" (title)     │  │                        │  ││
│  │  │ Description text          │  │                        │  ││
│  │  │ [Chi tiết →]             │  │                        │  ││
│  │  └───────────────────────────┘  └────────────────────────┘  ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Footer (1440px, border-top: 1px solid #2E3940, py: 40px)   ││
│  │  ┌──────┐  ┌─────────────────────────────────┐  ┌────────┐ ││
│  │  │ Logo │  │ About | Award* | Kudos | Tiêu   │  │ ©2025  │ ││
│  │  │69x64 │  │ chuẩn (gap: 48px)               │  │        │ ││
│  │  └──────┘  └─────────────────────────────────┘  └────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Keyvisual Banner

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8437 | - |
| width | 1440px | `width: 100%` |
| height | 627px | `height: 627px` |
| background | image cover, center | `background: url(...) center/cover no-repeat` |
| gradient-overlay | linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0.00) 52.79%) | `background: linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)` |
| position | absolute, z-index: 1 | layered over keyvisual image |

---

### Section Title Block

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8453 | - |
| width | 1152px | `width: calc(100% - 288px)` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` |
| align-items | flex-start | `align-items: flex-start` |

#### Subtitle ("Sun\* Annual Awards 2025")

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 24px/32px 700 | `font: 700 24px/32px 'Montserrat'` |
| color | #FFFFFF | `color: #FFFFFF` |

#### Title ("Hệ thống giải thưởng SAA 2025")

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 57px 700 | `font: 700 57px 'Montserrat'` |
| color | #FFEA9E | `color: #FFEA9E` |

---

### Header Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8440 | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16,20,23,0.8) | `background-color: rgba(16,20,23,0.8)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| position | fixed/absolute | `position: fixed; top: 0; z-index: 50` |
| backdrop-filter | blur (inferred for glass effect) | `backdrop-filter: blur(8px)` |

### Nav Link (Default)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8440;186:1579 | - |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #FFFFFF, no border |
| Active | color: #FFEA9E, border-bottom: 1px solid #FFEA9E, text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |
| Hover | color: #FFEA9E (inferred) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Award Category Menu (Left Sidebar)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8459 | - |
| width | ~178px | `width: auto` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 0 | stacked items |
| position | sticky (inferred) | `position: sticky; top: 80px` |

### Menu Item

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8460–313:8465 | - |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| letter-spacing | 0.25px | `letter-spacing: 0.25px` |
| color | #FFFFFF | `color: #FFFFFF` |
| icon-size | 24x24px | `width: 24px; height: 24px` |
| gap (icon-text) | 4px | `gap: 4px` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #FFFFFF |
| Active | color: #FFEA9E, underline/indicator gold |
| Hover | color: #FFEA9E (highlight) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Award Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8467 (Top Talent example) | - |
| width | 856px | `width: 100%` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 80px | `gap: 80px` |

#### Card Inner Layout (Image + Content)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2803 | - |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 40px | `gap: 40px` |
| align-items | flex-start | `align-items: flex-start` |

#### Award Image

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2525 | - |
| width | 336px | `width: 336px` |
| height | 336px | `height: 336px` |
| border | 0.955px solid #FFEA9E | `border: 1px solid #FFEA9E` |
| border-radius | 24px | `border-radius: 24px` |
| box-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `box-shadow: var(--shadow-award-image)` |
| mix-blend-mode | screen | `mix-blend-mode: screen` |
| background | image cover | `background-size: cover` |

#### Award Content Block

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2526 | - |
| width | 480px | `width: 480px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 32px | `gap: 32px` |
| border-radius | 16px | `border-radius: 16px` |
| backdrop-filter | blur(32px) | `backdrop-filter: blur(32px)` |

#### Award Title Row

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2528 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |
| icon | 24x24px | target icon |
| title font | Montserrat 24px/32px 700 | `font: 700 24px/32px 'Montserrat'` |
| title color | #FFEA9E | `color: #FFEA9E` |

#### Award Description

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2531 | - |
| width | 480px | `width: 100%` |
| font | Montserrat 16px/24px 700 | `font: 700 16px/24px 'Montserrat'` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | justify | `text-align: justify` |

#### Award Divider

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2532 | - |
| width | 480px | `width: 100%` |
| height | 1px | `height: 1px` |
| background | #2E3940 | `background-color: #2E3940` |

#### Award Quantity Row

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2534 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |
| label | "Số lượng giải thưởng:" — Montserrat 24px/32px 700, #FFEA9E |
| value | Montserrat 36px/44px 700, #FFFFFF |
| unit | "Cá nhân/Tập thể" — Montserrat 14px/20px 700, #FFFFFF |

#### Award Prize Value Row

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2541 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 0 | stacked |
| label | "Giá trị giải thưởng:" — Montserrat 24px/32px 700, #FFEA9E |
| value | Montserrat 36px/44px 700, #FFFFFF |
| subtitle | "cho mỗi giải thưởng" — Montserrat 14px/20px 700, #FFFFFF |

---

### Bottom Card Divider

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2771 | - |
| width | 853px | `width: 100%` |
| height | 1px | `height: 1px` |
| background | #2E3940 | `background-color: #2E3940` |

---

### Sun* Kudos Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 335:12023 | - |
| width | 1152px | `width: calc(100% - 288px)` |
| display | flex/group | layout with content + image |
| padding-x | 144px (page) | inherited from page |

#### Kudos Content

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I335:12023;313:8419 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |

#### Kudos Label ("Phong trào ghi nhận")

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 24px/32px 700 | `font: 700 24px/32px 'Montserrat'` |
| color | #FFFFFF | `color: #FFFFFF` |

#### Kudos Title ("Sun\* Kudos")

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 57px 700 | `font: 700 57px 'Montserrat'` |
| color | #FFEA9E | `color: #FFEA9E` |

#### Kudos Description

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 16px/24px 700 | `font: 700 16px/24px 'Montserrat'` |
| color | #FFFFFF | `color: #FFFFFF` |

#### Kudos Logo ("KUDOS")

| Property | Value | CSS |
|----------|-------|-----|
| font | SVN-Gotham 96px/24px 400 | `font: 400 96px 'SVN-Gotham'` |
| color | #DBD1C1 | `color: #DBD1C1` |
| letter-spacing | -13% | `letter-spacing: -0.13em` |

#### Chi tiết Button (CTA)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I335:12023;313:8426 | - |
| type | text_link with icon |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| text | "Chi tiết" |
| font | Montserrat 16px/24px 700 | `font: 700 16px/24px 'Montserrat'` |
| color | #00101A | `color: #00101A` |
| background | #FFEA9E (inferred from dark text) | `background-color: #FFEA9E` |
| icon | 24x24px arrow right | append after text |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E, color: #00101A |
| Hover | opacity: 0.9, slight transform (inferred) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 354:4323 | - |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid #2E3940` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |

#### Footer Logo

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I354:4323;342:1408 | - |
| width | 69px | `width: 69px` |
| height | 64px | `height: 64px` |

#### Footer Nav

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I354:4323;342:1409 | - |
| display | flex | `display: flex` |
| gap | 48px | `gap: 48px` |
| items | About SAA 2025, Award Information*, Sun* Kudos, Tiêu chuẩn chung |
| font | Montserrat 16px/24px 700 |
| active style | bg: rgba(255,234,158,0.1), text-shadow gold glow |

#### Footer Copyright

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I354:4323;342:1413 | - |
| text | "Bản quyền thuộc về Sun* © 2025" |
| font | Montserrat Alternates 16px/24px 700, #FFFFFF |
| text-align | center |

---

## Component Hierarchy with Styles

```
Page (1440x6410, bg: #00101A)
├── Header (1440x80, bg: rgba(16,20,23,0.8), px: 144, flex, center, between)
│   ├── Left Group (flex, gap: 64px, center)
│   │   ├── Logo (52x48, image cover)
│   │   └── NavLinks (flex, gap: 24px)
│   │       ├── NavLink "About SAA 2025" (16px/700, #FFF, px: 16)
│   │       ├── NavLink "Award Information" (16px/700, #FFEA9E, active, border-b gold)
│   │       └── NavLink "Sun* Kudos" (14px/700, #FFF, px: 16)
│   └── Right Group (flex, gap: 16px, center)
│       ├── Notification (40x40, icon 24px, red dot 8px)
│       ├── Language "VN ▼" (108px, flex, icon + text + chevron)
│       └── UserAvatar (40x40, rounded)
│
├── Keyvisual (1440x627, bg: image, gradient overlay bottom)
│   └── Content: "ROOT FURTHER" artwork + "Sun* Annual Awards 2025"
│
├── Section Title (px: 144)
│   ├── Subtitle "Sun* annual awards 2025" (small, light)
│   └── Title "Hệ thống giải thưởng SAA 2025" (57px, gold)
│
├── Awards Section (px: 144, flex, row)
│   ├── MenuList (flex-col, sticky)
│   │   ├── MenuItem "Top Talent" (14px/700, icon 24px, gap: 4px)
│   │   ├── MenuItem "Top Project"
│   │   ├── MenuItem "Top Project Leader"
│   │   ├── MenuItem "Best Manager"
│   │   ├── MenuItem "Signature 2025 Creator"
│   │   └── MenuItem "MVP"
│   │
│   └── CardList (853px, flex-col, gap: 80px)
│       ├── AwardCard "Top Talent" (flex-row, gap: 40px)
│       │   ├── Image (336x336, radius: 24, border: gold, shadow: glow)
│       │   └── Content (480px, flex-col, gap: 32px, backdrop-blur: 32px)
│       │       ├── TitleRow (flex, gap: 16px) → icon + "Top Talent" (24px, gold)
│       │       ├── Description (16px/24px, #FFF, justify)
│       │       ├── Divider (1px, #2E3940)
│       │       ├── QuantityRow → "Số lượng giải thưởng:" (24px, gold) + "10" (36px, white) + "Cá nhân"
│       │       ├── Divider (1px, #2E3940)
│       │       └── ValueBlock → "Giá trị giải thưởng:" (24px, gold) + "7.000.000 VNĐ" (36px, white) + "cho mỗi giải thưởng"
│       │
│       ├── AwardCard "Top Project" (same layout, image right→left alt)
│       ├── AwardCard "Top Project Leader"
│       ├── AwardCard "Best Manager"
│       ├── AwardCard "Signature 2025 - Creator"
│       └── AwardCard "MVP"
│
├── Sun* Kudos Section (px: 144)
│   ├── Content (flex-col)
│   │   ├── Label "Phong trào ghi nhận"
│   │   ├── Title "Sun* Kudos"
│   │   ├── Description (body text)
│   │   └── Button "Chi tiết →" (text link + icon)
│   └── Image/Logo (Kudos branding, "KUDOS" SVN-Gotham 96px #DBD1C1)
│
└── Footer (1440px, border-top: 1px #2E3940, py: 40px, px: 90px, flex, between)
    ├── Left (flex, gap: 80px, center)
    │   ├── Logo (69x64)
    │   └── NavLinks (flex, gap: 48px)
    │       ├── "About SAA 2025"
    │       ├── "Award Information" (active)
    │       ├── "Sun* Kudos"
    │       └── "Tiêu chuẩn chung"
    └── Copyright "Bản quyền thuộc về Sun* © 2025" (Montserrat Alternates)
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
| Header | px: 16px, hamburger menu replaces nav |
| Menu List | Hidden or horizontal scroll tabs |
| Award Card | Stack vertically (image above content), full width |
| Award Image | 100% width, max 336px, centered |
| Content Block | 100% width |
| Kudos Section | Stack vertically |
| Footer | Stack vertically, center align, reduced padding |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Header | px: 48px |
| Menu List | Hidden or collapsible |
| Award Card | Image smaller (240px), content fills remaining |
| Footer | px: 48px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Container | max-width: 1440px, margin: 0 auto |
| All sections | As designed (px: 144px) |
| Menu List | Sticky sidebar, visible |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| Target icon | 24x24 | #FFEA9E | Award title prefix, menu items |
| Diamond icon | 24x24 | #FFEA9E | Quantity label prefix |
| License icon | 24x24 | #FFEA9E | Prize value label prefix |
| Notification bell | 24x24 | #FFFFFF | Header notification |
| Chevron down | 24x24 | #FFFFFF | Language selector |
| Flag VN | 20x15 | - | Language selector flag |
| Arrow right | 24x24 | #00101A | "Chi tiết" button |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Nav Link | color, border-bottom, text-shadow | 200ms | ease-in-out | Hover/Active |
| Menu Item | color | 200ms | ease-in-out | Hover/Active |
| Award Card | scroll position | 300ms | ease-out | Menu click |
| "Chi tiết" Button | opacity, transform | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page | 313:8436 | `bg-[#00101A] min-h-screen` | `<AwardSystemPage>` |
| Header | 313:8440 | `fixed top-0 w-full h-20 bg-[#101417]/80 backdrop-blur` | `<Header>` (existing) |
| Keyvisual | 313:8437 | `w-full h-[627px] bg-cover bg-center` | `<KeyVisual>` (existing) |
| Section Title | 313:8453 | `px-36 text-left` | `<SectionTitle>` |
| Awards Section | 313:8458 | `px-36 flex gap-10` | `<AwardsSection>` |
| Menu List | 313:8459 | `sticky top-20 flex flex-col` | `<AwardMenu>` |
| Menu Item | 313:8460-8465 | `p-4 rounded text-sm font-bold` | `<AwardMenuItem>` |
| Award Card | 313:8467-8510 | `flex gap-10` | `<AwardCard>` |
| Award Image | I313:8467;214:2525 | `w-[336px] h-[336px] rounded-3xl border border-[#FFEA9E]` | `<AwardImage>` |
| Award Content | I313:8467;214:2526 | `w-[480px] flex flex-col gap-8 backdrop-blur-[32px]` | `<AwardContent>` |
| Kudos Section | 335:12023 | `px-36` | `<KudosPromo>` |
| Footer | 354:4323 | `w-full border-t border-[#2E3940] py-10 px-[90px]` | `<Footer>` (existing) |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS v4)
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Font families: Montserrat (primary), Montserrat Alternates (footer copyright), SVN-Gotham (Kudos hero text)
- Award cards alternate image position: odd cards (1st, 3rd, 5th) have image on LEFT, even cards (2nd, 4th, 6th) have image on RIGHT — confirmed from Figma position data
- Ensure color contrast meets WCAG AA (gold #FFEA9E on dark #00101A passes)
- The `backdrop-filter: blur(32px)` on award content provides frosted glass effect
