# Design Style: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**Figma Link**: [Open in Figma](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=2940-13431)
**Extracted At**: 2026-03-17

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-background | #00101A | 100% | Page background (dark) |
| --color-container-2 | #00070C | 100% | Sidebar card backgrounds |
| --color-primary-gold | #FFEA9E | 100% | Primary accent, headings, highlights, labels |
| --color-primary-gold-10 | #FFEA9E | 10% | Button/input backgrounds (secondary normal) |
| --color-primary-gold-40 | #FFEA9E | 40% | Button hover state (secondary) |
| --color-surface-cream | #FFF8E1 | 100% | Highlight Kudo card background, primary button hover |
| --color-surface-warm | #FFF3C6 | 100% | Kudo card secondary background |
| --color-kudo-card | #FFF8E1 | 100% | All Kudos card background |
| --color-text-primary | #FFEA9E | 100% | Section titles, stat values, gold text |
| --color-text-white | #FFFFFF | 100% | Body text, sub-titles, spotlight names |
| --color-text-secondary | #999999 | 100% | Muted text, labels |
| --color-text-dark | #00101A | 100% | Text on light kudo cards |
| --color-border | #998C5F | 100% | Card borders, input borders |
| --color-divider | #2E3940 | 100% | Section dividers, separators |
| --color-heart-active | #D4271D | 100% | Active heart/like icon |
| --color-header-bg | #101417 | 80% | Header background (semi-transparent) |
| --color-error-highlight | #F17676 | 100% | Spotlight highlighted name |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-hero | SVN-Gotham | 139.78px | 700 | auto | 0 |
| --text-section-title | Montserrat | 57px | 700 | 64px | -0.25px |
| --text-spotlight-count | Montserrat | 36px | 700 | 44px | 0 |
| --text-sub-heading | Montserrat | 24px | 700 | 32px | 0 |
| --text-sidebar-title | Montserrat | 22px | 700 | 28px | 0 |
| --text-body-lg | Montserrat | 20px | 500 | auto | 0 |
| --text-body | Montserrat | 16px | 400 | auto | 0 |
| --text-body-medium | Montserrat | 16px | 500 | auto | 0 |
| --text-body-sm | Montserrat | 14px | 400 | auto | 0 |
| --text-body-sm-bold | Montserrat | 14px | 700 | auto | 0 |
| --text-spotlight-name | Montserrat | 6.66px | 700 | 6.36px | 0.21px |
| --text-spotlight-name-lg | Montserrat | 11px | 700 | 6.36px | 0.21px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-x | 144px | Page horizontal padding |
| --spacing-section-gap | 120px | Gap between major sections |
| --spacing-section-inner | 40px | Gap within sections (consistent across all sections) |
| --spacing-card-padding | 40px 40px 16px 40px | Kudo card internal padding |
| --spacing-card-padding-highlight | 24px 24px 16px 24px | Highlight kudo card padding |
| --spacing-sidebar-padding | 24px | Sidebar card padding |
| --spacing-list-gap | 24px | Gap between kudo cards in list |
| --spacing-carousel-gap | 24px | Gap between carousel items |
| --spacing-element | 16px | Default element gap |
| --spacing-sm | 8px | Small gaps (avatar-to-text, icon-to-label) |
| --spacing-xs | 4px | Tight gaps |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-card | 24px | Kudo post cards |
| --radius-sidebar | 17px | Sidebar cards |
| --radius-highlight | 16px | Highlight kudo cards |
| --radius-button | 8px | "Mo qua" button |
| --radius-sm | 4px | Filter buttons, nav buttons |
| --radius-pill | 68px | Search/input pill shape |
| --radius-avatar | 100px | Circular avatars |
| --border-card | 1px solid #998C5F | Card borders |
| --border-highlight | 4px solid #FFEA9E | Active highlight kudo border |
| --border-thin | 0.5px solid #FFEA9E | Thin accent borders |
| --border-divider | 1px | Divider lines |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-none | none | Most elements (flat dark UI) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| max-width | 1440px | Full desktop width |
| padding-x | 144px | Horizontal content padding |
| content-width | 1152px | Effective content area |
| background | #00101A | Dark background |

### Page Structure

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical sections |
| gap | 120px | Between major sections |
| padding-top | 96px | Top padding (below header) |
| padding-bottom | 120px | Bottom padding |

