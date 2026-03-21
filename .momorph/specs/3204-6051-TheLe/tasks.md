# Tasks: Thể lệ — Kudos Rules Panel

**Frame**: `3204:6051-TheLe`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5, US6)
- **|**: File path affected by this task

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download Figma assets and create project directories

- [x] T001 Create directory `public/images/kudos/` and `public/images/kudos/icons/` for panel assets
- [x] T002 [P] Download 4 hero badge pill images from Figma media API to `public/images/kudos/` — nodes: `3204:6163` → `new-hero-badge.png`, `3204:6172` → `rising-hero-badge.png`, `3204:6181` → `super-hero-badge.png`, `3204:6190` → `legend-hero-badge.png` | public/images/kudos/
- [x] T003 [P] Download pencil icon SVG from Figma media node `I3204:6094;186:1763` to `public/icons/pencil.svg`. Verify existing `public/icons/close.svg` matches Figma node `I3204:6093;186:2759` — if not, download replacement | public/icons/pencil.svg
- [ ] T004 [P] Source 6 collectible icon images (manual Figma export or reuse from awards page) to `public/images/kudos/icons/`: revival.png, touch-of-light.png, stay-gold.png, flow-to-horizon.png, beyond-the-boundary.png, root-further.png. If unavailable, skip — fallback placeholders will be implemented in T014 | public/images/kudos/icons/

---

## Phase 2: Foundation (Types & Static Data)

**Purpose**: TypeScript types and static data constants required by ALL components

**⚠️ CRITICAL**: No component work can begin until this phase is complete

- [x] T005 [P] Define TypeScript types `HeroBadgeTier` (`{ id, label, imageSrc, condition, description }`) and `CollectibleIcon` (`{ id, label, imageSrc, alt }`) | src/types/kudos-rules.ts
- [x] T006 [P] Create static data constants: `HERO_BADGE_TIERS` (4 items with exact Vietnamese text from design-style.md Hero Tiers Data table), `COLLECTIBLE_ICONS` (6 items in order: REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER), all section headings and body text (exact copy from design-style.md body text nodes `3204:6133`, `3204:6078`, `3204:6089`, `3204:6091`) | src/utils/kudos-rules-data.ts

**Checkpoint**: Foundation ready — component implementation can begin

---

## Phase 3: US1 — View Kudos Rules Panel + US3 — Close Panel (Priority: P1) 🎯 MVP

**Goal**: Core panel overlay with all 3 content sections, open/close animation, backdrop, focus trap, body scroll lock, responsive layout. US1 and US3 are inseparable — the panel must open to display and close to dismiss.

**Independent Test**: Navigate to `/kudos`, click trigger → panel slides in from right with title "Thể lệ" in gold, 3 sections visible, scroll works. Click "Đóng" / Escape / backdrop → panel slides out, focus restores.

### Sub-components (US1)

- [x] T007 [P] [US1] Build `<HeroBadgeRow>` sub-component: flexbox layout (gap-1, 4px), Tier 1 row (badge pill 126×22px `<Image>` with `<span>` fallback + condition text), Tier 2 row (description text 14px/20px text-justify). Props: `tier: HeroBadgeTier`. See plan.md Phase 2 "Build HeroBadgeRow" for exact Tailwind classes | src/components/kudos/hero-badge-row.tsx
- [x] T008 [P] [US1] Build `<CollectibleIconGrid>` sub-component: 2-level nested padding (outer `px-6` + inner `px-6` = 48px/side), inner flex-col gap-4, 2 rows of 3 icons each (flex-row justify-between), each cell w-20 with 64×64 circular `<Image>` (border-2 border-white) + label (text-[11px]). `onError` fallback for images. Props: `icons: CollectibleIcon[]`. See plan.md Phase 2 "Build CollectibleIconGrid" for exact Tailwind classes | src/components/kudos/collectible-icon-grid.tsx

### Main Panel (US1 + US3)

