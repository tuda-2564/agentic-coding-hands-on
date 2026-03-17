# Tasks: Countdown — Prelaunch Page

**Frame**: `2268:35127-CountdownPrelaunchPage`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download assets and prepare project infrastructure

- [x] T001 Download background image from Figma using `get_media_files` tool (tag: MM_MEDIA_BG) and save to `public/images/prelaunch-bg.png`
- [x] T002 [P] Acquire "Digital Numbers" LED font (.woff2) and save to `src/fonts/digital-numbers.woff2`
- [x] T003 [P] Create `src/components/countdown/` directory structure for new components

**Checkpoint**: All assets available locally

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Font registration, CSS variables, and middleware changes required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add `--font-digital: var(--font-digital)` to `@theme` block in `src/app/globals.css` for Tailwind `font-digital` class
- [x] T005 [P] Add `/` to `PUBLIC_ROUTES` array in `middleware.ts` so unauthenticated users can reach page.tsx (page.tsx will handle auth internally when event has started)
- [x] T006 Restructure `src/app/page.tsx` to: (1) fetch campaign first with try/catch, (2) if `event_date` is in the future → render `<PrelaunchCountdown>` (placeholder for now), (3) else → check auth + render existing homepage. Import and use `getActiveCampaign()` before auth check.

**Checkpoint**: Foundation ready — `/` route allows unauthenticated access, page.tsx conditionally branches prelaunch vs homepage

---

## Phase 3: User Story 1 — View Countdown Timer (Priority: P1) 🎯 MVP

**Goal**: Visitor sees fullscreen countdown with glass-morphism digit cards showing DAYS, HOURS, MINUTES

**Independent Test**: Navigate to `/` with campaign `event_date` in the future → see title "Sự kiện sẽ bắt đầu sau" → see 3 countdown units with LED-style digits → background artwork visible

### UI Components (US1)

- [x] T007 [P] [US1] Create `DigitCard` component — glass-morphism card displaying a single digit with LED font. Props: `digit: string`. Apply: `w-[77px] h-[123px] rounded-xl border-[0.75px] border-[rgba(255,234,158,0.5)] backdrop-blur-[25px]` + inline gradient bg `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)`. Do NOT use `opacity-50` on container. | `src/components/countdown/digit-card.tsx`
- [x] T008 [P] [US1] Create `CountdownUnit` component — group of 2 DigitCards + label. Props: `value: number, label: string`. Split value into tens/ones digits via `padStart(2, '0')`. Layout: `flex flex-col items-center gap-[21px] w-[175px]`, digit pair row: `flex flex-row items-center gap-[21px]`. | `src/components/countdown/countdown-unit.tsx`
- [x] T009 [US1] Create `PrelaunchCountdown` client component — main fullscreen prelaunch page. Register "Digital Numbers" font via `next/font/local` at module scope with variable `--font-digital`. Props: `eventDate: string`. Use `useCountdown(eventDate)` hook for live ticking. Render: page container (`relative w-full min-h-screen bg-[#00101A] overflow-hidden`) + BG image (`next/image` with `fill`, `priority`, `sizes="100vw"`) + gradient overlay (inline style: `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)`) + content section + title "Sự kiện sẽ bắt đầu sau" + 3 CountdownUnit components (DAYS, HOURS, MINUTES). Add `role="timer"`, `aria-live="polite"`, `aria-label` with human-readable time. | `src/components/countdown/prelaunch-countdown.tsx`
- [x] T010 [US1] Wire `PrelaunchCountdown` into `src/app/page.tsx` — replace placeholder from T006 with actual `<PrelaunchCountdown eventDate={campaign.event_date} />`. Pass the `event_date` as prop. Verify: page renders countdown when `event_date` is future, homepage when past. | `src/app/page.tsx`

**Checkpoint**: US1 complete — visitor sees fullscreen countdown with glass-morphism cards, LED digits, and background

---

## Phase 4: User Story 2 — Transition When Countdown Reaches Zero (Priority: P1)

**Goal**: Page automatically transitions to homepage when countdown expires

**Independent Test**: Set `event_date` to 1 minute in the future → wait for expiry → page refreshes and shows authenticated homepage (or login redirect for unauthenticated users)

### Integration (US2)

- [x] T011 [US2] Add redirect-on-expiry logic to `PrelaunchCountdown` — when `isExpired` from `useCountdown` becomes `true`, call `router.refresh()` (NOT `router.push('/')` which would be a no-op). Import `useRouter` from `next/navigation`. This triggers RSC re-render where page.tsx sees `event_date` in the past and renders homepage. | `src/components/countdown/prelaunch-countdown.tsx`
- [x] T012 [US2] Handle edge case in `src/app/page.tsx` — if `event_date` is exactly now or just passed (within last few seconds), ensure homepage renders instead of countdown. Use `new Date(campaign.event_date) > new Date()` comparison. | `src/app/page.tsx`

**Checkpoint**: US2 complete — countdown auto-transitions to homepage on expiry

---

