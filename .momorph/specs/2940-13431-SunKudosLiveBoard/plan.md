# Implementation Plan: Sun* Kudos - Live Board

**Frame**: `2940:13431-SunKudosLiveBoard`
**Date**: 2026-03-17
**Spec**: `specs/2940-13431-SunKudosLiveBoard/spec.md`

---

## Summary

The Sun* Kudos - Live Board is a full-page feature for the SAA 2025 platform. It displays a highlight kudos carousel, an interactive spotlight word cloud, a paginated all-kudos feed with heart/share interactions, personal stats sidebar, Secret Box, and sunner leaderboards. Built on Next.js 15 App Router with RSC-first data fetching, Supabase for auth/data, TailwindCSS v4 for styling, and deployed to Cloudflare Workers via `@opennextjs/cloudflare`.

**Technical approach**: RSC page (`/kudos`) server-fetches initial data (highlights, spotlight, first page of kudos, stats, leaderboards). Interactive sections (carousel, like toggle, infinite scroll, filters, spotlight pan/zoom) are client components hydrated from server-rendered HTML. New API route handlers provide cursor-based pagination, like toggle, and filter endpoints.

---

## Technical Context

**Language/Framework**: TypeScript 5.x (strict) / Next.js 15.x App Router
**Primary Dependencies**: React 19, TailwindCSS 4.x, @supabase/ssr 0.8.x, sanitize-html
**Database**: Supabase (PostgreSQL) — requires new migration for likes, stats views, departments
**Testing**: Vitest (unit/integration), Playwright (E2E)
**State Management**: RSC for server data, React useState/useReducer for client interactions
**API Style**: REST (Next.js Route Handlers, edge runtime)
**Deployment**: Cloudflare Workers via @opennextjs/cloudflare

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Code & Source Organization** — Feature-based folder `src/components/kudos-board/`, kebab-case files, PascalCase components, `@/*` imports
- [x] **II. Next.js & Cloudflare Workers** — RSC default, `"use client"` only for interactive elements, Route Handlers with edge runtime, TailwindCSS v4
- [x] **III. Supabase Integration** — `@supabase/ssr` for server client, RLS on all new tables, Supabase CLI migrations, no raw SQL from client
- [x] **IV. Responsive Design (Mobile-First)** — Mobile-first with `md:` and `lg:` prefixes, 44x44px touch targets, three breakpoints
- [x] **V. OWASP Security** — Parameterized Supabase queries, HttpOnly cookies via `@supabase/ssr`, no `dangerouslySetInnerHTML`, explicit CORS, RLS enforcement
- [x] **VI. Test-First (TDD)** — Unit tests for services/utils, integration tests for route handlers, E2E for P1 user stories

**Violations**: None — all features implementable within approved stack.

**New Dependencies Assessment**:

| Library | Purpose | Justification | Alternative Rejected |
|---------|---------|---------------|---------------------|
| None required | — | All features achievable with existing stack | — |

> **Note on Spotlight Word Cloud**: The interactive word cloud (pan/zoom/search) will be implemented using pure CSS transforms + vanilla DOM events (no D3.js or react-force-graph needed). Names are positioned via absolute positioning with pre-calculated coordinates from the API. This avoids adding new runtime dependencies per constitution rules.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based folder `src/components/kudos-board/` for page-specific components, plus reuse of existing shared components (`Header`, `Footer`, `Icon`, `Toast`, `SectionSkeleton`, `ErrorRetry`, `ScrollReveal`)
- **Styling Strategy**: TailwindCSS v4 utility classes with new design tokens added to `globals.css` `@theme inline` block. No CSS modules needed.
- **Data Fetching**:
  - **RSC (Server Components)**: Page-level data fetch for highlight kudos, spotlight data, first page of all kudos, user stats, leaderboards — all via service layer calling Supabase server client
  - **Client Components**: Carousel interaction, infinite scroll (cursor-based fetch), like toggle (optimistic UI), filter dropdowns, spotlight pan/zoom, clipboard copy
- **Page Route**: `/kudos` → `src/app/kudos/page.tsx` (RSC, auth-gated)

### Backend Approach

- **API Design**: New Route Handlers in `src/app/api/` with edge runtime, explicit CORS, auth checks via `createClient()`
- **Data Access**: Supabase client queries via service layer (`src/services/`) — no raw SQL, parameterized queries only
- **Validation**: Manual field validation in Route Handlers (consistent with existing `POST /api/kudos` pattern — no Zod)

