# Tasks: Hệ thống giải (Award System)

**Frame**: `313:8436-HeThongGiai`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, etc.)

---

## Phase 1: Setup (Assets & Project Structure)

**Purpose**: Download assets from Figma and prepare project structure

- [x] T001 Download 6 high-res award category images (336×336) from Figma using `get_media_files` → `public/images/awards/` (top-talent.png, top-project.png, top-project-leader.png, best-manager.png, signature-2025.png, mvp.png)
- [x] T002 [P] Download icons from Figma using `get_media_files`: target.svg, diamond.svg, license.svg, arrow-right.svg → `public/icons/`
- [x] T003 [P] Verify `root-further.png` keyvisual image exists in `public/images/` for the Award System banner; if not, download from Figma
- [x] T004 [P] Verify SVN-Gotham font availability for "KUDOS" text; if unavailable, plan Montserrat bold fallback with `letter-spacing: -0.13em`

---

## Phase 2: Foundation (Types, Data & Global Styles)

**Purpose**: Core data layer and global CSS required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add `PrizeTier` and `AwardDetailCategory` types alongside existing `AwardCategory` type | `src/types/awards.ts`
- [x] T006 Create static award data constant `AWARD_CATEGORIES: AwardDetailCategory[]` with all 6 categories (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) matching spec data table. Each entry: id (URL-safe slug), name, description (Vietnamese text from Figma), imageUrl, quantity, unitType, prizeTiers array. Signature 2025 has 2 prize tiers (5M individual + 8M team), all others have 1 | `src/utils/award-data.ts`
- [x] T007 [P] Write unit tests for static data: exactly 6 categories, all fields non-empty, all ids URL-safe and unique, correct display order, Signature 2025 has 2 prize tiers, others have 1 | `src/utils/__tests__/award-data.test.ts`
- [x] T008 [P] Add `scroll-behavior: smooth` and `scroll-padding-top: 64px` to `html` element for native hash/anchor navigation (FR-009, TR-005) | `src/app/globals.css`

**Checkpoint**: Foundation ready — types defined, data validated, global styles set. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Award Categories Overview (Priority: P1) 🎯 MVP

**Goal**: Display all 6 award categories with image, title, description, quantity, unit type, and prize value in alternating left/right layout.

**Independent Test**: Navigate to `/awards` and verify all 6 award cards are displayed with correct information and alternating image positions.

### Frontend (US1)