- [x] T009 [US1] Build `<KudosRulesPanel>` main component with "use client" directive. Props: `isOpen: boolean`, `onClose: () => void`, `triggerRef?: RefObject<HTMLButtonElement | null>`. Implement: | src/components/kudos/kudos-rules-panel.tsx
  - **Always-render strategy**: Panel always in DOM, visibility via `translate-x-full`/`translate-x-0` (NOT conditional render — required for close animation)
  - **Panel container**: `fixed top-0 right-0 h-dvh z-50 w-full md:w-[480px] lg:w-[553px] bg-kudos-container-2 pt-4 px-5 pb-5 md:pt-6 md:px-10 md:pb-10 flex flex-col justify-between gap-10 transition-transform`
  - **Conditional classes**: `isOpen ? 'translate-x-0 duration-200 ease-out' : 'translate-x-full duration-150 ease-in'`
  - **`inert` + `aria-hidden="true"`** when `isOpen === false`
  - **Backdrop**: sibling `<div>` at z-40 with `fixed inset-0 bg-black/50 transition-opacity`, toggle `opacity-0 pointer-events-none` / `opacity-100`
  - **Content area** (3-level gap): `flex-1 overflow-y-auto flex flex-col gap-6` containing `<h2>` title + Sections Group `flex flex-col gap-4` containing Section 1 Container (`flex flex-col gap-4` with heading + body + 4× `<HeroBadgeRow>`) + flat S2 heading/body + `<CollectibleIconGrid>` + collection note + S3 heading/body
  - **Footer**: `flex-shrink-0 flex flex-row gap-4` with "Đóng" `<button>` and "Viết KUDOS" `<Link>` (see plan.md Phase 2 Footer for exact Tailwind classes including `transition-opacity duration-150 ease-in-out`)
  - **ARIA**: `role="dialog"` `aria-modal="true"` `aria-labelledby="kudos-rules-title"` on panel container
  - **All text content**: Import from `src/utils/kudos-rules-data.ts` constants

- [x] T010 [US3] Add panel interaction handlers to `<KudosRulesPanel>` — copy patterns from `src/components/kudo-modal/kudo-modal.tsx`: | src/components/kudos/kudos-rules-panel.tsx
  - **Escape key** handler (useEffect, kudo-modal lines 59–67)
  - **Focus trap** (useEffect, kudo-modal lines 69–102) — focus title `<h2 tabIndex={-1}>` on open
  - **Body scroll lock** (useEffect, kudo-modal lines 104–108) — `document.body.style.overflow = isOpen ? "hidden" : ""`
  - **Backdrop click** → `onClose()`
  - **Focus restoration** → `triggerRef?.current?.focus()` on close

**Checkpoint**: US1 + US3 complete — panel opens with all content, closes via 3 methods, animation works, focus trapped

---

## Phase 4: US2 — Navigate to Write a Kudos (Priority: P1)

**Goal**: "Viết KUDOS" button navigates to `/kudos/write` using `next/link`

**Independent Test**: Open panel → click "Viết KUDOS" → browser navigates to `/kudos/write`

- [x] T011 [US2] Verify "Viết KUDOS" footer button in `<KudosRulesPanel>` is implemented as `<Link href="/kudos/write">` (not `<button>`) with `<Icon name="pencil" size={24} className="text-navy" />`. Keyboard Enter activates natively. Already built in T009 footer — this task validates it works as navigation link, not just styled button | src/components/kudos/kudos-rules-panel.tsx

**Checkpoint**: US2 complete — CTA navigates correctly

---

## Phase 5: US4 — Hero Badge Tiers + US5 — Collectible Icons (Priority: P2)

**Goal**: Ensure pixel-perfect rendering of hero badge rows and collectible icon grid matching Figma design-style.md specs

**Independent Test (US4)**: Open panel → verify 4 badge rows: each has gold-bordered pill on left, condition text right, description below. Check New Hero ("Có 1-4...") and Legend Hero ("Có hơn 20...") text exact.

**Independent Test (US5)**: Open panel → verify 2×3 icon grid with circular borders, correct labels (REVIVAL → ROOT FURTHER), collection note below.

