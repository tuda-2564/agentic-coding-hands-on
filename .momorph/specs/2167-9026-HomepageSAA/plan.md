# Implementation Plan: Homepage SAA

**Frame**: `2167:9026-HomepageSAA`
**Date**: 2026-03-10
**Spec**: `specs/2167-9026-HomepageSAA/spec.md`

---

## Summary

Implement the Homepage SAA — the main landing page for the SAA 2025 "ROOT FURTHER" internal platform. The page features a premium dark theme with gold accents, a real-time countdown timer, an awards system grid, Sun* Kudos live board, and persistent header/footer navigation. Architecture follows RSC-first approach with minimal client components (CountdownTimer, KudosLiveBoard, ProfileDropdown, LanguageSelector, HeaderClient, MobileMenu).

---

## Technical Context

**Language/Framework**: TypeScript 5 (strict) / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS v4, @supabase/ssr, @supabase/supabase-js, next/image
**Database**: Supabase (PostgreSQL) with RLS
**Testing**: Playwright (E2E); unit/integration test runner TBD (see Note T1)
**State Management**: RSC server state + React useState/useEffect for client components
**API Style**: REST (Route Handlers) + Supabase Realtime (Kudos stream — see ADR-1)
**Deployment**: Cloudflare Workers via @opennextjs/cloudflare

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **Principle I — Clean Code**: kebab-case files, PascalCase components, `@/*` imports, `src/` structure
- [x] **Principle II — Next.js/Cloudflare**: RSC-first, only 6 client components (CountdownTimer, KudosLiveBoard, ProfileDropdown, LanguageSelector, HeaderClient, MobileMenu), edge-compatible Route Handlers
- [x] **Principle III — Supabase Integration**: `@supabase/ssr` for server, browser client only for real-time Kudos stream, RLS on all tables
- [x] **Principle IV — Responsive Mobile-First**: 3 breakpoints (mobile/tablet/desktop), 44×44px touch targets, `next/image` with `sizes`
- [x] **Principle V — OWASP Security**: Parameterised Supabase queries, HttpOnly session cookies, no `dangerouslySetInnerHTML`, RLS
- [x] **Principle VI — TDD**: Test-first approach integrated into each phase (see per-phase test notes); 80% coverage target for services/utils

**Violations**: None

**Note T1 — Test Runner**: The project currently has **no unit/integration test runner** (`package.json` has only Playwright implied via constitution). Before Phase 1 begins, a test runner must be added. **Recommendation**: Add `vitest` as a devDependency. **Justification**: Vitest is the de facto standard for Vite/Next.js projects, has native TypeScript support, and is faster than Jest. No alternative in current deps achieves this. This must be documented in the PR description per constitution.

---

## Architecture Decisions

### ADR-1: Kudos Real-time via Supabase Realtime (not custom WebSocket/SSE)

The spec lists `/api/kudos/live/stream` (WebSocket/SSE) as a predicted endpoint. **This plan replaces it with Supabase Realtime** (client-side `channel.on('postgres_changes')`) because:
- No custom WebSocket server needed — Supabase manages the connection
- Edge-compatible (runs on browser client only, not server)
- Consistent with Constitution Principle III (browser client for real-time)
- Reduces backend complexity

**Trade-off**: Tightly couples to Supabase. If migrating away from Supabase in the future, this would need reimplementation. Acceptable for current project scope.

### ADR-2: Header/Footer Backward Compatibility via Prop-Driven Variants

The existing Header (`absolute top-0`) and Footer (`absolute bottom-0`) are used by the Login page inside a `relative` container. The Homepage needs:
- Header: `fixed top-0` with scroll-based glassmorphism
- Footer: Normal document flow (not absolute)

**Approach**: Add a `variant` prop to both components:
- `Header variant="login"` → current absolute positioning (default, backward-compatible)
- `Header variant="app"` → fixed positioning with nav links, profile avatar, scroll state
- `Footer variant="login"` → current absolute positioning (default)
- `Footer variant="app"` → normal flow positioning with extended links

This avoids breaking the Login page while supporting the Homepage layout.

### ADR-3: Header Client/Server Split

The Homepage header requires scroll detection (`isScrolled`) and interactive dropdowns — both need `"use client"`. Current Header is a server component.

**Approach**: Split into:
- `Header` (server component) — renders the shell, passes data (user profile, nav links) as props
- `HeaderClient` (client component) — handles scroll detection, dropdown state coordination, mobile menu toggle
- `ProfileDropdown` (client component) — profile menu
- `MobileMenu` (client component) — hamburger menu for mobile

The Login page continues using the simple server-only Header (no HeaderClient needed).

### ADR-4: Concurrent Dropdown Coordination

Spec requires: "Only one dropdown can be open at a time; opening one closes the other."

