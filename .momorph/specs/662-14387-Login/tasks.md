# Tasks: Login

**Frame**: `662-14387-Login`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets + Test Infrastructure)

**Purpose**: Download all UI assets from MoMorph and configure the test runner before any code is written.

- [x] T001 Install Vitest dev dependencies *(blocked: Node 16 incompatible with Vitest 2+/4+; skipped per user decision)* | package.json
- [x] T002 [P] Create Vitest config *(skipped — no test runner)* | vitest.config.ts
- [x] T003 [P] Create test setup file *(skipped — no test runner)* | src/test/setup.ts
- [x] T004 [P] Add test scripts to package.json *(skipped — no test runner)* | package.json
- [x] T005 [P] Download SAA 2025 logo from MoMorph (node `I662:14391;178:1033;178:1030`) | public/images/saa-logo.png
- [x] T006 [P] Download ROOT FURTHER key visual from MoMorph (node `2939:9548`) | public/images/root-further.png
- [x] T007 [P] Download background artwork *(node `662:14389` returns 404 — CSS fallback `bg-[#00101A]` used)* | —
- [x] T008 [P] Download Google OAuth icon from MoMorph (node `I662:14426;186:1766`) | public/icons/google.svg
- [x] T009 [P] Download Vietnamese flag icon from MoMorph (node `I662:14391;186:1696;186:1821;186:1709`) | public/icons/flag-vn.svg
- [x] T010 [P] Download ChevronDown icon from MoMorph (node `I662:14391;186:1696;186:1821;186:1441`) | public/icons/chevron-down.svg

**Checkpoint**: ✅ 5/6 assets downloaded; test runner skipped (Node 16 incompatibility)

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Font loading, shared types, session middleware, and OAuth callback route — everything P1 and P2 depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Fonts & Globals

- [x] T011 [P] Update layout: add `Montserrat` + `Montserrat_Alternates` via `next/font/google`; set `<html lang="vi">` | src/app/layout.tsx
- [x] T012 [P] Update globals: add `--font-sans`/`--font-alt` @theme vars; set `font-family: var(--font-sans)` on body | src/app/globals.css

### Types

- [x] T013 [P] Define `AuthError`, `Language`, `LanguageOption` TypeScript types | src/types/auth.ts

### Middleware (implementation only — tests skipped)

- [x] T014 Write failing unit tests for middleware *(skipped — no test runner)* | middleware.test.ts
- [x] T015 Implement middleware: session guard; public routes allow-list; redirect logic | middleware.ts

### OAuth Callback Route (implementation only — tests skipped)

- [x] T016 Write failing unit tests for callback route *(skipped — no test runner)* | src/app/auth/callback/route.test.ts
- [x] T017 Implement `GET` handler: exchange code → session; open-redirect guard on `next` param | src/app/auth/callback/route.ts

**Checkpoint**: ✅ `yarn tsc --noEmit` passes; `yarn lint` clean

---

## Phase 3: User Story 1 — Login with Google (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated user visits `/login`, clicks "LOGIN With Google", completes Google OAuth, and is redirected to the home page with a valid Supabase session.

**Independent Test**: Load `/login` → page renders with SAA logo, ROOT FURTHER image, hero text, login button, footer.

### Leaf UI Components

- [x] T018 [P] [US1] Create circular loading spinner: 24×24px, `animate-spin` | src/components/login/spinner.tsx
- [x] T019 [P] [US1] Create inline error message: conditional render, `role="alert"`, dark-red styling | src/components/login/error-message.tsx
- [x] T020 [P] [US1] Create RSC footer: Montserrat Alternates 700 16px, `border-t border-[#2E3940]` | src/components/footer/footer.tsx
- [x] T021 [P] [US1] Create RSC header stub: SAA logo + LanguageSelector slot | src/components/header/header.tsx

### Login Button

- [x] T022 [US1] Write failing unit tests for LoginButton *(skipped — no test runner)* | src/components/login/login-button.test.tsx
- [x] T023 [US1] Implement LoginButton: `isLoading`/`error` state, 30s timeout, `signInWithOAuth`, ARIA attrs | src/components/login/login-button.tsx

### Hero Section & Page Assembly

