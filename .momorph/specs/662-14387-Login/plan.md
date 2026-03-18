# Implementation Plan: Login

**Frame**: `662-14387-Login`
**Date**: 2026-03-17 (reviewed)
**Spec**: `specs/662-14387-Login/spec.md`

---

## Summary

Full-page hero Login screen for SAA 2025 that authenticates users exclusively via Google OAuth
using Supabase Auth + `@supabase/ssr`. The page is a React Server Component with minimal
`"use client"` interactive components. Next.js middleware protects all routes. Deployed on
Cloudflare Workers via `@opennextjs/cloudflare`.

**Current status**: Implementation is **~90% complete**. All UI components, route handlers, and
middleware are built. Remaining work: 2 spec-violating bugs to fix, accessibility improvements,
Supabase Auth environment setup, and comprehensive test suite.

---

## Technical Context

| Layer | Technology |
|-------|-----------|
| Language/Framework | TypeScript 5 / Next.js 15 (App Router) |
| UI | React 19, TailwindCSS v4 (`@theme inline`) |
| Auth | Supabase Auth via `@supabase/ssr` (Google OAuth provider) |
| State | Local component state only (`isLoading`, `error`, `isLangDropdownOpen`, `selectedLanguage`) |
| API | Supabase Auth built-ins + Next.js Route Handler (`/auth/callback`) |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| Testing | Vitest (unit) + Playwright (E2E) |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Code** — kebab-case files, PascalCase components, descriptive names, `@/*` imports, features in `src/components/<feature>/`
- [x] **II. Next.js + Cloudflare** — RSC by default, `"use client"` only on `LoginButton` + `LanguageSelector`; edge-compatible route handlers; no Node.js-only APIs
- [x] **III. Supabase Integration** — `@supabase/ssr` for server/middleware clients; `HttpOnly` cookies; no custom session management; direct Supabase Auth SDK calls
- [x] **IV. Responsive Design** — Mobile-first with 3 breakpoints (< 768px, md: 768px, lg: 1024px); touch targets ≥ 44×44px
- [x] **V. OWASP Security** — A07 compliance (HttpOnly cookies); open-redirect guard in callback; no secrets in client code; `.env*` in `.gitignore` ✅
- [x] **VI. TDD** — Vitest configured (`vitest.config.ts` + `vitest.setup.ts` at root); test convention: `__tests__/` dirs co-located with source

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `src/components/login/`, `src/components/header/`, `src/components/footer/`
- **Styling**: TailwindCSS v4 utilities with design tokens defined in `globals.css` (`@theme inline`)
- **RSC vs Client split**:
  - RSC (no `"use client"`): `LoginPage`, `Header` (login variant), `HeroSection`, `Footer`, `ErrorMessage`, `Spinner`
  - Client (`"use client"`): `LoginButton` (auth flow + loading/error state), `LanguageSelector` (dropdown toggle)
  - Note: `ErrorMessage` and `Spinner` have no `"use client"` directive but run as client components at runtime because they are imported by `LoginButton` (a client component boundary). This is the correct pattern — keep them as RSCs unless they need browser APIs.
- **Font system**: `font-sans` = Montserrat (`--font-montserrat`), `font-alt` = Montserrat Alternates (`--font-montserrat-alt`); loaded via `next/font/google` in `layout.tsx` with `display: 'swap'`
- **Focus ring strategy**: Global focus ring in `globals.css` uses gold (`#C8A96E`). Login-specific overrides:
  - LoginButton: `focus:outline-[#FFEA9E]` (matches button background for visibility on dark bg)
  - LanguageSelector: `focus:outline-white/50` (subtle on header)
  - All meet WCAG 2.4.7 (visible 2px outline with offset)

### Backend / Auth Approach

- **OAuth flow**: Redirect-based (not popup) via `supabase.auth.signInWithOAuth({ provider: 'google' })` — triggers full page redirect to Google; avoids popup-blocker issues
- **Callback**: `src/app/auth/callback/route.ts` — exchanges code for session, validates `next` param (open-redirect guard: rejects URLs with `//` or protocol schemes)
- **Middleware**: `middleware.ts` — session check on every request:
  - Public routes whitelist: `/login`, `/auth/callback`
  - Authenticated user on `/login` → redirect to `/`
  - Unauthenticated user on protected route → redirect to `/login`
  - **Exception**: `/` is allowed without auth because the homepage handles prelaunch/countdown state internally — it renders different content based on auth status (see `src/app/page.tsx`)