### All Kudos Layout (Two-Column)

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Horizontal layout |
| gap | 24px | Between columns |
| kudo-list-width | 680px | Left column (kudo feed) |
| sidebar-width | ~374px | Right column (stats + lists) |

### Layout Structure (ASCII)

```
+------------------------------------------------------------------+ 1440px
|  Header (h:80px, bg:rgba(16,20,23,0.8), px:144px)               |
|  [Logo] [About SAA] [Award Info] [Sun* Kudos]  [Lang][Bell][Ava] |
+------------------------------------------------------------------+
|                                                                    |
|  Keyvisual (h:512px, background-image + gradient overlay)         |
|  +---------------------------------------------------------+      |
|  | "He thong ghi nhan va cam on"                           |      |
|  | * KUDOS (SVN-Gotham 139px)                              |      |
|  +---------------------------------------------------------+      |
|  | [__ Hom nay, ban muon gui...___] [Q Tim kiem sunner]    |      |
|  +------------------------------------------+--------------+      |
|                                                                    |
|  Section: HIGHLIGHT KUDOS (px:144px, gap:40px)                    |
|  +---------------------------------------------------------+      |
|  | "Sun* Annual Awards 2025"                               |      |
|  | HIGHLIGHT KUDOS (57px)     [Hashtag v] [Phong ban v]    |      |
|  +---------------------------------------------------------+      |
|  | [<] [KUDO Card] [KUDO Card*] [KUDO Card] [>]            |      |
|  |     (carousel, 5 cards, gap:24px, w:528px each)         |      |
|  +---------------------------------------------------------+      |
|  |              [<]  2/5  [>]                              |      |
|  +---------------------------------------------------------+      |
|                                                                    |
|  Section: SPOTLIGHT BOARD                                          |
|  +---------------------------------------------------------+      |
|  | "Sun* Annual Awards 2025"                               |      |
|  | SPOTLIGHT BOARD (57px)                                   |      |
|  +---------------------------------------------------------+      |
|  | +-----------------------------------------------------+ |      |
|  | | 388 KUDOS        [search]      [pan/zoom]           | |      |
|  | |                                                     | |      |
|  | |  Word cloud / interactive name diagram              | |      |
|  | |  (names sized by kudos count)                       | |      |
|  | +-----------------------------------------------------+ |      |
|  +---------------------------------------------------------+      |
|                                                                    |
|  Section: ALL KUDOS (two-column)                                   |
|  +---------------------------------------------------------+      |
|  | "Sun* Annual Awards 2025"                               |      |
|  | ALL KUDOS (57px)                                        |      |
|  +---------------------------------------------------------+      |
|  | +------------------------------+ +--------------------+ |      |
|  | | Kudo Post Card (680px)       | | Stats Card (374px) | |      |
|  | | [avatar] sender -> receiver  | | Kudos received: 25 | |      |
|  | | [hashtag] 10:00 - date       | | Kudos sent: 25     | |      |
|  | | Content text (5 lines max)   | | Hearts: 25         | |      |
|  | | [gallery images]             | | ----------         | |      |
|  | | #tags                        | | SBox opened: 25    | |      |
|  | | [heart 1000] [Copy Link]     | | SBox unopened: 25  | |      |
|  | +------------------------------+ | [Mo qua button]    | |      |
|  | +------------------------------+ +--------------------+ |      |
|  | | Kudo Post Card               | +--------------------+ |      |
|  | | ...                          | +--------------------+ |      |
|  | +------------------------------+ | 10 SUNNER NHAN QUA | |      |
|  | +------------------------------+ | MOI NHAT           | |      |
|  | | Kudo Post Card               | | [avatar] Name      | |      |
|  | | ...                          | | ...                | |      |
|  | +------------------------------+ +--------------------+ |      |
|  |                                  +--------------------+ |      |
|  |                                  | SUNNER CO SU THANG | |      |
|  |                                  | HANG MOI NHAT      | |      |
|  |                                  | [avatar] Name      | |      |
|  |                                  | ...                | |      |
|  |                                  +--------------------+ |      |
|  +---------------------------------------------------------+      |
|                                                                    |
|  Footer (shared component)                                         |
+------------------------------------------------------------------+
```