### Database Approach

New Supabase migration adding:
- `kudo_likes` table (user_id + kudo_id unique constraint, RLS: user can only manage own likes)
- `departments` table (id, name) with public read RLS
- **No `hashtags` table needed** — extract distinct hashtags from existing `kudos.hashtags` JSONB array via `SELECT DISTINCT unnest(hashtags) FROM kudos`. This avoids sync issues and leverages existing data. The `hashtags.ts` service uses this query directly.
- Database views/functions for: highlight kudos (top-5 by like count), user stats, spotlight aggregation
- `heart_count` either as materialized view or computed column on kudos

### Integration Points

- **Existing Services**: `getRecentKudos()` in `src/services/kudos.ts` — **do NOT modify** (used by Homepage). Create separate `kudos-feed.ts` for the Live Board's paginated feed. The Homepage `GET /api/kudos/live` route remains unchanged.
- **Shared Components**: `Header` (variant `app`), `Footer` (variant `saa`), `Icon`, `Toast`, `SectionSkeleton`, `ErrorRetry`, `ScrollReveal`
- **Existing Types**: `Kudo`, `Badge`, `Colleague`, `KudoSubmitPayload` in `src/types/kudos.ts` (extend significantly). **Note**: Existing `Kudo` type has `message` field but the DB column and submit API use `content`. **Resolution**: Add `content: string` to the `Kudo` type (keeping `message` as deprecated alias to avoid breaking Homepage); `KudoHighlight` and all new code MUST use `content` exclusively.
- **Existing DB**: `kudos` table (with `recipient_ids`, `badge_id`, `hashtags`, `image_urls`), `badges` table, `user_profiles` view, `notifications` table
- **Auth**: Middleware already protects `/kudos` route. Page uses `createClient()` → `auth.getUser()`.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2940-13431-SunKudosLiveBoard/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot ✅
```

### Source Code (affected areas)

```text
# New Files
src/
├── app/kudos/
│   ├── page.tsx                          # RSC page (auth + data fetch)
│   └── loading.tsx                       # Suspense fallback (full-page skeleton)
├── app/api/
│   ├── kudos/highlight/route.ts          # GET highlight kudos (filtered)
│   ├── kudos/[id]/like/route.ts          # POST toggle like
│   ├── kudos/stats/route.ts              # GET personal stats
│   ├── kudos/spotlight/route.ts          # GET spotlight data
│   ├── sunners/gift-recipients/route.ts  # GET gift recipients
│   ├── sunners/ranking/route.ts          # GET ranking list
│   ├── hashtags/route.ts                 # GET hashtag list
│   └── departments/route.ts              # GET department list
├── components/kudos-board/
│   ├── kudos-keyvisual.tsx               # Hero section (RSC)
│   ├── action-bar.tsx                    # Recognition + search inputs (client)
│   ├── section-header.tsx                # Reusable sub-heading + title (RSC)
│   ├── highlight-section.tsx             # Container for carousel + filters (client)
│   ├── highlight-card.tsx                # Individual carousel card (RSC-safe)
│   ├── kudo-carousel.tsx                 # Carousel logic with side arrows (client)
│   ├── carousel-pagination.tsx           # Pagination controls (client)
│   ├── filter-button.tsx                 # Hashtag/Department dropdown trigger (client)
│   ├── spotlight-board.tsx               # Word cloud canvas (client)
│   ├── all-kudos-section.tsx             # Two-column layout container (RSC)
│   ├── kudo-feed.tsx                     # Infinite scroll kudo list (client)
│   ├── kudo-post-card.tsx                # Full kudo card (RSC-safe)
│   ├── user-info.tsx                     # Avatar + name + stars + badge (RSC-safe)
│   ├── heart-button.tsx                  # Like toggle with optimistic UI (client)
│   ├── copy-link-button.tsx              # Copy URL + toast (client)
│   ├── image-gallery.tsx                 # Thumbnail grid (client)
│   ├── image-lightbox.tsx                # Full-screen image viewer overlay (client)
│   ├── hashtag-badge.tsx                 # Prominent pill badge (RSC-safe)
│   ├── hashtag-list.tsx                  # Inline hashtag row (RSC-safe)
│   ├── stats-card.tsx                    # Personal stats sidebar (RSC)
│   ├── open-gift-button.tsx              # "Mo qua" button (client)
│   ├── sunner-list.tsx                   # Reusable list for gifts + rankings (RSC)
│   └── sunner-item.tsx                   # Individual sunner row (RSC-safe)
├── hooks/
│   ├── use-carousel.ts                   # Carousel navigation logic
│   ├── use-infinite-scroll.ts            # Intersection Observer pagination
│   ├── use-kudo-like.ts                  # Optimistic like toggle
│   └── use-clipboard.ts                  # Copy to clipboard + toast
├── services/
│   ├── kudos-highlight.ts                # Highlight kudos queries
│   ├── kudos-feed.ts                     # Paginated feed queries
│   ├── kudos-like.ts                     # Like toggle logic
│   ├── kudos-stats.ts                    # Personal stats queries
│   ├── kudos-spotlight.ts                # Spotlight data queries
│   ├── sunners.ts                        # Gift recipients + rankings
│   ├── hashtags.ts                       # Hashtag list
│   └── departments.ts                    # Department list
├── types/
│   └── kudos.ts                          # EXTEND with new types
└── utils/
    └── format.ts                         # EXTEND with heart count formatter

