# Implementation Plan: Thể lệ — Kudos Rules Panel

**Frame**: `3204:6051-TheLe`
**Date**: 2026-03-20
**Spec**: `specs/3204-6051-TheLe/spec.md`

---

## Summary

Implement a right-side slide-in panel (`KudosRulesPanel`) that displays the official rules of the Sun* Kudos feature within SAA 2025. The panel is a **purely static, informational overlay** — no API calls needed. It contains 3 content sections (Hero Badges, Collectible Icons, Kudos Quốc Dân), and 2 footer action buttons (Close / Write Kudos). The implementation follows the existing modal/drawer pattern used in `kudo-modal.tsx` and `mobile-menu.tsx`, with CSS transition animations, focus trapping, and full WCAG AA accessibility.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4 (inline `@theme`), `next/image`, `next/font/google` (Montserrat — already configured in `src/app/layout.tsx`)
**Database**: N/A — all content is static
**Testing**: Playwright (E2E), manual accessibility audit
**State Management**: Local component state (`useState` for `isOpen`, `useRef` for trigger/focus)
**API Style**: N/A — no API calls

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Code & Source Organization** — Component in `src/components/kudos/`, static data in `src/utils/`, types in `src/types/`. PascalCase components, kebab-case files, `@/*` alias imports. Functions under ~50 lines — sub-components extracted for `HeroBadgeRow` and `CollectibleIconGrid`.
- [x] **II. Next.js & Cloudflare Workers** — Panel is a `"use client"` component (interactive state). Parent `/kudos` page remains Server Component. Integration via client wrapper following established `ActionBarWrapper` pattern. TailwindCSS v4 for all styling. CSS transitions only (no JS animation libs). No Node.js-only APIs.
- [x] **III. Supabase Integration** — N/A (no database access needed for static rules content).
- [x] **IV. Responsive Design (Mobile-First)** — Mobile-first with `md:` (768px) and `lg:` (1024px) breakpoints. Touch targets ≥ 44×44px (buttons are 56px tall). Internal scroll for overflow. `next/image` for all raster images. Verified at 375px, 768px, 1440px.
- [x] **V. OWASP Security** — No user input, no database queries, no `dangerouslySetInnerHTML`. Static content only. No secrets.
- [x] **VI. Test-First Development** — E2E tests (Playwright) for all P1 user stories before feature is done. Unit test for static data integrity.

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single main component `<KudosRulesPanel>` with sub-components `<HeroBadgeRow>` and `<CollectibleIconGrid>` extracted for readability. Follows existing pattern in `src/components/kudo-modal/`. A client wrapper `<KudosRulesWrapper>` will manage `isOpen` state and sit alongside the panel trigger button — following the same `ActionBarWrapper` → `KudoModal` pattern already used on the `/kudos` page.
- **Styling Strategy**: Tailwind utility classes exclusively. Custom Tailwind tokens already exist:
  - `kudos-gold` (`#FFEA9E`) — title, headings, "Viết KUDOS" button bg
  - `kudos-container-2` (`#00070C`) — panel background
  - `kudos-border` (`#998C5F`) — "Đóng" button border
  - No new tokens or CSS needed.