- **Supabase clients**: 3 pre-built wrappers in `src/libs/supabase/`:
  - `server.ts` — Server Component / Route Handler client (cookies via `next/headers`)
  - `middleware.ts` — Middleware client (cookies via request/response)
  - `client.ts` — Browser client (`createBrowserClient`)

### Integration Points

- **Existing libs**: All Supabase client wrappers are pre-configured and used by the implementation
- **Shared components**: `Header` supports `variant="login"|"app"` prop; `Footer` supports `variant="login"|"app"|"saa"`
- **Supabase config**: `supabase/config.toml` already has `[auth.external.google] enabled = true` with env var substitution

---

## Project Structure

### Implemented Files (✅ Complete)

```text
middleware.ts                                  ✅ Session guard + public routes
src/app/login/page.tsx                         ✅ Login page (RSC)
src/app/auth/callback/route.ts                 ✅ OAuth callback route handler
src/components/login/hero-section.tsx           ✅ Hero content (RSC)
src/components/login/login-button.tsx           ✅ Login button (client)
src/components/login/error-message.tsx          ✅ Inline error display (RSC, used inside client boundary)
src/components/login/spinner.tsx                ✅ Loading spinner (RSC, used inside client boundary)
src/components/header/header.tsx                ✅ Header with login/app variants (RSC)
src/components/header/header-client.tsx         ✅ App header (client)
src/components/header/language-selector.tsx      ✅ Language dropdown (client)
src/components/header/mobile-menu.tsx           ✅ Mobile menu
src/components/header/profile-dropdown.tsx      ✅ Profile dropdown
src/components/footer/footer.tsx                ✅ Footer (RSC)
src/components/ui/icon.tsx                      ✅ Icon component
src/libs/supabase/server.ts                     ✅ Server Supabase client
src/libs/supabase/middleware.ts                 ✅ Middleware Supabase client
src/libs/supabase/client.ts                     ✅ Browser Supabase client
src/types/auth.ts                              ✅ Auth types (AuthError, Language, LanguageOption)
src/app/layout.tsx                             ✅ Montserrat + Montserrat Alternates fonts
src/app/globals.css                            ✅ Design tokens + global focus ring
public/images/saa-logo.png                     ✅ SAA logo
public/images/root-further.png                 ✅ ROOT FURTHER key visual
public/images/keyvisual-bg.svg                 ✅ Background artwork
public/icons/google.svg                        ✅ Google icon
public/icons/flag-vn.svg                       ✅ VN flag
public/icons/flag-en.svg                       ✅ EN flag
public/icons/chevron-down.svg                  ✅ Chevron icon
vitest.config.ts                               ✅ Vitest configuration
vitest.setup.ts                                ✅ Test setup (imports @testing-library/jest-dom)
```

### Test Files (🔲 To Create)

```text
src/components/login/__tests__/login-button.test.tsx      🔲 LoginButton unit tests
src/components/header/__tests__/language-selector.test.tsx 🔲 LanguageSelector unit tests
src/app/auth/callback/__tests__/route.test.ts             🔲 OAuth callback handler tests
tests/e2e/login.spec.ts                                   🔲 E2E login flow (Playwright)
```

> **Note**: No login-related tests exist yet. The project has existing test patterns (e.g.,
> `src/services/__tests__/`, `src/hooks/__tests__/`, `src/components/countdown/__tests__/`)
> that should be followed for consistency.

### Configuration Files

```text
supabase/config.toml                           ✅ Google OAuth enabled
.env.example                                   ✅ Documents required env vars
.gitignore                                     ✅ .env* excluded (line 35)
```

---

## Known Issues to Fix

### Issue 1: Short Viewport — Scroll Blocked (SPEC VIOLATION) ⚠️

**Spec edge case**: "On viewports shorter than content height, the footer MUST remain at the
bottom of the content flow. The page MUST scroll naturally."

**Current implementation** (in `src/app/login/page.tsx` line 27):
```html
<main className="relative min-h-screen bg-[#00101A] overflow-hidden">
```

