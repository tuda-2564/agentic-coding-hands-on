# Design Style: Thể lệ (Kudos Rules Panel)

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-19

---

## Design Tokens

### Colors

| Token Name           | Hex Value                  | Opacity | Usage                                          |
| -------------------- | -------------------------- | ------- | ---------------------------------------------- |
| `--color-bg-page`    | `#00101A`                  | 100%    | Full-frame background (navy)                   |
| `--color-bg-panel`   | `#00070C`                  | 100%    | Right-side rules panel background              |
| `--color-gold`       | `#FFEA9E`                  | 100%    | Title, section headings, badge pill borders    |
| `--color-text-white` | `#FFFFFF`                  | 100%    | Body text, badge condition text, button labels |
| `--color-border-close` | `#998C5F`                | 100%    | "Đóng" button border                           |
| `--color-bg-close`   | `rgba(255, 234, 158, 0.10)` | 10%    | "Đóng" button background (transparent gold)   |
| `--color-icon-border`| `#FFFFFF`                  | 100%    | Collectible icon circular border               |

> Canonical Tailwind mappings: `bg-navy` (`#00101A`), `text-kudos-gold` (`#FFEA9E`)

### Typography

| Token Name              | Font Family | Size  | Weight | Line Height | Letter Spacing | Color     |
| ----------------------- | ----------- | ----- | ------ | ----------- | -------------- | --------- |
| `--text-panel-title`    | Montserrat  | 45px  | 700    | 52px        | 0              | `#FFEA9E` |
| `--text-section-h2`     | Montserrat  | 22px  | 700    | 28px        | 0              | `#FFEA9E` |
| `--text-kudos-qd-h2`    | Montserrat  | 24px  | 700    | 32px        | 0              | `#FFEA9E` |
| `--text-body`           | Montserrat  | 16px  | 700    | 24px        | 0.5px          | `#FFFFFF` |
| `--text-badge-condition`| Montserrat  | 16px  | 700    | 24px        | 0.5px          | `#FFFFFF` |
| `--text-badge-desc`     | Montserrat  | 14px  | 700    | 20px        | 0.1px          | `#FFFFFF` |
| `--text-icon-label`     | Montserrat  | 11px  | 700    | 16px        | 0.5px          | `#FFFFFF` |
| `--text-button`         | Montserrat  | 16px  | 700    | 24px        | 0.5px          | varies    |

### Spacing

| Token Name          | Value | Usage                                                                        |
| ------------------- | ----- | ---------------------------------------------------------------------------- |
| `--panel-padding-t` | 24px  | Panel top padding                                                            |
| `--panel-padding-r` | 40px  | Panel right padding                                                          |
| `--panel-padding-b` | 40px  | Panel bottom padding                                                         |
| `--panel-padding-l` | 40px  | Panel left padding                                                           |
| `--panel-gap`       | 40px  | Gap between content area and footer buttons (flex `justify-between`)         |
| `--title-gap`       | 24px  | Gap between Title block and Sections group (`3204:6053` gap = 24px)         |
| `--section-gap`     | 16px  | Gap between items inside the sections group (`3204:6076` gap = 16px): between S1 container, S2 heading, S2 body, icon grid, collection note, S3 heading, S3 body |
| `--section1-gap`    | 16px  | Gap between items inside Section 1 (`3204:6131` gap = 16px): S1 heading, S1 body, 4 badge rows |
| `--icon-grid-gap`   | 16px  | Gap between icon rows (row 1 and row 2), from inner container `3204:6080`    |
| `--icon-grid-px`    | 24px  | Icon grid horizontal padding (`3204:6079` padding: `0px 24px`)               |
| `--icon-cell-gap`   | 8px   | Gap between icon circle and icon label within each cell                      |
| `--button-gap`      | 16px  | Gap between footer buttons                                                   |

### Border & Radius

| Token Name              | Value       | Usage                          |
| ----------------------- | ----------- | ------------------------------ |
| `--radius-badge`        | 55.579px    | Hero badge pill border-radius  |
| `--radius-button`       | 4px         | Footer button border-radius    |
| `--radius-icon`         | 100px       | Collectible icon circle        |
| `--border-badge`        | 0.579px solid `#FFEA9E` | Badge pill border |
| `--border-close`        | 1px solid `#998C5F` | "Đóng" button border |
| `--border-icon`         | 2px solid `#FFFFFF` | Collectible icon border |

