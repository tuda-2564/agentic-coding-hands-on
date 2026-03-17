# Implementation Plan: Countdown — Prelaunch Page

**Frame**: `2268:35127-CountdownPrelaunchPage`
**Date**: 2026-03-13
**Spec**: `specs/2268-35127-CountdownPrelaunchPage/spec.md`

---

## Summary

Build a fullscreen prelaunch countdown page that replaces the normal homepage when the campaign's `event_date` is in the future. The page shows glass-morphism digit cards with LED-style font on top of artistic background imagery. It must be accessible to **all visitors** (authenticated and unauthenticated) and automatically redirect to the homepage when the countdown expires.

**Key technical challenge**: The current middleware redirects unauthenticated users on `/` to `/login`. We need to allow unauthenticated access to `/` when the event hasn't started.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4, Supabase SSR
**Database**: Supabase (PostgreSQL) — existing `campaigns` table
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: Local state via `useCountdown` hook (existing)
**API Style**: Server Component data fetching (direct Supabase query via RSC)
**Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case files, PascalCase components, `@/*` imports)
- [x] Uses approved libraries and patterns (no new dependencies)
- [x] Adheres to folder structure guidelines (`src/components/`, `src/app/`)
- [x] Meets security requirements (no secrets, Supabase SSR cookies)
- [x] Follows testing standards (unit + E2E for P1 stories)
- [x] Mobile-first responsive design (3 breakpoints)
- [x] RSC by default, `"use client"` only for countdown tick logic
- [x] `next/image` with `priority` for background image

**Violations**: None — no new runtime dependencies required.

---

## Architecture Decisions

### Routing Strategy

**Decision**: Handle prelaunch check inside `src/app/page.tsx`, not a separate route.

The spec states the prelaunch page "replaces the normal Homepage SAA." To enable unauthenticated access:

1. **Modify `middleware.ts`**: Allow the `/` route through without auth check. Add `/` to the public-like handling — let page.tsx manage auth internally.
2. **Modify `src/app/page.tsx`**: Restructure to:
   - First, fetch campaign (no auth needed — Supabase anon key allows public table reads)
   - If `event_date` is in the future → render `<PrelaunchCountdown>` (no auth check)
   - If `event_date` is past, no campaign, or campaign fetch fails → check auth, redirect to `/login` if unauthenticated, render homepage if authenticated
   - **Error resilience**: If `getActiveCampaign()` throws (RLS issue, network error), treat as "no active campaign" and fall through to auth check

**Why not a separate `/countdown` route?**: The spec says it "replaces" the homepage at `/`. A separate route would change the URL and require additional redirect logic.

### Frontend Approach

- **Component Structure**: Single page component `<PrelaunchCountdown>` with sub-components: `<DigitCard>`, `<CountdownUnit>`
- **Styling Strategy**: Tailwind utilities matching design-style.md tokens; inline `style` for gradient background only (too complex for Tailwind)
- **Data Fetching**: Campaign fetched server-side in page.tsx via existing `getActiveCampaign()` service
- **Client/Server Split**:
  - Server: page.tsx (RSC) — fetches campaign, renders initial countdown values, decides prelaunch vs homepage
  - Client: `<PrelaunchCountdown>` — wraps the countdown with `useCountdown` hook for live ticking + redirect on expiry
