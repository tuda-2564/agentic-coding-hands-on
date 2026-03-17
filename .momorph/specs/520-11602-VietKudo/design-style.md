# Design Style: Viết Kudo

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**Figma Link**: [Open in Figma](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=520-11602)
**Extracted At**: 2026-03-11

> ⚠️ **Note on Node IDs**: Figma direct access was unavailable during extraction. Node IDs listed in this document are **estimated** based on visual analysis of screenshots. All IDs MUST be verified against the actual Figma file before implementation.

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-background | #00101A | 100% | Page background (dark navy) |
| --color-modal-bg | #0A1E2B | 100% | Modal dialog background |
| --color-modal-overlay | #000D14 | 70% | Backdrop overlay behind modal |
| --color-surface-input | #001520 | 100% | Input field backgrounds |
| --color-surface-card | #0F2333 | 100% | Image thumbnails / card surfaces |
| --color-gold-primary | #C8A96E | 100% | Gold accents, borders, badge highlights |
| --color-gold-light | #E8D5A8 | 100% | Lighter gold for text highlights |
| --color-kudos-orange | #FF6B35 | 100% | Send button, accent actions |
| --color-text-primary | #FFFFFF | 100% | Heading text, labels |
| --color-text-secondary | #B0BEC5 | 100% | Placeholder text, hints |
| --color-text-muted | #6B8A9A | 100% | Disabled/secondary helper text |
| --color-border | #1E3448 | 100% | Input borders, dividers |
| --color-border-gold | #C8A96E | 30% | Gold subtle borders |
| --color-hashtag-bg | #0F2A3D | 100% | Hashtag pill background |
| --color-error | #EF4444 | 100% | Validation errors |
| --color-cancel-btn | #1A2D3E | 100% | Cancel button background |
| --color-cancel-btn-border | #2D4A63 | 100% | Cancel button border |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Inter | 20px | 700 | 28px | 0 |
| --text-field-label | Inter | 14px | 600 | 20px | 0 |
| --text-field-value | Inter | 14px | 400 | 20px | 0 |
| --text-placeholder | Inter | 14px | 400 | 20px | 0 |
| --text-helper | Inter | 12px | 400 | 16px | 0 |
| --text-badge-name | Inter | 13px | 600 | 18px | 0 |
| --text-hashtag | Inter | 13px | 500 | 18px | 0 |
| --text-button | Inter | 14px | 600 | 20px | 0.02em |
| --text-body-sm | Inter | 13px | 400 | 18px | 0 |
| --text-rich-text | Inter | 14px | 400 | 22px | 0 |
| --text-char-count | Inter | 12px | 400 | 16px | 0 |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-xs | 4px | Tight gaps, tag padding |
| --spacing-sm | 8px | Inner field padding (vertical), icon gaps |
| --spacing-md | 16px | Field-to-field gaps, modal padding |
| --spacing-lg | 24px | Modal header padding, section gaps |
| --spacing-xl | 32px | Modal horizontal padding |
| --spacing-2xl | 48px | Modal max width padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-sm | 4px | Hashtag pills, image thumbnails |
| --radius-md | 8px | Input fields, buttons |
| --radius-lg | 12px | Modal container |
| --radius-full | 9999px | Avatar, round buttons |
| --border-width | 1px | Default input border |
| --border-width-focus | 2px | Active/focus input border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-modal | 0 24px 64px rgba(0, 0, 0, 0.7) | Modal elevation |
| --shadow-overlay | 0 0 0 9999px rgba(0, 13, 20, 0.7) | Backdrop |
| --shadow-input-focus | 0 0 0 3px rgba(200, 169, 110, 0.2) | Gold focus glow |

---

## Layout Specifications

