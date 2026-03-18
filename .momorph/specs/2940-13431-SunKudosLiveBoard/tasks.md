# Tasks: Sun* Kudos - Live Board

**Frame**: `2940:13431-SunKudosLiveBoard`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US8)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets, Tokens, Types, Migration)

**Purpose**: Download assets, configure design tokens, extend types, create DB migration, add utility functions.

- [ ] T001 Download Kudos keyvisual background from Figma | public/images/kudos-keyvisual-bg.svg
- [ ] T002 [P] Download missing icons from Figma (heart.svg, link.svg, gift.svg, pan-zoom.svg, star.svg, play.svg, pen.svg, chevron-left.svg, chevron-right.svg) | public/icons/
- [x] T003 [P] Add Kudos Live Board design tokens to globals.css @theme inline block (--color-kudos-container-2, --color-kudos-gold, --color-kudos-cream, --color-kudos-border, --color-kudos-divider, --color-kudos-heart) | src/app/globals.css
- [x] T004 [P] Extend Kudo type with `content` field (deprecated alias for `message`), add KudoReceiver, KudoHighlight, KudoLike, KudoStats, SpotlightEntry, SunnerGift, SunnerRanking, Department, HashtagItem types | src/types/kudos.ts
- [x] T005 [P] Add formatHeartCount() and formatKudoTimestamp() utility functions | src/utils/format.ts
- [x] T006 [P] Create database migration: kudo_likes table (unique user_id+kudo_id), departments table, secret_boxes table, trigger-maintained heart_count on kudos, RPC functions (get_kudo_stats, get_spotlight_data, get_highlight_kudos) | supabase/migrations/20260317000000_kudos_live_board.sql
- [x] T007 Update Footer SAA_NAV_LINKS: change "Sun* Kudos" href from "/#kudos-heading" to "/kudos" | src/components/footer/footer.tsx

**Checkpoint**: Assets ready, types defined, DB migration created, tokens configured.

---

## Phase 2: Foundation (Services & Route Handlers)

**Purpose**: Build all service layer functions and API endpoints. BLOCKS all UI work.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete.

### Services

- [x] T008 [P] Create kudos-highlight service: getHighlightKudos(filters?) → KudoHighlight[] | src/services/kudos-highlight.ts
- [x] T009 [P] Create kudos-feed service: getKudosFeed(cursor?, limit?) → { kudos, nextCursor } | src/services/kudos-feed.ts
- [x] T010 [P] Create kudos-like service: toggleKudoLike(kudoId, userId) → { liked, heart_count } | src/services/kudos-like.ts
- [x] T011 [P] Create kudos-stats service: getKudoStats(userId) → KudoStats | src/services/kudos-stats.ts
- [x] T012 [P] Create kudos-spotlight service: getSpotlightData() → { total, entries[] } | src/services/kudos-spotlight.ts
- [x] T013 [P] Create sunners service: getGiftRecipients() → SunnerGift[], getSunnerRankings() → SunnerRanking[] | src/services/sunners.ts
- [x] T014 [P] Create hashtags service: getHashtags() → string[] (SELECT DISTINCT unnest from kudos) | src/services/hashtags.ts
- [x] T015 [P] Create departments service: getDepartments() → Department[] | src/services/departments.ts

### Route Handlers

- [x] T016 [P] Create GET /api/kudos/highlight route handler (query: hashtag, department) | src/app/api/kudos/highlight/route.ts
- [x] T017 Add GET export to existing /api/kudos route (cursor pagination, hashtag filter) + update OPTIONS to allow GET | src/app/api/kudos/route.ts
- [x] T018 [P] Create POST /api/kudos/[id]/like route handler (toggle like, return count) | src/app/api/kudos/[id]/like/route.ts
- [x] T019 [P] Create GET /api/kudos/stats route handler (auth required) | src/app/api/kudos/stats/route.ts
- [x] T020 [P] Create GET /api/kudos/spotlight route handler | src/app/api/kudos/spotlight/route.ts
- [x] T021 [P] Create GET /api/sunners/gift-recipients route handler | src/app/api/sunners/gift-recipients/route.ts
- [x] T022 [P] Create GET /api/sunners/ranking route handler | src/app/api/sunners/ranking/route.ts
- [x] T023 [P] Create GET /api/hashtags route handler | src/app/api/hashtags/route.ts
- [x] T024 [P] Create GET /api/departments route handler | src/app/api/departments/route.ts

