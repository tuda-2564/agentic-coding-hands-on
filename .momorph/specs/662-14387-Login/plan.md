# Implementation Plan: Login

**Frame**: `662-14387-Login`
**Date**: 2026-03-09
**Spec**: `specs/662-14387-Login/spec.md`

---

## Summary

Build a full-page hero Login screen for SAA 2025 that authenticates users exclusively via
Google OAuth using Supabase Auth. The page is a React Server Component with a minimal
`"use client"` button component. A Next.js middleware protects all routes and redirects
unauthenticated users to `/login`. A new `/auth/callback` route handler completes the
OAuth exchange and establishes a Supabase session in `HttpOnly` cookies.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, `@supabase/ssr`, `@supabase/supabase-js`
**Database**: Supabase Auth (managed — no custom tables needed for login)
**Testing**: Playwright (E2E), Jest/Vitest (unit + integration)
**State Management**: Local component state only (`isLoading`, `error`, `isLangDropdownOpen`)
**API Style**: Supabase Auth built-ins + Next.js Route Handler (`/auth/callback`)
**Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, kebab-case files, PascalCase components)
- [x] Uses approved libraries only — no new runtime dependencies required
- [x] Adheres to folder structure (`src/app/`, `src/components/`, `src/libs/`, `src/types/`)
- [x] Meets security requirements (OWASP A07: `HttpOnly` cookies via `@supabase/ssr`; no secrets in client code)
- [x] Follows testing standards (unit + E2E for P1 user story)

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/login/`, `src/components/header/`, `src/components/footer/`
- **Styling Strategy**: TailwindCSS v4 utility classes; Tailwind arbitrary values for design tokens (`bg-[#00101A]`, `text-[22px]`, etc.)
- **Data Fetching**: Server Component reads session via `src/libs/supabase/server.ts` and redirects; no client-side data fetching on this page
- **RSC vs Client split**:
  - `LoginPage` (RSC) — server-side session check + static layout
  - `LoginButton` (`"use client"`) — owns `isLoading`, `error`, calls `signInWithOAuth`
  - `LanguageSelector` (`"use client"`) — owns `isLangDropdownOpen` dropdown toggle
  - All other components (Header, HeroSection, Footer) — RSC

### Backend Approach

- **OAuth flow**: Redirect-based (not popup) via `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '<origin>/auth/callback' } })`
- **Callback handler**: `src/app/auth/callback/route.ts` — exchanges OAuth `code` for session, sets `HttpOnly` cookies, redirects to `/` on success or `/login?error=<code>` on failure
- **Middleware**: `middleware.ts` at project root — checks Supabase session; redirects unauthenticated users to `/login`; redirects authenticated users away from `/login` to `/`
- **Data Access**: Direct Supabase Auth SDK calls; no custom tables

### Integration Points

- **Existing**: `src/libs/supabase/server.ts`, `src/libs/supabase/middleware.ts`, `src/libs/supabase/client.ts` — all pre-configured, no changes needed
- **New**: `middleware.ts` (root) wraps the existing `createClient` from `src/libs/supabase/middleware.ts`
- **Fonts**: `layout.tsx` updated to load Montserrat + Montserrat Alternates via `next/font/google`

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/662-14387-Login/
├── spec.md              ✅ Complete
├── design-style.md      ✅ Complete
├── plan.md              ← This file
└── tasks.md             ← Next step
```

### Source Code (new files to create)

```text
middleware.ts                                  # Next.js middleware (session guard)

src/
├── app/
│   ├── layout.tsx                             # MODIFY: add Montserrat fonts
│   ├── globals.css                            # MODIFY: add font CSS vars
│   ├── login/
│   │   └── page.tsx                           # Login page (RSC)
│   └── auth/
│       └── callback/
│           └── route.ts                       # OAuth callback route handler
│
├── components/
│   ├── login/
│   │   ├── hero-section.tsx                   # Hero content (RSC): key visual + description + LoginButton
│   │   ├── login-button.tsx                   # "LOGIN With Google" button (client)
│   │   ├── error-message.tsx                  # Inline error display (client)
│   │   └── spinner.tsx                        # Loading spinner
│   ├── header/
│   │   ├── header.tsx                         # Page header (RSC)
│   │   └── language-selector.tsx              # Language toggle button (client)
│   └── footer/
│       └── footer.tsx                         # Copyright footer (RSC)
│
└── types/
    └── auth.ts                                # Auth-related TypeScript types

public/
├── images/
│   ├── saa-logo.png                           # SAA 2025 logo (node: I662:14391;178:1033;178:1030)
│   ├── root-further.png                       # ROOT FURTHER key visual (node: 2939:9548)
│   └── login-bg.png                           # Background artwork (node: 662:14389)
└── icons/
    ├── google.svg                             # Google icon (node: I662:14426;186:1766)
    ├── flag-vn.svg                            # VN flag (node: I662:14391;186:1696;186:1821;186:1709)
    └── chevron-down.svg                       # Chevron (node: I662:14391;186:1696;186:1821;186:1441)
```

### Files to Modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `Montserrat` + `Montserrat_Alternates` from `next/font/google`; update metadata title |
| `src/app/globals.css` | Add `--font-montserrat` and `--font-montserrat-alt` CSS variables; keep existing vars |

### New Dependencies

Unit testing is not yet configured. Add the following **dev dependencies** during Phase 1:

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (Vite-native, React 19 compatible) |
| `@vitejs/plugin-react` | React JSX transform for Vitest |
| `jsdom` | DOM environment for component tests |
| `@testing-library/react` | React component testing utilities |
| `@testing-library/user-event` | User interaction simulation |
| `@testing-library/jest-dom` | Custom DOM matchers |

Install: `yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`

Additional new config file:
- `vitest.config.ts` — Vitest config with `jsdom` environment, path aliases matching `tsconfig.json`, and `setupFiles` pointing to a test setup file
- `src/test/setup.ts` — Import `@testing-library/jest-dom` for global matchers

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download all media assets from MoMorph and place in `public/`:

| Asset | MoMorph Node ID | Target Path | Format |
|-------|-----------------|-------------|--------|
| SAA Logo | `I662:14391;178:1033;178:1030` | `public/images/saa-logo.png` | PNG |
| ROOT FURTHER image | `2939:9548` | `public/images/root-further.png` | PNG |
| Background artwork | `662:14389` | `public/images/login-bg.png` | PNG (large, fetch via `get_media_file`) |
| Google icon | `I662:14426;186:1766` | `public/icons/google.svg` | SVG |
| VN flag | `I662:14391;186:1696;186:1821;186:1709` | `public/icons/flag-vn.svg` | SVG |
| ChevronDown | `I662:14391;186:1696;186:1821;186:1441` | `public/icons/chevron-down.svg` | SVG |

> ⚠️ The background artwork node `662:14389` was not returned by `get_media_files` — fetch it
> directly via `get_media_file` with that node ID during task execution.

### Phase 1: Foundation (Blocking — must complete before UI)

1. **Install test dependencies**: Run `yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`. Create `vitest.config.ts` (jsdom env, `@/*` alias, setupFiles) and `src/test/setup.ts`. Add `"test": "vitest"` to `package.json` scripts.
2. **Update `src/app/layout.tsx`**: Load Montserrat + Montserrat Alternates via `next/font/google`, add font CSS variables, update `<html lang>` to `"vi"`.
3. **Update `src/app/globals.css`**: Add `--font-montserrat` and `--font-montserrat-alt` vars; remove dark mode `prefers-color-scheme` (login is always dark-themed).
4. **Create `src/types/auth.ts`**: Define `AuthError`, `Language`, `LanguageOption` types.
5. **Create `middleware.ts`** (root): Use existing `src/libs/supabase/middleware.ts` client to check session. Logic:
   - Public routes (`/login`, `/auth/callback`): always allow
   - Authenticated user on `/login`: redirect to `/`
   - Unauthenticated user on protected route: redirect to `/login`
6. **Create `src/app/auth/callback/route.ts`**: `GET` handler that:
   - Reads `code` from query params
   - Calls `supabase.exchangeCodeForSession(code)`
   - On success: redirects to `/` (open-redirect guard: `next` param accepted only if it starts with `/` and does not contain `//` or protocol)
   - On error: redirects to `/login?error=auth_error`

### Phase 2: User Story 1 — Login with Google (P1) 🎯

**Goal**: Unauthenticated user can click the login button, complete Google OAuth, and land on the home page.

#### Shared UI components (parallelisable)

7. **Create `src/components/login/spinner.tsx`**: 24×24 circular spinner (`animate-spin`, `border-[#00101A]`).
8. **Create `src/components/login/error-message.tsx`**: Conditional inline error block (`role="alert"`, `text-red-300`, `bg-red-500/15`).
9. **Create `src/components/footer/footer.tsx`**: RSC footer with copyright text and `border-t border-[#2E3940]`.
10. **Create `src/components/header/header.tsx`**: RSC header with SAA logo + LanguageSelector slot; `bg-[#0B0F12]/80`, `h-20`, `px-36`.

#### Core auth components

11. **Create `src/components/login/login-button.tsx`** (`"use client"`):
    - Reads `?error` query param on mount → sets `error` state
    - `onClick`: `setIsLoading(true)`, `setError(null)`, starts 30-second `setTimeout`; if timer fires before redirect, calls `setError('timeout')` and `setIsLoading(false)`; calls `createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`
    - Renders: button + Google icon (or Spinner when loading) + ErrorMessage below
    - ARIA: `aria-busy`, `aria-disabled`, `aria-label`
12. **Create `src/components/login/hero-section.tsx`** (RSC):
    - Contains ROOT FURTHER key visual (`next/image`, `object-contain`), hero description text, and `<LoginButton>` slot
    - Layout: `flex flex-col gap-6`, `pl-4`, within `Frame487` (`flex flex-col gap-20 items-start`)
    - Accepts `initialError?: string` prop, passed through to `<LoginButton>`
13. **Create `src/app/login/page.tsx`** (RSC):
    - Checks session with `createClient()` from `server.ts` → `redirect('/')` if authenticated
    - Reads `searchParams.error` and passes to `<HeroSection>`
    - Renders full-page layout: background image + gradients + Header + HeroSection + Footer

### Phase 3: User Story 2 — Language Selection (P2)

14. **Create `src/components/header/language-selector.tsx`** (`"use client"`):
    - Toggle button: VN flag + "VN" text + ChevronDown
    - `isLangDropdownOpen` state; closes on outside click (`useEffect` + document listener) and `Escape`
    - ChevronDown rotates 180° when open (`transition-transform`)
    - ARIA: `aria-expanded`, `aria-haspopup="listbox"`, `aria-label`
    - Accepts `languages: LanguageOption[]` prop (stub: VN only for now, structure ready for i18n without refactoring)
    - Dropdown renders list of language options
15. **Wire `LanguageSelector` into `Header`**.

### Phase 4: Polish & Cross-cutting

16. Verify all three responsive breakpoints (360px, 768px, 1440px).
17. Run accessibility audit: tab order, focus rings, screen reader announcement of errors.
18. Verify `yarn lint` and `yarn build` pass.
19. Verify Cloudflare Workers edge-compatibility (`route.ts` must not use Node.js-only APIs).

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: `LoginButton` loading state, error display, disabled prevention
- [x] **External dependency**: Supabase Auth OAuth initiation (mock in unit tests)
- [x] **Data layer**: `/auth/callback` route handler — session exchange (mock Supabase)
- [x] **User workflows**: Full login E2E (mock Google OAuth)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Button click → loading state; error param → error display |
| App ↔ External API | Yes | `signInWithOAuth` call; `/auth/callback` code exchange |
| App ↔ Data Layer | Yes | Session set in cookies after callback |
| Cross-platform | Yes | Responsive layout at 360px, 768px, 1440px |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `supabase.auth.signInWithOAuth` | Mock (Vitest `vi.mock`) | Cannot run real Google OAuth in unit tests |
| Supabase callback `exchangeCodeForSession` | Mock (Vitest `vi.mock`) | Isolate route handler logic from network |
| Google OAuth redirect | Stub (Playwright `page.route()`) | E2E needs to bypass external IdP |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Click login button → `signInWithOAuth` called with `provider: 'google'`
   - [ ] `/auth/callback?code=valid` → session created → redirect to `/`
   - [ ] Authenticated user visits `/login` → redirected to `/` without rendering UI

2. **Error Handling**
   - [ ] `/auth/callback?error=access_denied` → redirect to `/login?error=access_denied`
   - [ ] Login page with `?error=access_denied` → error message rendered below button
   - [ ] Click button → disabled immediately (no duplicate calls)

3. **Edge Cases**
   - [ ] Button clicked twice quickly → only one `signInWithOAuth` call
   - [ ] Keyboard Enter/Space on button → same as click
   - [ ] Escape key closes language dropdown
   - [ ] 30-second timeout fires → `isLoading` reset to `false`, timeout error message shown
   - [ ] `next` param with external URL in callback → rejected, redirected to `/`

### Tooling & Framework

- **Unit tests**: Vitest + React Testing Library (`jsdom` environment)
- **E2E tests**: Playwright — mock Google OAuth callback via `page.route()`
- **CI integration**: Run in `yarn test` script pre-merge

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `login-button.tsx` logic (loading, error, timeout, duplicate-click) | 90%+ | High |
| `/auth/callback` route handler (success, error, open-redirect guard) | 90%+ | High |
| `middleware.ts` redirect logic | 85%+ | High |
| `language-selector.tsx` (open, close, keyboard, outside-click) | 80%+ | Medium |
| Responsive layout (E2E) | 3 viewports | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Background artwork not in `get_media_files` (node `662:14389`) | Medium | Low | Fetch via `get_media_file` with explicit node ID; fallback to solid `#00101A` background |
| Vitest incompatibility with Next.js 15 server components | Low | Medium | Unit-test only client components and route handlers; use Playwright for page-level testing |
| Google OAuth redirect URI not configured in Supabase dashboard | Medium | High | Document as infrastructure prerequisite; add to README setup steps |
| `next/font/google` requests blocked on Cloudflare edge | Low | Medium | Use `display: 'swap'` and ensure font preloading; test with `yarn preview` |
| Language dropdown frame `721:4942` not yet specced | Medium | Low | Stub with VN-only structure; full implementation deferred to that frame's spec |
| `middleware.ts` runs on every request — edge overhead | Low | Low | Keep middleware logic minimal (single session check); no DB calls in middleware |

### Estimated Complexity

- **Frontend**: Medium (pixel-perfect hero layout, font loading, responsive)
- **Backend**: Low (Supabase Auth handles all auth logic; only callback route + middleware needed)
- **Testing**: Medium (mocking OAuth flow for unit tests; Playwright E2E setup)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` reviewed and complete
- [x] `design-style.md` reviewed and complete
- [ ] Google OAuth provider enabled in Supabase dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env`
- [ ] Redirect URI `http://localhost:3000/auth/callback` added to Google Cloud Console OAuth app

### External Dependencies

- Supabase project with Google OAuth provider configured
- Google Cloud Console OAuth 2.0 Client ID with correct redirect URIs

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** `tasks.md` for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `src/libs/supabase/middleware.ts` creates a Supabase client for middleware use
  but does NOT contain session check logic — the root `middleware.ts` will import it and add
  the routing guard logic.
- `src/app/page.tsx` (home) is currently the default Next.js template. It will become a
  protected route via middleware but its content is out of scope for this feature.
- Supabase env var is named `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not the older
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — existing clients already use this.
- Language selector dropdown (frame `721:4942`) is out of scope for this spec; the
  `LanguageSelector` component must be structured to accept a `languages` prop for future
  extension without refactoring.
- OAuth uses redirect strategy (not popup) — `signInWithOAuth` triggers a full page redirect
  to Google; `isLoading` state persists until the redirect occurs, preventing duplicate clicks.
- The `next` query param in `/auth/callback` MUST be validated: accept only relative paths
  starting with `/` and containing no `//` or protocol (e.g., `http`). Reject anything else
  and default to `/` to prevent open-redirect attacks (OWASP A01).
- `HeroSection` is an RSC that encapsulates the B_Bìa layout block (key visual + description + login button area). It keeps `LoginPage` clean and matches the design-style component hierarchy.
- Vitest setup file (`src/test/setup.ts`) imports `@testing-library/jest-dom` to provide
  custom matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.) globally across all tests.