- [x] T009 [P] [US1] Create `<AwardImage>` client component (`"use client"`): wraps `next/image` (336×336), gold border (`1px solid #FFEA9E`), `rounded-3xl`, glow shadow (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`), `mix-blend-mode: screen`. Props: `src`, `alt`, `name`. `onError` fallback: replace with dark container showing award name in gold text, maintaining 336×336 dimensions. Responsive: `w-full max-w-[336px]` on mobile, fixed 336px on desktop | `src/components/awards/award-image.tsx`
- [x] T010 [P] [US1] Create `<SectionTitle>` RSC: subtitle "Sun\* Annual Awards 2025" (Montserrat 24px/32px 700, white), title "Hệ thống giải thưởng SAA 2025" (Montserrat 57px 700, gold #FFEA9E). Responsive: title ~36px on mobile. `text-left` alignment, gap-4 between subtitle and title | `src/components/awards/section-title.tsx`
- [x] T011 [US1] Create `<AwardCard>` RSC: Props `category: AwardDetailCategory`, `index: number`. Layout: `flex-row` (even index = image LEFT) / `flex-row-reverse` (odd index = image RIGHT) on desktop via `lg:flex-row` / `lg:flex-row-reverse`; always `flex-col` on mobile. Uses `<AwardImage>` for image block. Content block: 480px desktop / full width mobile, `backdrop-filter: blur(32px)`, gap-8, rounded-2xl. Inner structure: title row (`<Icon name="target" />` + name, Montserrat 24px/32px 700 gold), description (16px/24px 700 white, `text-justify`), divider (1px #2E3940), quantity row (label 24px gold + value 36px white + unit 14px white), divider, prize value block (label 24px gold + value 36px white + subtitle 14px white). Multi-tier: iterate `prizeTiers[]` for Signature 2025 dual display. Root element has `id={category.id}` for anchor nav. Use `<h3>` for award name | `src/components/awards/award-card.tsx`

**Checkpoint**: User Story 1 complete — all 6 award cards display correctly with alternating layout, correct data, and image fallback handling.

---

## Phase 4: User Story 2 — Navigate Between Award Categories (Priority: P1)

**Goal**: Implement sticky left sidebar with scroll-spy navigation and URL hash support.

**Independent Test**: Click each sidebar menu item → page scrolls to the correct award section. Scroll manually → active menu item updates automatically.

### Frontend (US2)

- [x] T012 [US2] Create `<AwardSidebar>` client component (`"use client"`): Props `categories: { id: string; name: string }[]`. Vertical menu with `<Icon name="target" />` + label per category. **Scroll-spy**: `IntersectionObserver` with `rootMargin: "-64px 0px -50% 0px"`, observes each card by id, updates `activeAwardId` state. **Click**: `scrollIntoView({ behavior: 'smooth', block: 'start' })` + immediate `activeAwardId` update + `history.replaceState` to update URL hash. **Active state**: gold #FFEA9E text, text-shadow glow, left indicator. **Default**: white #FFFFFF. **Keyboard**: `<button>` elements, Tab through, Enter/Space to activate. **ARIA**: `<nav role="navigation" aria-label="Danh mục giải thưởng">`, `aria-current="true"` on active. CSS: `position: sticky`, `top: 64px`, `self-start`. Touch targets: `p-4` (≥44×44px). **On mount**: check `window.location.hash` → set as active if matches category id. Cleanup: disconnect observer on unmount | `src/components/awards/award-sidebar.tsx`
- [x] T013 [US2] Create `<AwardsSection>` RSC: layout wrapper — flex row with `<AwardSidebar>` (178px, hidden below `lg:`) + card list (853px). Maps `AWARD_CATEGORIES` to `<AwardCard>` components with 80px gap. Dividers between cards (1px #2E3940, full width 853px). Passes `categories` (id + name only) to `<AwardSidebar>`. Responsive: sidebar hidden on mobile/tablet, card list full width | `src/components/awards/awards-section.tsx`

**Checkpoint**: User Story 2 complete — sidebar navigation, scroll-spy, keyboard nav, URL hash support all working.

---

## Phase 5: User Story 3 + 4 — Hero Keyvisual & Sun\* Kudos (Priority: P2)

**Goal**: Implement the hero keyvisual banner and Kudos promotional section.

**Independent Test (US3)**: Load `/awards` → keyvisual banner renders at top with "ROOT FURTHER" artwork and gradient overlay.
**Independent Test (US4)**: Scroll to bottom → Kudos section visible with title, description, and working "Chi tiết" button.

### Frontend (US3 + US4)

- [x] T014 [P] [US3] Create `<AwardKeyVisual>` RSC: relative container, `h-[300px] md:h-[450px] lg:h-[627px]` responsive. Background: `root-further.png` via `next/image` with `fill` + `object-cover`. Gradient overlay: `<div>` with `background: linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)` absolute positioned. `aria-hidden="true"`, `pointer-events-none`. This is a NEW component (existing `<KeyVisual>` is full-screen absolute — cannot reuse) | `src/components/awards/award-keyvisual.tsx`
- [x] T015 [P] [US4] Create `<KudosPromo>` RSC: two-column on desktop (content left, branding right), stacked on mobile. Left: label "Phong trào ghi nhận" (24px/32px 700 white), title "Sun\* Kudos" (57px 700 gold, ~36px mobile), description (16px/24px 700 white), "Chi tiết" button as `<Link href="/#kudos-heading">` (gold bg #FFEA9E, dark text #00101A, `<Icon name="arrow-right" />`, p-4, rounded-sm, hover: opacity-90, focus: outline 2px solid #FFEA9E). Right: "KUDOS" text (SVN-Gotham 96px, #DBD1C1, `letter-spacing: -0.13em`; fallback: Montserrat bold). Responsive: stack on mobile, "KUDOS" hidden or 48px | `src/components/awards/kudos-promo.tsx`

**Checkpoint**: User Stories 3 & 4 complete — keyvisual and Kudos promo render correctly.

---

## Phase 6: User Story 5 + 6 — Responsive Layout & Header/Footer Navigation (Priority: P2/P3)

**Goal**: Ensure full responsive behavior across 3 breakpoints and modify shared Header/Footer for active link support.

**Independent Test (US5)**: View page at mobile (<768px), tablet (768-1023px), desktop (≥1024px) — no layout overflow, cards stack on mobile, sidebar hidden on mobile/tablet.
**Independent Test (US6)**: On `/awards`, "Award Information" is highlighted gold in header nav; footer shows SAA nav links with "Award Information" active.

### Shared Component Modifications (US6)

- [x] T016 [P] [US6] Modify `<Header>` server component: add `activeHref?: string` prop, pass through to `<HeaderClient>` | `src/components/header/header.tsx`
- [x] T017 [P] [US6] Modify `<HeaderClient>`: accept `activeHref` prop. In nav link loop, compare `link.href` with `activeHref` — match: apply `text-gold border-b border-gold` + `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`; no match: keep existing `text-white/80 hover:text-gold`. Backward-compatible: Homepage doesn't pass `activeHref`, all links render default | `src/components/header/header-client.tsx`
- [x] T018 [US6] Modify `<Footer>`: add `variant="saa"` with: layout `flex justify-between items-center`, `border-top: 1px solid #2E3940`, `py-10 px-6 md:px-12 lg:px-[90px]`. Left: logo (69×64) + nav links (flex, gap-12) — "About SAA 2025" (`/`), "Award Information" (`/awards`), "Sun\* Kudos" (`/#kudos-heading`), "Tiêu chuẩn chung" (`/standards`). Active link: compare with `activeHref` prop → apply bg `rgba(255,234,158,0.1)`, gold text-shadow. Right: copyright "Bản quyền thuộc về Sun\* © 2025" in Montserrat Alternates. Responsive: stack on mobile, center-align, hide logo on mobile. Existing variants unchanged | `src/components/footer/footer.tsx`