**Problems**:
1. `overflow-hidden` prevents scrolling entirely on short viewports
2. `Footer` with `absolute bottom-0` pins to viewport bottom, not content flow — overlaps hero on short screens

**Fix approach**:
- Change `overflow-hidden` to `overflow-x-hidden` (still clips horizontal overflow from gradient bleed but allows vertical scroll)
- Change `Footer` login variant from `absolute bottom-0` to relative positioning with margin-top auto or a flex spacer, so it flows naturally after hero content
- Ensure `min-h-screen` still works for tall viewports (footer stays at bottom when content is short)

### Issue 2: Language Selector Arrow Key Navigation (SPEC GAP) ⚠️

**Spec requirement**: "When dropdown is open, `ArrowDown`/`ArrowUp` SHOULD move focus between language options"

**Current implementation**: `<li>` elements have no `tabIndex`, no `onKeyDown` handler for arrow keys. Only mouse click works.

**Fix approach** (in `src/components/header/language-selector.tsx`):
- Add `tabIndex={-1}` to each `<li role="option">` for programmatic focus
- Add `onKeyDown` handler on the `<ul>` that:
  - `ArrowDown` → focus next `<li>` (wrap to first)
  - `ArrowUp` → focus previous `<li>` (wrap to last)
  - `Enter`/`Space` → select focused option + close dropdown
- Track `focusedIndex` state; auto-focus first option when dropdown opens
- Note: This is a SHOULD (not MUST) per spec, but important for accessibility

---

## Supabase Auth Setup for Google OAuth

### Prerequisites

To make Google login work, you need:

1. **Google Cloud Console** — OAuth 2.0 Client credentials
2. **Supabase project** — Google provider enabled (already done in `config.toml`)
3. **Environment variables** — configured locally

### Step-by-step Setup

#### A. Google Cloud Console (one-time)

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application type)
3. Add **Authorized JavaScript origins**: `http://localhost:3000`
4. Add **Authorized redirect URIs**:
   - Local Supabase: `http://localhost:54321/auth/v1/callback`
   - Production: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client Secret**

> **IMPORTANT**: The redirect URI must go to Supabase's auth endpoint (`/auth/v1/callback`),
> NOT the app's `/auth/callback`. Supabase handles the Google OAuth exchange, then redirects
> back to the app's callback URL (`http://localhost:3000/auth/callback`) which is validated
> against `site_url` + `additional_redirect_urls` in `config.toml`.

#### B. Supabase Config (already done)

`supabase/config.toml` already has:
```toml
[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:3000", "https://127.0.0.1:3000"]

[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
```

#### C. Local Environment Setup

Create `.env.local` with:

```bash
# Google OAuth credentials (from Google Cloud Console step A)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Supabase local development (from `supabase status` output after `supabase start`)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key-from-supabase-status>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-supabase-status>

# App URL (used for CORS in API Route Handlers)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### D. Start Local Supabase

```bash
# 1. Start Docker Desktop first (required)
# 2. Start Supabase local dev stack
supabase start

# 3. Copy the anon key and service_role key from the output into .env.local
supabase status

# 4. Start the Next.js dev server
yarn dev
```

#### E. For Hosted Supabase (Production/Staging)

1. Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste Google Client ID and Client Secret
4. The redirect URL shown in Supabase dashboard must match Google Cloud Console's authorized redirect URI exactly
5. Set env vars in Cloudflare Workers dashboard or `wrangler.jsonc`

---

## Implementation Strategy

### Remaining Work (4 phases)

#### Phase 1: Environment Setup (Blocking)

1. Start Docker Desktop
2. Run `supabase start` to launch local Supabase
3. Create `.env.local` with credentials from `supabase status` + Google OAuth credentials from Google Cloud Console
4. Verify `yarn dev` loads the login page at `http://localhost:3000/login`

#### Phase 2: Bug Fixes (Before testing)

5. **Fix short viewport scroll** (`src/app/login/page.tsx`):
   - Change `overflow-hidden` → `overflow-x-hidden` on `<main>`
   - Restructure layout so Footer flows naturally after hero content instead of `absolute bottom-0`
   - Verify: resize viewport to 360×500px → page scrolls, footer visible below hero
6. **Add arrow key navigation** (`src/components/header/language-selector.tsx`):
   - Add `focusedIndex` state, `tabIndex={-1}` on `<li>` options
   - Add `onKeyDown` handler for `ArrowDown`/`ArrowUp`/`Enter`/`Space`
   - Auto-focus first option when dropdown opens