# Modified Files
src/app/globals.css                       # Add Kudos Live Board design tokens
src/types/kudos.ts                        # Extend Kudo type, add new types
src/utils/format.ts                       # Add formatHeartCount(), formatTimestamp()
src/app/api/kudos/route.ts               # ADD GET export for paginated feed (existing file has POST + OPTIONS only)
src/components/footer/footer.tsx          # Update SAA_NAV_LINKS: change "Sun* Kudos" href from "/#kudos-heading" → "/kudos"

# Database
supabase/migrations/
└── 20260317000000_kudos_live_board.sql   # New migration: likes, departments, hashtags, views

# Tests
src/services/__tests__/
├── kudos-highlight.test.ts
├── kudos-feed.test.ts
├── kudos-like.test.ts
├── kudos-stats.test.ts
├── kudos-spotlight.test.ts
├── sunners.test.ts
├── hashtags.test.ts
└── departments.test.ts
src/hooks/__tests__/
├── use-carousel.test.ts
├── use-infinite-scroll.test.ts
├── use-kudo-like.test.ts
└── use-clipboard.test.ts
src/utils/__tests__/
└── format.test.ts                        # Extend existing tests
tests/e2e/
└── kudos-live-board.spec.ts              # E2E for P1 flows
```

### Dependencies

No new packages required. All features implementable with existing stack:
- `@supabase/ssr` + `@supabase/supabase-js` — data access
- `sanitize-html` — XSS prevention for kudo content display
- TailwindCSS v4 — styling
- Vitest + @testing-library — unit/integration tests
- Playwright — E2E tests

---

## Implementation Strategy

### Phase 0: Asset Preparation & Foundation

**Goal**: Download assets, set up design tokens, extend types, create DB migration.

1. Download UI assets from Figma using `get_media_files` to `public/`:
   - **Keyvisual background**: `public/images/kudos-keyvisual-bg.svg` (or .png)
   - **Missing icons** (not in `public/icons/` yet): `heart.svg`, `link.svg`, `gift.svg`, `pan-zoom.svg`, `star.svg`, `play.svg`, `pen.svg`, `chevron-left.svg`, `chevron-right.svg`
   - Verify existing icons still usable: `search.svg`, `chevron-down.svg`, `hash.svg`, `arrow-right.svg`
2. Add Kudos Live Board design tokens to `globals.css` `@theme inline`. **Reuse existing tokens where values match** (`--color-navy` = `#00101A`, existing gold `#C8A96E` is the homepage gold). Only add tokens for **new** colors:
   ```css
   /* Existing (reuse as-is): --color-navy (#00101A), --color-gold (#C8A96E) */
   /* New Kudos-specific tokens: */
   --color-kudos-container-2: #00070C;
   --color-kudos-gold: #FFEA9E;       /* ⚠ Different from --color-gold (#C8A96E) — bright gold for kudos highlights */
   --color-kudos-cream: #FFF8E1;
   --color-kudos-border: #998C5F;
   --color-kudos-divider: #2E3940;
   --color-kudos-heart: #D4271D;
   ```
   Use `bg-navy` (not `bg-kudos-bg`) for page background since `--color-navy` already equals `#00101A`.