---

## Layout Specifications

### Container

| Property   | Value   | Notes                                                     |
| ---------- | ------- | --------------------------------------------------------- |
| Frame size | 1440×1796px | Full-page overlay frame                               |
| Panel x    | 887px   | Panel starts at x=887 (right ~38.6% of frame)           |
| Panel size | 553×1410px | Fixed-width right-side panel                          |
| Panel bg   | `#00070C` | Near-black dark background                             |
| Panel padding | `24px 40px 40px 40px` | top right bottom left               |
| Panel layout | `flex-col justify-between` | Content on top, buttons on bottom |
| Panel gap  | 40px    | Between content area and footer (`justify-between`)      |
| Content area | `flex-1 overflow-y-auto` | Scrollable; takes remaining height |
| Footer     | `flex-shrink-0`          | Stays pinned at bottom of panel  |
| **Web position** | `fixed top-0 right-0` | Figma: `absolute`; web: `fixed` for overlay behavior |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Page frame (1440×1796px, bg: #00101A)                              │
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  Left artwork area   │  │  Panel (553×1410px, bg: #00070C)     │ │
│  │  (decorative, 887px) │  │  padding: 24px 40px 40px 40px        │ │
│  │                      │  │  flex-col, justify-between, gap: 40px│ │
│  │                      │  │                                      │ │
│  │                      │  │  ┌────────────────────────────────┐  │ │
│  │                      │  │  │ Content area (473px wide)       │  │ │
│  │                      │  │  │ flex-col, gap: 24px             │  │ │
│  │                      │  │  │                                 │  │ │
│  │                      │  │  │  "Thể lệ" (title, 45px gold)   │  │ │
│  │                      │  │  │                                 │  │ │
│  │                      │  │  │  ── Section 1 ──────────────── │  │ │
│  │                      │  │  │  Heading (22px gold, uppercase) │  │ │
│  │                      │  │  │  Body (16px white, justified)   │  │ │
│  │                      │  │  │  Hero row 1 (400×72px)          │  │ │
│  │                      │  │  │  Hero row 2 (400×72px)          │  │ │
│  │                      │  │  │  Hero row 3 (400×72px)          │  │ │
│  │                      │  │  │  Hero row 4 (400×72px)          │  │ │
│  │                      │  │  │                                 │  │ │
│  │                      │  │  │  ── Section 2 ──────────────── │  │ │
│  │                      │  │  │  Heading (22px gold, uppercase) │  │ │
│  │                      │  │  │  Body (16px white, justified)   │  │ │
│  │                      │  │  │  Icon grid (2×3, gap: 16px)     │  │ │
│  │                      │  │  │    [REVIVAL][TOUCH][STAY GOLD]  │  │ │
│  │                      │  │  │    [FLOW][BEYOND][ROOT FURTHER] │  │ │
│  │                      │  │  │  Collection note (16px white)   │  │ │
│  │                      │  │  │                                 │  │ │
│  │                      │  │  │  ── Section 3 ──────────────── │  │ │
│  │                      │  │  │  "KUDOS QUỐC DÂN" (24px gold)  │  │ │
│  │                      │  │  │  Body (16px white, justified)   │  │ │
│  │                      │  │  └────────────────────────────────┘  │ │
│  │                      │  │                                      │ │
│  │                      │  │  ┌────────────────────────────────┐  │ │
│  │                      │  │  │ Footer buttons (473×56px)       │  │ │
│  │                      │  │  │ flex-row, gap: 16px             │  │ │
│  │                      │  │  │  [Đóng ~94px] [Viết KUDOS 363px]│ │ │
│  │                      │  │  └────────────────────────────────┘  │ │
│  └──────────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Panel Container — Node `3204:6052`

| Property        | Value                    | Tailwind / CSS                              |
| --------------- | ------------------------ | ------------------------------------------- |
| **Node ID**     | `3204:6052`              | —                                           |
| width           | 553px                    | `w-[553px]`                                 |
| height          | 1410px (Figma static)    | `h-screen` (web: use `100vh` to fill viewport) |
| background      | `#00070C`                | `bg-[#00070C]`                              |
| padding         | `24px 40px 40px 40px`    | `pt-6 px-10 pb-10`                          |
| display         | flex-col                 | `flex flex-col`                             |
| align-items     | flex-end                 | `items-end`                                 |
| justify-content | space-between            | `justify-between`                           |
| gap             | 40px                     | `gap-10`                                    |

---

### Panel Title — Node `3204:6055`

| Property    | Value     | Tailwind / CSS                                 |
| ----------- | --------- | ---------------------------------------------- |
| **Node ID** | `3204:6055` | —                                            |
| text        | "Thể lệ"  | —                                              |
| font-family | Montserrat | `font-montserrat`                             |
| font-size   | 45px      | `text-[45px]`                                  |
| font-weight | 700       | `font-bold`                                    |
| line-height | 52px      | `leading-[52px]`                               |
| color       | `#FFEA9E` | `text-kudos-gold`                              |

---

### Section Heading (Hero + Collector) — Nodes `3204:6132`, `3204:6077`

| Property    | Value     | Tailwind / CSS                       |
| ----------- | --------- | ------------------------------------ |
| **Node IDs**| `3204:6132`, `3204:6077` | —              |
| font-family | Montserrat | `font-montserrat`                   |
| font-size   | 22px      | `text-[22px]`                        |
| font-weight | 700       | `font-bold`                          |
| line-height | 28px      | `leading-7`                          |
| color       | `#FFEA9E` | `text-kudos-gold`                    |
| text-case   | uppercase | `uppercase`                          |

---

### Body Text — Nodes `3204:6133`, `3204:6078`, `3204:6089`, `3204:6091`

| Property       | Value     | Tailwind / CSS                    |
| -------------- | --------- | --------------------------------- |
| font-family    | Montserrat | `font-montserrat`                |
| font-size      | 16px      | `text-base`                       |
| font-weight    | 700       | `font-bold`                       |
| line-height    | 24px      | `leading-6`                       |
| letter-spacing | 0.5px     | `tracking-[0.5px]`                |
| color          | `#FFFFFF` | `text-white`                      |
| text-align     | justify   | `text-justify`                    |

**Exact content per body text node:**

| Node ID       | Text Content                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `3204:6133`   | "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile"                                                                                     |
| `3204:6078`   | "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA."     |
| `3204:6089`   | "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025."                                                                                                                                 |
| `3204:6091`   | "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further."                                                                        |

---

### Hero Badge Row — Nodes `3204:6161`, `3204:6170`, `3204:6179`, `3204:6188`

Each row is a **2-tier container** (absolutely positioned children within 400×72px frame):

| Property    | Value     | Tailwind / CSS              |
| ----------- | --------- | --------------------------- |
| **Node IDs**| `3204:6161`, `3204:6170`, `3204:6179`, `3204:6188` | — |
| width       | 400px     | `w-full` (within content)   |
| height      | 72px      | `h-[72px]`                  |
| position    | relative  | `relative`                  |

**Tier 1 — Badge + Condition (top row, approx top:0):**

| Element        | Position          | Layout                                     |
| -------------- | ----------------- | ------------------------------------------ |
| Badge pill     | top:0, left:20px  | `w-[126px] h-[22px]`                       |
| Condition text | top:0, left:154px | fills remaining width (~270px), `text-base font-bold leading-6 text-white tracking-[0.5px]` |
| Gap badge→text | 8px               | badge ends at 146px, condition starts at 154px |

**Tier 2 — Description (below tier 1, approx top:28px):**

| Element          | Position         | Layout                                  |
| ---------------- | ---------------- | --------------------------------------- |
| Description text | top:28px, left:20px | full width, `text-sm font-bold leading-5 text-white text-justify tracking-[0.1px]` |

**Badge pill** (left element):

> ⚠️ **Image component**: Badge pills are `MM_MEDIA_*` Figma component instances containing a background image (badge artwork), a dark gradient overlay (`rgba(9,36,50,0.5)`), and white text on top. For implementation, use the image assets for each tier if available, or replicate with a styled container + inner text as fallback.

| Property      | Value              | Tailwind / CSS                          |
| ------------- | ------------------ | --------------------------------------- |
| width         | 126px              | `w-[126px]`                             |
| height        | 22px               | `h-[22px]`                              |
| border        | `0.579px solid #FFEA9E` (≈1px CSS) | `border border-kudos-gold` |
| border-radius | 55.579px           | `rounded-full`                          |
| text-align    | center             | `text-center`                           |
| font-size     | ~13px (13.205px)   | `text-[13px]`                           |
| font-weight   | 700                | `font-bold`                             |
| color         | `#FFFFFF`          | `text-white`                            |
| text-shadow   | `0 0.447px 1.787px #000` | `[text-shadow:0_0.447px_1.787px_#000]` |

**Condition text** (middle — "Có X người gửi Kudos cho bạn"):

| Property    | Value     | Tailwind / CSS       |
| ----------- | --------- | -------------------- |
| font-size   | 16px      | `text-base`          |
| font-weight | 700       | `font-bold`          |
| line-height | 24px      | `leading-6`          |
| color       | `#FFFFFF` | `text-white`         |

**Description text** (second row — full width below badge+condition):

| Property       | Value     | Tailwind / CSS          |
| -------------- | --------- | ----------------------- |
| font-size      | 14px      | `text-sm`               |
| font-weight    | 700       | `font-bold`             |
| line-height    | 20px      | `leading-5`             |
| letter-spacing | 0.1px     | `tracking-[0.1px]`      |
| color          | `#FFFFFF` | `text-white`            |
| text-align     | justified | `text-justify`          |

**Hero Tiers Data:**

| Tier         | Badge Label     | Condition                          | Description                                                                                          |
| ------------ | --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| New Hero     | "New Hero"      | Có 1-4 người gửi Kudos cho bạn   | Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.  |
| Rising Hero  | "Rising Hero"   | Có 5-9 người gửi Kudos cho bạn   | Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.              |
| Super Hero ⚠️ | "Super Hero"  | Có 10–20 người gửi Kudos cho bạn | Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến. |
| Legend Hero  | "Legend Hero"   | Có hơn 20 người gửi Kudos cho bạn | Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình. |

> ⚠️ **Super Hero description (node `3204:6182`)**: Figma shows `textAlign: "left"` while all other badge descriptions use `textAlign: "JUSTIFIED"`. This appears to be a Figma authoring inconsistency. **Recommended implementation**: use `text-justify` uniformly for all 4 badge description lines for visual consistency.

---

### Collectible Icon Grid — Nodes `3204:6079` (outer) + `3204:6080` (inner)

> ⚠️ **2-level nesting**: The icon grid has two nested containers, each with `px-6` padding. Effective horizontal indent = 48px per side, leaving rows 377px wide (473 − 48×2 = 377px).

**Outer container — Node `3204:6079`:**

| Property    | Value      | Tailwind / CSS          |
| ----------- | ---------- | ----------------------- |
| **Node ID** | `3204:6079` | —                      |
| size        | 473×240px  | full content width      |
| padding     | `0px 24px` | `px-6`                  |
| display     | flex-col   | `flex flex-col`         |
| gap         | 24px       | `gap-6` (1 child only → not applied between rows) |

**Inner container — Node `3204:6080`:**

| Property    | Value      | Tailwind / CSS          |
| ----------- | ---------- | ----------------------- |
| **Node ID** | `3204:6080` | —                      |
| size        | 425×240px  | —                       |
| padding     | `0px 24px` | `px-6`                  |
| display     | flex-col   | `flex flex-col`         |
| gap         | **16px**   | `gap-4` ← **actual row gap** |

Icon row (`flex-row justify-between`), width = 377px:

| Property    | Value  | Tailwind / CSS               |
| ----------- | ------ | ---------------------------- |
| display     | flex   | `flex flex-row`              |
| justify     | between | `justify-between`           |

Each icon cell wrapper:

| Property        | Value             | Tailwind / CSS                    |
| --------------- | ----------------- | --------------------------------- |
| cell width      | 80px              | `w-20`                            |
| cell height     | 88–120px (varies) | —                                 |
| display         | flex-col          | `flex flex-col`                   |
| align-items     | center            | `items-center`                    |
| justify-content | center            | `justify-center`                  |
| gap (icon→label)| 8px              | `gap-2`                           |

Icon image circle (inside cell):

| Property      | Value           | Tailwind / CSS              |
| ------------- | --------------- | --------------------------- |
| size          | 64×64px         | `w-16 h-16`                 |
| border        | `2px solid #FFFFFF` | `border-2 border-white` |
| border-radius | 100px (circle)  | `rounded-full`              |
| overflow      | hidden          | `overflow-hidden`           |

Icon label (below circle):

| Property       | Value                    | Tailwind / CSS                        |
| -------------- | ------------------------ | ------------------------------------- |
| width          | 80px                     | `w-20`                                |
| font-size      | 12px (1-word), 11px (multi-word) | see per-icon table below     |
| font-weight    | 700                      | `font-bold`                           |
| line-height    | 16px                     | `leading-4`                           |
| letter-spacing | 0.5px                    | `tracking-[0.5px]`                    |
| color          | `#FFFFFF`                | `text-white`                          |
| text-align     | center                   | `text-center`                         |

**Per-icon label font sizes (from Figma):**

| Icon                | Font Size | Label Lines | Cell Height |
| ------------------- | --------- | ----------- | ----------- |
| REVIVAL             | 12px      | 1           | 88px        |
| TOUCH OF LIGHT      | 11px      | 2           | 104px       |
| STAY GOLD           | 12px      | 1           | 88px        |
| FLOW TO HORIZON     | 11px      | 2           | 104px       |
| BEYOND THE BOUNDARY | 11px      | 3           | 120px       |
| ROOT FURTHER        | 11px      | 2           | 104px       |

**6 Collectible Icons:**

| Row | Position | Label               |
| --- | -------- | ------------------- |
| 1   | Left     | REVIVAL             |
| 1   | Center   | TOUCH OF LIGHT      |
| 1   | Right    | STAY GOLD           |
| 2   | Left     | FLOW TO HORIZON     |
| 2   | Center   | BEYOND THE BOUNDARY |
| 2   | Right    | ROOT FURTHER        |

---

### Kudos Quốc Dân Heading — Node `3204:6090`

| Property    | Value     | Tailwind / CSS      |
| ----------- | --------- | ------------------- |
| **Node ID** | `3204:6090` | —                 |
| font-family | Montserrat | `font-montserrat`  |
| font-size   | 24px      | `text-2xl`          |
| font-weight | 700       | `font-bold`         |
| line-height | 32px      | `leading-8`         |
| color       | `#FFEA9E` | `text-kudos-gold`   |
| text-case   | uppercase | `uppercase`         |

---

### Footer Buttons — Node `3204:6092`

Container:

| Property    | Value     | Tailwind / CSS         |
| ----------- | --------- | ---------------------- |
| **Node ID** | `3204:6092` | —                    |
| width       | 473px     | `w-full`               |
| height      | 56px      | `h-14`                 |
| display     | flex-row  | `flex flex-row`        |
| gap         | 16px      | `gap-4`                |

**"Đóng" Button — Node `3204:6093`**:

| Property      | Value                      | Tailwind / CSS                                  |
| ------------- | -------------------------- | ----------------------------------------------- |
| **Node ID**   | `3204:6093`                | —                                               |
| width         | flex 1 (fill remaining)    | `flex-1`                                        |
| height        | 56px                       | `h-14`                                          |
| background    | `rgba(255, 234, 158, 0.10)` | `bg-[rgba(255,234,158,0.10)]`                  |
| border        | `1px solid #998C5F`        | `border border-[#998C5F]`                       |
| border-radius | 4px                        | `rounded`                                       |
| padding       | 16px                       | `p-4`                                           |
| display       | flex, items-center, gap    | `flex items-center justify-center gap-2`        |
| icon          | X / close, 24px            | `<Icon name="x" size={24} />`                   |
| text color    | `#FFFFFF`                  | `text-white`                                    |
| font-size     | 16px                       | `text-base`                                     |
| font-weight   | 700                        | `font-bold`                                     |
| letter-spacing| 0.5px                      | `tracking-[0.5px]`                              |
| action        | Close/dismiss panel        | —                                               |

**States — "Đóng":**

| State    | Changes                                              |
| -------- | ---------------------------------------------------- |
| Hover    | `opacity: 0.8`                                       |
| Focus    | `outline: 2px solid #998C5F, outline-offset: 2px`   |
| Active   | `opacity: 0.6`                                       |
| Disabled | `opacity: 0.5, cursor: not-allowed`                  |

**"Viết KUDOS" Button — Node `3204:6094`**:

| Property      | Value       | Tailwind / CSS                                   |
| ------------- | ----------- | ------------------------------------------------ |
| **Node ID**   | `3204:6094` | —                                                |
| width         | 363px       | `w-[363px]`                                      |
| height        | 56px        | `h-14`                                           |
| background    | `#FFEA9E`   | `bg-kudos-gold`                                  |
| border        | none        | —                                                |
| border-radius | 4px         | `rounded`                                        |
| padding       | 16px        | `p-4`                                            |
| display       | flex, items-center, gap | `flex items-center justify-center gap-2` |
| icon          | pen/edit, 24px | `<Icon name="pencil" size={24} />`            |
| text color    | `#00101A`   | `text-navy`                                      |
| font-size     | 16px        | `text-base`                                      |
| font-weight   | 700         | `font-bold`                                      |
| letter-spacing| 0.5px       | `tracking-[0.5px]`                               |
| action        | Navigate to Viết Kudo screen (`520:11602`) | —          |

**States — "Viết KUDOS":**

| State    | Changes                                              |
| -------- | ---------------------------------------------------- |
| Hover    | `opacity: 0.9`                                       |
| Focus    | `outline: 2px solid #FFEA9E, outline-offset: 2px`   |
| Active   | `opacity: 0.8`                                       |
| Disabled | `opacity: 0.5, cursor: not-allowed`                  |

---

## Component Hierarchy with Styles

```
Panel (bg: #00070C, 553×1410px, pt-6 px-10 pb-10, flex-col, justify-between, gap-10)
├── Content Area (flex-col, gap-6)
│   ├── Title: "Thể lệ" (Montserrat 45px/52px 700, #FFEA9E)
│   │
│   ├── Section 1: Người Nhận Kudos
│   │   ├── Heading (Montserrat 22px/28px 700, #FFEA9E, uppercase)
│   │   ├── Body text (16px/24px 700, white, tracking-0.5px, justify)
│   │   │     "Dựa trên số lượng đồng đội gửi trao Kudos..."
│   │   ├── HeroBadgeRow × 4 (400×72px, relative)
│   │   │   ├── [top:0]  BadgePill (126×22px, image-based MM_MEDIA_*, border 1px #FFEA9E, rounded-full)
│   │   │   ├── [top:0, left:154px]  ConditionText (16px/24px 700, white, tracking-0.5px)
│   │   │   └── [top:28px]  DescriptionText (14px/20px 700, white, tracking-0.1px, justify)
│   │
│   ├── Section 2: Người Gửi Kudos
│   │   ├── Heading (Montserrat 22px/28px 700, #FFEA9E, uppercase)
│   │   ├── Body text (16px/24px 700, white, tracking-0.5px, justify)
│   │   ├── IconGrid (px-6, flex-col, gap-6)
│   │   │   ├── Row 1 (flex-row, justify-between)
│   │   │   │   ├── IconCell: REVIVAL (80×88px, flex-col, items-center, gap-2)
│   │   │   │   │   ├── img (64×64, border-2 white, rounded-full)
│   │   │   │   │   └── label "REVIVAL" (12px/16px 700, white, center)
│   │   │   │   ├── IconCell: TOUCH OF LIGHT (80×104px)
│   │   │   │   │   ├── img (64×64, border-2 white, rounded-full)
│   │   │   │   │   └── label "TOUCH OF LIGHT" (11px/16px 700, 2-line)
│   │   │   │   └── IconCell: STAY GOLD (80×88px)
│   │   │   │       ├── img (64×64, border-2 white, rounded-full)
│   │   │   │       └── label "STAY GOLD" (12px/16px 700, 1-line)
│   │   │   └── Row 2 (flex-row, justify-between)
│   │   │       ├── IconCell: FLOW TO HORIZON (80×104px)
│   │   │       ├── IconCell: BEYOND THE BOUNDARY (80×120px)
│   │   │       └── IconCell: ROOT FURTHER (80×104px)
│   │   └── CollectionNote (16px/24px 700, white)
│   │
│   └── Section 3: Kudos Quốc Dân
│       ├── Heading (Montserrat 24px/32px 700, #FFEA9E, uppercase)
│       └── Body text (16px/24px 700, white, tracking-0.5px, justify)
│
└── Footer Buttons (flex-row, gap-4, h-14)
    ├── DongButton (flex-1, bg rgba(255,234,158,0.10), border #998C5F, rounded)
    │   ├── <Icon name="x" size={24} className="text-white" />
    │   └── "Đóng" (text-base font-bold tracking-[0.5px] text-white)
    └── VietKudosButton (w-[363px], bg-kudos-gold, rounded)
        ├── <Icon name="pencil" size={24} className="text-navy" />
        └── "Viết KUDOS" (text-base font-bold tracking-[0.5px] text-navy)
```

---

## Responsive Specifications

This panel is designed as a **right-side overlay/drawer** that appears over the main page content. It is not a standalone full-width page.

### Breakpoints

| Name    | Min Width | Max Width | Behavior                                  |
| ------- | --------- | --------- | ----------------------------------------- |
| Mobile  | 0         | 767px     | Panel takes full screen width (100vw)     |
| Tablet  | 768px     | 1023px    | Panel width: 480px, full height           |
| Desktop | 1024px    | ∞         | Panel width: 553px, fixed right position  |

### Responsive Changes

#### Mobile (< 768px)

| Component       | Changes                                        |
| --------------- | ---------------------------------------------- |
| Panel           | `w-full`, full screen overlay                  |
| Panel padding   | `16px 20px 20px 20px`                          |
| Title           | `text-[32px]`                                  |
| Section headings | `text-[18px]`                                 |
| Hero badge rows | `w-full`                                       |
| "Viết KUDOS"    | `flex-1` (equal width with Đóng)               |

#### Desktop (≥ 1024px)

| Component  | Changes                    |
| ---------- | -------------------------- |
| Panel      | 553px fixed width          |
| Layout     | As per Figma design spec   |

---

## Icon Specifications

| Icon Name | Size  | Color     | Usage                     |
| --------- | ----- | --------- | ------------------------- |
| `x`       | 24px  | `#FFFFFF` | "Đóng" button close icon  |
| `pencil`  | 24px  | `#00101A` | "Viết KUDOS" button icon  |

> All icons MUST use the `<Icon>` component (`src/components/ui/icon.tsx`), NOT raw SVG or `<img>` tags.

---

## Animation & Transitions

| Element         | Property   | Duration | Easing      | Trigger    |
| --------------- | ---------- | -------- | ----------- | ---------- |
| Panel           | slide-in from right | 200ms | ease-out | Open    |
| Panel           | slide-out to right  | 150ms | ease-in  | Close (Đóng) |
| Overlay backdrop | opacity 0→0.5 | 200ms | ease-out | Open   |
| "Đóng" button   | opacity    | 150ms    | ease-in-out | Hover      |
| "Viết KUDOS"    | opacity    | 150ms    | ease-in-out | Hover      |

---

## Implementation Mapping

| Design Element         | Figma Node ID | Tailwind / CSS                              | React Component               |
| ---------------------- | ------------- | ------------------------------------------- | ----------------------------- |
| Panel container        | `3204:6052`   | `fixed top-0 right-0 w-[553px] h-screen bg-[#00070C] pt-6 px-10 pb-10 flex flex-col justify-between items-end overflow-hidden z-50` | `<KudosRulesPanel>` |
| Panel title            | `3204:6055`   | `text-kudos-gold font-bold text-[45px] leading-[52px]`          | `<h2>` inside panel           |
| Section 1 heading      | `3204:6132`   | `text-kudos-gold font-bold text-[22px] leading-7 uppercase`     | `<h3>`                        |
| Section 2 heading      | `3204:6077`   | same as above                                                    | `<h3>`                        |
| Kudos QD heading       | `3204:6090`   | `text-kudos-gold font-bold text-2xl leading-8 uppercase`        | `<h3>`                        |
| Body text              | `3204:6133`   | `text-white font-bold text-base leading-6 tracking-[0.5px] text-justify` | `<p>`             |
| Hero badge row         | `3204:6161`   | `relative h-[72px] w-full`                                      | `<HeroBadgeRow>`              |
| Badge pill             | inner el      | `absolute top-0 left-5 w-[126px] h-[22px] border border-kudos-gold rounded-full text-white text-[13px] font-bold text-center` (or `<Image>` if asset exists) | `<span>` or `<Image>` |
| Condition text         | inner el      | `absolute top-0 left-[154px] text-white font-bold text-base leading-6 tracking-[0.5px]` | `<span>` |
| Description text       | inner el      | `absolute top-7 left-5 right-0 text-white font-bold text-sm leading-5 tracking-[0.1px] text-justify` | `<p>` |
| Content area           | `3204:6053`   | `w-full flex-1 flex flex-col gap-4 overflow-y-auto`             | `<div>`                       |
| Icon grid (outer)      | `3204:6079`   | `flex flex-col px-6` (1 child; gap-6 not applied)              | `<div>` wrapper               |
| Icon grid (inner)      | `3204:6080`   | `flex flex-col gap-4 px-6` (gap-4 = 16px between rows)         | `<IconGrid>`                  |
| Icon cell wrapper      | inner cells   | `w-20 flex flex-col items-center justify-center gap-2`          | `<div>`                       |
| Icon image circle      | inner image   | `w-16 h-16 rounded-full border-2 border-white overflow-hidden`  | `<Image>` / `<div>`           |
| Icon label             | inner text    | `w-20 text-[11px] font-bold leading-4 tracking-[0.5px] text-white text-center` | `<span>` |
| Footer buttons         | `3204:6092`   | `flex-shrink-0 flex flex-row gap-4 h-14`                        | `<div>`                       |
| Backdrop overlay       | —             | `fixed inset-0 bg-black/50 z-40`                                | `<div>` (conditionally rendered) |
| "Đóng" button          | `3204:6093`   | `flex-1 flex items-center justify-center gap-2 border border-[#998C5F] bg-[rgba(255,234,158,0.10)] rounded p-4 text-white font-bold text-base tracking-[0.5px] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-2` | `<button>` |
| "Viết KUDOS" button    | `3204:6094`   | `w-[363px] flex items-center justify-center gap-2 bg-kudos-gold rounded p-4 text-navy font-bold text-base tracking-[0.5px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-kudos-gold focus-visible:outline-offset-2` | `<button>` or `<Link>` |

---

## Notes

- The frame `3204:6051` is 1440×1796px total; the **implementable panel** is the right 553px (x:887 onward). The left is decorative artwork belonging to the parent `/kudos` page.
- All text uses **Montserrat** font family (must be loaded via `next/font/google` or global CSS import).
- **Panel positioning for web**: Figma uses `position: absolute` within the frame. For web, implement as `position: fixed; top: 0; right: 0;` with `z-index` above page content and a backdrop overlay at a lower z-index.
- **Panel height for web**: Figma static height is `1410px`. For web, use `height: 100vh` (`h-screen`) so it fills the viewport; content area should have `overflow-y: auto` and `flex: 1` to allow internal scrolling; footer must have `flex-shrink: 0` to stay pinned at bottom.
- **Hero badge pills are image-based** (`MM_MEDIA_*` Figma components): each contains a background badge artwork image, a dark gradient overlay (`rgba(9,36,50,0.5)`), and white text. Obtain separate badge image assets (e.g., `new-hero-badge.png`). Fallback if assets unavailable: `<span class="border border-kudos-gold rounded-full text-white text-[13px] font-bold px-2 py-0.5">New Hero</span>`.
- **Collectible icon images** (REVIVAL, TOUCH OF LIGHT, etc.): static assets stored under `/public/images/icons/`. Use `next/image` for optimization. Fallback: `<div class="w-16 h-16 rounded-full border-2 border-white bg-navy flex items-center justify-center" />` + label text.
- "Viết KUDOS" button navigates to the **Viết Kudo screen** (Figma frame `520:11602`), route `/kudos/write` or equivalent.
- Color contrast: `#FFEA9E` on `#00070C` = ~8.7:1 (exceeds WCAG AA). `#FFFFFF` on `#00070C` = ~21:1. Both pass.
