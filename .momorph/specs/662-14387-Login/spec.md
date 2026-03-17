# Feature Specification: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/662:14387
**Created**: 2026-03-09
**Status**: Draft

---

## Overview

The Login screen is the application entry point for **SAA 2025 (Sun Annual Awards 2025)**. It
presents a full-page branded hero layout with a striking "ROOT FURTHER" artwork background, an
introductory tagline, and a single-action **"LOGIN With Google"** button. Authentication is
handled exclusively via Google OAuth through Supabase Auth. The screen also provides a language
selector (currently Vietnamese) in the header.

**Target users**: All unauthenticated visitors accessing the SAA 2025 platform.

**Business context**: Users must be authenticated to access any awards content. The login screen
is the sole authentication gateway — no email/password flow exists.

---

## User Scenarios & Testing

### User Story 1 — Login with Google (Priority: P1)

**As a** SAA 2025 participant
**I want to** click "LOGIN With Google" and authenticate with my Google account
**So that** I can access the SAA 2025 awards platform

**Why this priority**: Core authentication — without it no other feature is accessible. It is
the only path to enter the application.

**Independent Test**: Load the login page → Click the button → Complete Google OAuth → Verify
redirect to the authenticated home/dashboard page.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated user on the Login page,
   **When** I click the "LOGIN With Google" button,
   **Then** the Google OAuth consent screen MUST open (redirect or popup).

2. **Given** I complete Google OAuth successfully,
   **When** Google returns the auth token,
   **Then** I MUST be redirected to the authenticated home/dashboard page and a valid Supabase
   session MUST be established.

3. **Given** Google OAuth fails or is cancelled,
   **When** the OAuth flow returns an error,
   **Then** I MUST be returned to the Login page with an appropriate error message displayed,
   and no session MUST be created.

4. **Given** I am on the Login page and click the button,
   **When** the OAuth request is in progress,
   **Then** the button MUST be disabled (opacity reduced, `cursor-not-allowed`) and MUST display
   a loading indicator.

5. **Given** I already have an active Supabase session,
   **When** I navigate to the Login page,
   **Then** I MUST be automatically redirected to the home/dashboard page without showing
   the login UI.

---

### User Story 2 — Language Selection (Priority: P2)

**As a** user who prefers a different language
**I want to** click the language selector in the header and switch the application language
**So that** I can use the platform in my preferred language

**Why this priority**: Enhances accessibility and UX for non-Vietnamese users. The selector is
always visible in the header but is secondary to the core auth flow.

**Independent Test**: Load the Login page → Click the "VN" language button → Verify a dropdown
opens → Select a different language → Verify UI text changes.

**Acceptance Scenarios**:

1. **Given** I am on the Login page,
   **When** I click the language selector button showing "VN" + flag + chevron,
   **Then** a dropdown menu MUST appear listing available languages.

2. **Given** the language dropdown is open,
   **When** I click a language option,
   **Then** the UI MUST update to reflect the selected language and the dropdown MUST close.

3. **Given** the language dropdown is open,
   **When** I click outside the dropdown,
   **Then** the dropdown MUST close without changing the language.

---

### Edge Cases

- **OAuth popup blocked**: If the browser blocks the popup, the system MUST fall back to a
  redirect-based OAuth flow (`redirectTo` strategy) OR display a toast message instructing
  the user to allow popups and retry.
- **Supabase Auth unavailable**: If the Supabase Auth service returns a network error,
  an inline error message MUST appear below the login button (see error state in design-style.md)
  and the button MUST be re-enabled so the user can retry.
- **Very slow network**: The button loading state MUST persist until the OAuth response
  returns; no silent timeout. If >30s passes with no response, show a timeout error message
  with a retry option.
- **Mobile device**: The layout MUST adapt per responsive breakpoints (see design-style.md);
  the login button MUST be full-width on mobile; touch targets MUST be ≥ 44×44px (WCAG 2.5.5).
- **Already authenticated**: If the user has a valid session and navigates to `/login`,
  middleware MUST redirect them to the home page before the login page renders.
- **Concurrent login attempts**: Double-clicking the button MUST NOT trigger two OAuth flows;
  the button becomes disabled immediately on first click.

---

## UI/UX Requirements *(from Figma)*