3. Extend `src/types/kudos.ts` with:
   ```typescript
   export type KudoReceiver = {
     user_id: string;
     full_name: string;
     avatar_url: string | null;
     department?: string;
     star_count?: number;
     danh_hieu?: string;
   };

   export type KudoHighlight = Kudo & {
     heart_count: number;
     sender_full_name: string;
     sender_avatar_url: string | null;
     sender_department?: string;
     sender_star_count?: number;
     sender_danh_hieu?: string;
     receivers: KudoReceiver[];  // Supports multiple receivers
     is_liked_by_me?: boolean;   // For authenticated user's like state
   };

   export type KudoLike = {
     id: string;
     user_id: string;
     kudo_id: string;
     created_at: string;
   };

   export type KudoStats = {
     kudos_received: number;
     kudos_sent: number;
     hearts_received: number;
     secret_boxes_opened: number;
     secret_boxes_unopened: number;
   };

   export type SpotlightEntry = {
     user_id: string;
     full_name: string;
     kudos_count: number;
   };

   export type SunnerGift = {
     user_id: string;
     full_name: string;
     avatar_url: string | null;
     description: string;
   };

   export type SunnerRanking = {
     user_id: string;
     full_name: string;
     avatar_url: string | null;
     rank_change: string;
   };

   export type Department = {
     id: string;
     name: string;
   };

   export type HashtagItem = {
     name: string;  // No `id` — extracted via `SELECT DISTINCT unnest(hashtags)` from kudos table
   };
   ```
4. Create database migration `supabase/migrations/20260317000000_kudos_live_board.sql`:
   - `kudo_likes` table: `(id uuid PK, user_id uuid FK auth.users, kudo_id uuid FK kudos, created_at timestamptz DEFAULT now())` with unique constraint `(user_id, kudo_id)`, RLS: authenticated users can INSERT/DELETE own likes, SELECT all
   - `departments` table: `(id uuid PK, name text NOT NULL, created_at timestamptz DEFAULT now())`, public read RLS
   - `secret_boxes` table: `(id uuid PK, user_id uuid FK auth.users, opened boolean DEFAULT false, gift_description text, created_at timestamptz DEFAULT now())`, RLS: users can read/update own boxes. **Required for** `KudoStats.secret_boxes_opened/unopened`
   - Extend `user_profiles` view OR create `sunner_profiles` table to include `star_count integer DEFAULT 0` and `danh_hieu text` fields. **⚠ BLOCKING**: Every kudo card displays these fields — schema must be decided before Phase 1.
   - Add `heart_count` via one of: **(a)** a `kudos_with_hearts` VIEW that joins `kudos LEFT JOIN (SELECT kudo_id, COUNT(*) AS heart_count FROM kudo_likes GROUP BY kudo_id)`, or **(b)** a trigger-maintained `heart_count integer DEFAULT 0` column on `kudos` (updated on INSERT/DELETE to `kudo_likes`). **⚠ Cannot use PostgreSQL GENERATED column — generated columns can only reference data in the same row, not other tables.** Recommend option (b) for query simplicity + performance.
   - Create RPC functions: `get_kudo_stats(p_user_id uuid)` returns `KudoStats`, `get_spotlight_data()` returns `SpotlightEntry[]`, `get_highlight_kudos(p_limit int, p_hashtag text, p_department uuid)` returns `KudoHighlight[]`
5. Create utility functions in `src/utils/format.ts`:
   - `formatHeartCount(count: number): string` — e.g., 1000 → "1,000"
   - `formatKudoTimestamp(dateStr: string): string` — "HH:mm - MM/DD/YYYY"
6. **Mention rendering**: Kudo content contains Tiptap HTML with `<span data-mention-id="uuid">@Name</span>`. Use existing `src/utils/mention-parser.ts` (`extractMentionIds()`) for extracting mention IDs. For **display**, render sanitized HTML via `sanitize-html` (already a dependency) with allowed tags/attributes matching the existing `SANITIZE_OPTIONS` in `src/app/api/kudos/route.ts`. Mention spans should be styled as clickable links to profile pages.

### Phase 1: Core Services & Route Handlers (P1 Backend)

**Goal**: Build all service layer functions and API endpoints.