**Checkpoint**: All services and API endpoints ready. UI development can begin.

---

## Phase 3: User Story 1 — Browse Highlight Kudos Carousel (Priority: P1) 🎯 MVP

**Goal**: Display top-5 most-liked kudos in a horizontal multi-card carousel with prev/next navigation, pagination, and hashtag/department filters.

**Independent Test**: Navigate to /kudos, verify carousel renders up to 5 cards with sender/receiver info, content (3-line truncation), hashtags, heart count, arrows, pagination "2/5", and filter dropdowns.

### Components (US1)

- [x] T025 [P] [US1] Create kudos-keyvisual component (hero banner with background image + gradient + "KUDOS" text) | src/components/kudos-board/kudos-keyvisual.tsx
- [x] T026 [P] [US1] Create section-header component (reusable "Sun* Annual Awards 2025" sub-heading + title + optional filter slots) | src/components/kudos-board/section-header.tsx
- [x] T027 [P] [US1] Create highlight-card component (sender/receiver info, content 3-line, hashtags, heart count, "Copy Link", "Xem chi tiet") | src/components/kudos-board/highlight-card.tsx
- [x] T028 [P] [US1] Create user-info component (avatar + name + department + star count + danh hieu, reusable across cards) | src/components/kudos-board/user-info.tsx
- [x] T029 [P] [US1] Create hashtag-badge component (prominent pill: gold bg, dark text, clickable) | src/components/kudos-board/hashtag-badge.tsx
- [x] T030 [P] [US1] Create hashtag-list component (inline row, max 5 + "..." overflow, clickable) | src/components/kudos-board/hashtag-list.tsx
- [x] T031 [P] [US1] Create filter-button component (dropdown trigger with chevron, fetches options on open) | src/components/kudos-board/filter-button.tsx
- [x] T032 [P] [US1] Create carousel-pagination component (prev/next arrows + "2/5" indicator) | src/components/kudos-board/carousel-pagination.tsx
- [x] T033 [US1] Create use-carousel hook (index management, prev/next, disabled states, touch/swipe support) | src/hooks/use-carousel.ts
- [x] T034 [US1] Create kudo-carousel component (multi-card viewport: 3 desktop, 2 tablet, 1 mobile; translateX slide) | src/components/kudos-board/kudo-carousel.tsx
- [x] T035 [US1] Create highlight-section component (client wrapper: carousel state, filter state, data refetch on filter change) | src/components/kudos-board/highlight-section.tsx

### Page Shell (US1)

- [x] T036 [US1] Create /kudos page (RSC: auth check, parallel data fetch via Promise.all, NAV_LINKS, render Header/Keyvisual/Highlight/Footer) | src/app/kudos/page.tsx
- [x] T037 [US1] Create /kudos loading.tsx (full-page skeleton: keyvisual, 3 carousel cards, feed, sidebar) | src/app/kudos/loading.tsx

**Checkpoint**: US1 complete — carousel navigates, filters work, page loads with highlight section. MVP independently testable.

---

## Phase 4: User Story 2 — View All Kudos Feed (Priority: P1)

**Goal**: Display chronological feed of all kudos with infinite scroll, full card details, image gallery, and hashtag filtering.

**Independent Test**: Scroll to "ALL KUDOS" section, verify cards render with all fields. Scroll to bottom, verify next page loads via infinite scroll.

### Components (US2)