## Phase 5: User Story 3 — Responsive Experience (Priority: P2)

**Goal**: Countdown page displays correctly on mobile (< 768px) and tablet (768-1023px)

**Independent Test**: Open page at 375px width → countdown readable, no horizontal scroll. Open at 768px → medium-sized cards. Open at 1024px+ → full Figma design.

### Responsive (US3)

- [x] T013 [US3] Add mobile-first responsive classes to `PrelaunchCountdown` content section — `px-6 py-12 md:px-12 md:py-16 lg:px-[144px] lg:py-[96px]`. Title: `text-xl leading-7 md:text-[28px] lg:text-4xl lg:leading-[48px]`. Timer row: `gap-4 md:gap-8 lg:gap-[60px]`. | `src/components/countdown/prelaunch-countdown.tsx`
- [x] T014 [P] [US3] Add responsive classes to `DigitCard` — `w-12 h-[77px] md:w-[60px] md:h-[96px] lg:w-[77px] lg:h-[123px]`. Digit text: `text-[46px] md:text-[57px] lg:text-[73.73px]`. | `src/components/countdown/digit-card.tsx`
- [x] T015 [P] [US3] Add responsive classes to `CountdownUnit` — unit width: `w-auto lg:w-[175px]`. Digit pair gap: `gap-3 lg:gap-[21px]`. Label: `text-base leading-6 md:text-2xl lg:text-4xl lg:leading-[48px]`. | `src/components/countdown/countdown-unit.tsx`

**Checkpoint**: US3 complete — page is fully responsive across all 3 breakpoints

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility refinements, edge cases, tests

- [x] T016 [P] Add page fade-in animation on load (opacity 0→1, 500ms ease-out) and digit change animation (opacity + transform, 300ms ease-in-out) to `src/components/countdown/prelaunch-countdown.tsx`
- [x] T017 [P] Add `<noscript>` fallback in PrelaunchCountdown — show static server-rendered countdown values for users with JavaScript disabled | `src/components/countdown/prelaunch-countdown.tsx`
- [x] T018 [P] Write unit tests for DigitCard (renders digit, glass-morphism classes applied) and CountdownUnit (splits value into tens/ones, renders label) | `src/components/countdown/__tests__/digit-card.test.tsx`
- [x] T019 [P] Write unit tests for PrelaunchCountdown (renders countdown when not expired, calls router.refresh on expiry, renders title and 3 units) | `src/components/countdown/__tests__/prelaunch-countdown.test.tsx`
- [x] T020 Verify build passes with `yarn build` — ensure no TypeScript errors, no unused imports, font loads correctly, middleware change doesn't break other routes

**Checkpoint**: All tasks complete — prelaunch countdown page is production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on T001-T003 (assets must exist)
- **Phase 3 (US1)**: Depends on Phase 2 completion (font registered, middleware updated, page.tsx restructured)
- **Phase 4 (US2)**: Depends on Phase 3 (US1) — redirect requires working countdown component
- **Phase 5 (US3)**: Depends on Phase 3 (US1) — responsive requires working components; can run in parallel with Phase 4
- **Phase 6 (Polish)**: Depends on Phase 3-5 completion

### Within Each Phase

- Tasks marked [P] can run in parallel
- T007 and T008 are parallel (different files)
- T009 depends on T007+T008 (uses both sub-components)
- T010 depends on T009 (wires component into page)
- T013, T014, T015 — T014 and T015 are parallel (different files), T013 sequential
- T016-T019 are all parallel (different files/concerns)

### Parallel Opportunities

**Phase 1**: T001, T002, T003 — all parallel (independent assets)
**Phase 2**: T004 and T005 — parallel (different files)
**Phase 3**: T007 and T008 — parallel (independent components)
**Phase 5**: T014 and T015 — parallel (different component files)
**Phase 6**: T016, T017, T018, T019 — all parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (setup + foundation)
2. Complete Phase 3 (US1: view countdown) — **this is the MVP**
3. **STOP and VALIDATE**: Visit `/` with future `event_date` → countdown visible
4. Complete Phase 4 (US2: auto-redirect on expiry)
5. Complete Phase 5 (US3: responsive)
6. Complete Phase 6 (polish + tests)

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1) → Countdown visible → Can demo
3. Phase 4 (US2) → Auto-transition works → Core feature complete
4. Phase 5 (US3) → Mobile/tablet support → Production-ready UI
5. Phase 6 → Tests + animations → Fully polished

---

## Notes

- Existing `useCountdown` hook returns `{ days, hours, minutes, seconds, isExpired }` — ignore `seconds`, use `isExpired` for redirect
- Montserrat font is already loaded in layout.tsx — title and labels use it directly (no extra font setup)
- "Digital Numbers" font fallback: `"Courier New", monospace` with `font-variant-numeric: tabular-nums`
- Background image fallback: page bg `#00101A` renders immediately before image loads
- No header or footer on this page — standalone fullscreen layout
- Glass-morphism: opacity baked into background gradient rgba values, NOT container `opacity` property