---

## Component Style Details

### Header - `2940:13433`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13433 | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16,20,23,0.8) | `background-color: rgba(16,20,23,0.8)` |
| backdrop-filter | blur(10px) | `backdrop-filter: blur(10px)` |
| display | flex | `display: flex` |
| gap | 238px | `gap: 238px` |
| position | fixed | `position: fixed; top: 0` |

---

### KV Kudos Banner - `2940:13437`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13437 | - |
| width | 1152px | `width: 100%` |
| height | 160px | `height: auto` |
| title-font | SVN-Gotham, 139.78px, 700 | Hero logo text |
| subtitle-font | Montserrat, 36px, 700 | `font: 700 36px Montserrat` |
| subtitle-color | #FFEA9E | `color: var(--color-primary-gold)` |

---

### Button Ghi Nhan (Recognition Input) - `2940:13449`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13449 | - |
| width | 738px | `width: 738px` |
| height | 72px | `height: 72px` |
| padding | 24px 16px | `padding: 24px 16px` |
| background | rgba(255,234,158,0.1) | `background: var(--Details-SecondaryButton-Normal)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 68px | `border-radius: 68px` |
| gap | 8px | `gap: 8px` |
| font | Montserrat 16px 400 | Placeholder text |
| color | #999 | `color: var(--color-text-secondary)` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255,234,158,0.1) |
| Hover | background: rgba(255,234,158,0.4) |
| Focus | border-color: #FFEA9E |

---

### Search Sunner Input - `2940:13450`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13450 | - |
| width | 381px | `width: 381px` |
| height | 72px | `height: 72px` |
| padding | 24px 16px | `padding: 24px 16px` |
| background | rgba(255,234,158,0.1) | `background: var(--Details-SecondaryButton-Normal)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 68px | `border-radius: 68px` |
| font | Montserrat 16px 400 | Placeholder text |
| color | #999 | `color: var(--color-text-secondary)` |
| icon | search (left), 20x20, #999 | Search icon prefix |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255,234,158,0.1) |
| Hover | background: rgba(255,234,158,0.4) |
| Focus | border-color: #FFEA9E |

---