#### Phase 3: End-to-End Verification

7. Test Google OAuth flow end-to-end:
   - Click "LOGIN With Google" → Google consent screen → callback → redirect to `/`
   - Verify session cookie is `HttpOnly` (DevTools → Application → Cookies)
   - Verify authenticated user on `/login` redirects to `/`
8. Test error scenarios:
   - Cancel OAuth → `/login?error=access_denied` → error message displayed below button
   - Navigate to `/auth/callback` without code → redirect to `/login?error=auth_error`
9. Test responsive at 360px, 768px, 1440px viewports (DevTools → Device Toolbar)
10. Test short viewport scroll (360×500px) — footer visible after scrolling

#### Phase 4: Testing

> **Note**: Zero login-related tests exist. Follow existing project test patterns:
> `src/components/<feature>/__tests__/<name>.test.tsx` for component tests.

11. **Unit tests — LoginButton** (`src/components/login/__tests__/login-button.test.tsx`):
    - Renders button with correct text and Google icon
    - Click → `signInWithOAuth` called with `provider: 'google'` and correct `redirectTo`
    - Click → button becomes disabled, shows spinner, `aria-busy="true"`
    - Double-click → only one `signInWithOAuth` call
    - URL has `?error=auth_error` → error message rendered with `role="alert"`
    - 30-second timeout → `isLoading` reset, timeout error message shown
    - Error auto-clears on next click

12. **Unit tests — LanguageSelector** (`src/components/header/__tests__/language-selector.test.tsx`):
    - Click toggle → dropdown opens, `aria-expanded="true"`
    - Click option → selected language updates, dropdown closes
    - Click outside → dropdown closes without changing language
    - `Escape` key → dropdown closes
    - `ArrowDown`/`ArrowUp` → focus moves between options (after Issue 2 fix)
    - `Enter` on focused option → selects and closes

13. **Unit tests — OAuth callback** (`src/app/auth/callback/__tests__/route.test.ts`):
    - `?code=valid` → `exchangeCodeForSession` called → redirect to `/`
    - `?code=valid&next=/awards` → redirect to `/awards` (safe relative path)
    - `?code=valid&next=https://evil.com` → redirect to `/` (open-redirect guard)
    - `?code=valid&next=//evil.com` → redirect to `/` (protocol-relative guard)
    - No code param → redirect to `/login?error=auth_error`
    - `exchangeCodeForSession` fails → redirect to `/login?error=auth_error`

14. **E2E test** (`tests/e2e/login.spec.ts`):
    - Mock Google OAuth via `page.route()` to intercept Supabase auth redirect
    - Test: unauthenticated user sees login page with button
    - Test: click button → redirected (verify `signInWithOAuth` was triggered)
    - Test: authenticated user on `/login` → redirected to `/`
    - Test: responsive layout at 360px, 768px, 1440px (no overflow, no broken images)

#### Phase 5: Polish

15. Accessibility audit:
    - Tab order: Logo → Language Selector → Login Button
    - Focus rings visible on all interactive elements
    - `aria-busy`, `aria-disabled`, `aria-expanded`, `aria-label` verified
    - Screen reader announces error message (`role="alert"` + `aria-live="assertive"`)