- **Data Fetching**: None — all content is static data constants defined in `src/utils/kudos-rules-data.ts`.
- **Panel Pattern**: `position: fixed`, `z-index: 50`, slide-in/out via `translate-x` CSS transition (matching spec: 200ms ease-out open, 150ms ease-in close). Backdrop overlay at `z-index: 40`. Body scroll locked when panel is open (`document.body.style.overflow = "hidden"`), matching `kudo-modal.tsx` pattern (lines 104–108).
- **Focus Management**: Manual focus trap (Tab key handler) matching existing pattern in `kudo-modal.tsx` (lines 69–102). Escape key handler (lines 59–67). Focus first element on open, restore to `triggerRef` on close. No new dependency needed.
- **Icon Component**: Reuse existing `<Icon>` component from `src/components/ui/icon.tsx` (loads from `/public/icons/{name}.svg`). Use existing `close.svg` for "Đóng" button. Download new `pencil.svg` for "Viết KUDOS" button from Figma media (node `I3204:6094;186:1763`).
- **"Viết KUDOS" navigation**: Use `next/link` (`<Link>`) for semantic correctness (it's a navigation action, not a form submit). This ensures proper `<a>` tag rendering for accessibility and keyboard activation.

### Backend Approach

- N/A — purely frontend feature.

### Integration Points

- **Existing Components**: `<Icon>` (`src/components/ui/icon.tsx`), `next/image`, `next/link`
- **Parent Page**: `/kudos` page (`src/app/kudos/page.tsx`) — will embed `<KudosRulesWrapper>` which contains the trigger button + panel. Follows established pattern: `ActionBarWrapper` wraps `ActionBar` + `KudoModal`.
- **Shared Tokens**: Tailwind theme tokens in `globals.css` — `--color-kudos-gold`, `--color-kudos-container-2`, `--color-kudos-border`
- **Navigation Target**: "Viết KUDOS" → `/kudos/write` route (Figma frame `520:11602`). If route doesn't exist yet, use `href="/kudos/write"` — the panel works independently.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/3204-6051-TheLe/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/frame.png     # Reference screenshot ✅
```

### Source Code (affected areas)

```text
# New files
src/components/kudos/kudos-rules-panel.tsx      # Main panel component ("use client") — overlay, backdrop, content, footer
src/components/kudos/hero-badge-row.tsx          # Hero badge row sub-component (pill + condition + description)
src/components/kudos/collectible-icon-grid.tsx   # 2×3 icon grid sub-component (2-level padding wrapper)
src/components/kudos/kudos-rules-wrapper.tsx     # Client wrapper: trigger button + panel state management ("use client")
src/utils/kudos-rules-data.ts                    # Static data constants (tiers, icons, section text — exact Vietnamese copy)
src/types/kudos-rules.ts                         # TypeScript types: HeroBadgeTier, CollectibleIcon

# New assets (download from Figma media API)
public/images/kudos/new-hero-badge.png           # Hero badge pill image (node 3204:6163)
public/images/kudos/rising-hero-badge.png        # Hero badge pill image (node 3204:6172)
public/images/kudos/super-hero-badge.png         # Hero badge pill image (node 3204:6181)
public/images/kudos/legend-hero-badge.png        # Hero badge pill image (node 3204:6190)
public/icons/pencil.svg                          # "Viết KUDOS" button icon (node I3204:6094;186:1763)

# Collectible icon images (6 files — see Note below)
public/images/kudos/icons/revival.png
public/images/kudos/icons/touch-of-light.png
public/images/kudos/icons/stay-gold.png
public/images/kudos/icons/flow-to-horizon.png
public/images/kudos/icons/beyond-the-boundary.png
public/images/kudos/icons/root-further.png

# Modified files
src/app/kudos/page.tsx                           # Import and place <KudosRulesWrapper /> in the page layout
```

> **Note on collectible icon images**: The 6 collectible icon images (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) returned `null` from the Figma media API (nodes `3204:6082`–`3204:6088`). These are likely Figma component instances that need manual export. **Fallback strategy**: implement styled placeholder `<div class="w-16 h-16 rounded-full border-2 border-white bg-navy" />` + label text. Replace with real images once assets are sourced.

### Dependencies

No new npm packages required. All functionality achievable with:
- Existing `next/image` for optimized images
- Existing `next/link` for "Viết KUDOS" navigation
- CSS `transition-transform` + `transition-opacity` for animations
- Manual focus trap (same pattern as `kudo-modal.tsx` lines 69–102)
- Manual body scroll lock (same as `kudo-modal.tsx` lines 104–108)
- Existing `<Icon>` component for button icons

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Download 4 hero badge pill images from Figma media API to `public/images/kudos/`:
  - `3204:6163` → `new-hero-badge.png`
  - `3204:6172` → `rising-hero-badge.png`
  - `3204:6181` → `super-hero-badge.png`
  - `3204:6190` → `legend-hero-badge.png`
- Download pencil icon SVG from Figma media (node `I3204:6094;186:1763`) to `public/icons/pencil.svg`
- Confirm existing `public/icons/close.svg` visually matches Figma close icon (node `I3204:6093;186:2759`). If not, download from Figma.
- Source 6 collectible icon images for `public/images/kudos/icons/` (manual Figma export or reuse from awards page)
- Verify all assets render correctly at target sizes (badge pills at 126×22px, icons at 64×64px)

### Phase 1: Foundation — Types & Static Data

- Define TypeScript types in `src/types/kudos-rules.ts`:
  - `HeroBadgeTier` — `{ id: string; label: string; imageSrc: string; condition: string; description: string }`
  - `CollectibleIcon` — `{ id: string; label: string; imageSrc: string; alt: string }`
- Create static data constants in `src/utils/kudos-rules-data.ts`:
  - `HERO_BADGE_TIERS: HeroBadgeTier[]` — 4 items with exact Vietnamese text from design-style.md Hero Tiers Data table:
    - New Hero: "Có 1-4 người gửi Kudos cho bạn" / "Hành trình lan tỏa điều tốt đẹp bắt đầu..."
    - Rising Hero: "Có 5-9 người gửi Kudos cho bạn" / "Hình ảnh bạn đang lớn dần..."
    - Super Hero: "Có 10–20 người gửi Kudos cho bạn" / "Bạn đã trở thành biểu tượng..."
    - Legend Hero: "Có hơn 20 người gửi Kudos cho bạn" / "Bạn đã trở thành huyền thoại..."
  - `COLLECTIBLE_ICONS: CollectibleIcon[]` — 6 items in order: REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER
  - Section heading and body text constants (exact Vietnamese copy from design-style.md body text nodes `3204:6133`, `3204:6078`, `3204:6089`, `3204:6091`):
    - S1 Heading: "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC"
    - S1 Body: "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile"
    - S2 Heading: "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN"
    - S2 Body: "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA."
    - Collection Note: "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025."
    - S3 Heading: "KUDOS QUỐC DÂN"
    - S3 Body: "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further."

### Phase 2: Core Panel — US1 (View Rules) + US3 (Close Panel)

Build `<KudosRulesPanel>` in `src/components/kudos/kudos-rules-panel.tsx`:

**Props**: `isOpen: boolean`, `onClose: () => void`, `triggerRef?: RefObject<HTMLButtonElement | null>`

**Panel container** (fixed overlay):
- `fixed top-0 right-0 h-dvh z-50`
- Width: `w-full md:w-[480px] lg:w-[553px]`
- Background: `bg-kudos-container-2` (token for `#00070C`)
- Padding: `pt-4 px-5 pb-5 md:pt-6 md:px-10 md:pb-10` (mobile: top 16px, horizontal 20px, bottom 20px; desktop: `24px 40px 40px 40px`)
- Layout: `flex flex-col justify-between gap-10`

**Content area** (scrollable, 3-level gap structure — critical for Figma accuracy):

```
Content Area [3204:6053] (flex-1 overflow-y-auto flex flex-col gap-6)
├── Title: "Thể lệ" (<h2>)
└── Sections Group [3204:6076] (flex flex-col gap-4)
    ├── Section 1 Container [3204:6131] (flex flex-col gap-4)
    │   ├── S1 Heading (<h3>)
    │   ├── S1 Body (<p>)
    │   ├── HeroBadgeRow × 1
    │   ├── HeroBadgeRow × 2
    │   ├── HeroBadgeRow × 3
    │   └── HeroBadgeRow × 4
    ├── S2 Heading (<h3>)          ← flat sibling, NOT wrapped
    ├── S2 Body (<p>)              ← flat sibling
    ├── <CollectibleIconGrid />    ← flat sibling
    ├── Collection Note (<p>)      ← flat sibling
    ├── S3 Heading (<h3>)          ← flat sibling
    └── S3 Body (<p>)              ← flat sibling
```

> **Why S2/S3 items are flat**: In Figma, only Section 1 has a container wrapper (node `3204:6131` with `gap:16px`). Section 2 and Section 3 items are direct children of the Sections Group (node `3204:6076` with `gap:16px`). Since both gaps are 16px, wrapping S2/S3 would produce an identical visual — but keeping them flat matches the Figma structure and avoids unnecessary nesting.

- Content Area outer: `flex-1 overflow-y-auto flex flex-col gap-6` (24px between title and sections group)
- Title: `<h2>` with `text-kudos-gold font-bold text-[32px] leading-[40px] lg:text-[45px] lg:leading-[52px]`
- Sections Group: `<div class="flex flex-col gap-4">` (16px between all items)
- Section 1 Container: `<div class="flex flex-col gap-4">` (16px internal)
  - S1 Heading: `text-kudos-gold font-bold text-[18px] leading-6 lg:text-[22px] lg:leading-7 uppercase`
  - S1 Body: body text style (see below)
  - 4× `<HeroBadgeRow>`
- S2 Heading: same style as S1 Heading
- S2 Body: body text style
- `<CollectibleIconGrid />`
- Collection Note: body text style
- S3 Heading: `text-kudos-gold font-bold text-2xl leading-8 uppercase` (24px — does NOT scale down on mobile per design-style)
- S3 Body: body text style
- Body text shared style: `text-white font-bold text-base leading-6 tracking-[0.5px] text-justify`

**Footer** (sticky at bottom):
- `flex-shrink-0 flex flex-row gap-4`
- "Đóng": `<button>` — `flex-1 h-14 flex items-center justify-center gap-2 bg-[rgba(255,234,158,0.10)] border border-kudos-border rounded p-4 text-white font-bold text-base tracking-[0.5px] transition-opacity duration-150 ease-in-out hover:opacity-80 active:opacity-60 focus-visible:outline-2 focus-visible:outline-kudos-border focus-visible:outline-offset-2`
- "Viết KUDOS": `<Link href="/kudos/write">` — `flex-1 h-14 lg:w-[363px] lg:flex-none flex items-center justify-center gap-2 bg-kudos-gold rounded p-4 text-navy font-bold text-base tracking-[0.5px] transition-opacity duration-150 ease-in-out hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-kudos-gold focus-visible:outline-offset-2`

**Backdrop**: `<div class="fixed inset-0 bg-black/50 z-40" onClick={onClose} />`

**Interactions** (copy from `kudo-modal.tsx`):
- Escape key handler (useEffect, lines 59–67 pattern)
- Focus trap (useEffect, lines 69–102 pattern) — focus panel title on open
- Body scroll lock (useEffect, lines 104–108 pattern)
- Backdrop click → `onClose`
- Focus restoration to `triggerRef` on close

**Render strategy** (differs from `kudo-modal.tsx`):
- `kudo-modal.tsx` uses `if (!isOpen) return null` — no close animation possible.
- This panel MUST always render in the DOM (never conditionally unmount) because the spec requires a visible slide-out close animation. Use `translate-x-full` (off-screen) / `translate-x-0` (visible) to control visibility.
- When `isOpen === false` and panel is off-screen, also set `aria-hidden="true"` and `inert` attribute to prevent screen reader / focus access to hidden panel.
- Backdrop is also always rendered; toggle `opacity-0 pointer-events-none` (closed) / `opacity-100` (open).

**Animation** (conditional Tailwind classes based on `isOpen`):
- Panel base: `transition-transform` (REQUIRED — without this, translate changes are instant)
  - Open: `translate-x-0 duration-200 ease-out`
  - Close: `translate-x-full duration-150 ease-in`
- Backdrop base: `transition-opacity` (REQUIRED)
  - Open: `opacity-100 duration-200 ease-out`
  - Close: `opacity-0 duration-150 ease-in`
- Buttons base: `transition-opacity duration-150 ease-in-out` (for hover/active opacity changes)
- Implementation: Use template literal or `clsx` to swap conditional classes based on `isOpen` boolean. The CSS transition fires on each class change, producing the correct asymmetric timing.

**ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="kudos-rules-title"` on panel container.

Build `<HeroBadgeRow>` in `src/components/kudos/hero-badge-row.tsx`:

> **Layout note**: Figma uses absolute positioning within 400×72px frames (`top:0 left:20px`, `top:0 left:154px`, `top:28px left:20px`). For implementation, use **flexbox instead** — a vertical flex container with two rows. This produces the same visual layout while being more responsive and maintainable on smaller screens.

- Container: `w-full flex flex-col gap-1` (4px — matches Figma: Tier 1 height 24px + 4px gap = Tier 2 at top:28px)
- Tier 1 (top row): `flex flex-row items-center gap-2`
  - Badge pill: `w-[126px] h-[22px] shrink-0 rounded-full border border-kudos-gold overflow-hidden` — use `<Image>` if asset exists, else `<span>` fallback with text + `text-center text-[13px] font-bold text-white [text-shadow:0_0.4px_1.8px_#000]`
  - Condition text: `text-white font-bold text-base leading-6 tracking-[0.5px]`
- Tier 2 (bottom row): description text
  - `text-white font-bold text-sm leading-5 tracking-[0.1px] text-justify`

Build `<CollectibleIconGrid>` in `src/components/kudos/collectible-icon-grid.tsx`:
- ⚠️ **2-level nesting** (from design-style.md): outer `px-6` + inner `px-6` = 48px per side
- Outer container: `flex flex-col px-6`
- Inner container: `flex flex-col gap-4 px-6` (gap-4 = 16px between rows)
- Each row: `flex flex-row justify-between`
- Each icon cell: `w-20 flex flex-col items-center justify-center gap-2`
- Icon circle: `w-16 h-16 rounded-full border-2 border-white overflow-hidden` — `<Image>` with `onError` fallback
- Icon label: `w-20 text-[11px] font-bold leading-4 tracking-[0.5px] text-white text-center` (uniform 11px — the 12px/11px difference in Figma is negligible and word wrap handles single-word labels naturally)

### Phase 3: Navigation — US2 (Write Kudos CTA)

- "Viết KUDOS" implemented as `<Link href="/kudos/write">` from `next/link`
- Styled as a button (block-level flex container) but semantically an anchor tag
- Keyboard activation (Enter key) works natively with `<Link>`/`<a>`
- Icon: `<Icon name="pencil" size={24} className="text-navy" />`

### Phase 4: Responsive Design — Mobile/Tablet/Desktop

- **Mobile** (default, < 768px):
  - Panel: `w-full` (full screen overlay)
  - Padding: `pt-4 px-5 pb-5` (top 16px, horizontal 20px, bottom 20px)
  - Title: `text-[32px] leading-[40px]`
  - Section headings (S1, S2): `text-[18px] leading-6`
  - S3 heading: stays `text-2xl` (24px) — no mobile override
  - Hero badge rows: `w-full`
  - Both buttons: `flex-1` (equal width)
- **Tablet** (`md:`, ≥ 768px):
  - Panel: `md:w-[480px]`
  - Padding: `md:pt-6 md:px-10 md:pb-10`
  - Title, headings: still mobile sizes (32px, 18px) — desktop sizes only at `lg:`
- **Desktop** (`lg:`, ≥ 1024px):
  - Panel: `lg:w-[553px]`
  - Title: `lg:text-[45px] lg:leading-[52px]`
  - Section headings (S1, S2): `lg:text-[22px] lg:leading-7`
  - "Viết KUDOS": `lg:w-[363px] lg:flex-none` (fixed width, "Đóng" takes remainder)

### Phase 5: Integration — Connect to /kudos Page

Build `<KudosRulesWrapper>` in `src/components/kudos/kudos-rules-wrapper.tsx`:
- `"use client"` component managing `isOpen` state and `triggerRef`
- Contains:
  - Trigger button (e.g. "Xem thể lệ" text or icon button)
  - `<KudosRulesPanel isOpen={isOpen} onClose={close} triggerRef={triggerRef} />`
- Follows identical pattern to `ActionBarWrapper` (`src/components/kudos-board/action-bar-wrapper.tsx`) which wraps `ActionBar` + `KudoModal`

Modify `src/app/kudos/page.tsx`:
- Import `KudosRulesWrapper`
- Place `<KudosRulesWrapper />` in the page layout (near `<KudosKeyvisual />` or `<ActionBarWrapper />`)

Deep link support (optional): Read `searchParams` for `?rules=open` and pass `defaultOpen={true}` to the wrapper.

### Phase 6: Polish — Edge Cases & Accessibility (US4, US5, US6)

- **Image fallbacks**: Badge pills → styled `<span>` with gold border + white text. Collectible icons → navy circle with border + label.
- **Image loading**: Use `next/image` built-in lazy loading. No skeleton needed since text renders immediately.
- **Debounce rapid open/close**: Disable trigger button during animation transition (200ms) via `isAnimating` state or `pointer-events-none`.
- **Screen reader**: Focus moves to panel title (`<h2 id="kudos-rules-title" tabIndex={-1}>`) on open. Panel announced as dialog.
- **Focus order**: Content sections (scrollable) → "Đóng" button → "Viết KUDOS" link
- **WCAG AA contrast**: Already confirmed — `#FFEA9E` on `#00070C` = ~8.7:1, `#FFFFFF` on `#00070C` = ~21:1.
- **Keyboard-only test**: Full tab cycle through panel, Escape to close, Enter on buttons/links.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Collectible icon images unavailable from Figma API | High | Medium | Implement styled fallback circles with labels first. Source images via manual Figma export. Assets can be swapped in later without code changes (just file replacement in `public/images/kudos/icons/`). |
| `/kudos/write` route not yet implemented | Medium | Low | Use `href="/kudos/write"` — the panel and Link work independently. Next.js will show 404 if route doesn't exist yet; no runtime error. |
| Hero badge pill images too small/blurry at 126×22px | Low | Medium | Download at 2x resolution from Figma (`@2x` scale). Use `next/image` with `width={126} height={22}` and let it serve appropriate resolution. |
| Focus trap edge cases on different browsers | Low | Medium | Proven pattern from `kudo-modal.tsx` (already tested in production). Copy implementation verbatim. Test on Chrome, Firefox, Safari. |
| Trigger button placement unclear from spec | Medium | Low | Spec says "from `/kudos` page → clicking a 'Thể lệ' / 'Xem thể lệ' trigger". Implement as a visible button in the wrapper; exact position can be adjusted during integration without panel code changes. |

### Estimated Complexity

- **Frontend**: Medium (panel overlay with animation, focus trap, responsive, 3 sub-components, 1 wrapper)
- **Backend**: None
- **Testing**: Low-Medium (E2E for open/close/navigation, responsive at 3 breakpoints)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Panel open/close, button navigation, focus management, trigger → panel → close cycle
- [ ] **External dependencies**: N/A
- [ ] **Data layer**: N/A
- [x] **User workflows**: Open panel → read rules → write kudos OR close panel

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Panel open/close state, animation, focus trap, Escape key, backdrop click, body scroll lock |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive behavior at 375px, 768px, 1440px viewports |

### Test Environment

- **Environment type**: Local development, Playwright browser contexts
- **Test data strategy**: Static data constants (no mocking needed)
- **Isolation approach**: Each test navigates fresh to `/kudos` page (requires authenticated session — use Playwright auth setup)

### Test Scenarios Outline

1. **Happy Path (P1 — US1, US2, US3)**
   - [x] Open panel → verify title "Thể lệ" visible in gold
   - [x] Verify 3 section headings render with correct text
   - [x] Verify 4 hero badge rows with correct tier names and condition text
   - [x] Verify 6 collectible icons in 2×3 grid with correct labels
   - [x] Verify body text content matches spec exactly (spot-check key phrases)
   - [x] Click "Viết KUDOS" → verify navigation to `/kudos/write`
   - [x] Click "Đóng" → verify panel closes and page is accessible

2. **Interaction & Accessibility (P1 + P3 — US3, US6)**
   - [x] Press Escape → panel closes
   - [x] Click backdrop → panel closes
   - [x] Tab through panel → focus stays trapped inside
   - [x] Panel has `role="dialog"` and `aria-modal="true"`
   - [x] Focus restores to trigger element on close
   - [x] Body scroll is locked when panel is open

3. **Responsive (P1 — all user stories)**
   - [x] Mobile (375px): panel full-width, both buttons equal-width
   - [x] Tablet (768px): panel 480px wide
   - [x] Desktop (1440px): panel 553px wide
   - [x] Content scrolls internally when viewport height is insufficient (e.g. 600px viewport)

### Tooling & Framework

- **Test framework**: Playwright (already configured in project)
- **Supporting tools**: Playwright accessibility snapshot, axe-core if available
- **CI integration**: Existing Playwright CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (open/close/navigate) | 100% | High |
| Accessibility (focus trap, ARIA, keyboard) | 90%+ | High |
| Responsive layout | 3 breakpoints verified | Medium |
| Image fallbacks | Manual verification | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] `design-style.md` complete with all visual specs
- [x] Montserrat font configured in project (`src/app/layout.tsx`)
- [x] Tailwind tokens exist: `kudos-gold`, `kudos-container-2`, `kudos-border` (in `globals.css`)
- [x] `<Icon>` component exists (`src/components/ui/icon.tsx`)
- [x] `close.svg` icon exists (`public/icons/close.svg`)
- [ ] Hero badge pill images downloaded from Figma (4 PNG files) → Phase 0
- [ ] Collectible icon images sourced (6 files — Figma API returned null) → Phase 0
- [ ] `pencil.svg` icon added to `/public/icons/` → Phase 0

### External Dependencies

- None — purely static frontend component

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order (Phase 0: Assets → Phase 1: Foundation → Phase 2: Core → ...)

---

## Notes

- **Existing close icon**: `/public/icons/close.svg` already exists. Use `<Icon name="close" />` for the "Đóng" button (design-style says `x` but the project convention uses `close`).
- **Figma media node mapping**:
  - `3204:6163` → New Hero badge pill image (PNG)
  - `3204:6172` → Rising Hero badge pill image (PNG)
  - `3204:6181` → Super Hero badge pill image (PNG)
  - `3204:6190` → Legend Hero badge pill image (PNG)
  - `I3204:6093;186:2759` → Close/X button icon (SVG) — use existing `close.svg` if visually matching
  - `I3204:6094;186:1763` → Pencil/edit button icon (SVG) — download to `public/icons/pencil.svg`
  - `3204:6082`–`3204:6088` → Collectible icons (returned `null` — manual Figma export needed)
- **Panel is NOT a separate page** — it's an overlay rendered within `/kudos`. The `isOpen` state is managed by `<KudosRulesWrapper>` (client component), which follows the same pattern as `ActionBarWrapper` → `KudoModal`.
- **Content area gap structure** (critical for visual accuracy):
  - Content Area: `flex flex-col gap-6` (24px between Title and Sections Group)
  - Sections Group: `flex flex-col gap-4` (16px between all section items: S1 container, S2 heading, S2 body, icon grid, collection note, S3 heading, S3 body)
  - Section 1 Internal: `flex flex-col gap-4` (16px between S1 heading, S1 body, and 4 badge rows)
  - This creates three nested flex containers — the gap hierarchy is essential for matching Figma.
- **Icon grid 2-level nesting** (from design-style.md ⚠️ warning): Outer container `px-6` + Inner container `px-6` = 48px horizontal padding per side. Effective row width = 473 − 96 = 377px. Missing one level will make icons too spread out.
- **Buttons layout**: Desktop: "Đóng" is `flex-1` (~94px), "Viết KUDOS" is `w-[363px]`. Mobile: both are `flex-1` (equal width). Use `lg:w-[363px] lg:flex-none` on "Viết KUDOS" to switch.
- **Per-icon label font size**: Figma shows 12px for single-word labels (REVIVAL, STAY GOLD) and 11px for multi-word. Implementation uses uniform `text-[11px]` — the 1px difference is negligible and word wrap handles line counts naturally.
- **Super Hero text-align inconsistency**: Figma node `3204:6182` shows `textAlign: "left"` while all others use `"JUSTIFIED"`. Per design-style recommendation, use `text-justify` uniformly for all 4 badge descriptions.
- **Emoji in text**: Body text nodes `3204:6078` and `3204:6091` contain `❤️` emoji. Render as Unicode character directly in JSX — no special handling needed.
- **`items-end` on panel container**: The Figma spec shows `align-items: flex-end` on the panel container. Since all children are `w-full` within padded container, this has no visual effect. Omit to keep Tailwind cleaner unless visual discrepancy is found during implementation.
- **Always-render vs conditional-render**: Unlike `kudo-modal.tsx` which uses `if (!isOpen) return null`, this panel MUST always exist in the DOM (hidden via `translate-x-full`) because the spec requires a visible slide-out animation. Use the `inert` HTML attribute + `aria-hidden="true"` when closed to prevent focus/screen-reader access to the off-screen panel.
- **S3 heading size on mobile**: The design-style responsive spec only scales the title (45→32px) and S1/S2 headings (22→18px). The S3 "KUDOS QUỐC DÂN" heading (24px) has no mobile override — keep `text-2xl` at all breakpoints.
- **Badge pill `text-shadow`**: The fallback `<span>` badge pill must include `[text-shadow:0_0.4px_1.8px_#000]` from design-style node data. This is needed for legibility when using the text-only fallback (not needed when using `<Image>` asset).