1. **Services** (in `src/services/`):
   - `kudos-highlight.ts` — `getHighlightKudos(filters?: { hashtag?: string; department?: string }): Promise<KudoHighlight[]>`
   - `kudos-feed.ts` — `getKudosFeed(cursor?: string, limit?: number): Promise<{ kudos: KudoHighlight[]; nextCursor: string | null }>`
   - `kudos-like.ts` — `toggleKudoLike(kudoId: string, userId: string): Promise<{ liked: boolean; heart_count: number }>`
   - `kudos-stats.ts` — `getKudoStats(userId: string): Promise<KudoStats>`
   - `kudos-spotlight.ts` — `getSpotlightData(): Promise<{ total: number; entries: SpotlightEntry[] }>`
   - `sunners.ts` — `getGiftRecipients(): Promise<SunnerGift[]>`, `getSunnerRankings(): Promise<SunnerRanking[]>`
   - `hashtags.ts` — `getHashtags(): Promise<string[]>` (returns plain array of hashtag strings, no IDs)
   - `departments.ts` — `getDepartments(): Promise<Department[]>`

2. **Route Handlers** (in `src/app/api/`):
   - `GET /api/kudos/highlight` — NEW route handler, query params: `hashtag`, `department`
   - `GET /api/kudos` — ADD GET export to existing `src/app/api/kudos/route.ts` (currently only has POST + OPTIONS). Supports cursor pagination: `cursor`, `limit` (default 10), optional `hashtag` filter. Also update existing `OPTIONS` handler to include `GET` in `Access-Control-Allow-Methods`. **Note**: The existing `GET /api/kudos/live` at `src/app/api/kudos/live/route.ts` is a simpler endpoint used by the Homepage; the new GET on `/api/kudos` is the full paginated feed for the Live Board.
   - `POST /api/kudos/{id}/like` — toggle like, return new count
   - `GET /api/kudos/stats` — personal stats (auth required)
   - `GET /api/kudos/spotlight` — spotlight data
   - `GET /api/sunners/gift-recipients` — top 10 gift recipients
   - `GET /api/sunners/ranking` — top 10 rising sunners
   - `GET /api/hashtags` — available hashtags
   - `GET /api/departments` — department list

   All handlers: `export const runtime = "edge"`, CORS headers, auth check via `createClient()`.

3. **Unit tests** for each service function (mock Supabase client).

### Phase 2: Page & Core UI Components (P1 Frontend — Highlight + All Kudos)

**Goal**: Build the page shell and the two P1 sections.

1. **Page** (`src/app/kudos/page.tsx`):
   ```tsx
   // RSC — auth check, parallel data fetch, render
   const NAV_LINKS = [
     { label: "About SAA 2025", href: "/" },
     { label: "Award Information", href: "/awards" },
     { label: "Sun* Kudos", href: "/kudos" },
   ];

   export default async function KudosPage() {
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) redirect("/login");

     const [highlights, spotlight, kudos, stats, giftRecipients, rankings] =
       await Promise.all([...]);

     return (
       <main>
         <Header variant="app" navLinks={NAV_LINKS} activeHref="/kudos" user={...} />
         <KudosKeyvisual />
         <ActionBar />
         <HighlightSection initialHighlights={highlights} />
         <SpotlightBoard initialData={spotlight} />
         <AllKudosSection
           initialKudos={kudos}
           stats={stats}
           giftRecipients={giftRecipients}
           rankings={rankings}
           userId={user.id}
         />
         <Footer variant="saa" activeHref="/kudos" />
       </main>
     );
   }
   ```

2. **Loading** (`src/app/kudos/loading.tsx`):
   - Full-page skeleton using existing `SectionSkeleton` — renders skeleton for keyvisual, carousel (3 cards), feed (3 cards), sidebar (stats + lists)
   - Automatically used by Next.js Suspense boundary during RSC data fetch

3. **Keyvisual + Action Bar**:
   - `kudos-keyvisual.tsx` — RSC, background image + gradient + "KUDOS" hero text
   - `action-bar.tsx` — Client component with two inputs:
     - **Recognition input**: click → opens existing `KudoModal` from `src/components/kudo-modal/kudo-modal.tsx`. Manages `isKudoModalOpen` state.
     - **Search sunner input**: type → calls existing `GET /api/users/search?q={query}` (debounced 300ms) → renders dropdown of matching profiles. Click result → navigates to profile page. Uses existing `Colleague` type.

