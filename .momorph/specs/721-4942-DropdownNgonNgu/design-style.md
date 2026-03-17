# Design Style: Dropdown Ngôn Ngữ (Language Selector)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**Figma Link**: [Open in Figma](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:4942)
**Extracted At**: 2026-03-13

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (gold) |
| --color-selected-bg | #FFEA9E | 20% | Selected language item highlight |
| --color-text-primary | #FFFFFF | 100% | Language code text |
| --color-hover-bg | #FFFFFF | 10% | Item hover state background |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-language-code | Montserrat | 16px | 700 | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container internal padding |
| --spacing-item-padding | 16px | Language item internal padding (all sides) |
| --spacing-flag-code-gap | 4px | Gap between flag icon and language code |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border-radius |
| --radius-selected-item | 2px | Selected language item border-radius |
| --radius-item | 4px | Unselected language item border-radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-dropdown | 0 10px 15px rgba(0,0,0,0.1) | Dropdown elevation shadow |

---

## Layout Specifications

### Trigger Button (Language Button)

| Property | Value | Notes |
|----------|-------|-------|
| width | 108px | Fixed width |
| height | 56px | Fixed height |
| padding | 16px | All sides |
| display | flex | Horizontal layout |
| flex-direction | row | Flag → Code → Chevron |
| align-items | center | Vertically centered |
| justify-content | space-between | Spread items |
| border-radius | 4px | Rounded corners |
| cursor | pointer | Interactive |

### Dropdown Container

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (fit-content) | Wraps items |
| padding | 6px | Internal padding around items |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| display | flex | Vertical stack |
| flex-direction | column | Items stacked vertically |
| position | absolute | Positioned below trigger |
| z-index | 50 | Above other content |

### Language Item (Each Option)

| Property | Value | Notes |
|----------|-------|-------|
| width | 108px | Matches trigger width |
| height | 56px | Fixed height |
| padding | 16px | All sides |
| display | flex | Horizontal layout |
| flex-direction | row | Flag → Code |
| align-items | center | Vertically centered |
| justify-content | space-between | Spread flag+code |
| gap | 4px (flag+code group) | Between flag icon and code text |

### Layout Structure (ASCII)

```
Trigger Button (108×56, p-16, flex-row, justify-between)
┌──────────────────────────────────────────┐
│  [🇻🇳 24×24]  [VN 16px/700]  [▼ 24×24] │
└──────────────────────────────────────────┘
                    │ (mt-1, absolute right-0 top-full)
                    ▼
Dropdown Container (p-1.5, bg-#00070C, border-1px-#998C5F, rounded-lg, shadow-lg)
┌──────────────────────────────────────────────┐
│ 6px                                          │
│  ┌────────────────────────────────────────┐  │
│  │  Selected Item (w-full, h-56, p-16, r-2) │  ← bg: rgba(255,234,158,0.2)
│  │  [🇻🇳 24×24]  4px  [VN 16px/700]      │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Option Item (w-full, h-56, p-16, r-4)│  │  ← bg: transparent
│  │  [🇬🇧 24×24]  4px  [EN 16px/700]      │  │
│  └────────────────────────────────────────┘  │
│ 6px                                          │
└──────────────────────────────────────────────┘
```

---

## Component Style Details