- **Redirect on Expiry**: When `isExpired` becomes `true`, use `router.refresh()` (NOT `router.push('/')` which would be a no-op since we're already at `/`). This triggers RSC re-render — page.tsx will see `event_date` in the past and render the homepage instead.

### Custom Font: "Digital Numbers"

**Decision**: Load "Digital Numbers" as a local font via `next/font/local`.

- Download the font file (`.woff2`) and place in `src/fonts/digital-numbers.woff2` (NOT `public/` — `next/font/local` loads relative to the importing file)
- Register at module scope in `src/components/countdown/prelaunch-countdown.tsx` (NOT `layout.tsx` — avoids loading the font on every page)
- Apply font className directly to the prelaunch component's root div
- Expose as CSS variable `--font-digital` via the font's `variable` option
- Add `--font-digital` to `@theme` in `globals.css` so Tailwind can use `font-digital`
- Fallback: `"Courier New", monospace` with `font-variant-numeric: tabular-nums`

**Why local, not Google Fonts?**: "Digital Numbers" is not on Google Fonts. It's a specialty LED display font.
**Why not in layout.tsx?**: The font is only used on the prelaunch page. Registering in layout.tsx would add it to every page's bundle.

### Background Image

- Download from Figma via `get_media_files` tool (tagged `MM_MEDIA_BG`)
- Place in `public/images/prelaunch-bg.png` (or `.webp` if available)
- Use `next/image` with `fill`, `priority`, `sizes="100vw"` for optimized loading
- Fallback: page background `#00101A` (renders immediately before image loads)

### Glass-morphism Digit Cards

Per design-style.md review, the correct implementation:
- Background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)` — opacity baked into rgba
- Border: `0.75px solid rgba(255,234,158,0.5)` — gold at 50% opacity
- Backdrop: `backdrop-blur-[25px]`
- **Do NOT** use `opacity-50` on the container (would make digit text semi-transparent)

### Integration Points

- **Existing Services**: `getActiveCampaign()` from `src/services/campaign.ts`
- **Existing Hooks**: `useCountdown()` from `src/hooks/use-countdown.ts`
- **Existing Utils**: `calculateTimeLeft()` from `src/utils/countdown.ts`
- **Existing Types**: `Campaign` from `src/types/campaign.ts`
- **No new API endpoints** — direct Supabase query in RSC

---

## Project Structure

### Documentation

```text
.momorph/specs/2268-35127-CountdownPrelaunchPage/
├── spec.md              # Feature specification ✅
├── design-style.md      # Visual specs ✅
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma reference ✅
```

### New Files

| File | Purpose |
|------|---------|
| `src/components/countdown/prelaunch-countdown.tsx` | Main prelaunch page client component (countdown logic + redirect + font registration) |
| `src/components/countdown/digit-card.tsx` | Glass-morphism single digit card component |
| `src/components/countdown/countdown-unit.tsx` | Unit group: 2 digit cards + label (DAYS/HOURS/MINUTES) |
| `src/fonts/digital-numbers.woff2` | LED-style custom font file (for `next/font/local`) |
| `public/images/prelaunch-bg.png` | Background artwork from Figma |
| `src/components/countdown/__tests__/prelaunch-countdown.test.tsx` | Unit tests for prelaunch countdown component |
| `src/components/countdown/__tests__/digit-card.test.tsx` | Unit tests for digit card component |

### Modified Files

| File | Changes |
|------|---------|
| `middleware.ts` | Add `/` to `PUBLIC_ROUTES` array so unauthenticated users reach page.tsx (which handles auth internally post-event) |
| `src/app/page.tsx` | Restructure: fetch campaign first → if prelaunch render `<PrelaunchCountdown>` → else check auth + render homepage. Wrap campaign fetch in try/catch. |
| `src/app/globals.css` | Add `--font-digital: var(--font-digital)` in `@theme` block for Tailwind `font-digital` class |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| — | — | No new dependencies. All existing packages suffice. |

---

## CSS Change Map

### globals.css additions

```css
@theme {
  /* Add to existing @theme block */
  --font-digital: var(--font-digital);
}
```

### Key Tailwind Classes per Component

| Component | Tailwind Classes |
|-----------|-----------------|
| Page Container | `relative w-full min-h-screen bg-[#00101A] overflow-hidden` |
| BG Image | `absolute inset-0 z-0 object-cover` (via `next/image fill`) |
| Gradient Overlay | `absolute inset-0 z-[1]` + inline `style` for 18deg gradient |
| Content Section | `relative z-[2] flex flex-col items-center justify-center min-h-screen px-6 py-12 md:px-12 md:py-16 lg:px-[144px] lg:py-[96px]` |
| Countdown Container | `flex flex-col items-center gap-6` |
| Title | `font-bold text-xl leading-7 md:text-[28px] lg:text-4xl lg:leading-[48px] text-white text-center` |
| Timer Row | `flex flex-row items-center gap-4 md:gap-8 lg:gap-[60px]` |
| Countdown Unit | `flex flex-col items-center gap-[21px] w-auto lg:w-[175px]` |
| Digit Pair Row | `flex flex-row items-center gap-3 lg:gap-[21px]` |
| Digit Card | `w-12 h-[77px] md:w-[60px] md:h-[96px] lg:w-[77px] lg:h-[123px] rounded-xl flex items-center justify-center backdrop-blur-[25px] border-[0.75px] border-[rgba(255,234,158,0.5)]` + inline gradient bg |
| Digit Text | `font-digital text-[46px] md:text-[57px] lg:text-[73.73px] text-white` |
| Unit Label | `font-bold text-base leading-6 md:text-2xl lg:text-4xl lg:leading-[48px] text-white uppercase` |

---

## Implementation Strategy

### Phase Breakdown

1. **Phase 0: Asset Preparation** — Download BG image from Figma, acquire Digital Numbers font
2. **Phase 1: Foundation** — Register custom font, add CSS variables, update middleware
3. **Phase 2: Core UI (US1)** — Build DigitCard, CountdownUnit, PrelaunchCountdown components
4. **Phase 3: Integration (US2)** — Wire into page.tsx, implement redirect on expiry, handle prelaunch vs homepage logic
5. **Phase 4: Responsive (US3)** — Mobile/tablet breakpoints
6. **Phase 5: Polish** — Animations, accessibility, edge cases, tests

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| "Digital Numbers" font unavailable or license issue | Medium | Medium | Fallback to `"Courier New", monospace` with `tabular-nums`. Font can be replaced later. |
| Middleware change breaks auth on other routes | Low | High | Only change behavior for exact `/` path. Other routes unaffected. Add integration test. |
| Glass-morphism not rendering on older browsers | Low | Low | `backdrop-filter` has 96%+ browser support. Fallback: solid semi-transparent bg. |
| Background image too large for 3G | Medium | Medium | Use `next/image` with WebP format, `priority` flag, `sizes="100vw"`. Fallback bg color. |
| Campaign RLS blocks unauthenticated reads | Low | High | Verify RLS policy allows anon reads on `campaigns` table. If blocked, add a public API route. |

### Estimated Complexity

- **Frontend**: Medium (glass-morphism + custom font + responsive)
- **Backend**: Low (no new APIs, minimal middleware change)
- **Testing**: Low (mostly static UI, one redirect behavior)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: PrelaunchCountdown ↔ useCountdown hook ↔ redirect
- [x] **Data layer**: Campaign fetch determines prelaunch vs homepage
- [x] **User workflows**: Visit `/` → see countdown or homepage based on campaign date

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Countdown ticks, redirect on expiry |
| App ↔ Data Layer | Yes | Campaign fetch, event_date comparison |
| Cross-platform | Yes | Mobile/tablet/desktop responsive |

### Test Environment

- **Environment type**: Local dev server (Vitest for unit, Playwright for E2E)
- **Test data strategy**: Mock campaign with configurable `event_date`
- **Isolation approach**: Mock Supabase responses in unit tests; seed test data for E2E

### Test Scenarios Outline

1. **Happy Path**
   - [x] Page renders countdown when event_date is in the future
   - [x] Countdown displays correct DAYS, HOURS, MINUTES values
   - [x] Redirect to homepage when countdown expires

2. **Error Handling**
   - [x] No active campaign → show homepage (not countdown)
   - [x] Campaign without event_date → show homepage

3. **Edge Cases**
   - [x] Event already started → immediate redirect / show homepage
   - [x] Event exactly at current time → transition gracefully
   - [x] Unauthenticated user sees countdown (no login redirect)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core countdown logic | 80%+ | High |
| Component rendering | 70%+ | Medium |
| E2E (P1 user stories) | Key flows | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] `design-style.md` reviewed and corrected
- [ ] "Digital Numbers" font file acquired (`.woff2`)
- [ ] Background image downloaded from Figma (`MM_MEDIA_BG`)

### External Dependencies

- "Digital Numbers" font — free/open-source LED display font (download from font repository)
- Figma background image — download via `get_media_files` MoMorph tool

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `useCountdown` hook returns `{ days, hours, minutes, seconds, isExpired }` — we ignore `seconds` and use `isExpired` for redirect trigger.
- The existing `CountdownTimer` widget (`src/components/home/countdown-timer.tsx`) is a small inline widget for the homepage. The prelaunch page is a completely different fullscreen design — no code reuse except the shared hook.
- Montserrat font is already loaded in layout.tsx — the title and labels use it directly.
- The page must work without JavaScript for initial render (SSR). The countdown ticking and redirect are progressive enhancements via the client component.
- No header or footer on this page — the `PrelaunchCountdown` component renders standalone, outside the normal page shell.