- [x] T038 [P] [US2] Create kudo-post-card component (full card: user-info rows, hashtag badge, timestamp, content 5-line, gallery, hashtag list, actions, id={kudo.id} for scroll-to) | src/components/kudos-board/kudo-post-card.tsx
- [x] T039 [P] [US2] Create image-gallery component (max 5 thumbnails 80x80px, click-to-lightbox, video play icon overlay) | src/components/kudos-board/image-gallery.tsx
- [x] T040 [P] [US2] Create image-lightbox component (full-screen overlay, prev/next, close on Escape/click-outside) | src/components/kudos-board/image-lightbox.tsx
- [x] T041 [US2] Create use-infinite-scroll hook (IntersectionObserver, cursor management, loading state) | src/hooks/use-infinite-scroll.ts
- [x] T042 [US2] Create kudo-feed component (client: infinite scroll list, hashtag filter state, empty state with "send first kudo" prompt) | src/components/kudos-board/kudo-feed.tsx
- [x] T043 [US2] Create all-kudos-section component (RSC: two-column layout container 680px + 374px) | src/components/kudos-board/all-kudos-section.tsx
- [x] T044 [US2] Integrate All Kudos section into /kudos page (pass initialKudos, stats, leaderboards, userId) | src/app/kudos/page.tsx

**Checkpoint**: US2 complete — feed renders, infinite scroll works, hashtag filter applied, images expandable.

---

## Phase 5: User Story 3 — Like and Share Kudos (Priority: P1)

**Goal**: Users can like/unlike kudos with optimistic UI and copy shareable links with toast confirmation.

**Independent Test**: Click heart on a kudo card → count increments, icon turns red. Click again → unlike. Click "Copy Link" → toast appears, URL in clipboard.

### Components (US3)

- [x] T045 [P] [US3] Create use-kudo-like hook (optimistic state, POST /api/kudos/{id}/like, rollback on error) | src/hooks/use-kudo-like.ts
- [x] T046 [P] [US3] Create use-clipboard hook (navigator.clipboard.writeText, toast state, 2s timeout) | src/hooks/use-clipboard.ts
- [x] T047 [US3] Create heart-button component (optimistic toggle, scale animation 1.2x 200ms, aria-pressed, red/gray states) | src/components/kudos-board/heart-button.tsx
- [x] T048 [US3] Create copy-link-button component (clipboard write, "Copied!" toast 2s, aria-live) | src/components/kudos-board/copy-link-button.tsx
- [x] T049 [US3] Integrate heart-button and copy-link-button into kudo-post-card and highlight-card | src/components/kudos-board/kudo-post-card.tsx, highlight-card.tsx

**Checkpoint**: US3 complete — like toggle persists, copy link works with toast. All P1 stories done.

---

## Phase 6: User Story 6 — Send a Kudo (Priority: P1)

**Goal**: Recognition input bar opens Viet Kudo modal; search sunner input searches profiles with debounced API.

**Independent Test**: Click recognition input → Viet Kudo modal opens. Type in search → dropdown of matching profiles appears.

### Components (US6)

- [x] T050 [US6] Create action-bar component (client: recognition input click → opens KudoModal, search input → debounced 300ms GET /api/users/search, dropdown results, click → navigate to profile) | src/components/kudos-board/action-bar.tsx
- [x] T051 [US6] Integrate action-bar into /kudos page between keyvisual and highlight section | src/app/kudos/page.tsx

**Checkpoint**: US6 complete — kudo composition accessible from Live Board.

---

## Phase 7: User Story 4 — Personal Stats & Secret Box (Priority: P2)

**Goal**: Sidebar shows personal kudos stats (5 stat rows + divider) and "Mo qua" button for Secret Box.

**Independent Test**: Verify sidebar stats card shows correct counts (received, sent, hearts | divider | opened, unopened). Click "Mo qua" → Secret Box dialog triggered.

### Components (US4)