> Visual specifications, exact dimensions, colors, and typography are defined in
> [`design-style.md`](./design-style.md). This section describes *behavior* and *structure*.

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Background Artwork | `662:14388` | Full-bleed decorative background image | None |
| Left Gradient Overlay | `662:14392` | Horizontal gradient fading left side to solid `#00101A` | None |
| Bottom Gradient Overlay | `662:14390` | Vertical gradient fading bottom to solid `#00101A` | None |
| Header | `662:14391` | Semi-transparent top bar with logo + language selector | — |
| SAA Logo | `I662:14391;186:2166` | Sun Annual Awards 2025 logo (top-left) | None |
| Language Selector | `I662:14391;186:1601` | "VN" flag + text + chevron button | Click → opens language dropdown (frame `721:4942`) |
| ROOT FURTHER Key Visual | `662:14395` | "ROOT FURTHER" branded logo image | None |
| Hero Description | `662:14753` | Two-line tagline text | None |
| Login Button | `662:14425` | "LOGIN With Google" CTA button with Google icon | Click → Google OAuth flow |
| Footer | `662:14447` | Copyright bar at bottom | None |

### Navigation Flow

- **From**: Unauthenticated entry point (direct URL, bookmark, or expired session redirect)
- **To (success)**: Home / Dashboard (post-authentication redirect)
- **To (language)**: Language dropdown overlay (`721:4942`)
- **Triggers**:
  - Login button click → Google OAuth → home page
  - Language button click → dropdown opens

### Visual Requirements

- **Design reference**: See [design-style.md](./design-style.md) for all tokens and component specs
- **Responsive breakpoints**:
  - Mobile (`< 768px`): Full-width button, reduced padding, smaller key visual
  - Tablet (`768px – 1023px`): Medium padding, constrained key visual
  - Desktop (`≥ 1024px`): Full 1440px design as per Figma
- **Transitions**: Login button hover lift effect (150ms ease-out); language chevron rotation on open
- **Loading state**: Login button MUST show a circular spinner (replacing the Google icon) and be
  non-interactive during OAuth; button text changes to "Logging in…" or remains as-is with spinner
- **Error state**: When OAuth fails, an inline error message MUST appear below the Login button
  (see error message component in design-style.md); the message must be dismissible or auto-clear
  on next click
- **Fonts**: Montserrat and Montserrat Alternates MUST be loaded via `next/font/google`

### Accessibility Requirements

- **Keyboard navigation**:
  - Tab order: Header Logo → Language Selector → Login Button (logical top-to-bottom, left-to-right)
  - `Enter` or `Space` MUST activate the Login Button
  - `Enter` or `Space` MUST open/close the Language Selector dropdown
  - `Escape` MUST close the Language Selector dropdown
- **ARIA**:
  - Login button: `role="button"`, `aria-label="Login with Google"`, `aria-busy="true"` when loading,
    `aria-disabled="true"` when loading
  - Language selector: `role="button"`, `aria-expanded="false|true"`, `aria-haspopup="listbox"`,
    `aria-label="Select language, current: Vietnamese"`
  - Error message: `role="alert"` so screen readers announce it immediately
- **Focus ring**: All interactive elements MUST have a visible focus ring (2px outline) meeting
  WCAG 2.4.7
- **Color contrast**: #FFEA9E (`#FFEA9E`) on `#00101A` = 10.7:1 ✅; white on `#0B0F12` = 18.9:1 ✅
- **Screen reader**: Background decorative images MUST have `alt=""` (empty alt); the ROOT FURTHER
  key visual MUST have descriptive alt text (e.g., `alt="ROOT FURTHER – SAA 2025"`)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the Login page for any unauthenticated request to the root
  or protected routes.
- **FR-002**: The system MUST redirect authenticated users away from the Login page to the
  home/dashboard automatically.
- **FR-003**: Users MUST be able to initiate Google OAuth by clicking the "LOGIN With Google"
  button.
- **FR-004**: The system MUST handle the OAuth callback, establish a Supabase session, and
  redirect the user to the home/dashboard on success.
- **FR-005**: The system MUST display an error message if Google OAuth fails or is cancelled,
  without crashing or leaving the user in an undefined state.
- **FR-006**: The Login button MUST be disabled and show a loading indicator during the OAuth
  flow to prevent duplicate submissions.
- **FR-007**: The language selector MUST open a dropdown and allow language switching.
- **FR-008**: Session tokens MUST be stored in `HttpOnly` cookies via `@supabase/ssr`
  (OWASP A07 compliance).

### Technical Requirements

- **TR-001**: Authentication MUST use Supabase Auth with Google OAuth provider; no custom
  session management is permitted (Constitution Principle V + III).
- **TR-002**: The Login page MUST be a React Server Component by default; the interactive
  button MUST be a minimal `"use client"` component (Constitution Principle II).
- **TR-003**: All three responsive breakpoints (mobile, tablet, desktop) MUST be implemented
  and verified (Constitution Principle IV).