- [x] T024 [US1] Create RSC HeroSection: ROOT FURTHER image + hero description + LoginButton | src/components/login/hero-section.tsx
- [x] T025 [US1] Create RSC LoginPage: session check → redirect; gradient overlays; full layout | src/app/login/page.tsx

### E2E Test

- [ ] T026 [US1] Write Playwright E2E test for US1 | tests/e2e/login.spec.ts

**Checkpoint**: ✅ `yarn build` succeeds; `/login` renders correctly in browser

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: User can click the language selector, see a dropdown, close by Escape or clicking outside.

- [x] T027 [US2] Write failing unit tests for LanguageSelector *(skipped — no test runner)* | src/components/header/language-selector.test.tsx
- [x] T028 [US2] Implement LanguageSelector: open/close state, outside-click, Escape, chevron rotation, ARIA | src/components/header/language-selector.tsx
- [x] T029 [US2] Wire LanguageSelector into Header with default VN language | src/components/header/header.tsx

**Checkpoint**: ✅ Language dropdown works; Escape and outside-click close correctly

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T030 [P] Verify responsive layout at 360px / 768px / 1440px | src/app/login/page.tsx, src/components/login/hero-section.tsx
- [ ] T031 [P] Accessibility audit: tab order, focus rings, screen reader | —
- [x] T032 `yarn lint` + `yarn build` — zero errors | —
- [ ] T033 `yarn preview` — Cloudflare Workers edge-compat check | —

### Bug Fixes

- [x] T034 Fix incorrect font classes across all components: replace `font-[family-name:var(...)]` (invalid in TailwindV4) with `font-sans`/`font-alt` theme utilities; add missing `tracking-[0.15px]` to Language "VN" label per `--text-nav-label` token | src/components/footer/footer.tsx, src/components/header/language-selector.tsx, src/components/login/error-message.tsx, src/components/login/login-button.tsx, src/components/login/hero-section.tsx, src/app/globals.css

**Checkpoint**: ✅ Lint clean; TypeScript passes; fonts render from Montserrat/Montserrat Alternates correctly

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup + Assets)
    └──> Phase 2 (Foundation)
              ├──> Phase 3 (US1) ✅
              │         └──> Phase 4 (US2) ✅
              │                   └──> Phase 5 (Polish) ← in progress
              └──> Bug Fixes (T034) ✅
```

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Setup | T001–T010 (10) | ✅ Complete (T007 fallback; T001-T004 skipped) |
| Phase 2: Foundation | T011–T017 (7) | ✅ Complete (T014, T016 skipped) |
| Phase 3: US1 (P1) | T018–T026 (9) | ✅ T018-T025 complete; T026 pending |
| Phase 4: US2 (P2) | T027–T029 (3) | ✅ Complete |
| Phase 5: Polish | T030–T033 (4) | T032 ✅; T030, T031, T033 pending |
| Bug Fixes | T034 (1) | ✅ Complete |

### Remaining

- **T026**: Playwright E2E test (login happy path, error display, loading state)
- **T030**: Responsive layout verification (360px, 768px, 1440px)
- **T031**: Accessibility audit (tab order, focus rings, screen reader)
- **T033**: Cloudflare edge-compat verification (`yarn preview`)

---

## Phase 6: Bug Fixes (UI & Logic Review)

**Purpose**: Fix visual and logic regressions discovered during design review.

- [x] T035 [P] Add `keyvisual-bg.svg` background image to login page — `public/images/keyvisual-bg.svg` exists but is unused; add as absolute full-bleed `<Image>` below gradient overlays (z-0) | src/app/login/page.tsx
- [x] T036 [P] Hide error message during loading state in LoginButton — `getErrorMessage(errorCode) ?? error` renders URL error even when `isLoading=true`; fix by suppressing error display while loading | src/components/login/login-button.tsx

---

## Notes

- Background artwork node `662:14389` returns 404 from MoMorph — `keyvisual-bg.svg` was later found at `public/images/keyvisual-bg.svg` (T035 fixes this)
- Vitest skipped: Node 16 environment incompatible with Vitest 2+/4+ (requires Node ≥18; uses `crypto.getRandomValues`)
- Font fix (T034): TailwindV4 does not support `font-[family-name:var(...)]` arbitrary type hint; use `@theme`-registered `font-sans`/`font-alt` utilities instead
- `font-sans` → Montserrat (inherited by `body` via `globals.css`); `font-alt` → Montserrat Alternates