- [x] T052 [US4] Create stats-card component (RSC: 5 stat rows, gold values #FFEA9E, bg #00070C, border #998C5F, radius 17px, divider between hearts and Secret Box rows) | src/components/kudos-board/stats-card.tsx
- [x] T053 [US4] Create open-gift-button component (client: gold button, emits event/navigates to Secret Box dialog frame 1466:7676) | src/components/kudos-board/open-gift-button.tsx
- [x] T054 [US4] Integrate stats-card into all-kudos-section sidebar | src/components/kudos-board/all-kudos-section.tsx

**Checkpoint**: US4 complete — stats displayed, Secret Box button functional.

---

## Phase 8: User Story 5 — Spotlight Board (Priority: P2)

**Goal**: Interactive word cloud showing kudos recipients sized by count, with pan/zoom and search.

**Independent Test**: Scroll to Spotlight Board, verify names rendered with sizes proportional to kudos count, total counter shown, search highlights names, pan/zoom toggles work.

### Components (US5)

- [x] T055 [US5] Create spotlight-board component (client: CSS-based word cloud, absolute-positioned names, CSS transforms for pan/zoom, search input highlights, "388 KUDOS" dynamic total, will-change:transform, limit 500 names) | src/components/kudos-board/spotlight-board.tsx
- [x] T056 [US5] Integrate spotlight-board into /kudos page between highlight section and all kudos section | src/app/kudos/page.tsx

**Checkpoint**: US5 complete — Spotlight Board interactive and performant.

---

## Phase 9: User Story 7 — Sunner Leaderboards (Priority: P3)

**Goal**: Two sidebar lists: "10 SUNNER NHAN QUA MOI NHAT" (gift recipients) and "10 SUNNER CO SU THANG HANG MOI NHAT" (rising sunners).

**Independent Test**: Verify both sidebar lists render up to 10 items each with avatar (40px circle), name, description. Click avatar/name navigates to profile.

### Components (US7)

- [x] T057 [P] [US7] Create sunner-item component (avatar 40px circle + name + description, clickable, hover → profile preview) | src/components/kudos-board/sunner-item.tsx
- [x] T058 [US7] Create sunner-list component (RSC: reusable card with title + list of sunner-items, empty state) | src/components/kudos-board/sunner-list.tsx
- [x] T059 [US7] Integrate two sunner-list instances into all-kudos-section sidebar (gift recipients + rankings) | src/components/kudos-board/all-kudos-section.tsx

**Checkpoint**: US7 complete — leaderboards displayed in sidebar.

---

## Phase 10: User Story 8 — Profile Previews (Priority: P3)

**Goal**: Hover avatar/name shows profile preview tooltip; click navigates to profile page.

**Independent Test**: Hover sender avatar in kudo card → profile preview tooltip appears. Click avatar → navigates to profile page.

### Components (US8)

- [x] T060 [US8] Implement profile preview tooltip on user-info component (hover trigger, tooltip with summary info, reuse frame 721:5827 pattern if available) | src/components/kudos-board/user-info.tsx
- [x] T061 [US8] Add click-to-navigate to profile page on all avatar/name elements | src/components/kudos-board/user-info.tsx

**Checkpoint**: US8 complete — all user stories implemented.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling, accessibility, responsive, animations — affecting multiple stories.

### Loading & Error States

- [x] T062 [P] Add skeleton cards for highlight carousel (3 placeholder cards during loading) | src/components/kudos-board/highlight-section.tsx
- [x] T063 [P] Add skeleton cards for kudo feed (3 placeholder cards during loading) | src/components/kudos-board/kudo-feed.tsx
- [x] T064 [P] Add skeleton rows for stats card (5 rows during loading) | src/components/kudos-board/stats-card.tsx
- [x] T065 [P] Add skeleton items for leaderboard lists (5 rows during loading) | src/components/kudos-board/sunner-list.tsx
- [x] T066 [P] Add spinner for infinite scroll loading indicator | src/components/kudos-board/kudo-feed.tsx
- [x] T067 [P] Add ErrorRetry component integration for section-level errors (highlight, spotlight, feed) | src/components/kudos-board/highlight-section.tsx, kudo-feed.tsx, spotlight-board.tsx
- [x] T068 [P] Add Toast integration for inline errors (like failure, copy failure, load-more failure) | src/components/kudos-board/heart-button.tsx, copy-link-button.tsx

### Accessibility

- [x] T069 [P] Add carousel ARIA: aria-roledescription="carousel", slide role="group", aria-label="Slide {n} of {total}" | src/components/kudos-board/kudo-carousel.tsx
- [x] T070 [P] Add heart button ARIA: aria-pressed, aria-label="Like kudo, {count} likes" | src/components/kudos-board/heart-button.tsx
- [x] T071 [P] Add filter button ARIA: aria-haspopup="listbox", aria-expanded | src/components/kudos-board/filter-button.tsx
- [x] T072 [P] Add Toast aria-live="polite" region | src/components/kudos-board/copy-link-button.tsx
- [x] T073 Add focus management: return focus on dropdown close, skip-to-content link | src/app/kudos/page.tsx

### Responsive

- [x] T074 [P] Implement mobile layout (<768px): single column, stacked sidebar, 1-card carousel, hamburger header | src/components/kudos-board/
- [x] T075 [P] Implement tablet layout (768-1023px): 2-card carousel, narrow two-column | src/components/kudos-board/
- [x] T076 Verify desktop layout (>=1024px): full two-column 680px + 374px, 3-card carousel | src/components/kudos-board/

### Animations

- [x] T077 [P] Add carousel slide animation: translateX 300ms ease-out | src/components/kudos-board/kudo-carousel.tsx
- [x] T078 [P] Add heart toggle animation: scale 1.2x 200ms ease-out + color transition | src/components/kudos-board/heart-button.tsx
- [x] T079 [P] Add kudo card enter animation: opacity 200ms ease-in via ScrollReveal | src/components/kudos-board/kudo-feed.tsx
- [x] T080 [P] Add copy toast animation: opacity + translateY 200ms ease-out | src/components/kudos-board/copy-link-button.tsx

**Checkpoint**: All polish complete — page accessible, responsive, animated.

---

## Phase 12: Testing & Quality

**Purpose**: Unit tests, integration tests, E2E tests.

### Unit Tests (Vitest)

- [ ] T081 [P] Unit tests for kudos-highlight service | src/services/__tests__/kudos-highlight.test.ts
- [ ] T082 [P] Unit tests for kudos-feed service | src/services/__tests__/kudos-feed.test.ts
- [ ] T083 [P] Unit tests for kudos-like service | src/services/__tests__/kudos-like.test.ts
- [ ] T084 [P] Unit tests for kudos-stats service | src/services/__tests__/kudos-stats.test.ts
- [ ] T085 [P] Unit tests for kudos-spotlight service | src/services/__tests__/kudos-spotlight.test.ts
- [ ] T086 [P] Unit tests for sunners service | src/services/__tests__/sunners.test.ts
- [ ] T087 [P] Unit tests for hashtags service | src/services/__tests__/hashtags.test.ts
- [ ] T088 [P] Unit tests for departments service | src/services/__tests__/departments.test.ts
- [ ] T089 [P] Unit tests for use-carousel hook | src/hooks/__tests__/use-carousel.test.ts
- [ ] T090 [P] Unit tests for use-infinite-scroll hook | src/hooks/__tests__/use-infinite-scroll.test.ts
- [ ] T091 [P] Unit tests for use-kudo-like hook | src/hooks/__tests__/use-kudo-like.test.ts
- [ ] T092 [P] Unit tests for use-clipboard hook | src/hooks/__tests__/use-clipboard.test.ts
- [ ] T093 [P] Extend format.ts tests for formatHeartCount and formatKudoTimestamp | src/utils/__tests__/format.test.ts

### E2E Tests (Playwright)

- [ ] T094 E2E: Navigate to /kudos, verify page loads with all sections visible | tests/e2e/kudos-live-board.spec.ts
- [ ] T095 [P] E2E: Carousel prev/next navigation updates cards and pagination indicator | tests/e2e/kudos-live-board.spec.ts
- [ ] T096 [P] E2E: Like/unlike a kudo, verify count changes and icon toggles | tests/e2e/kudos-live-board.spec.ts
- [ ] T097 [P] E2E: Copy link and verify toast notification | tests/e2e/kudos-live-board.spec.ts
- [ ] T098 [P] E2E: Infinite scroll loads more posts on scroll to bottom | tests/e2e/kudos-live-board.spec.ts
- [ ] T099 [P] E2E: Filter highlight carousel by hashtag | tests/e2e/kudos-live-board.spec.ts

**Checkpoint**: All tests passing. Feature complete.

---

## Phase 13: Bug Fixes — UI & Logic Review

**Purpose**: Fix UI discrepancies and logic issues found during design-style.md / spec.md review.

### UI Fixes

- [x] T100 [P] Fix highlight card padding: change from `p-4 md:p-6 pb-4` to `px-4 pt-4 md:px-6 md:pt-6 pb-4` to match design `24px 24px 16px 24px` (24px top/sides, 16px bottom) | src/components/kudos-board/highlight-card.tsx
- [x] T101 [P] Fix heart icon inactive color: change from `opacity-40` to explicit `text-[#999]` to match design spec "icon: gray (#999)" | src/components/kudos-board/highlight-card.tsx, heart-button.tsx
- [x] T102 [P] Fix action bar gap and widths: recognition input should be `lg:w-[738px]` flex-1, search should be `lg:w-[381px]`, gap between them ~33px on desktop (`lg:gap-[33px]`) | src/components/kudos-board/action-bar.tsx
- [x] T103 [P] Fix kudo post card padding: `p-6 md:p-10 pb-4` → ensure proper padding `px-6 pt-6 md:px-10 md:pt-10 pb-4` to match design `40px 40px 16px 40px` on desktop | src/components/kudos-board/kudo-post-card.tsx
- [x] T104 [P] Fix KV banner subtitle: change `text-xl` (20px) to `text-2xl` (24px) on mobile for closer match to design 36px subtitle | src/components/kudos-board/kudos-keyvisual.tsx
- [x] T105 [P] Fix sunner-list padding: design says `24px 16px 24px 24px` but code has `p-6 pr-4` (24px all, 16px right) — verify this matches | src/components/kudos-board/sunner-list.tsx

### Logic / Spec Compliance Fixes

- [x] T106 Fix XSS risk: replace `dangerouslySetInnerHTML` with safe text rendering or server-side sanitized content display for kudo content in kudo-post-card | src/components/kudos-board/kudo-post-card.tsx
- [x] T107 [P] Fix copy link toast text: spec says toast should show "Link copied — ready to share!" but implementation shows "Copied!" — update to match spec | src/components/kudos-board/copy-link-button.tsx
- [x] T108 [P] Fix highlight card content fallback: use `kudo.content ?? kudo.message ?? ""` (same as post card) for highlight cards that currently only use `kudo.content` | src/components/kudos-board/highlight-card.tsx
- [x] T109 [P] Fix carousel pagination: spec says arrows should be 52x52 — verify and ensure consistency | src/components/kudos-board/carousel-pagination.tsx

**Checkpoint**: All UI matches design-style.md, all logic matches spec.md.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────► Phase 2 (Foundation)
                                                  │
                                                  ▼
                               ┌──────────────────┼──────────────────┐
                               │                  │                  │
                          Phase 3 (US1)      Phase 4 (US2)     Phase 6 (US6)
                          Highlight MVP      All Kudos Feed     Send Kudo
                               │                  │                  │
                               └──────┬───────────┘                  │
                                      │                              │
                                 Phase 5 (US3)                       │
                                 Like & Share                        │
                                      │                              │
                               ┌──────┴──────┐                      │
                               │             │                      │
                          Phase 7 (US4) Phase 8 (US5)               │
                          Stats/Box     Spotlight                   │
                               │             │                      │
                               └──────┬──────┘                      │
                                      │                              │
                               ┌──────┴──────┐                      │
                               │             │                      │
                          Phase 9 (US7) Phase 10 (US8)              │
                          Leaderboards  Profiles                    │
                               │             │                      │
                               └──────┬──────┘──────────────────────┘
                                      │
                                 Phase 11 (Polish)
                                      │
                                 Phase 12 (Tests)
```

### Key Dependencies

- **US2 (All Kudos Feed)** depends on US1 (shared components: user-info, hashtag-badge, hashtag-list)
- **US3 (Like & Share)** depends on US2 (heart-button and copy-link go into kudo-post-card)
- **US4 (Stats)** depends on US2 (stats-card lives in all-kudos-section sidebar)
- **US5 (Spotlight)** can run parallel to US4 (independent section)
- **US6 (Send Kudo)** can run parallel to US1-US5 (action-bar is independent)
- **US7 (Leaderboards)** depends on US4 (sidebar in all-kudos-section)
- **US8 (Profiles)** depends on US1 (user-info component)
- **Phase 11 (Polish)** depends on all desired US phases
- **Phase 12 (Tests)** can partially overlap with later phases (service tests after Phase 2)

### Parallel Opportunities

**After Phase 2 completes, these can run in parallel:**
- US1 (Highlight Carousel) + US6 (Send Kudo) — independent components
- Within US1: T025–T032 all parallel (different component files)
- Within US2: T038–T040 all parallel (different component files)
- Within US3: T045 + T046 parallel (different hook files)
- US4 + US5 parallel (sidebar vs. standalone section)
- US7 + US8 parallel (leaderboards vs. profile previews)
- All Phase 11 tasks marked [P] can run in parallel
- All Phase 12 unit tests can run in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (US1 — Highlight Carousel) → **STOP and VALIDATE**
3. This gives a deployable page with carousel, keyvisual, and page shell

### Incremental Delivery

1. **Setup + Foundation** (Phase 1-2) → Verify services work
2. **US1 Highlight Carousel** (Phase 3) → Deploy MVP
3. **US2 All Kudos Feed** (Phase 4) → Deploy with feed
4. **US3 Like & Share** (Phase 5) → Deploy with interactions
5. **US6 Send Kudo** (Phase 6) → Deploy with action bar
6. **US4 Stats + US5 Spotlight** (Phase 7-8) → Deploy P2 features
7. **US7 Leaderboards + US8 Profiles** (Phase 9-10) → Deploy P3 features
8. **Polish + Tests** (Phase 11-12) → Final quality pass

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 99 |
| **Phase 1 (Setup)** | 7 |
| **Phase 2 (Foundation)** | 17 |
| **Phase 3 (US1 Highlight)** | 13 |
| **Phase 4 (US2 All Kudos)** | 7 |
| **Phase 5 (US3 Like/Share)** | 5 |
| **Phase 6 (US6 Send Kudo)** | 2 |
| **Phase 7 (US4 Stats)** | 3 |
| **Phase 8 (US5 Spotlight)** | 2 |
| **Phase 9 (US7 Leaderboards)** | 3 |
| **Phase 10 (US8 Profiles)** | 2 |
| **Phase 11 (Polish)** | 19 |
| **Phase 12 (Testing)** | 19 |
| **Parallelizable tasks** | 72 (73%) |
| **MVP scope** | Phase 1-3 (US1 only): 37 tasks |

---

## Notes

- ⚠️ **BLOCKING**: `star_count` and `danh_hieu` data source undecided. `user_profiles` view only has `full_name` and `avatar_url`. Clarify with stakeholders during Phase 1 (T006 migration).
- Commit after each task or logical group of parallel tasks.
- Run tests before moving to next phase.
- Mark tasks complete as you go: `[x]`
- Secret Box dialog (frame `1466:7676`), Profile Preview (frame `721:5827`), Hashtag Dropdown (frame `1002:13013`), Department Dropdown (frame `721:5684`) are separate feature specs — only integration points implemented here.
