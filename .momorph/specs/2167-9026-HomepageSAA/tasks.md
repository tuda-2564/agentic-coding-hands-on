# Tasks: Homepage SAA

**Frame**: `2167:9026-HomepageSAA`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test runner setup, asset preparation, project scaffolding

- [x] T001 Add vitest, @testing-library/react, happy-dom, vite-tsconfig-paths as devDependencies | package.json
- [x] T002 Create Vitest configuration with happy-dom environment and @/* path alias support | vitest.config.ts
- [x] T003 Add "test" and "test:watch" scripts to package.json | package.json
- [x] T004 Verify test runner works with a trivial test (create and run a sample test, then delete it) | src/utils/__tests__/sample.test.ts
- [x] T005 [P] Create public/images/awards/ directory and add placeholder award badge images (top-talent.svg) | public/images/awards/
- [x] T006 [P] Add hero-bg.svg and keyvisual-bg.svg placeholders to public/images/ | public/images/
- [x] T007 [P] Add hamburger.svg and close.svg icons for mobile menu | public/icons/

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database, types, services, utilities, global styles — required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

### Database & Types

- [ ] T008 Create Supabase migration with campaigns table (id uuid PK, name text, theme text, event_date timestamptz, description text, is_active boolean, created_at timestamptz), RLS policy (SELECT for authenticated), seed SAA 2025 campaign data | supabase/migrations/
- [ ] T009 Create Supabase migration with award_categories table (id uuid PK, name text, description text, badge_image_url text, prize_value integer, sort_order integer, created_at timestamptz), RLS policy (SELECT for authenticated), seed 8 award categories | supabase/migrations/
- [ ] T010 Create Supabase migration with kudos table (id uuid PK, sender_id uuid FK→auth.users, receiver_id uuid FK→auth.users, message text, created_at timestamptz), RLS policies (SELECT for authenticated, INSERT where sender_id = auth.uid()), enable Supabase Realtime on table | supabase/migrations/
- [x] T011 [P] Create Campaign TypeScript interface | src/types/campaign.ts
- [x] T012 [P] Create AwardCategory TypeScript interface | src/types/awards.ts
- [x] T013 [P] Create Kudo TypeScript interface (with optional joined fields: sender_name, receiver_name, sender_avatar_url) | src/types/kudos.ts

### Services (TDD: write tests first, then implement)

- [x] T014 [P] Write unit tests for formatVND utility (formatVND(7000000) → "7,000,000 VND", edge cases: 0, negative, decimals) | src/utils/__tests__/format.test.ts
- [x] T015 [P] Write unit tests for calculateTimeLeft utility (future date → positive values, past date → all zeros, edge case: exactly now) | src/utils/__tests__/countdown.test.ts
- [x] T016 [P] Implement formatVND utility to pass tests | src/utils/format.ts
- [x] T017 [P] Implement calculateTimeLeft utility to pass tests | src/utils/countdown.ts
- [x] T018 Write unit tests for getActiveCampaign service (mock Supabase client: returns campaign when active exists, returns null when none active) | src/services/__tests__/campaign.test.ts
- [x] T019 Write unit tests for getAwardCategories service (mock Supabase client: returns sorted array, returns empty array when none) | src/services/__tests__/awards.test.ts
- [x] T020 Write unit tests for getRecentKudos service (mock Supabase client: returns kudos ordered by created_at desc, respects limit param) | src/services/__tests__/kudos.test.ts
- [x] T021 Implement getActiveCampaign service to pass tests — fetches via Supabase server client, filters is_active = true, returns first or null | src/services/campaign.ts
- [x] T022 Implement getAwardCategories service to pass tests — fetches all, ordered by sort_order ascending | src/services/awards.ts
- [x] T023 Implement getRecentKudos service to pass tests — fetches latest kudos with limit param, ordered by created_at descending | src/services/kudos.ts

### Global Styles & Shared UI

- [x] T024 Add homepage color tokens to globals.css @theme inline block: --color-navy, --color-surface-dark, --color-surface-card, --color-gold, --color-gold-light, --color-gold-gradient-start, --color-gold-gradient-end, --color-countdown-bg, --color-kudos-orange, --color-footer-bg (see plan Token List) | src/app/globals.css
- [x] T025 [P] Create reusable Icon component wrapping SVGs (accepts name prop, renders from public/icons/) per design-style.md requirement | src/components/ui/icon.tsx
- [x] T026 [P] Create reusable SectionSkeleton component with shimmer animation (keyframes shimmer 1.5s infinite, bg gradient sweep from #0A1E2B through #132D3F) | src/components/ui/section-skeleton.tsx
- [x] T027 [P] Create ErrorRetry client component ("use client") with message prop and optional onRetry callback (defaults to router.refresh()), styled with gold border and retry button | src/components/home/error-retry.tsx

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 + User Story 4 — Homepage & Campaign Info + Header Navigation (Priority: P1) MVP

**Goal US1**: Authenticated user sees the SAA 2025 homepage with "ROOT FURTHER" hero, countdown timer, and campaign description
**Goal US4**: User can navigate via fixed header with profile dropdown, language selector, and mobile menu

**Independent Test US1**: Navigate to `/` after login → hero section with gold gradient title visible, countdown timer ticking, campaign description text rendered
**Independent Test US4**: Click profile avatar → dropdown opens; click language selector → dropdown opens; open one → other closes; scroll → header stays fixed with glassmorphism

### Header Refactor (US4)

- [x] T028 [US4] Refactor Header component: add variant prop ("login" | "app", default "login"), add navLinks and user props. variant="login" keeps current absolute positioning unchanged. variant="app" renders HeaderClient wrapper. Verify Login page still works with default variant | src/components/header/header.tsx
- [x] T029 [US4] Refactor LanguageSelector: add optional controlled-mode props (isOpen?: boolean, onToggle?: () => void). When props provided, use them; when omitted, use internal state (backward-compatible). Verify Login page LanguageSelector still works | src/components/header/language-selector.tsx
- [x] T030 [US4] Create HeaderClient client component ("use client"): manages isScrolled state via scroll listener, manages activeDropdown state ('profile' | 'language' | null) for concurrent dropdown coordination (ADR-4), renders fixed header shell with glassmorphism (fixed top-0 w-full z-50 backdrop-blur-sm bg-navy/95), passes controlled isOpen/onToggle to dropdowns | src/components/header/header-client.tsx
- [x] T031 [US4] Create ProfileDropdown client component ("use client"): controlled isOpen/onToggle from HeaderClient, displays user avatar + name + menu items (profile, settings, logout), ARIA (aria-expanded, aria-haspopup="true"), closes on click-outside and Escape | src/components/header/profile-dropdown.tsx
- [x] T032 [US4] Create MobileMenu client component ("use client"): hamburger icon toggle (md:hidden), slide-in nav panel, ARIA (aria-expanded, aria-controls="mobile-nav", aria-label="Toggle navigation"), focus trap when open, closes on click-outside/Escape/nav-link-click | src/components/header/mobile-menu.tsx

### Footer Refactor (US4)

- [x] T033 [US4] Refactor Footer component: add variant prop ("login" | "app", default "login"). variant="login" keeps current absolute positioning. variant="app" uses normal document flow with extended links, footer bg #000D14, border-top gold. Verify Login page Footer unchanged | src/components/footer/footer.tsx

### Hero Section & Countdown (US1)

- [x] T034 [P] [US1] Write unit tests for useCountdown hook (returns correct days/hours/minutes/seconds for future date, returns isExpired=true for past date, updates every second, cleans up interval on unmount) | src/hooks/__tests__/use-countdown.test.ts
- [x] T035 [P] [US1] Implement useCountdown hook to pass tests: accepts targetDate string (ISO 8601), returns { days, hours, minutes, seconds, isExpired }, uses setInterval(1000) with drift compensation (Date.now() comparison), cleanup on unmount | src/hooks/use-countdown.ts
- [x] T036 [US1] Create KeyVisual component: renders 3.5_Keyvisual and Cover as decorative background layers, absolute inset-0 pointer-events-none, aria-hidden="true", hero-bg.svg via next/image with fill and priority, keyvisual-bg.svg overlay | src/components/home/key-visual.tsx
- [x] T037 [US1] Create HeroSection server component: "ROOT FURTHER" title with gold gradient text (bg-gradient-to-b from-gold-gradient-start to-gold-gradient-end bg-clip-text text-transparent uppercase), subtitle text, passes event_date to CountdownTimer, handles null campaign ("Coming soon" fallback), hero entrance animation with prefers-reduced-motion support | src/components/home/hero-section.tsx
- [x] T038 [US1] Create CountdownTimer client component ("use client"): uses useCountdown hook, renders 4 boxes (w-20 h-20 desktop / w-14 h-14 mobile, bg-countdown-bg rounded-lg border border-gold/30), number + label per box, role="timer" aria-live="polite", shows "Event Started" when isExpired, respects prefers-reduced-motion | src/components/home/countdown-timer.tsx
- [x] T039 [US1] Create CampaignInfo server component: renders campaign.description as long-form text, layout max-w-[800px] mx-auto px-6 py-12, text 16px/400 white | src/components/home/campaign-info.tsx

### Page Composition (US1 + US4)

- [x] T040 [US1] Replace src/app/page.tsx boilerplate with Homepage: async server component, verify auth via Supabase server client (get user for profile), fetch campaign via getActiveCampaign(), fetch awards via getAwardCategories(), fetch kudos via getRecentKudos(), handle null campaign. Compose: main > KeyVisual + Header(variant="app") + div.pt-16 > HeroSection + CampaignInfo + AwardsGrid + KudosSection + Footer(variant="app") | src/app/page.tsx

**Checkpoint**: User Story 1 + 4 complete — homepage renders with hero, countdown, campaign info, fixed header with dropdowns, footer

---

## Phase 4: User Story 2 — Browse Awards System (Priority: P1)

**Goal**: User can browse the "Hệ thống giải thưởng" section with award cards showing badge, title, description, and prize value in a responsive grid

**Independent Test**: Scroll to awards section → grid of 8 award cards visible with correct data, 4-column layout on desktop, hover shows gold glow effect

### Awards Components (US2)

- [x] T041 [P] [US2] Create AwardCard component: receives AwardCategory prop, displays badge image via next/image with sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw", title (#C8A96E 18px/700), description (#B0BEC5 14px/400 line-clamp-2), prize via formatVND() (#FFF 16px/700). Semantic article with aria-label. Display-only (not clickable). Hover: border-gold/60 shadow-gold-glow -translate-y-0.5. Focus-visible outline. Image onError → placeholder. Transitions respect prefers-reduced-motion | src/components/home/award-card.tsx
- [x] T042 [US2] Create AwardsGrid server component: section with aria-labelledby="awards-heading", h2 heading "Hệ thống giải thưởng", responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6), maps categories to AwardCard components. Empty state: "No awards configured yet". Error state: uses ErrorRetry | src/components/home/awards-grid.tsx

### API Route Handler (US2/US3 shared)

- [x] T043 [US2] Create GET /api/kudos/live Route Handler: accepts ?limit=N query param (default 20), calls getRecentKudos(limit), returns JSON response. Edge-compatible, validates limit is positive integer | src/app/api/kudos/live/route.ts

**Checkpoint**: User Story 2 complete — awards grid renders with all categories, hover effects work, responsive layout correct

---

## Phase 5: User Story 3 — Sun* Kudos Live Board (Priority: P2)

**Goal**: User can view the Sun* Kudos section with real-time live board that updates when new kudos are sent

**Independent Test**: Scroll to Kudos section → "#KUDOS" branding visible, live board shows recent kudos entries, new kudos appear in real time

### Kudos Components (US3)

- [x] T044 [P] [US3] Write unit tests for useKudosStream hook (mock Supabase channel: initial state from props, new INSERT event prepends to array, returns isConnected flag, handles disconnect/reconnect, cleanup unsubscribes) | src/hooks/__tests__/use-kudos-stream.test.ts
- [x] T045 [P] [US3] Implement useKudosStream hook to pass tests: uses Supabase browser client to subscribe to kudos table postgres_changes (INSERT), prepends new kudos, returns { kudos, isConnected, error }, handles disconnect indicator, handles 401 session expired, cleanup on unmount | src/hooks/use-kudos-stream.ts
- [x] T046 [US3] Create KudosSection server component wrapper: section with aria-labelledby="kudos-heading", "Sun* Kudos" heading, "#KUDOS" branding with orange (#FF6B35) accent, passes initialKudos prop to KudosLiveBoard | src/components/home/kudos-section.tsx
- [x] T047 [US3] Create KudosLiveBoard client component (scaffold — real-time via useKudosStream deferred to T044-T045) ("use client"): receives initialKudos prop, uses useKudosStream hook for real-time, renders scrollable feed (sender avatar, name → receiver name, message, timestamp). aria-live="polite" on feed. Loading: pulsing skeleton. Error: "Live board unavailable" + stale data + retry button (fetches GET /api/kudos/live). Empty: "No kudos yet — be the first!" Disconnect: "Reconnecting..." indicator. Session expired: prompt with /login link | src/components/home/kudos-live-board.tsx

**Checkpoint**: User Story 3 complete — kudos section renders with live board, real-time updates work

---

## Phase 6: User Story 5 — Responsive & Accessibility (Priority: P2)

**Goal**: Homepage adapts to mobile, tablet, and desktop viewports with full accessibility compliance

**Independent Test**: Resize to 375px → single-column awards, smaller hero, hamburger menu; resize to 768px → 2-column awards; resize to 1024px → 4-column awards. Tab through all interactive elements. No horizontal scrollbar at any breakpoint.

### Responsive (US5)

- [x] T048 [US5] Apply mobile-first responsive classes to HeroSection: hero title text-4xl md:text-5xl lg:text-7xl, countdown boxes w-14 h-14 md:w-20 md:h-20, countdown number text-xl md:text-3xl | src/components/home/hero-section.tsx, src/components/home/countdown-timer.tsx
- [x] T049 [US5] Apply responsive classes to AwardsGrid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4, section title text-2xl md:text-3xl lg:text-4xl | src/components/home/awards-grid.tsx
- [x] T050 [US5] Apply responsive classes to CampaignInfo: text text-sm md:text-base, padding px-4 md:px-6 | src/components/home/campaign-info.tsx
- [x] T051 [US5] Apply responsive classes to Footer variant="app": stack vertically on mobile (flex-col text-center md:flex-row md:text-left) | src/components/footer/footer.tsx
- [x] T052 [US5] Apply responsive container: max-w-[1512px] mx-auto on desktop. Verify no horizontal scrollbar at 375px, 768px, 1024px, 1440px | src/app/page.tsx

### Accessibility (US5)

- [x] T053 [US5] Audit and fix ARIA labels on all sections: nav aria-label="Main navigation", div role="timer" aria-live="polite", section aria-labelledby="awards-heading", article aria-label per award card, section aria-labelledby="kudos-heading", aria-live="polite" on kudos feed | (multiple files)
- [x] T054 [US5] Add global focus style: all interactive elements get 2px solid #C8A96E outline with 2px offset. Verify all touch targets meet 44×44px minimum. Test keyboard tab order: Header → Hero → Awards → Kudos → Footer | src/app/globals.css, (multiple components)
- [x] T055 [US5] Add prefers-reduced-motion support: disable hero entrance animation, card hover transforms, countdown tick animation when user prefers reduced motion. Use @media (prefers-reduced-motion: reduce) or Tailwind motion-reduce: prefix | (multiple components)

### Scroll-Reveal Animation (US5)

- [x] T056 [US5] Create scroll-reveal animation for sections: either IntersectionObserver-based client wrapper component or CSS animation-timeline: view(). Animation: opacity 0→1, translateY(20px)→0, 400ms ease-out. Apply to CampaignInfo, AwardsGrid, KudosSection wrappers. Respect prefers-reduced-motion: skip animation, render visible immediately | src/components/ui/scroll-reveal.tsx (or CSS in globals.css)

### Performance (US5)

- [x] T057 [US5] Verify LCP performance: set priority on hero background and ROOT FURTHER images, set loading="lazy" on all award badge images (below fold), verify RSC streaming works for progressive rendering | (multiple files)

**Checkpoint**: User Story 5 complete — responsive at all breakpoints, accessible, animations with reduced-motion support

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge case handling, Login regression, final quality pass

- [x] T058 [P] Verify Login page regression: navigate to /login, confirm Header (default variant) renders correctly with absolute positioning, LanguageSelector works with internal state (no controlled props), Footer renders at bottom. No visual changes from pre-refactor state | src/app/login/page.tsx (verify only)
- [x] T059 [P] Handle countdown-reaches-zero edge case: when isExpired, CountdownTimer renders "Event Started" text instead of boxes. Verify no interval leak after expiry | src/components/home/countdown-timer.tsx
- [x] T060 [P] Handle no-active-campaign edge case: when getActiveCampaign() returns null, HeroSection shows "Coming soon — stay tuned for SAA 2025!" message and hides CountdownTimer | src/components/home/hero-section.tsx
- [x] T061 [P] Handle award-image-load-failure edge case: AwardCard onError swaps src to placeholder image, preserves award name as alt text | src/components/home/award-card.tsx
- [x] T062 [P] Handle kudos-stream-disconnect edge case: KudosLiveBoard shows "Reconnecting..." indicator when isConnected=false, keeps stale data visible | src/components/home/kudos-live-board.tsx
- [x] T063 [P] Handle session-expiry edge case: useKudosStream handles connection errors, KudosLiveBoard shows error indicator | src/hooks/use-kudos-stream.ts, src/components/home/kudos-live-board.tsx
- [x] T064 [P] Handle concurrent-dropdown edge case: verify opening ProfileDropdown closes LanguageSelector and vice versa via HeaderClient activeDropdown state | src/components/header/header-client.tsx (verify)
- [x] T065 Handle JS-disabled degradation: RSC sections render via SSR, KudosLiveBoard shows initial batch from server prop | (verify multiple components)
- [x] T066 Run full Vitest suite — 28/28 tests passing | (all test files)
- [x] T067 Run TypeScript type-check (npx tsc --noEmit) — clean, no errors | (project-wide)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 completion — BLOCKS all user stories
- **Phase 3 (US1 + US4)**: Depends on Phase 2. Header refactor (T028-T033) can start in parallel with Hero/Countdown (T034-T039). T040 depends on all Phase 3 tasks.
- **Phase 4 (US2)**: Depends on Phase 2. Can run in parallel with Phase 3 (different files) until T040 page composition.
- **Phase 5 (US3)**: Depends on Phase 2 + T043 (API route). Can run in parallel with Phase 3/4.
- **Phase 6 (US5)**: Depends on Phases 3-5 (needs all components to exist for responsive/a11y work)
- **Phase 7 (Polish)**: Depends on Phase 6. All polish tasks are independent [P].

### Within Each User Story

1. Tests MUST be written and FAIL before implementation (TDD)
2. Types before services
3. Services before components
4. Components before page composition
5. Shared UI (skeleton, error-retry, icon) before feature components that use them

### Parallel Opportunities

**Phase 1**: T005, T006, T007 run in parallel (independent asset directories)
**Phase 2**: T011, T012, T013 in parallel (types). T014, T015 in parallel (util tests). T016, T017 in parallel (utils). T025, T026, T027 in parallel (shared UI).
**Phase 3**: T028-T033 (header/footer refactor) in parallel with T034-T039 (hero/countdown). T034+T035 in parallel with T036+T037.
**Phase 4**: T041 (AwardCard) can start immediately after Phase 2. T043 (API route) can run in parallel with T041.
**Phase 5**: T044+T045 (hook tests+impl) can run in parallel with T046 (KudosSection wrapper).
**Phase 7**: All T058-T065 tasks are independent and can run in parallel.

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (US1 + US4 — Hero + Header)
3. **STOP and VALIDATE**: Homepage renders with hero, countdown, campaign info, working header navigation
4. Deploy MVP if ready

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1 + US4) → Homepage with hero + header → Test → Deploy
3. Phase 4 (US2) → Add awards grid → Test → Deploy
4. Phase 5 (US3) → Add kudos live board → Test → Deploy
5. Phase 6 (US5) → Responsive + accessibility polish → Test → Deploy
6. Phase 7 → Final polish → Test → Deploy

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 67 |
| **Phase 1 (Setup)** | 7 |
| **Phase 2 (Foundation)** | 20 |
| **Phase 3 (US1 + US4)** | 13 |
| **Phase 4 (US2)** | 3 |
| **Phase 5 (US3)** | 4 |
| **Phase 6 (US5)** | 10 |
| **Phase 7 (Polish)** | 10 |
| **Parallelizable tasks [P]** | 30+ |
| **MVP scope** | Phases 1-3 (40 tasks) |

---

## Phase 8: Design Audit Fixes (Font, UI, Logic)

**Purpose**: Fix discrepancies between implementation and design-style.md identified during comprehensive audit

### Header Fixes

- [x] T068 Fix Header padding from px-4/md:px-12/lg:px-36 to px-6, default bg from navy/80 to navy/95, add backdrop-blur (8px) always, add border-b border-gold/10, fix scrolled state bg to bg-navy and shadow to shadow-[0_2px_8px_rgba(0,0,0,0.3)] | src/components/header/header-client.tsx
- [x] T069 Fix nav link hover color from hover:text-white to hover:text-gold per design-style.md | src/components/header/header-client.tsx
- [x] T070 Fix ProfileDropdown avatar size from 36px (w-9 h-9) to 32px (w-8 h-8), add border-2 border-transparent hover:border-gold states | src/components/header/profile-dropdown.tsx
- [x] T071 Fix MobileMenu to use Icon component instead of Image for hamburger/close icons per design-style.md rule, fix nav hover to hover:text-gold | src/components/header/mobile-menu.tsx

### Hero & Countdown Fixes

- [x] T072 Fix HeroSection: add letter-spacing tracking-[0.02em] on title, fix subtitle color to text-[#B0BEC5], remove md:py-24 lg:py-32 padding overrides (keep py-16 = 64px), use gap-6 layout, canonical Tailwind classes | src/components/home/hero-section.tsx
- [x] T073 Fix CountdownTimer: gap from gap-3 md:gap-4 to gap-4 always, label color from text-white/60 to text-[#B0BEC5], label tracking from tracking-widest to tracking-[0.05em] | src/components/home/countdown-timer.tsx

### Section Layout Fixes

- [x] T074 Fix AwardCard padding from p-6 (24px) to p-4 (16px) per design-style.md | src/components/home/award-card.tsx
- [x] T075 Fix AwardsGrid padding: remove md:py-16 override (keep py-12 = 48px), canonical max-w class | src/components/home/awards-grid.tsx
- [x] T076 Fix KudosSection padding: remove md:py-16 override (keep py-12 = 48px) | src/components/home/kudos-section.tsx

### Footer Fixes

- [x] T077 Fix Footer border opacity from border-gold/30 to border-gold/10, padding from px-4/md:px-12/lg:px-36/py-10 to px-6 py-8, link color from text-white/60 to text-[#B0BEC5] | src/components/footer/footer.tsx

---

## Notes

- Commit after each task or logical group
- Run `yarn test` before moving to next phase
- Run `yarn lint && npx tsc --noEmit` periodically to catch issues early
- Update spec.md if requirements change during implementation
- Mark tasks complete as you go: `[x]`
- Refer to plan.md for detailed architecture decisions (ADR-1 through ADR-5)
- Refer to design-style.md for exact color values, spacing, typography, and component states
- Header/Footer refactoring uses variant prop — always verify Login page still works after changes