- [ ] T012 [P] [US4] Verify `<HeroBadgeRow>` renders all 4 tiers with exact Vietnamese text matching design-style.md Hero Tiers Data table. Verify badge pill image renders at 126×22px with border-kudos-gold. If badge images unavailable, verify fallback `<span>` with `text-[13px] font-bold text-white text-center [text-shadow:0_0.4px_1.8px_#000]` renders correctly. Verify `text-justify` uniform on all 4 descriptions (including Super Hero — Figma inconsistency noted in plan) | src/components/kudos/hero-badge-row.tsx
- [ ] T013 [P] [US5] Verify `<CollectibleIconGrid>` renders 6 icons in correct 2×3 order with labels. Verify 2-level nesting padding (effective 48px/side). Verify icon images at 64×64px with 2px white border. If images unavailable, verify fallback circles (w-16 h-16 rounded-full border-2 border-white bg-navy) display correctly with labels | src/components/kudos/collectible-icon-grid.tsx

**Checkpoint**: US4 + US5 complete — sub-component detail verified

---

## Phase 6: US6 — Accessibility (Priority: P3)

**Goal**: Full WCAG AA keyboard and screen reader support

**Independent Test**: Tab through panel → focus order is content → "Đóng" → "Viết KUDOS" → trapped (loops). Screen reader announces dialog. Escape closes. Focus restores to trigger.

- [x] T014 [US6] Verify and enhance accessibility in `<KudosRulesPanel>`: | src/components/kudos/kudos-rules-panel.tsx
  - `role="dialog"` + `aria-modal="true"` + `aria-labelledby="kudos-rules-title"` present (from T009)
  - Title `<h2 id="kudos-rules-title" tabIndex={-1}>` receives focus on open
  - Focus trap prevents Tab to background content
  - "Đóng" button has visible text "Đóng" (serves as accessible name)
  - `focus-visible:outline-2 focus-visible:outline-kudos-border focus-visible:outline-offset-2` on "Đóng"
  - `focus-visible:outline-2 focus-visible:outline-kudos-gold focus-visible:outline-offset-2` on "Viết KUDOS"
  - WCAG AA contrast confirmed: `#FFEA9E` on `#00070C` = ~8.7:1, `#FFFFFF` on `#00070C` = ~21:1

**Checkpoint**: US6 complete — full keyboard/screen reader navigation verified

---

## Phase 7: Integration — Connect to /kudos Page

**Purpose**: Wire the panel into the live `/kudos` page with trigger button

- [x] T015 Build `<KudosRulesWrapper>` client wrapper ("use client"): manages `isOpen` useState + `triggerRef` useRef. Contains trigger button (e.g. "Xem thể lệ") + `<KudosRulesPanel isOpen={isOpen} onClose={close} triggerRef={triggerRef} />`. Follow `ActionBarWrapper` pattern from `src/components/kudos-board/action-bar-wrapper.tsx` | src/components/kudos/kudos-rules-wrapper.tsx
- [x] T016 Import and place `<KudosRulesWrapper />` in `/kudos` page layout — add near `<KudosKeyvisual />` or `<ActionBarWrapper />`. Page remains Server Component; wrapper is the client boundary | src/app/kudos/page.tsx

**Checkpoint**: Panel accessible from live `/kudos` page via trigger button

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, responsive verification, final quality