4. **Highlight Kudos Section** (US1):
   - `section-header.tsx` — Reusable "Sun* Annual Awards 2025" + section title + optional filter slots
   - `highlight-section.tsx` — Client wrapper: manages carousel state, filters, fetches filtered data
   - `highlight-card.tsx` — Card with sender/receiver info (name, department, star count, danh hieu), content (3 lines), hashtags, heart count, "Copy Link", and "Xem chi tiet" (scrolls to corresponding kudo in All Kudos feed via `document.getElementById(kudoId)?.scrollIntoView()`). Multiple receivers: render each receiver info block in sequence.
   - `kudo-carousel.tsx` — Client: manages `carouselIndex`, renders side arrows + cards. **Multi-card viewport**: shows 3 cards simultaneously on desktop (528px each + 24px gap), 2 on tablet, 1 on mobile. Slides 1 card at a time. Uses `overflow: hidden` container with `transform: translateX()` on inner track.
   - `carousel-pagination.tsx` — Client: prev/next + "2/5" indicator
   - `filter-button.tsx` — Client: dropdown trigger with chevron, fetches options on open
   - `use-carousel.ts` — Hook: index management, prev/next, disabled states, **touch/swipe support** (touchstart/touchend delta detection for mobile swipe navigation, threshold 50px)

5. **All Kudos Feed** (US2):
   - `all-kudos-section.tsx` — RSC two-column layout container
   - `kudo-feed.tsx` — Client: infinite scroll list, uses `useInfiniteScroll` hook. **Empty state**: when 0 kudos exist, display a centered message with prompt to send the first kudo (links to recognition input / opens KudoModal).
   - `kudo-post-card.tsx` — Full card: user info rows (sender + arrow + receiver(s) — if multiple receivers, render each receiver block in sequence), hashtag badge, timestamp, content (5 lines), gallery, hashtag list, actions. Each card has `id={kudo.id}` for scroll-to from highlight "Xem chi tiet".
   - `user-info.tsx` — Reusable: avatar (48px/40px) + name + department + star count + danh hieu
   - `image-gallery.tsx` — Client: max 5 thumbnails (80x80px), click-to-lightbox. Supports video thumbnails with play icon overlay (FR-016); clicking video opens inline player or full-screen modal.
   - `image-lightbox.tsx` — Client: full-screen overlay for expanded image view, prev/next navigation, close on Escape/click-outside (FR-013)
   - `hashtag-badge.tsx` — Prominent pill: gold bg, dark text, clickable. **Click behavior**: sets `activeHashtag` filter state in `kudo-feed.tsx`, which resets the feed cursor and refetches with `?hashtag={name}` query param. Active filter shown as a removable chip above the feed.
   - `hashtag-list.tsx` — Inline row: max 5, "..." overflow, clickable (same filter behavior as hashtag-badge)
   - `use-infinite-scroll.ts` — Hook: IntersectionObserver, cursor management, loading state

6. **Like & Share** (US3):
   - `heart-button.tsx` — Client: optimistic toggle, animation, `aria-pressed`
   - `copy-link-button.tsx` — Client: clipboard write, "Copied!" state (2s), toast
   - `use-kudo-like.ts` — Hook: optimistic state, API call, rollback on error
   - `use-clipboard.ts` — Hook: `navigator.clipboard.writeText`, toast state

### Phase 3: Sidebar & Secondary Features (P2)

**Goal**: Build stats card, Secret Box, Spotlight Board.