### Page Assembly (US5 + US6)

- [x] T019 Create `<AwardsPage>` RSC: auth check via `createClient()` + `getUser()`, redirect to `/login` if unauthenticated. Render: `<AwardKeyVisual>`, `<Header variant="app" navLinks={NAV_LINKS} activeHref="/awards" user={...}>`, content wrapper `<div className="relative">` containing `<SectionTitle>`, `<ScrollReveal><AwardsSection /></ScrollReveal>`, `<ScrollReveal><KudosPromo /></ScrollReveal>`, then `<Footer variant="saa" activeHref="/awards" />`. NAV_LINKS: About SAA 2025 (`/`), Award Information (`/awards`), Sun\* Kudos (`/#kudos-heading`). No `pt-16` needed — `<AwardKeyVisual>` is in-flow | `src/app/awards/page.tsx`
- [x] T020 [US5] Verify responsive layout at all 3 breakpoints: Mobile (<768px) — no sidebar, cards stacked, `px-4`, title ~36px; Tablet (768-1023px) — no sidebar, smaller images (240px), `px-12`; Desktop (≥1024px) — full layout, `px-36`, sidebar visible + sticky. No horizontal overflow at any breakpoint

**Checkpoint**: All user stories (US1-US6) complete — page fully assembled and responsive.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility audit, performance optimization, and final verification