### Trigger Button (Language Button)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `186:1433` (component) | - |
| width | 108px | `w-[108px]` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| background | transparent | `bg-transparent` |
| border | none | - |
| border-radius | 4px | `rounded` |
| cursor | pointer | `cursor-pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,255,255,0.1) → `hover:bg-white/10` |
| Focus | outline: 2px solid rgba(255,255,255,0.5), offset: 2px |
| Open | chevron rotated 180° |

---

### Dropdown Container

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `525:11713` (A_Dropdown-List) | - |
| padding | 6px | `p-1.5` |
| background | #00070C | `bg-[#00070C]` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| box-shadow | 0 10px 15px rgba(0,0,0,0.1) | `shadow-lg` |
| display | flex column | `flex flex-col` |
| position | absolute, right: 0, top: 100% | `absolute right-0 top-full` |
| margin-top | 4px | `mt-1` |
| z-index | 50 | `z-50` |
| overflow | hidden | `overflow-hidden` |

---

### Language Item — Selected (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085` (A.1_tiếng Việt) | - |
| width | fill (100% of container) | `w-full` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| background | rgba(255, 234, 158, 0.2) | `bg-[rgba(255,234,158,0.2)]` |
| border-radius | 2px | `rounded-sm` |
| display | flex row | `flex flex-row items-center` |
| gap | 4px | `gap-1` |
| cursor | pointer | `cursor-pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default (selected) | background: rgba(255,234,158,0.2) |
| Hover | background: rgba(255,234,158,0.3) → slightly brighter highlight |

**Inner content:**
- Flag icon: 24×24, `shrink-0`
- Code text: "VN" — Montserrat 700, 16px/24px, letter-spacing 0.15px, white

---

### Language Item — Unselected (EN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128` (A.2_tiếng Anh) | - |
| width | fill (100% of container) | `w-full` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| background | transparent | - |
| border-radius | 4px | `rounded` |
| display | flex row | `flex flex-row items-center` |
| gap | 4px | `gap-1` |
| cursor | pointer | `cursor-pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,255,255,0.1) → `hover:bg-white/10` |
| Focus-visible | outline: 2px solid rgba(255,255,255,0.5), outline-offset: 2px |

**Inner content:**
- Flag icon: 24×24, `shrink-0`
- Code text: "EN" — Montserrat 700, 16px/24px, letter-spacing 0.15px, white

---

### Flag Icon

| Property | Value | CSS |
|----------|-------|-----|
| width | 24px | `w-6` |
| height | 24px | `h-6` |
| shrink | 0 | `shrink-0` |

Flag images: `/icons/flag-vn.svg` (VN), `/icons/flag-en.svg` (EN — needs to be added)

---

### Chevron Icon (Trigger only)

| Property | Value | CSS |
|----------|-------|-----|
| width | 24px | `w-6` |
| height | 24px | `h-6` |
| shrink | 0 | `shrink-0` |
| transition | transform 150ms | `transition-transform duration-150` |

**States:**
| State | Changes |
|-------|---------|
| Closed | rotation: 0° |
| Open | rotation: 180° → `rotate-180` |

---

## Component Hierarchy with Styles

```
LanguageSelector (relative container)
├── TriggerButton (w-[108px], h-14, p-4, flex, items-center, justify-between, rounded, cursor-pointer, hover:bg-white/10)
│   ├── FlagIcon (w-6, h-6, shrink-0) — next/image
│   ├── CodeText (font-bold, text-base, leading-6, tracking-[0.15px], text-white)
│   └── ChevronIcon (w-6, h-6, shrink-0, transition-transform duration-150, rotate-180 when open)
│
└── DropdownList (absolute, right-0, top-full, mt-1, p-1.5, bg-[#00070C], border-[#998C5F], rounded-lg, shadow-lg, z-50, overflow-hidden)
    │   role="listbox", aria-label="Select language"
    │
    ├── SelectedItem (w-full, h-14, p-4, bg-[rgba(255,234,158,0.2)], rounded-sm, flex, items-center, gap-1)
    │   │   role="option", aria-selected="true"
    │   ├── FlagIcon (w-6, h-6, shrink-0)
    │   └── CodeText (font-bold, text-base, text-white)
    │
    └── OptionItem (w-full, h-14, p-4, rounded, flex, items-center, gap-1, hover:bg-white/10, cursor-pointer)
        │   role="option", aria-selected="false"
        ├── FlagIcon (w-6, h-6, shrink-0)
        └── CodeText (font-bold, text-base, text-white)
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

The language selector component does **not change** across breakpoints. It maintains fixed dimensions (108px trigger width, 56px height) at all screen sizes. The component is always visible in both Login header and App header.

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| flag-vn | 24×24 | N/A (image) | Vietnam flag for VN option |
| flag-en | 24×24 | N/A (image) | UK/GB flag for EN option |
| chevron-down | 24×24 | white | Dropdown open/close indicator |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Chevron | transform (rotate) | 150ms | ease-in-out | Dropdown open/close |
| Trigger Button | background-color | 150ms | ease-in-out | Hover |
| Option Item | background-color | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Class | React Component |
|----------------|---------------|----------------|-----------------|
| Dropdown Container | `525:11713` | `p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg shadow-lg overflow-hidden` | `<ul>` in `LanguageSelector` |
| Selected Item (VN) | `I525:11713;362:6085` | `w-full h-14 p-4 bg-[rgba(255,234,158,0.2)] rounded-sm flex items-center gap-1` | `<li>` with `aria-selected="true"` |
| Unselected Item (EN) | `I525:11713;362:6128` | `w-full h-14 p-4 rounded flex items-center gap-1 hover:bg-white/10` | `<li>` with `aria-selected="false"` |
| Trigger Button | `186:1433` | `w-[108px] h-14 p-4 rounded flex items-center justify-between` | `<button>` in `LanguageSelector` |
| Language Code Text | `I525:11713;362:6085;186:1821;186:1439` | `font-bold text-base leading-6 tracking-[0.15px] text-white` | `<span>` |
| Flag Icon | `178:1019` (VN), `178:967` (EN) | `w-6 h-6 shrink-0` | `<Image>` (next/image) |

---

## Differences from Current Implementation

The existing `LanguageSelector` at `src/components/header/language-selector.tsx` needs these changes to match Figma:

| Property | Current | Figma Design | Change Needed |
|----------|---------|--------------|---------------|
| Dropdown background | `bg-[#0B0F12]` | `bg-[#00070C]` | Update color |
| Dropdown border | `border-[#2E3940]` | `border-[#998C5F]` | Update to gold border |
| Dropdown border-radius | `rounded` (4px) | `rounded-lg` (8px) | Increase radius |
| Dropdown padding | 0 (no padding) | `p-1.5` (6px) | Add internal padding |
| Selected item bg | None | `bg-[rgba(255,234,158,0.2)]` | Add selected highlight |
| Selected item radius | None | `rounded-sm` (2px) | Add border-radius |
| Unselected item radius | None | `rounded` (4px) | Add border-radius |
| Item height | Auto (`py-3`) | 56px (`h-14 p-4`) | Increase to match design |
| Item width | 108px | fill (100%) | Use `w-full` instead of fixed px |
| Dropdown shadow | `shadow-lg` | `shadow-lg` | OK (already present) |
| Dropdown overflow | `overflow-hidden` | `overflow-hidden` | OK (already present) |
| Chevron visible | Yes | Yes | OK |

---

## Notes

- All colors should use CSS variables for theming support where possible, but inline Tailwind arbitrary values are acceptable per constitution.
- Flag icons use `next/image` for optimization.
- The EN flag icon (`/icons/flag-en.svg`) needs to be created/downloaded — currently only VN flag exists.
- The component must remain backward-compatible with both controlled (App header) and uncontrolled (Login header) usage patterns.