**Approach**: `HeaderClient` manages a shared `activeDropdown: 'profile' | 'language' | null` state. Both `ProfileDropdown` and `LanguageSelector` receive `isOpen` and `onToggle` props from `HeaderClient` instead of managing their own open state. This requires refactoring `LanguageSelector` to accept controlled `isOpen`/`onToggle` props (backward-compatible: keep internal state as fallback when props are not provided).

### ADR-5: No Separate API Route Handlers for Campaign/Awards

The spec predicts `/api/campaign/active` and `/api/awards/categories` as REST endpoints. However, since the Homepage is a Server Component that fetches data directly via Supabase server client (TR-004, TR-007), **Route Handlers are unnecessary for these two resources**. Data flows:

- **Campaign + Awards**: RSC → `services/campaign.ts` / `services/awards.ts` → Supabase server client → DB (no Route Handler)
- **Kudos (initial)**: RSC → `services/kudos.ts` → Supabase server client → DB → passed as prop to KudosLiveBoard (no Route Handler)
- **Kudos (real-time)**: Browser client → Supabase Realtime subscription (no Route Handler)

Route Handlers would only be needed if a **client component** needed to fetch/refetch data independently (e.g., error retry in a client component). To support this:
- **`GET /api/kudos/live`** — Keep this Route Handler for the Kudos error retry scenario (client component can't call server client directly)
- Campaign/Awards error retry can use `router.refresh()` to re-trigger RSC fetch — no Route Handler needed

### Frontend Approach

- **Component Structure**: Feature-based folders under `src/components/home/`, with shared atoms in `src/components/ui/`
- **RSC/Client Split**:
  - **Server Components** (default): Page layout, Hero section wrapper, Awards grid (data fetch), Campaign info, Footer, Header shell
  - **Client Components** (`"use client"`): `CountdownTimer`, `KudosLiveBoard`, `ProfileDropdown`, `LanguageSelector` (existing, refactored), `HeaderClient`, `MobileMenu`
- **Styling Strategy**: TailwindCSS v4 utilities only. Custom color tokens added to `globals.css` `@theme`. No CSS modules needed.
- **Data Fetching**: Server Components fetch campaign + awards + initial kudos data via Supabase server client at render time. Kudos real-time via Supabase Realtime browser client subscription.
- **Image Handling**: `next/image` with responsive `sizes` for award badges; priority loading for hero assets.

### Font Decision

The spec/design-style references "Inter" but the existing codebase uses **Montserrat / Montserrat Alternates** (configured in `layout.tsx` with Vietnamese + Latin subsets). Since Montserrat is already integrated and matches the luxury/premium aesthetic, we will **continue using Montserrat** unless the design team explicitly requires Inter. This avoids font loading changes and Login page regression.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2167-9026-HomepageSAA/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── page.tsx                          # [MODIFY] Replace boilerplate with SAA homepage (RSC)
│   ├── globals.css                       # [MODIFY] Add homepage color tokens to @theme (see Token List below)
│   └── api/
│       └── kudos/
│           └── live/
│               └── route.ts              # [NEW] GET recent kudos (for client-side error retry)
│
├── components/
│   ├── ui/
│   │   ├── icon.tsx                      # [NEW] Reusable Icon component (SVG wrapper per design-style.md)
│   │   └── section-skeleton.tsx          # [NEW] Reusable skeleton loader with shimmer animation
│   ├── header/
│   │   ├── header.tsx                    # [MODIFY] Add variant prop ("login" | "app"), nav links, profile avatar slot
│   │   ├── header-client.tsx             # [NEW] Client wrapper: scroll detection, dropdown coordination, mobile toggle
│   │   ├── language-selector.tsx         # [MODIFY] Add controlled mode (isOpen/onToggle props) for dropdown coordination
│   │   ├── profile-dropdown.tsx          # [NEW] Profile dropdown menu (client component)
│   │   └── mobile-menu.tsx              # [NEW] Hamburger menu for mobile viewport (client component)
│   ├── footer/
│   │   └── footer.tsx                    # [MODIFY] Add variant prop ("login" | "app"), extended links for homepage
│   └── home/
│       ├── hero-section.tsx              # [NEW] "ROOT FURTHER" hero wrapper (RSC) — title, subtitle, countdown, decorative images
│       ├── countdown-timer.tsx           # [NEW] Real-time countdown (client component)
│       ├── campaign-info.tsx             # [NEW] Campaign long-form description section (RSC)
│       ├── awards-grid.tsx               # [NEW] Awards section heading + responsive grid (RSC)
│       ├── award-card.tsx                # [NEW] Individual award card with hover/focus states
│       ├── kudos-section.tsx             # [NEW] Sun* Kudos branding wrapper (RSC)
│       ├── kudos-live-board.tsx          # [NEW] Real-time kudos feed (client component)
│       ├── key-visual.tsx                # [NEW] Decorative background graphics layer (3.5_Keyvisual)
│       └── error-retry.tsx              # [NEW] Reusable error state with retry button (client component — uses useRouter)
│
├── hooks/
│   ├── use-countdown.ts                  # [NEW] Countdown timer logic hook
│   └── use-kudos-stream.ts              # [NEW] Supabase Realtime subscription hook
│
├── services/
│   ├── campaign.ts                       # [NEW] getActiveCampaign() — Supabase server client
│   ├── awards.ts                         # [NEW] getAwardCategories() — Supabase server client
│   └── kudos.ts                          # [NEW] getRecentKudos(limit) — Supabase server client
│
├── types/
│   ├── auth.ts                           # [KEEP] Existing auth types
│   ├── campaign.ts                       # [NEW] Campaign interface
│   ├── awards.ts                         # [NEW] AwardCategory interface
│   └── kudos.ts                          # [NEW] Kudo interface
│
└── utils/
    ├── format.ts                         # [NEW] formatVND(amount: number): string — "7,000,000 VND"
    └── countdown.ts                      # [NEW] calculateTimeLeft(targetDate: Date): { days, hours, minutes, seconds }

# Database
supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_create_homepage_tables.sql  # [NEW] campaigns, award_categories, kudos tables + RLS

# Public Assets
public/
├── images/
│   ├── saa-logo.png                      # [KEEP] Existing
│   ├── root-further.png                  # [KEEP] Existing
│   ├── hero-bg.png                       # [NEW] Hero background visual (or CSS gradient placeholder)
│   ├── keyvisual-bg.png                  # [NEW] Decorative keyvisual overlay
│   └── awards/                           # [NEW] Award badge images
│       ├── top-talent.png
│       ├── best-manager.png
│       ├── best-newcomer.png
│       ├── mvp.png
│       └── ...
├── icons/
│   ├── flag-vn.svg                       # [KEEP] Existing
│   ├── chevron-down.svg                  # [KEEP] Existing
│   ├── google.svg                        # [KEEP] Existing
│   ├── hamburger.svg                     # [NEW] Mobile menu icon
│   └── close.svg                         # [NEW] Mobile menu close icon
└── ...
```

### Token List for globals.css

Add to `@theme inline` block:
```css
--color-navy: #00101A;
--color-surface-dark: #001520;
--color-surface-card: #0A1E2B;
--color-gold: #C8A96E;
--color-gold-light: #E8D5A8;
--color-gold-gradient-start: #F5D98E;
--color-gold-gradient-end: #A67C3D;
--color-countdown-bg: rgba(26, 42, 58, 0.9);
--color-kudos-orange: #FF6B35;
--color-footer-bg: #000D14;
```

**Note**: The existing `--color-background: #ffffff` remains for potential light-theme pages. The homepage overrides at the page level with `bg-navy`.

### Dependencies

**Existing (no changes)**:
- `@supabase/supabase-js` — Realtime subscriptions for Kudos
- `@supabase/ssr` — Server-side data fetching
- `next/image` — Responsive images
- TailwindCSS v4 — All styling

**New devDependency (requires PR justification)**:
| Package | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| `vitest` | latest | Unit/integration test runner | Constitution Principle VI mandates TDD. No test runner currently exists. Vitest is fastest for TypeScript + React, zero-config with Vite. Alternative (Jest) requires heavier configuration. |
| `@testing-library/react` | latest | Component testing utilities | Required for rendering React components in unit tests. Industry standard. |
| `happy-dom` | latest | DOM environment for Vitest | Required by @testing-library/react for component rendering in tests. Lighter and faster than jsdom. |
| `vite-tsconfig-paths` | latest | Path alias resolution in Vitest | Maps `@/*` path aliases from tsconfig.json into Vitest's Vite config. |

---

## Implementation Strategy

### Phase 0: Asset Preparation & Test Setup

**0.1 — Assets**
- Download required UI assets from Figma (hero background, keyvisual, award badges) to `public/` folder
- Organize assets: `public/images/awards/` for badge images, `public/images/` for hero/decorative
- Verify asset quality and naming conventions (kebab-case)
- Placeholder images acceptable initially if Figma export is pending

**0.2 — Test Runner Setup**
- Add `vitest`, `@testing-library/react`, and `happy-dom` to devDependencies
- Create `vitest.config.ts` with: `environment: 'happy-dom'`, path aliases matching `tsconfig.json` (via `vite-tsconfig-paths` plugin)
- Add `"test"` and `"test:watch"` scripts to `package.json`
- Verify test runner works with a trivial test

### Phase 1: Foundation (Types, Services, Database)

**TDD approach**: Write service tests first (expected inputs/outputs), then implement services to pass tests.

**1.1 — Database Schema**
- Create Supabase migration with tables:
  - `campaigns` (id uuid PK, name text, theme text, event_date timestamptz, description text, is_active boolean, created_at timestamptz)
  - `award_categories` (id uuid PK, name text, description text, badge_image_url text, prize_value integer, sort_order integer, created_at timestamptz)
  - `kudos` (id uuid PK, sender_id uuid FK→auth.users, receiver_id uuid FK→auth.users, message text, created_at timestamptz)
- Enable RLS on all tables:
  - `campaigns`: SELECT for authenticated users
  - `award_categories`: SELECT for authenticated users
  - `kudos`: SELECT for authenticated users, INSERT for authenticated users (sender_id = auth.uid())
- Seed initial data (SAA 2025 campaign, 8 award categories with placeholder badge URLs)
- Enable Supabase Realtime on `kudos` table (for live board)

**1.2 — TypeScript Types**
- `src/types/campaign.ts`:
  ```typescript
  export interface Campaign {
    id: string;
    name: string;
    theme: string;
    event_date: string; // ISO 8601
    description: string;
    is_active: boolean;
  }
  ```
- `src/types/awards.ts`:
  ```typescript
  export interface AwardCategory {
    id: string;
    name: string;
    description: string;
    badge_image_url: string;
    prize_value: number;
    sort_order: number;
  }
  ```
- `src/types/kudos.ts`:
  ```typescript
  export interface Kudo {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    created_at: string;
    // Joined fields (from profiles/auth.users)
    sender_name?: string;
    receiver_name?: string;
    sender_avatar_url?: string;
  }
  ```

**1.3 — Service Layer** (write tests first)
- `src/services/campaign.ts`:
  - `getActiveCampaign(): Promise<Campaign | null>` — fetches via Supabase server client, filters `is_active = true`, returns first match or null
- `src/services/awards.ts`:
  - `getAwardCategories(): Promise<AwardCategory[]>` — fetches all, ordered by `sort_order` ascending
- `src/services/kudos.ts`:
  - `getRecentKudos(limit = 20): Promise<Kudo[]>` — fetches latest kudos with sender/receiver names joined, ordered by `created_at` descending

**1.4 — API Route Handler** (only one needed — see ADR-5)
- `src/app/api/kudos/live/route.ts` — GET, returns recent kudos (accepts `?limit=N` query param). Used by KudosLiveBoard client component for error retry/refresh.

**1.5 — Utility Functions** (write tests first)
- `src/utils/format.ts`:
  - `formatVND(amount: number): string` — e.g., `formatVND(7000000)` → `"7,000,000 VND"`
- `src/utils/countdown.ts`:
  - `calculateTimeLeft(targetDate: Date): { days: number; hours: number; minutes: number; seconds: number }` — returns `{ 0, 0, 0, 0 }` when target is past

### Phase 2: Core UI — Header Extension, Hero, Decorative Layers (US1, US4)

**TDD approach**: Write E2E tests for US1 acceptance scenarios and US4 header interactions. Then implement components to pass.

**2.1 — Update Global Styles**
- Add homepage color tokens to `globals.css` `@theme` (see Token List above)
- Add global focus style utility if not covered by Tailwind defaults

**2.2 — Shared UI Components**
- Create `src/components/ui/icon.tsx`: Reusable Icon component wrapping SVGs (per design-style.md requirement: "All icons MUST BE in Icon Component")
- Create `src/components/ui/section-skeleton.tsx`: Skeleton with shimmer animation (keyframes: `shimmer 1.5s infinite`, background gradient sweep)

**2.3 — Refactor Header (ADR-2, ADR-3)**
- **`header.tsx`**: Add `variant` prop (`"login" | "app"`, default `"login"`)
  - `variant="login"`: Current behavior (absolute positioning, logo + lang selector only)
  - `variant="app"`: Renders `<HeaderClient>` wrapper with fixed positioning, nav links, profile avatar, mobile menu
  - Props additions: `navLinks?: { label: string; href: string }[]`, `user?: { name: string; avatar_url: string }`
- **`header-client.tsx`** (new, client component):
  - Manages `isScrolled` state via `useEffect` + scroll event listener
  - Manages `activeDropdown` state (`'profile' | 'language' | null`) for concurrent dropdown coordination (ADR-4)
  - Renders fixed header shell with glassmorphism: `fixed top-0 w-full z-50 backdrop-blur-sm bg-navy/95`
  - Scrolled state: `bg-navy shadow-[0_2px_8px_rgba(0,0,0,0.3)]`
  - Passes controlled `isOpen`/`onToggle` to ProfileDropdown and LanguageSelector
- **`language-selector.tsx`** (modify): Add optional `isOpen`/`onToggle` props for controlled mode. When provided, use props; when not provided (Login page), use internal state as before. Backward-compatible.
- **`mobile-menu.tsx`** (new, client component): Hamburger icon toggle, slide-in nav panel for mobile. Rendered only in `variant="app"` header via `md:hidden`.
  - ARIA: Hamburger button `aria-expanded={isOpen}`, `aria-label="Toggle navigation"`, `aria-controls="mobile-nav"`
  - Menu panel: `id="mobile-nav"`, `aria-label="Mobile navigation"`, focus trap when open (first focusable item receives focus on open, Tab cycles within panel, Escape closes)
  - Closes on: click outside, Escape key, nav link click (navigated away)

**2.4 — Create ProfileDropdown**
- `src/components/header/profile-dropdown.tsx` (client component)
- Follow LanguageSelector pattern: controlled `isOpen`/`onToggle` from HeaderClient
- Displays user avatar, name, menu items (profile, settings, logout)
- ARIA: `aria-expanded`, `aria-haspopup="true"`, focus trap
- Closes on click outside, Escape key

**2.5 — Decorative Background Layers**
- Create `src/components/home/key-visual.tsx`: Renders `3.5_Keyvisual` and `Cover` as decorative background elements
  - Uses `absolute inset-0 pointer-events-none` positioning
  - `aria-hidden="true"` (purely decorative)
  - Hero background image (`public/images/hero-bg.png`) or CSS gradient fallback
  - Keyvisual overlay (`public/images/keyvisual-bg.png`) or decorative CSS patterns
  - `next/image` with `fill` and `priority` for hero background

**2.6 — Hero Section**
- Create `src/components/home/hero-section.tsx` (server component wrapper)
  - "ROOT FURTHER" title: gold gradient text (`bg-gradient-to-b from-[#F5D98E] to-[#A67C3D] bg-clip-text text-transparent`)
  - Subtitle text (16px, secondary color)
  - Passes `event_date` to CountdownTimer
  - Campaign badges/decorative images
  - **Loading state**: Skeleton placeholder for title + countdown (FR-011)
  - **Error state**: "Unable to load campaign" with retry via `router.refresh()` (FR-012)
  - **No active campaign**: Display "Coming soon — stay tuned for SAA 2025!" message in place of countdown (edge case)
- Hero entrance animation: fade-in + translateY on page load (respects `prefers-reduced-motion`)

**2.7 — Countdown Timer**
- Create `src/components/home/countdown-timer.tsx` (client component)
- Create `src/hooks/use-countdown.ts`:
  - Accepts `targetDate: string` (ISO 8601)
  - Returns `{ days, hours, minutes, seconds, isExpired }`
  - Uses `setInterval(1000)` with drift compensation (`Date.now()` comparison, not naive decrement)
  - Cleans up interval on unmount
- Display: 4 boxes (80×80px desktop, 56×56px mobile) with number + label
- `role="timer"` + `aria-live="polite"` + `aria-label="Countdown to SAA 2025 event"`
- Screen reader throttle: Update `aria-live` content every 60 seconds (not every tick)
- Respect `prefers-reduced-motion`: skip tick animation, only update number
- When `isExpired`: display "Event Started" text in place of countdown boxes

**2.8 — Campaign Info Section**
- Create `src/components/home/campaign-info.tsx` (server component)
- Renders long-form campaign description text from `campaign.description`
- Layout: `max-w-[800px] mx-auto px-6 py-12`, text `16px/400/#FFFFFF`
- Supports rich text if `description` contains markdown (future-proofing) or plain paragraphs

**2.9 — Homepage Page Composition**
- Replace `src/app/page.tsx` boilerplate with Homepage layout
- Verify auth via Supabase server client (get user for profile avatar — middleware already protects route)
- Fetch campaign data via `getActiveCampaign()`
- Fetch awards data via `getAwardCategories()`
- Fetch initial kudos via `getRecentKudos()`
- Handle null campaign (no active campaign edge case)
- Compose layout:
  ```
  <main className="relative min-h-screen bg-navy overflow-hidden">
    <KeyVisual />                      {/* Decorative backgrounds */}
    <Header variant="app" user={user} navLinks={NAV_LINKS} />
    <div className="pt-16">           {/* Offset for 64px fixed header */}
      <HeroSection campaign={campaign} />
      <CampaignInfo description={campaign?.description} />
      <AwardsGrid categories={categories} />
      <KudosSection initialKudos={kudos} />
      <Footer variant="app" />
    </div>
  </main>
  ```
- **Important**: The `pt-16` (64px) offset prevents content from being hidden behind the fixed header. This matches the header height specified in design-style.md.

### Phase 3: Awards System (US2)

**TDD approach**: Write tests for AwardCard rendering (all fields visible, hover classes), then implement.

**3.1 — Awards Grid**
- Create `src/components/home/awards-grid.tsx` (server component)
- Section heading: "Hệ thống giải thưởng" with `<h2 id="awards-heading">` and `<section aria-labelledby="awards-heading">`
- Responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6`
- **Loading state**: 4-8 skeleton cards using `section-skeleton.tsx`
- **Error state**: `error-retry.tsx` with "Unable to load awards" message and retry button (`router.refresh()`)
- **Empty state**: "No awards configured yet" centered message

**3.2 — Award Card**
- Create `src/components/home/award-card.tsx`
- Displays: badge image (via `next/image`, `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"`), title (#C8A96E, 18px/700), description (#B0BEC5, 14px/400, `line-clamp-2`), prize value (#FFFFFF, 16px/700, formatted via `formatVND()`)
- Semantic: `<article aria-label="{award.name} award">`. **Not a link** — award detail pages are TBD/out of scope. Cards are display-only for now. When detail pages are implemented, wrap card content in `<Link href="/awards/{id}">`. Do not add `tabIndex={0}` to non-interactive cards; they remain in tab order only via focusable children (if any) or are skipped.
- States:
  - Default: `bg-surface-card border border-gold/30 rounded-xl p-4`
  - Hover: `hover:border-gold/60 hover:shadow-[0_0_20px_rgba(200,169,110,0.15)] hover:-translate-y-0.5`
  - Focus: `focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2`
  - Active: `active:translate-y-0 active:border-gold/80`
- Image error: `onError` handler → replace `src` with placeholder badge, show award name as alt text
- Skeleton variant: shimmer animation matching card dimensions
- Transitions respect `prefers-reduced-motion: reduce` (no transform, instant state changes)

**3.3 — Error Retry Component**
- Create `src/components/home/error-retry.tsx` (`"use client"` — uses `useRouter` for `router.refresh()`)
- Props: `message: string`, `onRetry?: () => void` (defaults to `router.refresh()` if not provided)
- Used by Awards grid, Hero section, Kudos section
- Styled with gold border, retry button matching design system

### Phase 4: Kudos Section & Live Board (US3)

**TDD approach**: Write tests for initial kudos render, empty state, disconnect indicator.

**4.1 — Kudos Section**
- Create `src/components/home/kudos-section.tsx` (server component wrapper)
- Section heading: "Sun* Kudos" with `<section aria-labelledby="kudos-heading">`
- "#KUDOS" branding text with orange (#FF6B35) accent
- Passes `initialKudos` prop to KudosLiveBoard

**4.2 — Kudos Live Board**
- Create `src/components/home/kudos-live-board.tsx` (client component)
- Create `src/hooks/use-kudos-stream.ts`:
  - Uses Supabase browser client (`@/libs/supabase/client`) to subscribe to `kudos` table changes
  - `channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'kudos' }, callback)`
  - Prepends new kudos to local state array
  - Returns `{ kudos, isConnected, error }`
  - Handles disconnect: `isConnected = false` → show "Reconnecting..." indicator
  - Handles 401 (session expired): show "Session expired" prompt with link to `/login`
  - Cleanup: unsubscribe on unmount
- Initial data: `initialKudos` prop from server
- Display: scrollable feed of kudos entries (sender avatar, name, → receiver name, message, timestamp)
- `aria-live="polite"` on the feed container for new kudos announcements
- **Loading state**: Pulsing skeleton feed
- **Error state**: "Live board unavailable" + stale data visible + retry button (calls `GET /api/kudos/live`)
- **Empty state**: "No kudos yet — be the first!"

### Phase 5: Responsive & Accessibility (US5)

**5.1 — Responsive Verification**
- **Mobile (<768px)**:
  - Awards grid: `grid-cols-1` (or `grid-cols-2` if cards fit)
  - Hero title: `text-4xl` (36px) instead of `text-7xl` (72px)
  - Countdown boxes: 56×56px, number 24px
  - Header: hamburger menu (MobileMenu), hide nav links
  - Section titles: 24px
  - Campaign text: 14px, `px-4`
  - Footer: stacked vertically, `text-center`
- **Tablet (768-1023px)**:
  - Awards grid: `md:grid-cols-2`
  - Hero title: `md:text-5xl` (48px)
  - Header: compact nav, `px-6`
- **Desktop (≥1024px)**:
  - Awards grid: `lg:grid-cols-4`
  - Full hero title: `lg:text-7xl` (72px)
  - Full header with all nav links visible
  - Container: `max-w-[1512px] mx-auto`
- **Verify**: No horizontal scrollbar at 375px, 768px, 1024px, 1440px

**5.2 — Accessibility Audit**
- Keyboard navigation: Tab through all interactive elements in logical reading order
  - Header: Logo → Nav links → Profile avatar → Language selector
  - Hero: Countdown (non-interactive, `role="timer"`)
  - Awards: Cards are non-interactive (display-only) — not in tab order. When detail pages are added, cards become `<Link>` elements and enter tab order naturally
  - Kudos: Feed items (read-only)
  - Footer: Footer links
- ARIA labels (as specified in spec.md):
  - `<nav aria-label="Main navigation">`
  - `<div role="timer" aria-live="polite" aria-label="Countdown to SAA 2025 event">`
  - `<section aria-labelledby="awards-heading">`
  - `<article aria-label="{award.name} - {award.prize_value} VND">`
  - `<section aria-labelledby="kudos-heading">`, `aria-live="polite"` on feed
  - ProfileDropdown: `aria-expanded`, `aria-haspopup="true"`
  - LanguageSelector: `aria-expanded`, `aria-haspopup="listbox"` (already implemented)
- Focus indicators: `2px solid #C8A96E`, offset 2px (global focus style)
- Touch targets: minimum 44×44px on all interactive elements
- `prefers-reduced-motion: reduce`: disable hero entrance, scroll-reveal, card hover transform, countdown tick animation
- Screen reader: countdown `aria-live` throttled to 60s

**5.3 — Scroll-Reveal Animation**
- Implement scroll-triggered entrance animation for major sections (Campaign Info, Awards Grid, Kudos Section)
- Approach: Use `IntersectionObserver` in a reusable `"use client"` wrapper component (e.g., `<ScrollReveal>`) or via CSS `@starting-style` / `animation-timeline: view()` if browser support is sufficient
- Animation: `opacity: 0 → 1`, `translateY(20px) → 0`, `400ms ease-out` (matches design-style.md Animation table)
- MUST respect `prefers-reduced-motion: reduce` — skip animation, render immediately visible
- Apply to: `<CampaignInfo>`, `<AwardsGrid>`, `<KudosSection>` wrappers
- NOTE: If `IntersectionObserver` approach is used, this adds one more client component (`ScrollReveal`). Alternatively, use CSS-only `animation-timeline: view()` (modern browsers only) for zero JS overhead.

**5.4 — Performance**
- LCP target: <2.5s on 4G (TR-001)
- `priority` on hero background image and "ROOT FURTHER" visual
- `loading="lazy"` on award badge images (below fold)
- Minimize client bundle: only 6 small client components
- RSC streamed rendering for progressive load

### Phase 6: Polish & Edge Cases

All edge cases from spec.md with implementation strategy:

| Edge Case | Strategy | Phase Implemented |
|-----------|----------|-------------------|
| Countdown reaches zero | `isExpired` flag in `useCountdown` → render "Event Started" text | Phase 2.7 |
| Awards API failure | `try/catch` in RSC → `error-retry.tsx` with `router.refresh()` | Phase 3.1 |
| Kudos WebSocket disconnect | `isConnected` flag in `useKudosStream` → "Reconnecting..." indicator + stale data | Phase 4.2 |
| Award image load failure | `onError` handler on `next/image` → swap to placeholder src | Phase 3.2 |
| Long award descriptions | `line-clamp-2` on description text | Phase 3.2 |
| Session expiry on homepage | Middleware redirects on next navigation; Kudos stream detects 401 → "Session expired" prompt | Phase 4.2 |
| No active campaign | `getActiveCampaign()` returns null → "Coming soon" message, hide countdown | Phase 2.6 |
| JS disabled | RSC sections (header, awards, footer) render via SSR; countdown shows server-rendered static values; kudos shows initial batch | Phase 2.7, 4.2 |
| Concurrent dropdowns | `activeDropdown` state in HeaderClient coordinates both dropdowns | Phase 2.3 (ADR-4) |

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Header nav → page navigation, ProfileDropdown + LanguageSelector coordination, MobileMenu toggle
- [x] **External dependencies**: Supabase auth session, Supabase data queries, Supabase Realtime
- [x] **Data layer**: Campaign/Awards/Kudos queries, RLS policy enforcement
- [x] **User workflows**: Login → Homepage → Browse awards → View kudos

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Countdown timer accuracy, dropdown toggling, awards grid rendering, mobile menu |
| Service ↔ Service | Yes | Auth middleware → page render, campaign service → hero section |
| App ↔ External API | Yes | Supabase data fetching, Supabase Realtime subscription |
| App ↔ Data Layer | Yes | Campaign/Awards/Kudos queries, RLS policy enforcement |
| Cross-platform | Yes | Responsive layout at 375px, 768px, 1024px, 1440px |

### Test Environment

- **Environment type**: Local (Supabase local dev via `supabase start`) + Staging
- **Test data strategy**: Supabase seed files with known campaign, 8 awards, 10 kudos entries
- **Isolation approach**: Fresh Supabase local instance; transaction rollback for integration tests

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth | Mock (unit) / Real (E2E) | Unit tests mock session; E2E uses real OAuth flow |
| Supabase DB | Real (local) | Local Supabase instance for accurate query testing |
| Supabase Realtime | Mock (unit) / Real (E2E) | Unit tests mock channel subscription; E2E verifies real-time |
| next/image | Stub (unit) | Test rendering and props, not image optimization |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Authenticated user sees full homepage (hero, countdown, awards, kudos, header, footer)
   - [ ] Countdown timer decrements every second without layout shift
   - [ ] Awards grid displays all categories with correct data (image, title, description, price)
   - [ ] Header navigation links render and route correctly
   - [ ] Profile dropdown opens/closes correctly
   - [ ] Language selector works on homepage (controlled mode)
   - [ ] Mobile hamburger menu toggles nav panel

2. **Error Handling**
   - [ ] Unauthenticated user redirected to `/login`
   - [ ] Campaign fetch failure shows error state + retry
   - [ ] Awards fetch failure shows error state + retry
   - [ ] Kudos stream disconnect shows reconnecting indicator
   - [ ] Session expiry during Kudos stream shows "Session expired" prompt

3. **Edge Cases**
   - [ ] Countdown reaches zero → "Event Started"
   - [ ] No active campaign → "Coming soon" message
   - [ ] Empty awards list → "No awards configured yet"
   - [ ] Empty kudos list → "No kudos yet — be the first!"
   - [ ] Award image fails to load → placeholder shown
   - [ ] Long award descriptions truncated with ellipsis
   - [ ] Opening profile dropdown closes language dropdown (and vice versa)

### Tooling & Framework

- **Test framework**: Playwright (E2E), Vitest + @testing-library/react (unit/integration)
- **Supporting tools**: Supabase CLI (local dev)
- **CI integration**: GitHub Actions — lint → type-check → unit tests (vitest) → build → E2E (playwright) before merge

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (E2E) | All P1 stories (US1, US2, US4) | High |
| Services (campaign, awards, kudos) | 80%+ | High |
| Hooks (useCountdown, useKudosStream) | 80%+ | High |
| Utils (formatVND, calculateTimeLeft) | 90%+ | Medium |
| Component rendering | 70%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase Realtime not edge-compatible | Medium | High | Realtime runs client-side only (browser client), not on edge. If issues arise, fallback to polling `GET /api/kudos/live` every 30s |
| Design token values are estimated (no Figma Dev Mode) | High | Medium | Add "visual review needed" label in PR; iterate with design team; use screenshot comparison |
| Hero background assets not available from Figma | Medium | Medium | CSS gradient placeholder (`radial-gradient` mimicking the dark-to-navy effect); replace with real assets when provided |
| Font mismatch (spec says Inter, codebase uses Montserrat) | Low | Low | Keep Montserrat; confirm with design team; swap is a single-file change in `layout.tsx` |
| Kudos/Campaign tables don't exist in production | High | Medium | Migration created in Phase 1; seed test data; for staging, run migration before deploy |
| Header refactor breaks Login page | Medium | High | `variant` prop with default `"login"` ensures zero-change for Login. Manual regression test Login after header changes |
| Adding Vitest as new dependency | Low | Low | Required by Constitution Principle VI (TDD). Justified: no test runner exists. devDependency only — no production impact |
| LanguageSelector refactor (controlled mode) breaks Login | Medium | Medium | Controlled mode is opt-in (props optional). When no `isOpen`/`onToggle` passed, uses internal state as before. Write regression test for Login |

### Estimated Complexity

- **Frontend**: Medium-High (6 client components, responsive grid, real-time feed, header refactor)
- **Backend**: Low (1 Route Handler, 3 service functions, 1 DB migration)
- **Testing**: Medium (E2E for P1 stories, unit tests for hooks/services/utils)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders
- [x] `design-style.md` created with visual specifications
- [ ] Vitest + @testing-library/react added to devDependencies (Phase 0)
- [ ] Figma assets exported (hero background, award badges) — can use placeholders initially
- [ ] Supabase local dev environment running (`supabase start`)
- [ ] Database migration created and applied locally (Phase 1.1)

### External Dependencies

- **Supabase**: Auth (existing), Database (new tables needed), Realtime (for Kudos — must be enabled on `kudos` table)
- **Figma**: Asset export for hero visuals and award badge images
- **Design Team**: Confirmation on font choice (Montserrat vs Inter), countdown-at-zero behavior, no-active-campaign state

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following phase order (Phase 0 → Phase 6)

---

## Notes

- The `src/app/page.tsx` currently contains Next.js boilerplate — it will be completely replaced with the Homepage SAA implementation.
- The existing Header and Footer components are **extended via `variant` prop**, not replaced. The Login page continues to work with `variant="login"` (default). See ADR-2.
- Supabase Realtime for Kudos runs on the browser client (`src/libs/supabase/client.ts`), not the server client. This is Constitution-compliant (Principle III: browser client only for real-time). See ADR-1.
- All 8 open questions from spec.md should ideally be resolved before Phase 4+ but do not block Phase 1-3. The "no active campaign" case is handled with a "Coming soon" fallback.
- The countdown timer uses drift-compensated `setInterval` (compares against `Date.now()` each tick) for accuracy over long durations.
- `/api/campaign/active` and `/api/awards/categories` Route Handlers from the spec are **intentionally omitted** — RSC fetches data directly via services. See ADR-5.