16. Run `yarn lint` and `yarn build` — fix any issues
17. Verify edge-runtime compatibility — no Node.js-only APIs in route handler or middleware

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: `LoginButton` loading/error/timeout states, button disable logic
- [x] **External dependency**: Supabase Auth OAuth initiation (mock in unit tests)
- [x] **Data layer**: `/auth/callback` session exchange + open-redirect guard (mock Supabase)
- [x] **User workflows**: Full login E2E (mock Google OAuth)

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|-----------|---------------|
| UI ↔ Logic | Yes | Button click → loading; error param → error display; timeout |
| App ↔ External API | Yes | `signInWithOAuth` call; callback `exchangeCodeForSession` |
| App ↔ Data Layer | Yes | Session cookie set after callback |
| Cross-platform | Yes | Responsive at 360px, 768px, 1440px; short viewport scroll |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `@/libs/supabase/client` | `vi.mock` → mock `signInWithOAuth` | Cannot run real Google OAuth in unit tests |
| `@/libs/supabase/server` | `vi.mock` → mock `exchangeCodeForSession` | Isolate callback route handler from network |
| `next/navigation` | `vi.mock` → mock `useSearchParams` | Control `?error` param in LoginButton tests |
| Google OAuth redirect (E2E) | `page.route()` Playwright intercept | E2E bypasses external IdP |

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `login-button.tsx` (loading, error, timeout, double-click) | 90%+ | High |
| `/auth/callback/route.ts` (success, error, open-redirect) | 90%+ | High |
| `middleware.ts` redirect logic | 85%+ | High |
| `language-selector.tsx` (open, close, keyboard, arrow keys) | 80%+ | Medium |
| `error-message.tsx`, `spinner.tsx` | 80%+ | Low (simple components) |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Docker not running → can't start local Supabase | Medium | High | Document Docker as prerequisite; `supabase start` fails gracefully with clear error |
| Google OAuth redirect URI mismatch | Medium | High | URI must be `http://localhost:54321/auth/v1/callback` (Supabase), NOT `localhost:3000/auth/callback`. Document clearly in setup steps. |
| Short viewport fix breaks desktop layout | Low | Medium | Test at all 3 breakpoints + short viewport (360×500px) after fix |
| Vitest incompatibility with Next.js 15 RSC imports | Low | Medium | Only unit-test client components + route handlers; mock server-only imports; use Playwright for page-level |
| `next/font/google` blocked on Cloudflare edge | Low | Medium | `display: 'swap'` already configured; test with `yarn preview` |

### Estimated Complexity

- **Frontend bug fixes**: Low (2 targeted fixes)
- **Backend**: Low (Supabase handles auth; callback + middleware done)
- **Testing**: Medium (mocking OAuth, E2E setup, 4 test files)
- **DevOps/Setup**: Medium (Google Cloud Console + Supabase config)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` reviewed (3 passes)
- [x] `design-style.md` reviewed (3 passes)
- [x] All core UI components implemented
- [x] Route handler + middleware implemented
- [x] `supabase/config.toml` Google OAuth enabled
- [x] `.gitignore` covers `.env*` files
- [ ] Docker Desktop running
- [ ] `supabase start` executed successfully
- [ ] Google OAuth Client ID + Secret obtained from Google Cloud Console
- [ ] `.env.local` created with all required variables
- [ ] Short viewport bug fixed (Issue 1)
- [ ] Arrow key navigation added (Issue 2)

### External Dependencies

- Google Cloud Console — OAuth 2.0 credentials
- Docker Desktop — required for local Supabase
- Supabase CLI (`npx supabase`) — v2.71.3 installed ✅

---

## Next Steps

1. **Start Docker Desktop** and run `supabase start`
2. **Create `.env.local`** with credentials from `supabase status` output + Google OAuth creds
3. **Fix Issue 1 + Issue 2** (short viewport scroll + arrow key navigation)
4. **Test login flow** end-to-end locally
5. **Run `/momorph.tasks`** to generate task breakdown
6. **Implement test suite** (4 test files)

---

## Notes

- **Env var naming**: Supabase env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not the older `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — all existing clients already use this convention.
- **OAuth strategy**: Uses redirect (not popup) — `signInWithOAuth` triggers full page redirect to Google. This avoids popup-blocker issues entirely (spec edge case "OAuth popup blocked" is mitigated by design).
- **Open-redirect guard**: The `next` query param in `/auth/callback` is validated by `isSafeRedirect()`: only relative paths starting with `/` without `//` or protocol allowed (OWASP A01).
- **Middleware `/` exception**: The homepage (`/`) is accessible without auth because `page.tsx` handles both prelaunch (unauthenticated countdown) and authenticated dashboard states internally. This deviates from spec FR-001's literal wording but matches the actual app behavior.
- **Background artwork**: Uses `keyvisual-bg.svg` (not `login-bg.png` from initial asset mapping).
- **Language selector i18n**: Dropdown currently supports VN + EN options via `Language[]` prop. Full i18n integration (e.g., `next-intl`) is deferred to a separate feature. The component is structured with a `languages` prop for easy extension.
- **Test file convention**: Follow existing project pattern — `src/components/<feature>/__tests__/<name>.test.tsx` for component tests, `tests/e2e/<name>.spec.ts` for E2E.