- [ ] T017 [P] Add image error fallbacks: badge pills → styled `<span>` with gold border + white text + text-shadow. Collectible icons → navy circle (bg-navy w-16 h-16 rounded-full border-2 border-white) + label text. Use `onError` handler on `<Image>` components | src/components/kudos/hero-badge-row.tsx, src/components/kudos/collectible-icon-grid.tsx
- [ ] T018 [P] Add rapid open/close debounce: disable trigger button during animation (200ms) via `pointer-events-none` or `isAnimating` state in wrapper | src/components/kudos/kudos-rules-wrapper.tsx
- [ ] T019 [P] Verify responsive layout at 3 breakpoints: Mobile (375px) — panel full-width, buttons equal-width, title 32px, headings 18px. Tablet (768px) — panel 480px. Desktop (1440px) — panel 553px, "Viết KUDOS" 363px fixed. Content scrolls internally at short viewport (600px height) | src/components/kudos/kudos-rules-panel.tsx
- [ ] T020 [P] Verify panel `h-dvh` works correctly on mobile Safari/Chrome (no address bar overlap). Verify body scroll is locked when panel open. Verify footer stays pinned at bottom | src/components/kudos/kudos-rules-panel.tsx
- [x] T021a [BUGFIX] Fix pencil.svg fill="white" → fill="#00101A" (navy) — icon was invisible on gold background | public/icons/pencil.svg
- [x] T021b [BUGFIX] Fix focus restoration firing on initial mount — wasOpenRef pattern prevents stealing focus on page load | src/components/kudos/kudos-rules-panel.tsx
- [x] T021c [BUGFIX] Remove non-functional className props on Icon components (next/image can't color SVGs via CSS) | src/components/kudos/kudos-rules-panel.tsx
- [ ] T021 Run `yarn lint` and `yarn build` — fix any TypeScript errors, unused imports, or ESLint violations. Ensure no `dangerouslySetInnerHTML` usage. Verify all imports use `@/*` alias

**Checkpoint**: Feature complete — all user stories implemented, responsive, accessible, polished

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)          → No dependencies, start immediately
Phase 2 (Foundation)     → Depends on Phase 1 (directories exist)
                           ⚠️ BLOCKS all component work
Phase 3 (US1+US3 MVP)   → Depends on Phase 2 (types + data)
Phase 4 (US2)            → Depends on Phase 3 (panel exists)
Phase 5 (US4+US5)        → Depends on Phase 3 (sub-components exist)
Phase 6 (US6)            → Depends on Phase 3 (panel exists)
Phase 7 (Integration)    → Depends on Phase 3 (panel component ready)
Phase 8 (Polish)         → Depends on Phase 7 (integrated in page)
```

### Within Phase 3 (Core)

```
T007 (HeroBadgeRow) ──┐
T008 (IconGrid)     ──┤── can run in parallel (different files)
                      ↓
T009 (KudosRulesPanel) ← imports T007 + T008 sub-components
                      ↓
T010 (Interactions)    ← adds handlers to T009 component
```

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can all run in parallel (different asset types)
- **Phase 2**: T005, T006 can run in parallel (different files)
- **Phase 3**: T007, T008 can run in parallel (independent sub-components)
- **Phase 5**: T012, T013 can run in parallel (different components)
- **Phase 7–8**: T015 can start immediately after Phase 3; T016 depends on T015
- **Phase 8**: T017, T018, T019, T020 can all run in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (US1 + US3 — core panel with open/close)
3. **STOP and VALIDATE**: Open panel manually, verify all 3 sections render, close works
4. This delivers a usable rules panel — deploy if needed

### Incremental Delivery

1. Phase 1 + 2: Setup + Foundation
2. Phase 3: US1+US3 → Test → **MVP ready**
3. Phase 4: US2 (navigation CTA) → Test
4. Phase 5: US4+US5 (pixel-perfect detail) → Test
5. Phase 6: US6 (accessibility) → Test
6. Phase 7: Integration into `/kudos` page → Test
7. Phase 8: Polish → Final test → **Feature complete**

---

## Notes

- Constitution VI (TDD) requires E2E tests for P1 stories. The spec includes E2E test scenarios in `plan.md` Integration Testing Strategy. Write Playwright tests after Phase 7 integration (panel must be accessible via real page navigation).
- Commit after each phase or logical task group.
- Mark tasks complete as you go: `[x]`
- All Vietnamese text must be copied **exactly** from `design-style.md` body text nodes — do not paraphrase or translate.
- If collectible icon images are unavailable (T004 skipped), T008 and T013 will use the styled fallback. This is acceptable for MVP — images can be swapped in later without code changes.