- [x] T021 [P] Verify accessibility: all award images have descriptive alt text (e.g., "Giải thưởng Top Talent"); sidebar has `role="navigation"` + `aria-label` + `aria-current`; focus visible (`outline: 2px solid #FFEA9E, outline-offset: 2px`) on all interactive elements; `<h3>` for award names, heading hierarchy correct (`<h1>` page title, `<h2>` subtitle, `<h3>` award names)
- [x] T022 [P] Optimize performance: `next/image` with `sizes="(max-width: 768px) 100vw, 336px"` on award images; first 2 cards `priority`, remaining 4 lazy; verify Lighthouse ≥ 90 desktop (SC-003)
- [x] T023 [P] Add `@supports not (backdrop-filter: blur(32px))` fallback: `bg-navy/80` solid background on award content blocks
- [x] T024 [P] Verify long Vietnamese award descriptions render correctly within 480px content block with `text-justify`, no overflow or clipping
- [x] T025 [P] Verify Homepage still renders correctly after Header/Footer modifications (no regression from `activeHref` prop addition and new Footer `"saa"` variant)
- [x] T026 Fix SectionTitle subtitle casing: "Sun* Annual Awards 2025" → "Sun* annual awards 2025" per Figma design | `src/components/awards/section-title.tsx`
- [x] T027 Fix AwardsSection divider spacing: `my-16 lg:my-20` (160px total) → `my-8 lg:my-10` (80px total) per design spec | `src/components/awards/awards-section.tsx`
- [x] T028 Add `priority` prop to AwardImage and pass from AwardCard for first 2 above-fold images (performance optimization from plan T022) | `src/components/awards/award-image.tsx`, `src/components/awards/award-card.tsx`
- [x] T029 Fix sidebar scroll-spy flickering: track topmost visible section via Set instead of last intersecting entry | `src/components/awards/award-sidebar.tsx`
- [x] T030 Write E2E tests covering P1 user stories: all 6 awards displayed with correct data, alternating layout, sidebar click-to-scroll, scroll-spy active state, URL hash navigation (`/awards#mvp`), Signature 2025 dual prize tiers, mobile responsive (sidebar hidden, cards stacked), unauthenticated redirect, image fallback, "Chi tiết" button navigation, header/footer active link styling | `tests/e2e/award-system.spec.ts`
- [x] T031 Fix SectionTitle: add Rectangle 26 (1px divider) between subtitle and title, remove section wrapper (now overlaid inside AwardKeyVisual) | `src/components/awards/section-title.tsx`
- [x] T032 Fix AwardKeyVisual: accept `children?: ReactNode` prop and render as absolute overlay at bottom-left of Bìa frame | `src/components/awards/award-keyvisual.tsx`
- [x] T033 Fix page.tsx: move `<SectionTitle />` inside `<AwardKeyVisual>` as overlay child; update `Sun* Kudos` nav href from `/#kudos-heading` to `/kudos` | `src/app/awards/page.tsx`
- [x] T034 Fix KudosPromo: update Chi tiết href to `/kudos`, replace `arrow-right` icon with `external-link` (↗), add Sun* logo image on right side | `src/components/awards/kudos-promo.tsx`
- [x] T035 Add `public/icons/external-link.svg` — diagonal arrow (↗) icon for external link navigation | `public/icons/external-link.svg`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup/Assets) ──→ Phase 2 (Foundation) ──→ Phase 3 (US1: Cards) ──→ Phase 4 (US2: Sidebar)
                                                         │                         │
                                                         ├── Phase 5 (US3+4) ──────┤
                                                         │                         │
                                                         └─────────────────────────→ Phase 6 (US5+6: Assembly)
                                                                                         │
                                                                                         ↓
                                                                                   Phase 7 (Polish)
```

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 (assets referenced in data)
- **Phase 3 (US1)**: Depends on Phase 2 (types + data + global CSS)
- **Phase 4 (US2)**: Depends on Phase 3 (sidebar observes card elements by id)
- **Phase 5 (US3+US4)**: Depends on Phase 2 only (independent of US1/US2 cards)
- **Phase 6 (US5+US6)**: Depends on Phase 3 + Phase 4 + Phase 5 (assembles all components)
- **Phase 7 (Polish)**: Depends on Phase 6 (all components must exist)

### Parallel Opportunities

- **Phase 1**: T001, T002, T003, T004 — all parallel (independent asset downloads)
- **Phase 2**: T007 + T008 parallel with each other (after T005+T006 complete)
- **Phase 3**: T009 + T010 parallel (independent components), then T011 (depends on T009)
- **Phase 5**: T014 + T015 fully parallel (independent components, no dependency on Phase 3/4)
- **Phase 6**: T016 + T017 parallel (header changes); then T018 (footer); then T019 (page assembly)
- **Phase 7**: T021–T025 all parallel (independent verification tasks)

### Within Each User Story

- Types/data before components (Phase 2 before Phase 3)
- Image component before card component (T009 before T011)
- Card components before sidebar (Phase 3 before Phase 4, since sidebar observes cards)
- All components before page assembly (Phase 3-5 before Phase 6)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US1: Award Cards only)
3. **STOP and VALIDATE**: Temporarily render cards in a test page — verify all 6 display correctly with alternating layout
4. Continue Phase 4 → Phase 5 → Phase 6 → Phase 7

### Incremental Delivery

1. **Phase 1+2**: Setup + Foundation → verify unit tests pass
2. **Phase 3 (US1)**: Award cards render → visual check
3. **Phase 4 (US2)**: Sidebar + scroll-spy → interactive check
4. **Phase 5 (US3+4)**: Keyvisual + Kudos → visual check
5. **Phase 6 (US5+6)**: Full page assembly + responsive → cross-browser check
6. **Phase 7**: Polish + E2E → deploy-ready

---

## Notes

- Commit after each phase or logical group of tasks
- Run `vitest` after Phase 2 to validate static data
- Run Playwright E2E after Phase 7 for full coverage
- Award descriptions (Vietnamese text) must be extracted from Figma frame content during T006
- Mark tasks complete as you go: `[x]`
- Update spec.md if requirements change during implementation