### Filter Buttons (Hashtag / Phong ban) - `2940:13459`, `2940:13460`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13459, 2940:13460 | - |
| padding | 16px | `padding: 16px` |
| background | rgba(255,234,158,0.1) | `background: var(--Details-SecondaryButton-Normal)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 4px | `border-radius: 4px` |
| gap | 8px | `gap: 8px` |
| font | Montserrat 16px 500 | Button text |
| color | #FFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255,234,158,0.1) |
| Hover | background: rgba(255,234,158,0.4) |
| Active/Open | border-color: #FFEA9E |

---

### Highlight Kudo Card - `2940:13465`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13465 | - |
| width | 528px | `width: 528px` |
| padding | 24px 24px 16px 24px | `padding: 24px 24px 16px 24px` |
| background | #FFF8E1 | `background: var(--color-surface-cream)` |
| border | 4px solid #FFEA9E | `border: 4px solid var(--color-primary-gold)` |
| border-radius | 16px | `border-radius: 16px` |
| gap | 16px | `gap: 16px` |
| display | flex column | `display: flex; flex-direction: column` |

#### Highlight Card Inner Text Styles

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| User name | Montserrat | 14px | 700 | #00101A | Sender/receiver name |
| Department | Montserrat | 14px | 400 | #999 | Below user name |
| Star count (hoa thi) | Montserrat | 14px | 700 | #FFEA9E | Gold, with star icon |
| Danh hieu (badge) | Montserrat | 14px | 400 | #999 | Badge/title label |
| Timestamp | Montserrat | 14px | 400 | #999 | Format: "HH:mm - MM/DD/YYYY" |
| Content text | Montserrat | 16px | 400 | #00101A | Max **3 lines**, overflow: ellipsis |
| Hashtag tags | Montserrat | 14px | 700 | #00101A | Max 5 per line, "..." overflow |
| Heart count | Montserrat | 14px | 700 | #00101A | Beside heart icon |
| "Copy Link" text | Montserrat | 14px | 500 | #00101A | Beside link icon |
| "Xem chi tiet" text | Montserrat | 14px | 500 | #00101A | Link-style action, underline on hover |

#### Highlight Card Avatar Layout

| Element | Size | Notes |
|---------|------|-------|
| Sender/Receiver avatar | 40x40 circle | Smaller than All Kudos card avatars |
| Star icon | 14x14 | Gold (#FFEA9E) |
| Sender-to-Receiver row | flex row, gap: 12px | Compact layout for narrower card |

---

### Carousel Side Arrows (Overlay) - `2940:13470` (prev), `2940:13468` (next)

Large overlay arrows positioned on the left and right edges of the carousel viewport, allowing users to navigate between highlight kudo cards. These are distinct from the bottom pagination arrows (B.5).

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `2940:13470` (B.2.1 Button lùi), `2940:13468` (B.2.2 Button tiến) | - |
| position | absolute, vertically centered | `position: absolute; top: 50%; transform: translateY(-50%)` |
| size | 48x48 | `width: 48px; height: 48px` |
| background | rgba(0,0,0,0.5) | `background: rgba(0,0,0,0.5)` |
| border-radius | 50% | `border-radius: 50%` |
| icon | chevron-left / chevron-right, 24px, #FFF | `color: white` |
| z-index | 10 | Above carousel cards |
| left-arrow-position | 144px from left edge | `left: 144px` |
| right-arrow-position | 144px from right edge | `right: 144px` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(0,0,0,0.5), cursor: pointer |
| Hover | background: rgba(0,0,0,0.7) |
| Disabled (first/last card) | opacity: 0.3, cursor: not-allowed, pointer-events: none |

---

### Carousel Pagination Controls - `2940:13471`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13471 | - |
| width | 100% | `width: 100%` |
| height | 52px | `height: 52px` |
| padding | 0 144px | `padding: 0 144px` |
| display | flex row center | `display: flex; justify-content: center` |
| gap | 32px | `gap: 32px` |
| page-indicator-font | Montserrat 20px 500 | "2/5" text |
| page-indicator-color | #FFF (current page), #999 (total) | Current number bold |
| arrow-size | 52x52 | Circular button with chevron icon |

**Arrow Button States:**
| State | Changes |
|-------|---------|
| Default | color: #FFF, cursor: pointer |
| Hover | opacity: 0.8 |
| Disabled (first/last page) | opacity: 0.3, cursor: not-allowed, pointer-events: none |

---

### Spotlight Board - `2940:14174`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14174 | - |
| width | 1157px | `width: 100%` |
| height | 548px | `height: 548px` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| background | dark with overlay | `background: rgba(0,0,0,0.7) over image` |
| title-font | Montserrat 36px 700 | "388 KUDOS" |
| title-color | #FFF | `color: white` |
| overflow | hidden | `overflow: hidden` |

#### Spotlight Search Input - `2940:14833`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14833 | - |
| width | 219px | `width: 219px` |
| height | 39px | `height: 39px` |
| padding | 16px 11px | `padding: 16px 11px` |
| background | rgba(255,234,158,0.1) | `background: var(--Details-SecondaryButton-Normal)` |
| border | 0.682px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 46px | `border-radius: 46px` |
| font | Montserrat 14px 400 | Placeholder text |
| placeholder-color | #999 | `color: var(--color-text-secondary)` |
| icon | search (left) | 16x16, #999 |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E |
| Hover | background: rgba(255,234,158,0.2) |

#### Pan/Zoom Toggle - `3007:17479`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3007:17479 | - |
| size | 24x24 | Icon button |
| color | #FFF | `color: white` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Pan mode (default) | icon: pan cursor |
| Zoom mode | icon: zoom cursor |
| Hover | opacity: 0.8 |

---

### Kudo Post Card (All Kudos) - `3127:21871`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3127:21871 | - |
| width | 680px | `width: 680px` |
| padding | 40px 40px 16px 40px | `padding: 40px 40px 16px 40px` |
| background | #FFF8E1 | `background-color: var(--color-kudo-card)` |
| border-radius | 24px | `border-radius: 24px` |
| gap | 16px | `gap: 16px` |
| display | flex column | `display: flex; flex-direction: column` |

#### Kudo Card Avatar & User Info Layout

| Element | Size | CSS | Notes |
|---------|------|-----|-------|
| Sender/Receiver avatar | 48x48 circle | `width: 48px; height: 48px; border-radius: 100px` | Gmail profile image, clickable |
| Star icon (hoa thi) | 16x16 | `width: 16px; height: 16px` | Gold (#FFEA9E), inline with star count number |
| User info block | flex column | `display: flex; flex-direction: column; gap: 2px` | Name, department, star+badge stacked |
| Sender-to-Receiver row | flex row, center | `display: flex; align-items: center; gap: 16px` | avatar + info + arrow + avatar + info |

#### Kudo Card Inner Text Styles

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| User name | Montserrat | 14px | 700 | #00101A | Sender/receiver name |
| Department | Montserrat | 14px | 400 | #999 | Below user name |
| Star count (hoa thi) | Montserrat | 14px | 700 | #FFEA9E | Gold, with star icon |
| Danh hieu (badge) | Montserrat | 14px | 400 | #999 | Badge/title label |
| Hashtag Badge | Montserrat | 14px | 700 | #00101A | Pill bg: #FFEA9E, border-radius: 4px, padding: 4px 8px |
| Timestamp | Montserrat | 14px | 400 | #999 | Format: "HH:mm - MM/DD/YYYY" |
| Content text | Montserrat | 16px | 400 | #00101A | Max 5 lines, overflow: ellipsis |
| Inline hashtag | Montserrat | 14px | 700 | #00101A | Clickable, dark text on cream (#FFF8E1) kudo card background |
| Heart count | Montserrat | 16px | 700 | #00101A | Beside heart icon |
| "Copy Link" text | Montserrat | 14px | 500 | #00101A | Beside link icon |
| "Xem chi tiet" text | Montserrat | 14px | 500 | #00101A | Link-style, on highlight cards only |

#### Heart Button - `I3127:21871;256:5175`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3127:21871;256:5175 | - |
| display | flex row | `display: flex; align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default (not liked) | icon: gray (#999), count: normal weight |
| Active (liked) | icon: red (#D4271D), count: bold, scale animation 1.2x on toggle |
| Hover | opacity: 0.8 |

#### Copy Link Button - `I3127:21871;256:5216`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3127:21871;256:5216 | - |
| display | flex row | `display: flex; align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #00101A |
| Hover | opacity: 0.7 |
| Active (just copied) | text changes to "Copied!" briefly (2s) |

#### Image Gallery

| Property | Value | CSS |
|----------|-------|-----|
| display | flex row | `display: flex; gap: 8px` |
| thumbnail-size | ~80x80px | `width: 80px; height: 80px; object-fit: cover` |
| border-radius | 8px | `border-radius: 8px` |
| max-items | 5 | Show max 5 thumbnails |
| video-overlay | play icon centered | White play icon, 24x24, with semi-transparent dark circle bg |
| cursor | pointer | `cursor: pointer` |

---

### Stats Overview Card - `2940:13489`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13489 | - |
| width | ~374px | `width: 100%` |
| padding | 24px | `padding: 24px` |
| background | #00070C | `background: var(--Details-Container-2)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 17px | `border-radius: 17px` |
| gap | 10px | `gap: 10px` |

#### Stat Row - `2940:13491` (repeated)

| Property | Value | CSS |
|----------|-------|-----|
| width | 374px | `width: 100%` |
| height | 40px | `height: 40px` |
| display | flex row | `display: flex; justify-content: space-between` |
| label-font | Montserrat 16px 400 | `font: 400 16px Montserrat` |
| label-color | #FFF | `color: white` |
| value-font | Montserrat 16px 700 | `font: 700 16px Montserrat` |
| value-color | #FFEA9E | `color: var(--color-primary-gold)` |

#### "Mo Qua" Button - `2940:13497`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13497 | - |
| width | 374px | `width: 100%` |
| height | 60px | `height: 60px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background: var(--color-primary-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| font | Montserrat 16px 700 | `font: 700 16px Montserrat` |
| color | #00101A | `color: var(--color-background)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E, color: #00101A |
| Hover | background: #FFF8E1 |

---

### 10 Sunner Gift Recipients Card - `2940:13510`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13510 | - |
| width | 100% | `width: 100%` |
| padding | 24px 16px 24px 24px | `padding: 24px 16px 24px 24px` |
| background | #00070C | `background: var(--Details-Container-2)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 17px | `border-radius: 17px` |
| gap | 10px | `gap: 10px` |
| title-font | Montserrat 22px 700 | `font: 700 22px/28px Montserrat` |
| title-color | #FFEA9E | `color: var(--color-primary-gold)` |

#### Sunner Item - `2940:13516`

| Property | Value | CSS |
|----------|-------|-----|
| display | flex row | `display: flex; align-items: center` |
| gap | 8px | `gap: 8px` |
| height | 64px | `height: 64px` |
| avatar | 40px circle | `width: 40px; height: 40px; border-radius: 100px` |
| name-font | Montserrat 14px 700 | `font: 700 14px Montserrat` |
| name-color | #FFF | `color: white` |
| desc-font | Montserrat 14px 400 | `font: 400 14px Montserrat` |
| desc-color | #999 | `color: var(--color-text-secondary)` |

---

### Section Sub-heading (Reusable)

The "Sun* Annual Awards 2025" text that appears above every section title (Highlight Kudos, Spotlight Board, All Kudos).

| Property | Value | CSS |
|----------|-------|-----|
| font | Montserrat 24px 700 | `font: 700 24px/32px Montserrat` |
| color | #FFFFFF | `color: white` |
| margin-bottom | 8px | `margin-bottom: 8px` |

---

### Section Divider

| Property | Value | CSS |
|----------|-------|-----|
| width | 1152px | `width: 100%` |
| height | 1px | `height: 1px` |
| background | #2E3940 | `background-color: var(--color-divider)` |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, w: 1440px)
├── Header (h: 80px, bg: rgba(16,20,23,0.8), px: 144px, fixed)
│   ├── Logo (52x48)
│   ├── NavButtons (flex, gap: 24px)
│   │   ├── "About SAA 2025" (Montserrat 16px 500, #FFF)
│   │   ├── "Award Information" (Montserrat 16px 500, #FFF)
│   │   └── "Sun* Kudos" (Montserrat 16px 700, #FFEA9E, active)
│   └── Actions (flex, gap: 16px)
│       ├── LanguageSelector (108x56)
│       ├── NotificationBell (40x40)
│       └── ProfileAvatar (40x40, border: 1px solid #998C5F)
│
├── Keyvisual (w: 1440px, h: 512px, bg-image + gradient)
│   └── Content (flex-col, gap: 10px)
│       ├── "He thong ghi nhan va cam on" (Montserrat 36px 700, #FFEA9E)
│       └── "KUDOS" (SVN-Gotham 139px 700, Montserrat Alternates)
│
├── ActionBar (flex-row, px: 144px, gap: varies)
│   ├── ButtonGhiNhan (738x72, pill, bg: gold-10%, border: #998C5F)
│   └── SearchSunner (381x72, pill, bg: gold-10%, border: #998C5F)
│
├── HighlightKudos (flex-col, gap: 40px)
│   ├── Header (px: 144px)
│   │   ├── "Sun* Annual Awards 2025" (24px 700, #FFF)
│   │   ├── "HIGHLIGHT KUDOS" (57px 700, #FFEA9E)
│   │   └── Filters (flex, gap: 24px)
│   │       ├── HashtagBtn (border: #998C5F, bg: gold-10%)
│   │       └── PhongBanBtn (border: #998C5F, bg: gold-10%)
│   ├── Carousel (flex-row, gap: 24px, w: 1440px)
│   │   ├── PrevButton (chevron)
│   │   ├── KudoHighlightCards[5] (528px, r: 16px, border: 4px #FFEA9E)
│   │   └── NextButton (chevron)
│   └── Pagination (flex, center, gap: 32px)
│       ├── PrevBtn | "2/5" (20px 500) | NextBtn
│
├── SpotlightBoard (flex-col, gap: 40px)
│   ├── Header (px: 144px)
│   │   ├── "Sun* Annual Awards 2025" (24px 700, #FFF)
│   │   └── "SPOTLIGHT BOARD" (57px 700, #FFEA9E)
│   └── Canvas (1157x548, border: 1px #998C5F, dark overlay)
│       ├── "388 KUDOS" (36px 700, #FFF)
│       ├── SearchInput (219x39, pill)
│       ├── PanZoomToggle
│       └── NameCloud (interactive, sized by kudos count)
│
├── AllKudos (flex-col, gap: 40px)
│   ├── Header (px: 144px)
│   │   ├── "Sun* Annual Awards 2025" (24px 700, #FFF)
│   │   └── "ALL KUDOS" (57px 700, #FFEA9E)
│   └── Content (flex-row, gap: 24px, px: 144px)
│       ├── KudoFeed (w: 680px, flex-col, gap: 24px)
│       │   └── KudoPostCard[] (r: 24px, bg: #FFF8E1, p: 40px)
│       │       ├── SenderInfo (avatar + name + stars + badge)
│       │       ├── Arrow icon
│       │       ├── ReceiverInfo (avatar + name + stars + badge)
│       │       ├── HashtagBadge (e.g. "IDOL GIOI TRE")
│       │       ├── Timestamp ("10:00 - 10/30/2025")
│       │       ├── ContentText (max 5 lines, truncate)
│       │       ├── ImageGallery (max 5 thumbnails, horizontal)
│       │       ├── HashtagList (#Dedicated #Inspiring...)
│       │       └── ActionBar (flex, space-between)
│       │           ├── HeartBtn (1,000 + heart icon)
│       │           └── CopyLinkBtn ("Copy Link" + icon)
│       └── Sidebar (w: ~374px, flex-col, gap: 24px)
│           ├── StatsCard (r: 17px, bg: #00070C, border: #998C5F)
│           │   ├── StatRow "So Kudos ban nhan duoc: 25"
│           │   ├── StatRow "So Kudos ban da gui: 25"
│           │   ├── StatRow "So tim ban nhan duoc: 25"
│           │   ├── Divider (1px, #2E3940)
│           │   ├── StatRow "So Secret Box ban da mo: 25"
│           │   ├── StatRow "So Secret Box chua mo: 25"
│           │   └── MoQuaButton (374x60, bg: #FFEA9E, r: 8px)
│           ├── SunnerGiftCard (r: 17px, bg: #00070C, border: #998C5F)
│           │   ├── Title "10 SUNNER NHAN QUA MOI NHAT" (22px 700, #FFEA9E)
│           │   └── SunnerItems[10] (avatar 40px + name + desc)
│           └── SunnerRankingList (r: 17px, bg: #00070C, border: #998C5F)
│               ├── Title "SUNNER CO SU THANG HANG" (22px 700, #FFEA9E)
│               └── RankingItems[] (avatar 40px + name + rank change)
│
└── Footer (shared component)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | - |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Container padding | 16px horizontal |
| Header | Hamburger menu, hide nav text |
| Keyvisual | Reduced height, smaller title |
| Action buttons | Stack vertically, full width |
| Highlight Carousel | Single card view, swipe |
| Spotlight Board | Full width, reduced height |
| All Kudos layout | Single column, sidebar below feed |
| Kudo cards | Full width, reduced padding (24px) |
| Sidebar | Full width, stacked below feed |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Container padding | 48px horizontal |
| Highlight Carousel | 2 visible cards |
| All Kudos layout | Single column or narrow 2-column |
| Kudo cards | Full width |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Container | max-width: 1440px, padding: 0 144px |
| Highlight Carousel | 3 visible cards |
| All Kudos layout | 2-column (680px feed + 374px sidebar) |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-pen | 20x20 | #999 | Input prefix (ghi nhan) |
| icon-search | 20x20 | #999 | Search input prefix |
| icon-chevron-down | 16x16 | #FFF | Dropdown filter indicator |
| icon-chevron-left | 24x24 | #FFF | Carousel prev |
| icon-chevron-right | 24x24 | #FFF | Carousel next |
| icon-arrow-right | 16x16 | #FFF / dark | Sender-to-receiver indicator |
| icon-heart | 20x20 | #999 / #D4271D | Like toggle (inactive/active) |
| icon-link | 16x16 | #00101A | Copy link action |
| icon-gift | 20x20 | #00101A | "Mo qua" button icon |
| icon-pan-zoom | 24x24 | #FFF | Spotlight pan/zoom toggle |
| icon-star (hoa thi) | 16x16 | #FFEA9E | Star count beside user name |
| icon-play | 24x24 | #FFF | Video play overlay |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Button | background-color | 150ms | ease-in-out | Hover |
| Carousel | transform (translateX) | 300ms | ease-out | Prev/Next click |
| Heart icon | scale, color | 200ms | ease-out | Click toggle |
| Kudo card | opacity | 200ms | ease-in | Load/scroll into view |
| Spotlight names | transform | continuous | linear | Pan/zoom interaction |
| Copy toast | opacity, transform | 200ms | ease-out | After copy action |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page Container | 2940:13431 | `bg-[#00101A] min-h-screen` | `<KudosLiveBoardPage>` |
| Header | 2940:13433 | `fixed top-0 bg-[#101417]/80 backdrop-blur` | `<Header>` (shared) |
| Keyvisual | 2940:13437 | `relative h-[512px]` | `<KudosKeyvisual>` |
| Recognition Input | 2940:13449 | `rounded-full border border-[#998C5F] bg-[#FFEA9E]/10` | `<RecognitionInput>` |
| Filter Button | 2940:13459 | `rounded border border-[#998C5F] bg-[#FFEA9E]/10` | `<FilterButton>` |
| Highlight Section | 2940:13451 | `flex flex-col gap-10` | `<HighlightKudos>` |
| Highlight Card | 2940:13465 | `w-[528px] rounded-2xl border-4 border-[#FFEA9E] bg-[#FFF8E1]` | `<KudoHighlightCard>` |
| Carousel | 2940:13461 | `flex gap-6 overflow-hidden relative` | `<KudoCarousel>` |
| Carousel Side Arrow (prev) | 2940:13470 | `absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50` | `<CarouselSideArrow>` |
| Carousel Side Arrow (next) | 2940:13468 | `absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50` | `<CarouselSideArrow>` |
| Pagination | 2940:13471 | `flex justify-center gap-8` | `<CarouselPagination>` |
| Spotlight | 2940:14174 | `border border-[#998C5F] relative overflow-hidden` | `<SpotlightBoard>` |
| All Kudos Section | 2940:13475 | `flex flex-col gap-10` | `<AllKudosSection>` |
| Kudo Post Card | 3127:21871 | `rounded-3xl bg-[#FFF8E1] p-10` | `<KudoPostCard>` |
| Heart Button | I3127:21871;256:5175 | `flex items-center gap-1` | `<HeartButton>` |
| Copy Link Button | I3127:21871;256:5216 | `flex items-center gap-1` | `<CopyLinkButton>` |
| Stats Card | 2940:13489 | `rounded-[17px] bg-[#00070C] border border-[#998C5F] p-6` | `<StatsCard>` |
| "Mo Qua" Button | 2940:13497 | `bg-[#FFEA9E] rounded-lg text-[#00101A] font-bold` | `<OpenGiftButton>` |
| Sunner Gift List | 2940:13510 | `rounded-[17px] bg-[#00070C] border border-[#998C5F]` | `<SunnerGiftList>` |
| Section Title | 2940:13457 | `text-[57px] font-bold text-[#FFEA9E] font-montserrat` | `<SectionTitle>` |
| Spotlight Search | 2940:14833 | `rounded-full border border-[#998C5F] bg-[#FFEA9E]/10` | `<SpotlightSearch>` |
| Pan/Zoom Toggle | 3007:17479 | `cursor-pointer` | `<PanZoomToggle>` |
| Image Gallery | I3127:21871;256:5176 | `flex gap-2` | `<ImageGallery>` |
| Hashtag Badge | I3127:21871;2234:33038 | `bg-[#FFEA9E] rounded px-2 py-1 font-bold text-sm` | `<HashtagBadge>` |
| Sunner Ranking List | - | `rounded-[17px] bg-[#00070C] border border-[#998C5F]` | `<SunnerRankingList>` |

---

## Notes

- All colors use CSS variables defined in the project's design token system (gold-themed dark UI)
- Font families: **Montserrat** (primary), **SVN-Gotham** (hero branding), **Montserrat Alternates** (accent)
- The page uses a dark theme (#00101A background) with gold (#FFEA9E) accents throughout
- Kudo cards use a light cream (#FFF8E1) background for contrast against the dark page
- Sidebar cards use an even darker background (#00070C) than the page
- All interactive elements follow the gold-border/gold-bg-10% pattern for consistency
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