- **TR-004**: The `@supabase/ssr` server client MUST be used for session verification in
  middleware or server components (Constitution Principle III).
- **TR-005**: No secret keys or OAuth credentials MUST appear in client-side code; all
  credentials MUST be server-side environment variables (Constitution Principle V).
- **TR-006**: The page MUST be edge-runtime compatible for Cloudflare Workers deployment
  (Constitution Principle II).

### Key Entities

- **User (Supabase Auth)**: Created automatically on first successful Google OAuth login.
  Key attributes: `id`, `email`, `user_metadata` (name, avatar_url from Google).
- **Session**: Managed by Supabase Auth + `@supabase/ssr`; stored in `HttpOnly` cookies.

---

## API Dependencies

| Endpoint / Service | Method | Purpose | Status |
|--------------------|--------|---------|--------|
| Supabase Auth `/auth/v1/authorize` | GET | Initiate Google OAuth flow | Exists (Supabase built-in) |
| Supabase Auth `/auth/v1/callback` | GET | Handle OAuth callback & session creation | Exists (Supabase built-in) |
| Next.js Route Handler `/auth/callback` | GET | Relay Supabase OAuth callback, set cookies, redirect | New (to be created) |
| Next.js Middleware | — | Verify session on every request, redirect unauthenticated users | New (to be created) |

> All auth endpoints use Supabase's built-in flows; only the Next.js callback route handler
> and middleware need to be implemented.

---

## State Management

| State | Type | Location | Description |
|-------|------|----------|-------------|
| `isLoading` | `boolean` | Client component (`LoginButton`) local state | `true` while OAuth is in progress; disables button, shows spinner |
| `error` | `string \| null` | Client component (`LoginButton`) local state | Error message from failed OAuth; rendered below button; `null` = hidden |
| `session` | Supabase Session | Server (cookies via `@supabase/ssr`), checked in middleware | Persisted across requests; if valid, middleware redirects away from `/login` |
| `selectedLanguage` | `string` | Client component (`LanguageSelector`) local state | Current UI language (`"VN"` default); TODO: lift to context when i18n is added |
| `isLangDropdownOpen` | `boolean` | Client component (`LanguageSelector`) local state | Controls language dropdown visibility; toggled on button click, reset on outside click / Escape |

### Loading & Error Flow

```
User clicks button
  → setIsLoading(true), setError(null)
  → button disabled, aria-busy="true", spinner shown
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })
  → [OAuth redirect / popup]
  → On return to /auth/callback route handler:
      success → redirect to '/' (or intended page)
      error   → redirect to '/login?error=<code>'
  → Login page reads ?error param → setError(errorMessage), setIsLoading(false)
```

---

## Success Criteria *(mandatory)*

- **SC-001**: A new user can complete Google OAuth and reach the home/dashboard page within
  3 seconds on a standard connection.
- **SC-002**: An authenticated user navigating to `/login` is redirected to the home page
  without seeing the login UI.
- **SC-003**: A failed OAuth attempt returns the user to the login page with a visible,
  descriptive error message within 5 seconds.
- **SC-004**: The login page renders correctly (no layout overflow, no broken images) at
  360px, 768px, and 1440px viewport widths.
- **SC-005**: The login button is keyboard-accessible and has a visible focus ring meeting
  WCAG 2.1 AA standards.

---

## Out of Scope

- Email/password authentication — only Google OAuth is supported per this design.
- User registration flow — Supabase Auth auto-creates users on first Google login.
- Password reset / forgot password — not applicable (no password auth).
- Additional OAuth providers (GitHub, Apple, etc.) — not in this design.
- Language dropdown implementation detail — covered by the Dropdown-ngôn ngữ frame (`721:4942`).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not required; auth uses Supabase built-ins
- [ ] Database design completed (`.momorph/database.sql`) — not required; Supabase manages auth tables

---

## Notes

- The "ROOT FURTHER" image and SAA logo image assets are referenced as `MM_MEDIA_*` media
  items in MoMorph; they MUST be downloaded and placed in `public/` before implementation.
- The background artwork (C_Keyvisual) is a large decorative image; it MUST be lazy-loaded
  or used as a CSS background to avoid LCP impact.
- Google OAuth requires a verified redirect URI configured in Google Cloud Console and in
  Supabase Auth settings; this is an infrastructure prerequisite.
- The Supabase auth callback route MUST be at `/auth/callback` (or configured in Supabase
  dashboard) to match the OAuth redirect URI.
- Locale/i18n implementation strategy (e.g., `next-intl`, simple state, or context) is not
  mandated here; to be decided during planning.