1. **Stats Card** (US4):
   - `stats-card.tsx` — RSC: 5 stat rows (kudos received, kudos sent, hearts received | divider | Secret Box opened, Secret Box unopened), gold values (#FFEA9E), dark card bg (#00070C), border #998C5F, radius 17px
   - `open-gift-button.tsx` — Client: gold button, opens Secret Box dialog (frame `1466:7676` — out of scope, just emit event/navigate)

2. **Spotlight Board** (US5):
   - `spotlight-board.tsx` — Client: CSS-based word cloud, pan/zoom via CSS transforms, search input highlights names
   - Approach: Position names absolutely within a container, apply `scale()` and `translate()` for zoom/pan. Search filters names and scrolls to match.
   - Performance: Limit to 500 names, use `will-change: transform` for GPU acceleration

3. **Sunner Leaderboards** (US7):
   - `sunner-list.tsx` — RSC: reusable card with title + list of sunner items
   - `sunner-item.tsx` — Avatar (40px circle) + name + description, clickable

### Phase 4: Navigation & Polish (P3)

**Goal**: Profile interactions, loading/error states, accessibility, responsive, animations.

1. **Profile Previews** (US8):
   - Hover avatar/name → profile preview tooltip (reuse frame `721:5827` if already implemented, otherwise simple tooltip)
   - Click avatar/name → navigate to profile page

2. **Loading States** (FR-017):
   - Skeleton cards for highlight carousel (3 placeholders)
   - Skeleton cards for kudo feed (3 placeholders)
   - Skeleton rows for stats card (6 lines)
   - Skeleton items for leaderboards (5 rows)
   - Spinner for infinite scroll loading

3. **Error States** (FR-018):
   - Reuse `ErrorRetry` component for section-level errors
   - Toast for inline errors (like failure, copy failure)

4. **Accessibility**:
   - Carousel: `aria-roledescription="carousel"`, slide `role="group"`, `aria-label="Slide {n} of {total}"`
   - Heart button: `aria-pressed`, `aria-label="Like kudo, {count} likes"`
   - Filter buttons: `aria-haspopup="listbox"`, `aria-expanded`
   - Toast: `aria-live="polite"`
   - Focus management: return focus on dropdown close, skip-to-content link

5. **Responsive** (Constitution IV):
   - Mobile (<768px): single column, stacked sidebar, swipe carousel, hamburger header
   - Tablet (768-1023px): 2 visible carousel cards, single/narrow two-column
   - Desktop (>=1024px): full two-column (680px + 374px), 3 visible carousel cards

6. **Animations**:
   - Carousel slide: `transform: translateX()` 300ms ease-out
   - Heart toggle: scale 1.2x 200ms ease-out + color transition
   - Kudo card enter: opacity 200ms ease-in (scroll reveal)
   - Copy toast: opacity + translateY 200ms ease-out
   - Button hover: background-color 150ms ease-in-out

### Phase 5: Testing & Quality

1. **Unit Tests** (Vitest):
   - All service functions (mock Supabase)
   - All custom hooks (renderHook)
   - Utility functions (formatHeartCount, formatKudoTimestamp)
   - Target: 80%+ coverage on `src/services/` and `src/utils/`

2. **Integration Tests** (Vitest + Testing Library):
   - Route handler responses (mocked Supabase)
   - Component rendering with props
   - Carousel navigation state
   - Like toggle optimistic update + rollback

3. **E2E Tests** (Playwright):
   - Navigate to `/kudos`, verify page loads with all sections
   - Carousel prev/next navigation
   - Like/unlike a kudo
   - Copy link and verify toast
   - Infinite scroll loads more posts
   - Filter highlight by hashtag

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Spotlight word cloud performance with 500+ names | Medium | High | Limit rendered names to 200, paginate/virtualize remainder, GPU-accelerate transforms |
| Infinite scroll race conditions (rapid scrolling) | Low | Medium | Debounce scroll handler, abort previous fetch on new trigger, cursor-based pagination prevents duplicates |
| Optimistic like UI desync | Low | Medium | Reconcile on API response, revert on error, show error toast |
| Database migration conflicts with existing schema | Low | High | Test migration on staging first, use `IF NOT EXISTS` for all DDL |
| Large kudo content/images affecting page performance | Medium | Medium | Image lazy loading via `next/image`, content truncation, skeleton loading |
| Sunner Ranking List has no Figma design items | Low | Low | Reuse D.3 (Gift Recipients) visual pattern — same card style, same item layout |

### Estimated Complexity

- **Frontend**: High (20+ components, 4 hooks, complex interactions)
- **Backend**: Medium (8 route handlers, 8 service modules, 1 migration)
- **Testing**: Medium (matching service/hook coverage targets)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Carousel ↔ Pagination, Feed ↔ InfiniteScroll hook, HeartButton ↔ LikeHook ↔ API
- [x] **External dependencies**: Supabase auth + data queries (mocked in unit, real in E2E)
- [x] **Data layer**: New `kudo_likes` table, stats aggregation, spotlight query
- [x] **User workflows**: Browse → like → copy link → scroll → filter (E2E)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Carousel nav updates index + pagination, like toggle updates count + icon, filter changes carousel content |
| Service ↔ Service | Yes | Stats aggregation uses likes + kudos data, spotlight uses kudos + user_profiles |
| App ↔ External API | Yes | All route handlers → Supabase queries |
| App ↔ Data Layer | Yes | kudo_likes CRUD, cursor pagination, highlight ordering |
| Cross-platform | Yes | Mobile single-column, tablet 2-card carousel, desktop full layout |

### Test Environment

- **Environment type**: Local (Vitest + happy-dom), Playwright against dev server
- **Test data strategy**: Fixtures for unit tests (mock Supabase responses), seeded database for E2E
- **Isolation approach**: Fresh mock state per unit test, fresh browser context per E2E test

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase client (unit) | Mock | Fast, isolated, no DB dependency |
| Supabase client (E2E) | Real | Validates full stack including RLS |
| Next.js router | Mock (vi.mock) | Unit tests don't need routing |
| Clipboard API | Mock | Not available in happy-dom |
| IntersectionObserver | Mock | Not available in happy-dom |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Page loads with highlight carousel showing 5 cards
   - [ ] Carousel prev/next updates displayed card and pagination
   - [ ] All Kudos feed renders with correct card content
   - [ ] Like toggle increments count and changes icon color
   - [ ] Copy link writes URL to clipboard and shows toast
   - [ ] Infinite scroll loads next page on scroll bottom
   - [ ] Stats card displays correct personal values
   - [ ] Filter by hashtag refreshes highlight carousel

2. **Error Handling**
   - [ ] Failed highlight fetch shows error + retry
   - [ ] Failed like API reverts optimistic update + shows error toast
   - [ ] Failed infinite scroll shows "failed to load more" toast
   - [ ] Invalid clipboard API shows fallback message

3. **Edge Cases**
   - [ ] 0 highlight kudos hides carousel section
   - [ ] 0 kudos in feed shows empty state with "send first kudo" prompt
   - [ ] Kudo with no images hides gallery section
   - [ ] Kudo with >5 hashtags shows "..." overflow
   - [ ] Empty spotlight data shows placeholder
   - [ ] Carousel with 2 cards adjusts pagination to "1/2"

### Tooling & Framework

- **Test framework**: Vitest 4.x (unit/integration), Playwright latest (E2E)
- **Supporting tools**: @testing-library/react (component rendering), happy-dom (DOM environment)
- **CI integration**: `yarn test` (Vitest) + `yarn test:e2e` (Playwright) in PR gate

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `src/services/kudos-*.ts` | 90%+ | High |
| `src/hooks/use-*.ts` | 85%+ | High |
| `src/utils/format.ts` | 95%+ | High |
| Component rendering | 70%+ | Medium |
| E2E critical paths | 5 flows | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (3 review passes completed)
- [x] `design-style.md` finalized
- [ ] Database migration tested on staging
- [ ] Assets downloaded from Figma
- [ ] API contracts confirmed with stakeholders

### External Dependencies

- Supabase project configured with auth + storage
- Figma design assets exported (keyvisual-bg, icons)
- Existing `kudos` and `badges` tables populated with seed data for development

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Begin** Phase 0 (assets + types + migration) → Phase 1 (services) → Phase 2 (UI) sequentially

---

## Notes

- The Kudos Live Board page is the most complex page in the SAA 2025 platform (20+ components, 8 API endpoints, complex interactions). Phase breakdown enables incremental delivery and testing.
- The existing `KudosLiveBoard` component in `src/components/home/kudos-live-board.tsx` is a **simplified version** for the Homepage feed. The new `/kudos` page is a full-featured replacement with different layout and functionality. The Homepage component will remain unchanged.
- Secret Box dialog (frame `1466:7676`), Profile Preview (frame `721:5827`), Hashtag Dropdown (frame `1002:13013`), and Department Dropdown (frame `721:5684`) are separate feature specs. The plan assumes they will be implemented as separate screens/modals. Integration points are documented but not implemented in this plan.
- Footer should use the `saa` variant (already has the correct nav links and styling). The header `Sun* Kudos` nav link should be active (`activeHref="/kudos"`).
- The `user_profiles` view already exposes `full_name` and `avatar_url` from `auth.users`. Star count (`hoa thi`) and `danh_hieu` (badge title) are user profile fields that may need to be added to the view or a separate `sunner_profiles` table — clarify with stakeholders during Phase 0.
