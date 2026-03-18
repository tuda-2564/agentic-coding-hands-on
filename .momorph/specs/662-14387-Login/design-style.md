# Design Style: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/662:14387
**Extracted At**: 2026-03-09 (Reviewed: 2026-03-17)

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-page` | `#00101A` | 100% | Page background, gradient base |
| `--color-bg-header` | `#0B0F12` | 80% | Header background (Figma value). Impl uses `bg-navy/95` (#00101A/95%) + `backdrop-blur-sm` — see Header Note |
| `--color-btn-login` | `#FFEA9E` | 100% | Login button background (primary CTA) |
| `--color-btn-login-text` | `#00101A` | 100% | Login button text color |
| `--color-text-white` | `#FFFFFF` | 100% | All body/heading text on dark bg |
| `--color-divider` | `#2E3940` | 100% | Header/footer border, dividers |
| `--color-overlay-left` | `#00101A` | 100% | Left solid part of horizontal gradient |
| `--color-overlay-bottom` | `#001320` | 100% | Bottom gradient base color |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-nav-label` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-hero-desc` | Montserrat | 20px | 700 | 40px | 0.5px |
| `--text-btn-login` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0% |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-xs` | 4px | Inner icon gaps |
| `--spacing-sm` | 8px | Button icon-text gap |
| `--spacing-md` | 16px | Button padding top/bottom, content left padding |
| `--spacing-lg` | 24px | Button padding left/right, content vertical gap |
| `--spacing-xl` | 40px | Footer padding top/bottom |
| `--spacing-2xl` | 80px | Gap inside Frame 487 (between Key Visual and Frame 550) — Figma source value |
| `--spacing-3xl` | 64px / 80px / 96px | Hero section padding top/bottom (mobile / tablet / desktop) |
| `--spacing-page-x` | 16px / 48px / 144px | Main horizontal page gutter (mobile / tablet / desktop) |
| `--spacing-footer-x` | 16px / 48px / 90px | Footer horizontal padding (mobile / tablet / desktop) |
| `--spacing-header-x` | 16px / 48px / 144px | Header horizontal padding (mobile / tablet / desktop) |
| `--spacing-hero-gap` | 40px / 64px / 80px | Gap between Key Visual and content block (mobile / tablet / desktop). Figma Frame 487 gap=80px. |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-sm` | 4px | Language selector button |
| `--radius-md` | 8px | Login button |
| `--border-divider` | `1px solid #2E3940` | Footer border-top, header divider |

### Gradients

| Name | Value | Usage |
|------|-------|-------|
| `--gradient-left` | `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)` | Horizontal overlay on hero bg (left fade) |
| `--gradient-bottom` | `linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` | Vertical overlay on hero bg (bottom fade) |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Design canvas width |
| height | 1024px | Design canvas height |
| background | `#00101A` | Dark navy |
| position | relative | Stacking context for absolute children |

### Layout Structure (ASCII) — Figma Desktop Values

> Implementation deviations (responsive, header fixed, etc.) are documented in Component Style Details.

```
┌─────────────────────────────────────────────── 1440px ──────────────────────────────────────────────┐
│  [C_Keyvisual] — Background artwork image (absolute, z-index 1, full bleed, y:2)                     │
│  [Rectangle 57] — Horizontal gradient overlay (absolute, full bleed, z-index 1)                      │
│  [Cover] — Bottom vertical gradient overlay (absolute, y:138 to 1024, z-index 1)                     │
│                                                                                                       │
│  ┌─────────────────────── A_Header (h:80px, px:144px, z-index 1) ──────────────────────────────┐     │
│  │  [A.1 Logo 52×48px]                                    [A.2 Language 108×56px: 🏳️ VN ▾]    │     │
│  └───────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                       │
│  ┌──────────────── B_Bìa (h:845px, px:144px, py:96px, flex-col, y:88) ────────────────────┐     │
│  │                                                                                              │     │
│  │  ┌─────── Frame 487 (w:1152px, flex-col, gap:80px★, items-start, justify-center) ─────┐    │     │
│  │  │                                                                                     │    │     │
│  │  │  ┌── B.1 Key Visual (451×200px) ──────────────────────────────────────────────┐   │    │     │
│  │  │  │   [ROOT FURTHER logo image]                                                 │   │    │     │
│  │  │  └─────────────────────────────────────────────────────────────────────────────┘   │    │     │
│  │  │                                                                                     │    │     │
│  │  │  ┌── Frame 550 (pl:16px, flex-col, gap:24px) ─────────────────────────────────┐   │    │     │
│  │  │  │  B.2 "Bắt đầu hành trình của bạn cùng SAA 2025. / Đăng nhập để khám phá!" │   │    │     │
│  │  │  │  (w:480px, Montserrat 700 20px, lh:40px, #FFF)                             │   │    │     │
│  │  │  │                                                                              │   │    │     │
│  │  │  │  ┌── B.3 Login Button (305×60px, bg:#FFEA9E, r:8px, px:24px py:16px) ──┐  │   │    │     │
│  │  │  │  │  "LOGIN With Google"  [Google Icon 24×24]                            │  │   │    │     │
│  │  │  │  └──────────────────────────────────────────────────────────────────────┘  │   │    │     │
│  │  │  └─────────────────────────────────────────────────────────────────────────────┘   │    │     │
│  │  └─────────────────────────────────────────────────────────────────────────────────────┘   │     │
│  └──────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                       │
│  ┌──────── D_Footer (px:90px, py:40px, border-top: 1px solid #2E3940, y:933) ────────────────┐      │
│  │  "Bản quyền thuộc về Sun* © 2025"  (Montserrat Alternates 700 16px, centered, #FFF)       │      │
│  └───────────────────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Header — Navigation Bar

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `662:14391` | — |
| width | 1440px | `w-full` |
| height | 64px (impl) / 80px (Figma) | `h-16` |
| padding | responsive: 16px / 48px / 144px | `px-4 md:px-12 lg:px-36` (mobile / tablet / desktop) |
| background | rgba(0,16,26,0.95) + backdrop-blur | `bg-navy/95 backdrop-blur-sm` |
| border-bottom | 1px solid gold/10 | `border-b border-gold/10` |
| display | flex row | `flex flex-row` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| position | fixed, top:0 | `fixed top-0 left-0 right-0` |
| z-index | 50 | `z-50` |

> **Note**: Implementation uses `fixed` + `z-50` (instead of Figma's `absolute` + `z-10`) so the header
> stays visible on scroll. Height reduced to 64px for better mobile fit. Background uses `bg-navy/95`
> with `backdrop-blur-sm` for a frosted glass effect matching the overall dark theme.

### A.1_Logo — SAA Logo

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `I662:14391;186:2166` | — |
| width | 52px | `w-[52px]` |
| height | 56px | `h-[56px]` |
| type | Image (next/image) | `priority` |
| interaction | None | — |

> **Note**: Figma shows 48px height in some frames but the actual component measurement is 56px.

### A.2_Language — Language Selector Button

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `I662:14391;186:1601` | — |
| width | 108px | `w-[108px]` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| border-radius | 4px | `rounded` |
| display | flex row | `flex flex-row` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| cursor | pointer | `cursor-pointer` |

**Inner elements:**
- Flag icon: 24×24px (VN flag image component)
- Text "VN": Montserrat 700 16px, #FFFFFF, `text-white font-bold text-base`
- Down chevron icon: 24×24px, #FFFFFF

**States:**
| State | Changes |
|-------|---------|
| Default | No background |
| Hover | `bg-white/10` (subtle highlight), `cursor-pointer` |
| Focus | `outline-2 outline-offset-2 outline-white/50` (keyboard focus ring) |
| Active/Open | Chevron rotates 180°, `bg-white/10` |

### B.1_Key Visual — ROOT FURTHER Logo Image

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `662:14395` | — |
| width | 451px | `w-[451px]` |
| height | 200px | `h-[200px]` |
| type | Image (next/image) | `object-contain` |
| aspect-ratio | 115/51 | — |

### B.2_content — Hero Description Text

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `662:14753` | — |
| width | 480px | `max-w-[480px]` |
| height | 80px | auto |
| font-family | Montserrat | `font-sans` (Montserrat via `--font-montserrat`) |
| font-size | 20px | `text-xl` |
| font-weight | 700 | `font-bold` |
| line-height | 40px | `leading-10` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | #FFFFFF | `text-white` |
| text content | "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!" | — |

### B.3_Login — Login with Google Button

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `662:14425` (container) / `662:14426` (button) | — |
| width | 305px | `w-[305px]` |
| height | 60px | `h-[60px]` |
| padding | 16px 24px | `py-4 px-6` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border-radius | 8px | `rounded-lg` |
| display | flex row | `flex flex-row` |
| justify-content | flex-start | `justify-start` |
| align-items | center | `items-center` |
| gap | 8px (icon-text) | `gap-2` |
| cursor | pointer | `cursor-pointer` |

**Button Label:**
| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| font-family | Montserrat | `font-sans` (Montserrat via `--font-montserrat`) |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| color | #00101A | `text-[#00101A]` |
| text content | "LOGIN With Google " | — |

**Google Icon:** 24×24px, positioned right of text (`I662:14426;186:1766`)

**States:**
| State | Changes |
|-------|---------|
| Default | `bg-[#FFEA9E]` |
| Hover | `hover:shadow-lg hover:-translate-y-0.5 transition-all` (lift effect per spec) |
| Loading/Disabled | `opacity-50 cursor-not-allowed pointer-events-none`, show spinner |
| Focus | `outline-2 outline-offset-2 outline-[#FFEA9E]` |

### Error Message — Inline OAuth Error (Below Login Button)

> Not directly in Figma design (runtime state). Styled to match the dark theme.

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| position | inline, below `B.3_Login` | `mt-3` (12px top margin) |
| max-width | 305px (matches button width) | `max-w-[305px]` |
| background | rgba(239,68,68,0.15) | `bg-red-500/15` |
| border | 1px solid rgba(239,68,68,0.4) | `border border-red-500/40` |
| border-radius | 6px | `rounded-md` |
| padding | 8px 12px | `py-2 px-3` |
| font-family | Montserrat | `font-sans` (Montserrat via `--font-montserrat`) |
| font-size | 14px | `text-sm` |
| font-weight | 500 | `font-medium` |
| line-height | 20px | `leading-5` |
| color | `#FCA5A5` (red-300 on dark bg) | `text-red-300` |
| role | `alert` | ARIA — screen reader announces immediately |
| display | hidden when no error | `hidden` / conditional render |

### Loading Spinner — Inside Login Button (During OAuth)

> Replaces Google icon while `isLoading = true`.

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| size | 24×24px (matches Google icon) | `w-6 h-6` |
| color | `#00101A` (matches button text) | `text-[#00101A]` |
| animation | spin | `animate-spin` |
| type | circular border spinner | CSS border trick or SVG spinner |
| border-width | 2px | `border-2` |
| border-color | `#00101A` transparent transparent | `border-current border-t-transparent` |
| border-radius | full | `rounded-full` |

---

### D_Footer — Page Footer

| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `662:14447` | — |
| width | 1440px | `w-full` |
| padding-y | 40px | `py-10` |
| padding-x | responsive: 16px / 48px / 90px | `px-4 md:px-12 lg:px-[90px]` |
| border-top | 1px solid #2E3940 | `border-t border-[#2E3940]` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| justify-content | center (mobile) / between (desktop) | `justify-center lg:justify-between` |
| position | absolute bottom | `absolute bottom-0` |

**Copyright Text:**
| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| **Node ID** | `I662:14447;342:1413` | — |
| font-family | Montserrat Alternates | `font-alt` (Montserrat Alternates via `--font-montserrat-alt`) |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |
| content | "Bản quyền thuộc về Sun* © 2025" | — |

---

## Component Hierarchy with Styles

```
LoginPage (bg: #00101A, relative, min-h-screen, overflow-hidden)
├── C_Keyvisual (absolute, inset-0, z-0, object-cover, priority) — Background artwork image
├── Rectangle57 (absolute, inset-0, z-[1]) — Horizontal gradient overlay (left fade)
├── Cover (absolute, top-[138px], bottom-0, z-[1]) — Bottom gradient overlay
│
├── A_Header (fixed, top-0, w-full, h-16, px-4 md:px-12 lg:px-36, bg-navy/95, backdrop-blur-sm, border-b border-gold/10, z-50)
│   ├── A.1_Logo (w-[52px], h-[56px]) — SAA logo image (priority)
│   └── A.2_Language (w-[108px], h-14, p-4, rounded, cursor-pointer, flex items-center justify-between)
│       ├── VN Flag icon (24×24)
│       ├── "VN" text (Montserrat 700 16px #FFF tracking-[0.15px])
│       └── ChevronDown icon (24×24, rotate-180 when open)
│
├── B_Bìa (absolute, top-[88px], w-full, px-4 md:px-12 lg:px-36, py-16 md:py-20 lg:py-24, flex flex-col)
│   └── Frame487 (w-full lg:w-[1152px], flex flex-col gap-10 md:gap-16 lg:gap-20, items-start)
│       ├── B.1_KeyVisual (w-full max-w-[280px] md:w-[320px] lg:w-[451px] lg:h-[200px], object-contain)
│       │   — ROOT FURTHER image (next/image, priority)
│       └── Frame550 (pl-4, flex flex-col gap-6)
│           ├── B.2_Content (w-full max-w-[480px], Montserrat 700 text-base md:text-xl leading-7 md:leading-10, #FFF, tracking-[0.5px])
│           │   "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!"
│           ├── B.3_Login (w-full md:w-[305px], h-[60px], bg-[#FFEA9E], rounded-lg, px-6 py-4, flex items-center gap-2)
│           │   ├── "LOGIN With Google" (Montserrat 700 22px #00101A whitespace-nowrap)
│           │   └── Google icon / Spinner (24×24)
│           └── ErrorMessage (max-w-[305px], mt-3, bg-red-500/15, border border-red-500/40, rounded-md, py-2 px-3)
│               └── error text (Montserrat 500 14px text-red-300, role="alert") — hidden when no error
│
└── D_Footer (absolute, bottom-0, w-full, px-4 md:px-12 lg:px-[90px], py-10, border-t border-[#2E3940], flex justify-center lg:justify-between items-center)
    └── "Bản quyền thuộc về Sun* © 2025" (Montserrat Alternates 700 16px #FFF, text-center)
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

| Component | Property | Mobile Value |
|-----------|----------|--------------|
| Header | padding-x | `px-4` (16px) |
| Header | height | `h-16` (64px) |
| Header | position | `fixed` (stays visible on scroll) |
| B_Bìa | padding-x | `px-4` (16px) |
| B_Bìa | padding-y | `py-16` (64px) |
| B_Bìa | flex gap | `gap-10` (40px) |
| B.1 KeyVisual | width | `w-full max-w-[280px]` |
| B.1 KeyVisual | height | `h-auto` |
| B.2 content | font-size | `text-base` (16px) |
| B.2 content | line-height | `leading-7` |
| B.2 content | max-width | `w-full` |
| B.3 Login Button | width | `w-full` |
| Footer | padding-x | `px-4` |
| Footer | justify-content | `justify-center` |

#### Tablet (768px – 1023px)

| Component | Property | Tablet Value |
|-----------|----------|--------------|
| Header | padding-x | `px-12` (48px) |
| B_Bìa | padding-x | `px-12` (48px) |
| B_Bìa | padding-y | `py-20` (80px) |
| B_Bìa | flex gap | `gap-16` (64px) |
| B.1 KeyVisual | width | `w-[320px]` |
| B.3 Login Button | width | `w-[305px]` |
| Footer | padding-x | `px-12` |

#### Desktop (≥ 1024px)

| Component | Property | Desktop Value |
|-----------|----------|---------------|
| Header | padding-x | `px-36` (144px) |
| B_Bìa | padding-x | `px-36` (144px) |
| B_Bìa | padding-y | `py-24` (96px) |
| B_Bìa | flex gap | `gap-20` (80px) — Figma Frame 487 gap |
| B.1 KeyVisual | width | `w-[451px] h-[200px]` |
| B.3 Login Button | width | `w-[305px]` |
| Footer | padding-x | `px-[90px]` |
| Footer | justify-content | `justify-between` |

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage |
|-----------|---------|------|-------|-------|
| VN Flag | `I662:14391;186:1696;186:1821;186:1709` | 24×24 | — | Language selector |
| ChevronDown | `I662:14391;186:1696;186:1821;186:1441` | 24×24 | #FFFFFF | Language dropdown trigger |
| Google | `I662:14426;186:1766` | 24×24 | — | Login button |

> Icons SHOULD use the `<Icon name="..." size={n} />` component (renders via next/image from `/icons/{name}.svg`).
> The Google icon and flag icons may use `<Image />` (next/image) directly when they are colorful/multi-color assets
> that don't fit the monochrome icon pattern. Chevron SHOULD use `<Icon name="chevron-down" />`.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Login Button | `transform: translateY`, `box-shadow` | 150ms | ease-out | Hover |
| Login Button | `opacity` | 150ms | ease-in-out | Disabled/Loading |
| Language Chevron | `transform: rotate(180deg)` | 150ms | ease-in-out | Dropdown open |
| Language Button | `background-color` | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes (key) | React Component |
|----------------|---------------|------------------------|-----------------|
| Page Root | `662:14387` | `relative min-h-screen bg-[#00101A] overflow-hidden` | `<LoginPage />` |
| Background Image | `662:14388` | `absolute inset-0 object-cover` | `<Image />` (next/image) |
| Header | `662:14391` | `fixed top-0 w-full h-16 px-4 md:px-12 lg:px-36 bg-navy/95 backdrop-blur-sm border-b border-gold/10 flex justify-between items-center z-50` | `<Header />` |
| Logo | `I662:14391;186:2166` | `w-[52px] h-[56px]` | `<Image />` (next/image) |
| Language Selector | `I662:14391;186:1601` | `flex items-center justify-between p-4 rounded cursor-pointer hover:bg-white/10` | `<LanguageSelector />` |
| Hero Section (B_Bìa) | `662:14393` | `absolute top-[88px] w-full px-4 md:px-12 lg:px-36 py-16 md:py-20 lg:py-24 flex flex-col` | `<HeroSection />` |
| Inner Frame (Frame 487) | `662:14394` | `w-full lg:w-[1152px] flex flex-col gap-10 md:gap-16 lg:gap-20 items-start` | Inner `<div>` |
| ROOT FURTHER Image | `662:14395` | `w-full max-w-[280px] md:w-[320px] lg:w-[451px] lg:h-[200px] object-contain` | `<Image />` (next/image, priority) |
| Hero Description | `662:14753` | `font-bold text-base md:text-xl leading-7 md:leading-10 text-white tracking-[0.5px] max-w-[480px]` | `<p>` |
| Login Button | `662:14426` | `flex items-center gap-2 bg-[#FFEA9E] rounded-lg py-4 px-6 w-full md:w-[305px] h-[60px] hover:shadow-lg hover:-translate-y-0.5 transition-all` | `<LoginButton />` |
| Error Message | runtime state | `max-w-[305px] mt-3 py-2 px-3 bg-red-500/15 border border-red-500/40 rounded-md text-sm font-medium text-red-300` | `<ErrorMessage />` (conditional) |
| Loading Spinner | runtime state | `w-6 h-6 rounded-full border-2 border-[#00101A] border-t-transparent animate-spin` | `<Spinner />` (inside LoginButton) |
| Footer | `662:14447` | `absolute bottom-0 w-full px-4 md:px-12 lg:px-[90px] py-10 border-t border-[#2E3940] flex justify-center lg:justify-between items-center` | `<Footer />` |

---

## Notes

- Fonts **Montserrat** and **Montserrat Alternates** MUST be loaded via `next/font/google`.
- All images (background, ROOT FURTHER logo, SAA logo) MUST use `next/image` with `sizes` props.
- Google icon in login button may use `<Image />` directly (it is a multi-color brand asset, not a monochrome icon).
- The background overlay gradients (Rectangle57, Cover) can be implemented as `<div>` elements with inline gradient styles or Tailwind arbitrary values.
- Ensure color contrast: #FFEA9E on #00101A and white on dark bg meet WCAG AA (4.5:1).