### Modal Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 600px | Fixed modal width |
| max-height | 90vh | Header + body + footer combined height limit |
| padding | 0 | No container padding; header/body/footer handle own padding |
| background | #0A1E2B | Dark navy modal bg |
| border | 1px solid rgba(200,169,110,0.3) | Gold subtle border |
| border-radius | 12px | Rounded corners |
| box-shadow | 0 24px 64px rgba(0,0,0,0.7) | Elevation |
| overflow-y | hidden | Outer container does NOT scroll |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────┐
│  Backdrop Overlay (rgba(0,13,20,0.7), full screen)        │
│                                                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Modal (w: 600px, bg: #0A1E2B, p: 0, overflow: hidden) │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Header (flex, justify-between)              │  │   │
│  │  │  "Gửi lời cảm ơn và ghi nhận đến đồng đội"  │  │   │
│  │  │                                [✕ Close]     │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Người nhận (Recipient field)                │  │   │
│  │  │  Label: "Người nhận"                         │  │   │
│  │  │  ┌──────────────────────────────────────┐   │  │   │
│  │  │  │ 🔍 Tìm kiếm... (search input)        │   │  │   │
│  │  │  └──────────────────────────────────────┘   │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Danh hiệu (Badge/Title field)               │  │   │
│  │  │  Label: "Danh hiệu"                          │  │   │
│  │  │  Helper: "Đánh chọn người nhận hiệu..."      │  │   │
│  │  │  ┌──────────────────────────────────────┐   │  │   │
│  │  │  │  Badge Selector (dropdown)            │   │  │   │
│  │  │  └──────────────────────────────────────┘   │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Nội dung (Content / Rich Text)              │  │   │
│  │  │  Label: "Nội dung"                           │  │   │
│  │  │  Hint: "Bạn có thể dùng '@tên' để nhắc tới  │  │   │
│  │  │         đồng nghiệp của bạn"                 │  │   │
│  │  │  ┌──────────────────────────────────────┐   │  │   │
│  │  │  │  [B] [I] [U] [⁼] … (formatting bar) │   │  │   │
│  │  │  │                                       │   │  │   │
│  │  │  │  (editable rich text area, ~100px h)  │   │  │   │
│  │  │  └──────────────────────────────────────┘   │  │   │
│  │  │  Character count: 0/500                      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Hashtag (section)                           │  │   │
│  │  │  Label: "Hashtag"                            │  │   │
│  │  │  ┌────────────────────┐ [+ Thêm hashtag]    │  │   │
│  │  │  │ # hashtag input    │                      │  │   │
│  │  │  └────────────────────┘                      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Image (section)                             │  │   │
│  │  │  Label: "Image"                              │  │   │
│  │  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ [+Image]    │  │   │
│  │  │  │im1│ │im2│ │im3│ │im4│ │im5│              │  │   │
│  │  │  └───┘ └───┘ └───┘ └───┘ └───┘              │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  [gap: 16px]                                       │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Footer Actions (flex, justify-end, gap: 8px) │  │   │
│  │  │              [Hủy]          [Gửi ►]          │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Modal Container

> The container itself has **no padding** — padding is handled by header, body, and footer sub-sections individually to support independent scrolling.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11602` | - |
| width | 600px | `width: 600px` |
| max-height | 90vh | `max-height: 90vh` |
| padding | 0 | `padding: 0` |
| background | #0A1E2B | `background-color: #0A1E2B` |
| border | 1px solid rgba(200,169,110,0.3) | `border: 1px solid rgba(200,169,110,0.3)` |
| border-radius | 12px | `border-radius: 12px` |
| box-shadow | 0 24px 64px rgba(0,0,0,0.7) | `box-shadow: 0 24px 64px rgba(0,0,0,0.7)` |
| overflow | hidden | `overflow: hidden` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |

---

### Modal Header

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11603` | - |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| padding-bottom | 16px | `padding-bottom: 16px` |
| border-bottom | 1px solid rgba(200,169,110,0.2) | `border-bottom: 1px solid rgba(200,169,110,0.2)` |

**Title text:**
| Property | Value | CSS |
|----------|-------|-----|
| font-size | 20px | `font-size: 20px` |
| font-weight | 700 | `font-weight: 700` |
| color | #FFFFFF | `color: white` |
| line-height | 28px | `line-height: 28px` |

**Close button (✕):**
| Property | Value | CSS |
|----------|-------|-----|
| width | 32px | `width: 32px` |
| height | 32px | `height: 32px` |
| border-radius | 50% | `border-radius: 50%` |
| background | transparent | `background: transparent` |
| color | #B0BEC5 | `color: #B0BEC5` |
| cursor | pointer | `cursor: pointer` |

**Close button states:**
| State | Changes |
|-------|---------|
| Hover | color: #FFFFFF, background: rgba(255,255,255,0.1) |
| Focus | outline: 2px solid #C8A96E |

---

### Người nhận (Recipient Search Input)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11610` | - |
| width | 100% | `width: 100%` |
| height | 44px | `height: 44px` |
| padding | 10px 12px 10px 36px | `padding: 10px 12px 10px 36px` |
| background | #001520 | `background-color: #001520` |
| border | 1px solid #1E3448 | `border: 1px solid #1E3448` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 14px | `font-size: 14px` |
| color | #FFFFFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Placeholder | color: #6B8A9A |
| Focus | border-color: #C8A96E, box-shadow: 0 0 0 3px rgba(200,169,110,0.2) |
| Error | border-color: #EF4444 |
| With results | dropdown appears below |

**Search icon:**
| Property | Value |
|----------|-------|
| size | 16x16px |
| color | #6B8A9A |
| position | absolute, left: 12px, center vertical |

---

### Danh hiệu (Badge Selector)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11620` | - |
| width | 100% | `width: 100%` |
| height | 44px | `height: 44px` |
| padding | 10px 12px | `padding: 10px 12px` |
| background | #001520 | `background-color: #001520` |
| border | 1px solid #1E3448 | `border: 1px solid #1E3448` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex; align-items: center; justify-content: space-between` |

**Badge item (selected state):**
| Property | Value |
|----------|-------|
| Badge icon | 24x24px, rounded, gold border |
| Badge name | font-size: 13px, weight: 600, color: #FFFFFF |
| Chevron icon | 16x16px, color: #6B8A9A, rotates on open |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #1E3448 |
| Open | border-color: #C8A96E, chevron rotates 180° |
| Focus | box-shadow: 0 0 0 3px rgba(200,169,110,0.2) |

**Helper text:**
| Property | Value |
|----------|-------|
| font-size | 12px |
| color | #6B8A9A |
| margin-top | 4px |

**Badge dropdown list (open state):**
| Property | Value |
|----------|-------|
| background | #001520 |
| border | 1px solid #C8A96E |
| border-radius | 8px |
| box-shadow | 0 8px 24px rgba(0,0,0,0.4) |
| max-height | 200px, overflow-y: auto |
| z-index | 10 |

**Badge dropdown item:**
| Property | Value |
|----------|-------|
| height | 44px |
| padding | 8px 12px |
| display | flex, align-items: center, gap: 10px |
| background | transparent |
| cursor | pointer |

| State | Changes |
|-------|---------|
| Hover | background: rgba(200,169,110,0.1) |
| Selected | background: rgba(200,169,110,0.15), color: #C8A96E |

---

### Nội dung (Rich Text Editor)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11630` | - |
| width | 100% | `width: 100%` |
| min-height | 120px | `min-height: 120px` |
| background | #001520 | `background-color: #001520` |
| border | 1px solid #1E3448 | `border: 1px solid #1E3448` |
| border-radius | 8px | `border-radius: 8px` |
| overflow | hidden | `overflow: hidden` |

**Toolbar:**
| Property | Value |
|----------|-------|
| height | 36px |
| background | #0F2333 |
| border-bottom | 1px solid #1E3448 |
| padding | 0 8px |
| display | flex, align-items: center, gap: 4px |

**Toolbar button:**
| Property | Value |
|----------|-------|
| width | 28px |
| height | 28px |
| border-radius | 4px |
| background | transparent |
| color | #B0BEC5 |
| font-size | 13px |
| font-weight | 700 |
| cursor | pointer |

**Toolbar button hover:**
| State | Changes |
|-------|---------|
| Hover | background: rgba(255,255,255,0.1), color: #FFFFFF |
| Active | background: rgba(200,169,110,0.2), color: #C8A96E |

**Content area:**
| Property | Value |
|----------|-------|
| padding | 10px 12px |
| font-size | 14px |
| line-height | 22px |
| color | #FFFFFF |
| min-height | 84px |

**Hint text:**
| Property | Value |
|----------|-------|
| font-size | 12px |
| color | #6B8A9A |
| margin-top | 4px |
| font-style | italic |

**Character counter:**
| Property | Value |
|----------|-------|
| font-size | 12px |
| color | #6B8A9A |
| text-align | right |
| margin-top | 4px |

**States:**
| State | Changes |
|-------|---------|
| Focus | border-color: #C8A96E, box-shadow: 0 0 0 3px rgba(200,169,110,0.2) |
| Error (empty/too long) | border-color: #EF4444 |

**Character counter — error state (limit reached):**
| Property | Value |
|----------|-------|
| color | #EF4444 (turns red) |
| font-weight | 600 |

---

### Hashtag Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11640` | - |
| display | flex | `display: flex; flex-wrap: wrap; gap: 8px; align-items: center` |

**Hashtag input:**
| Property | Value |
|----------|-------|
| width | fit-content, min: 120px |
| height | 36px |
| padding | 8px 12px |
| background | #0F2A3D |
| border | 1px solid #1E3448 |
| border-radius | 18px |
| font-size | 13px |
| color | #FFFFFF |
| prefix | "#" (color: #C8A96E) |

**Hashtag pill (existing tag):**
| Property | Value |
|----------|-------|
| height | 28px |
| padding | 4px 10px |
| background | #0F2A3D |
| border | 1px solid rgba(200,169,110,0.3) |
| border-radius | 9999px (`rounded-full` — equivalent to 14px for 28px height, use `rounded-full` in Tailwind) |
| font-size | 13px |
| font-weight | 500 |
| color | #C8A96E |
| remove icon | 12px, appears on hover, color: #B0BEC5 |

**"Thêm hashtag" button:**
| Property | Value |
|----------|-------|
| height | 28px |
| padding | 4px 12px |
| background | transparent |
| border | 1px dashed rgba(200,169,110,0.5) |
| border-radius | 14px |
| font-size | 13px |
| color | #C8A96E |
| icon | "+" prefix |

---

### Image Upload Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11650` | - |
| display | flex | `display: flex; flex-wrap: wrap; gap: 8px; align-items: center` |

**Image thumbnail:**
| Property | Value |
|----------|-------|
| width | 64px |
| height | 64px |
| border-radius | 4px |
| object-fit | cover |
| border | 1px solid #1E3448 |
| position | relative |

**Remove image button (×):**
| Property | Value |
|----------|-------|
| width | 18px |
| height | 18px |
| position | absolute, top: -6px, right: -6px |
| background | #EF4444 |
| border-radius | 50% |
| color | white |
| font-size | 10px |

**Add image button:**
| Property | Value |
|----------|-------|
| width | 64px |
| height | 64px |
| background | #0F2333 |
| border | 1px dashed #1E3448 |
| border-radius | 4px |
| color | #6B8A9A |
| icon | "+" (20px) |
| display | flex, center |

**Add image button hover:**
| State | Changes |
|-------|---------|
| Hover | border-color: #C8A96E, color: #C8A96E |

> Maximum **5** images. Add button hides when 5 images are selected.

---

### Instructional Footer Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11658` | - |
| text | "Gửi lời cảm ơn và ghi nhận đến doanh" (static label) | - |
| font-size | 12px | `font-size: 12px` |
| color | #6B8A9A | `color: #6B8A9A` |
| text-align | center | `text-align: center` |
| padding | 8px 0 | `padding: 8px 0` |

---

### Action Buttons (Footer)

**Cancel Button (Hủy):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11660` | - |
| height | 40px |
| padding | 0 20px |
| background | #1A2D3E | `background-color: #1A2D3E` |
| border | 1px solid #2D4A63 | `border: 1px solid #2D4A63` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 600 | `font-weight: 600` |
| color | #B0BEC5 | `color: #B0BEC5` |
| cursor | pointer | `cursor: pointer` |

**Cancel Button states:**
| State | Changes |
|-------|---------|
| Hover | background: #1E3448, color: #FFFFFF, border-color: #3A5C78 |
| Focus | outline: 2px solid #C8A96E |
| Active | background: #152436 |

---

**Send Button (Gửi ►):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `520:11661` | - |
| height | 40px |
| padding | 0 24px |
| background | #FF6B35 | `background-color: #FF6B35` |
| border | none | `border: none` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 600 | `font-weight: 600` |
| color | #FFFFFF | `color: white` |
| cursor | pointer | `cursor: pointer` |
| icon | "►" suffix | right side |

**Send Button states:**
| State | Changes |
|-------|---------|
| Hover | background: #E55A28, transform: translateY(-1px) |
| Active | background: #CC4F22 |
| Disabled | background: #3A3A3A, color: #6B6B6B, cursor: not-allowed |
| Loading | background: #FF6B35, icon replaced with spinner |
| Focus | outline: 2px solid #FF6B35, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
KudoModal (position: fixed, inset: 0, z: 50)
├── Backdrop (bg: rgba(0,13,20,0.7), inset: 0, flex center)
│
└── ModalContainer (w: 600px, bg: #0A1E2B, rounded-xl, shadow-xl, flex-col, overflow: hidden)
    ├── ModalHeader [FIXED] (flex, justify-between, align-center, p: 24px 32px 16px, border-bottom, flex-shrink: 0)
    │   ├── Title (text: 20px/700, color: #FFFFFF)
    │   └── CloseButton (32x32px, rounded-full, color: #B0BEC5)
    │
    ├── ModalBody [SCROLLABLE] (flex-col, gap: 16px, overflow-y: auto, p: 16px 32px, flex: 1)
    │   ├── FieldGroup: Người nhận
    │   │   ├── Label (14px/600, color: #FFFFFF)
    │   │   └── SearchInput (h: 44px, bg: #001520, border: #1E3448, pl: 36px)
    │   │       └── SearchIcon (16px, color: #6B8A9A, absolute left)
    │   │
    │   ├── FieldGroup: Danh hiệu
    │   │   ├── Label (14px/600, color: #FFFFFF)
    │   │   ├── HelperText (12px, color: #6B8A9A)
    │   │   └── BadgeSelector (h: 44px, bg: #001520, border: #1E3448)
    │   │       ├── BadgeIcon (24x24px, rounded)
    │   │       ├── BadgeName (13px/600, color: #FFFFFF)
    │   │       └── ChevronIcon (16px, color: #6B8A9A)
    │   │
    │   ├── FieldGroup: Nội dung
    │   │   ├── Label (14px/600, color: #FFFFFF)
    │   │   ├── HintText (12px/italic, color: #6B8A9A)
    │   │   ├── RichTextEditor (bg: #001520, border: #1E3448)
    │   │   │   ├── Toolbar (h: 36px, bg: #0F2333, border-bottom)
    │   │   │   │   └── ToolbarButtons (B, I, U, ⁼, …) (28x28px each)
    │   │   │   └── ContentArea (p: 10px 12px, min-h: 84px, 14px/400)
    │   │   └── CharCount (12px, color: #6B8A9A, text-right)
    │   │
    │   ├── FieldGroup: Hashtag
    │   │   ├── Label (14px/600, color: #FFFFFF)
    │   │   └── HashtagList (flex-wrap, gap: 8px)
    │   │       ├── HashtagPill[] (h: 28px, bg: #0F2A3D, border-gold, rounded-full)
    │   │       ├── HashtagInput (h: 36px, bg: #0F2A3D, rounded-full, "#" prefix)
    │   │       └── AddHashtagBtn (h: 28px, border-dashed gold, rounded-full)
    │   │
    │   └── FieldGroup: Image
    │       ├── Label (14px/600, color: #FFFFFF)
    │       └── ImageList (flex-wrap, gap: 8px)
    │           ├── ImageThumbnail[] (64x64px, rounded, object-cover)
    │           └── AddImageBtn (64x64px, bg: #0F2333, border-dashed)
    │
    └── ModalFooter [FIXED] (flex-col, gap: 4px, p: 16px 32px 24px, border-top, flex-shrink: 0)
        ├── InstructionalText ("Gửi lời cảm ơn và ghi nhận đến doanh", 12px, #6B8A9A, center)
        └── ActionRow (flex, justify-end, gap: 8px)
            ├── CancelButton (h: 40px, px: 20px, bg: #1A2D3E, border: #2D4A63)
            └── SendButton (h: 40px, px: 24px, bg: #FF6B35, color: white)
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
| Modal | width: 100vw, max-height: 100dvh, border-radius: 16px 16px 0 0, position: fixed bottom |
| Modal padding | 16px 20px |
| Backdrop | align-items: flex-end |
| Modal title | font-size: 16px |
| Image thumbnails | 56x56px |
| Action buttons | width: 100% (stack vertically), gap: 8px |
| Footer | flex-direction: column-reverse |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: min(560px, 90vw), centered |
| Backdrop | align-items: center |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 600px, centered |
| Backdrop | align-items: center |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-search | 16x16 | #6B8A9A | Recipient search input prefix |
| icon-chevron-down | 16x16 | #6B8A9A | Badge selector dropdown trigger |
| icon-close | 16x16 | #B0BEC5 | Modal close button |
| icon-x-circle | 18x18 | #EF4444 | Remove image thumbnail |
| icon-plus | 20x20 | #6B8A9A | Add image button |
| icon-bold | 14x14 | #B0BEC5 | Rich text toolbar |
| icon-italic | 14x14 | #B0BEC5 | Rich text toolbar |
| icon-underline | 14x14 | #B0BEC5 | Rich text toolbar |
| icon-list | 14x14 | #B0BEC5 | Rich text toolbar |
| icon-send | 14x14 | #FFFFFF | Send button icon |
| icon-hash | 14x14 | #C8A96E | Hashtag input prefix |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Modal | opacity, transform (scale 0.95→1) | 200ms | ease-out | Open |
| Modal | opacity, transform (scale 1→0.95) | 150ms | ease-in | Close |
| Backdrop | opacity (0→1) | 200ms | ease-out | Open |
| Backdrop | opacity (1→0) | 150ms | ease-in | Close |
| Send Button | background-color | 150ms | ease-in-out | Hover |
| Input | border-color, box-shadow | 150ms | ease-in-out | Focus |
| Badge selector chevron | transform (rotate 180°) | 150ms | ease-in-out | Open dropdown |
| Add hashtag button | border-color, color | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Modal Backdrop | `520:11601` | `fixed inset-0 bg-black/70 flex items-center justify-center z-50` | `<KudoModal />` |
| Modal Container | `520:11602` | `w-[600px] bg-[#0A1E2B] p-6 px-8 rounded-xl border border-[#C8A96E]/30 shadow-2xl` | `<KudoModal />` |
| Modal Header | `520:11603` | `flex justify-between items-center pb-4 border-b border-[#C8A96E]/20` | `<KudoModal />` |
| Close Button | `520:11604` | `w-8 h-8 rounded-full text-[#B0BEC5] hover:text-white hover:bg-white/10` | `<KudoModal />` |
| Recipient Input | `520:11610` | `w-full h-11 bg-[#001520] border border-[#1E3448] rounded-lg pl-9 text-sm text-white` | `<RecipientSearch />` |
| Badge Selector | `520:11620` | `w-full h-11 bg-[#001520] border border-[#1E3448] rounded-lg flex items-center justify-between px-3` | `<BadgeSelector />` |
| Rich Text Editor | `520:11630` | `w-full bg-[#001520] border border-[#1E3448] rounded-lg overflow-hidden` | `<RichTextEditor />` |
| Hashtag Section | `520:11640` | `flex flex-wrap gap-2 items-center` | `<HashtagInput />` |
| Image Section | `520:11650` | `flex flex-wrap gap-2 items-center` | `<ImageUpload />` |
| Instructional Text | `520:11658` | `text-xs text-[#6B8A9A] text-center py-2` | `<p>` (static) |
| Cancel Button | `520:11660` | `h-10 px-5 bg-[#1A2D3E] border border-[#2D4A63] rounded-lg text-sm font-semibold text-[#B0BEC5]` | `<Button variant="cancel">` |
| Send Button | `520:11661` | `h-10 px-6 bg-[#FF6B35] rounded-lg text-sm font-semibold text-white hover:bg-[#E55A28]` | `<Button variant="primary">` |

---

## Notes

- All colors use the SAA 2025 dark navy theme consistent with the Homepage SAA design
- The modal uses the same gold accent color (`#C8A96E`) for borders and interactive states
- The send/CTA button uses `#FF6B35` (kudos orange) to distinguish from gold-themed actions
- Rich text editor should support **bold**, *italic*, underline, and @mention functionality
- The `@mention` feature requires a user lookup API to suggest recipients in the content area
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- On mobile, the modal slides up from the bottom (bottom sheet pattern)
- Font family: **Inter** throughout (matching project-wide typography standard)
- Ensure color contrast meets WCAG AA: white on #0A1E2B = 14.5:1 ✅
