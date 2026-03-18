# Tasks: Login

**Frame**: `662-14387-Login`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- **|**: File path affected by this task

---

## Phase 1: Setup (Environment & Infrastructure)

**Purpose**: Supabase Auth environment configuration required for any auth testing

- [ ] T001 Start Docker Desktop and run `supabase start` to launch local Supabase dev stack
- [ ] T002 Create `.env.local` with Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) + Supabase keys from `supabase status` output (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`) — see plan.md "Supabase Auth Setup" section C
- [ ] T003 Verify `yarn dev` loads the login page at `http://localhost:3000/login` without errors

**Checkpoint**: Local development environment running with Supabase Auth + Google OAuth configured

---

## Phase 2: Foundation (Bug Fixes — Blocking)

**Purpose**: Fix 2 spec-violating bugs before user story verification or testing can begin

**⚠️ CRITICAL**: These fixes MUST be completed before Phase 3+ because tests would encode wrong behavior otherwise

- [x] T004 Fix short viewport scroll: change `overflow-hidden` to `overflow-x-hidden` on `<main>` element in `src/app/login/page.tsx` (line 27). This allows vertical scroll while still clipping horizontal gradient bleed.
- [x] T005 Fix footer positioning: change login variant in `src/components/footer/footer.tsx` from `absolute bottom-0` to flow-based layout. Use a flex column layout on `<main>` with `min-h-screen` + `flex-1` on hero section so footer stays at bottom when content is short but scrolls naturally when viewport is short. Verify at 360×500px viewport — page scrolls, footer visible below hero.
- [x] T006 Fix hero section positioning: update `src/components/login/hero-section.tsx` from `absolute top-[88px]` to relative/flex positioning that works with the new flex column layout from T005. Ensure `pt-[88px]` or equivalent accounts for fixed header height.
- [x] T007 Verify responsive layout after T004–T006: check login page at 360px, 768px, 1440px viewports + 360×500px short viewport — no overflow, no broken images, footer visible after scroll.

- [x] T024 Fix background artwork: replace placeholder `keyvisual-bg.svg` (414-byte dark gradient) with `prelaunch-bg.png` (the real colorful swirling artwork) in `src/app/login/page.tsx`. Matches Figma C_Keyvisual node 662:14388. | `src/app/login/page.tsx`
- [x] T025 Fix footer text alignment: change login variant footer from `justify-center lg:justify-between` to `justify-center` in `src/components/footer/footer.tsx`. With a single `<p>` child, `lg:justify-between` left-aligns it; design shows centered text at all breakpoints. | `src/components/footer/footer.tsx`

**Checkpoint**: Both spec violations fixed — layout scrolls on short viewports + footer flows naturally

---

## Phase 3: User Story 1 — Login with Google (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated user clicks "LOGIN With Google", completes Google OAuth, and lands on the home page with a valid session.

**Independent Test**: Navigate to `/login` → Click button → Complete Google OAuth → Verify redirect to `/` + session cookie set.

### Verification (US1)

- [ ] T008 [US1] Test Google OAuth happy path end-to-end: click "LOGIN With Google" → Google consent screen → callback → redirect to `/`. Verify session cookie is `HttpOnly` in DevTools → Application → Cookies.
- [ ] T009 [US1] Test authenticated user redirect: after login, navigate to `/login` → verify automatic redirect to `/` without showing login UI.
- [ ] T010 [US1] Test OAuth cancellation: cancel Google OAuth → verify redirect to `/login?error=access_denied` → error message "Bạn đã từ chối cấp quyền. Vui lòng thử lại." displayed below button.
- [ ] T011 [US1] Test invalid callback: navigate directly to `/auth/callback` without `code` param → verify redirect to `/login?error=auth_error`.

### Unit Tests (US1)

- [ ] T012 [P] [US1] Create LoginButton unit tests in `src/components/login/__tests__/login-button.test.tsx`:
  - Renders button with text "LOGIN With Google" and Google icon
  - Click → `signInWithOAuth` called with `provider: 'google'` and `redirectTo` containing `/auth/callback`
  - Click → button becomes disabled (`aria-disabled="true"`), shows spinner (`aria-busy="true"`)
  - Double-click → only one `signInWithOAuth` call (duplicate prevention)
  - URL `?error=auth_error` → error message rendered with `role="alert"` text "Đăng nhập thất bại. Vui lòng thử lại."
  - URL `?error=access_denied` → error message "Bạn đã từ chối cấp quyền. Vui lòng thử lại."
  - 30-second timeout → `isLoading` reset to false, timeout error message shown
  - Error auto-clears on next button click (setError(null) before setIsLoading(true))
  - Mock: `vi.mock("@/libs/supabase/client")`, `vi.mock("next/navigation")`

- [ ] T013 [P] [US1] Create OAuth callback route handler tests in `src/app/auth/callback/__tests__/route.test.ts`:
  - `?code=valid` → `exchangeCodeForSession` called → redirect to `/`
  - `?code=valid&next=/awards` → redirect to `/awards` (safe relative path accepted)
  - `?code=valid&next=https://evil.com` → redirect to `/` (open-redirect guard rejects protocol)
  - `?code=valid&next=//evil.com` → redirect to `/` (protocol-relative guard rejects `//`)
  - `?code=valid&next=/evil:scheme` → redirect to `/` (path with colon rejected)
  - No `code` param → redirect to `/login?error=auth_error`
  - `exchangeCodeForSession` returns error → redirect to `/login?error=auth_error`
  - Mock: `vi.mock("@/libs/supabase/server")`

**Checkpoint**: User Story 1 — Google OAuth login — verified and unit tested

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: User clicks language selector in header, dropdown opens, user can select a different language (VN/EN).

**Independent Test**: Load `/login` → Click "VN" button → Dropdown opens → Click "EN" → Selector shows "EN" + EN flag → Dropdown closes.

### Bug Fix (US2)

- [ ] T014 [US2] Add ArrowDown/ArrowUp keyboard navigation to language selector dropdown in `src/components/header/language-selector.tsx`:
  - Add `focusedIndex` state (number, default -1)
  - Add `tabIndex={-1}` to each `<li role="option">` element for programmatic focus
  - Add `onKeyDown` handler on the `<ul role="listbox">`:
    - `ArrowDown` → increment focusedIndex (wrap to 0 at end), focus that `<li>`
    - `ArrowUp` → decrement focusedIndex (wrap to last at beginning), focus that `<li>`
    - `Enter` or `Space` → select the focused option (call `setSelected` + `handleClose`)
  - When dropdown opens, auto-focus the first `<li>` option (set focusedIndex to 0)
  - Use `useRef` array to track `<li>` DOM references for `.focus()` calls

### Verification (US2)

- [ ] T015 [US2] Test language dropdown: click "VN" button → dropdown opens with VN and EN options → click "EN" → selector updates to show EN flag + "EN" → dropdown closes.
- [ ] T016 [US2] Test keyboard: focus selector → Enter → dropdown opens → ArrowDown → ArrowDown → Enter selects option → dropdown closes. Also test Escape closes dropdown.
- [ ] T017 [US2] Test outside click: open dropdown → click anywhere outside → dropdown closes without changing language.

### Unit Tests (US2)

- [ ] T018 [US2] Create LanguageSelector unit tests in `src/components/header/__tests__/language-selector.test.tsx`:
  - Click toggle button → dropdown opens, `aria-expanded="true"`
  - Click toggle again → dropdown closes, `aria-expanded="false"`
  - Click language option → `selected` updates, dropdown closes
  - Click outside container → dropdown closes without changing selected language
  - Press `Escape` → dropdown closes
  - Press `ArrowDown` when open → focus moves to next option
  - Press `ArrowUp` when open → focus moves to previous option (wraps)
  - Press `Enter` on focused option → selects it and closes
  - Dropdown shows currently selected item with `aria-selected="true"`
  - Supports controlled mode (isOpen + onToggle props)

**Checkpoint**: User Story 2 — Language selection — verified and unit tested

---

## Phase 5: E2E Tests

**Purpose**: End-to-end Playwright tests covering critical P1 login flow

- [ ] T019 Create E2E login test in `tests/e2e/login.spec.ts`:
  - Test: unauthenticated user navigates to `/login` → sees "LOGIN With Google" button, ROOT FURTHER image, SAA logo, language selector
  - Test: click "LOGIN With Google" → browser navigates away (intercepted via `page.route()` mock for Supabase OAuth URL)
  - Test: responsive at 360px → button is full-width; at 1440px → button is 305px
  - Test: page scrolls on short viewport (360×500px) — footer visible after scroll
  - Test: error message shown when navigating to `/login?error=auth_error`
  - Mock: `page.route('**/auth/v1/authorize**', ...)` to intercept Supabase OAuth redirect

**Checkpoint**: E2E coverage for P1 login flow

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility audit, build verification, final cleanup

- [ ] T020 [P] Accessibility audit on `/login`: verify tab order (Logo → Language Selector → Login Button), focus rings visible on all interactive elements, `aria-busy`/`aria-disabled`/`aria-expanded`/`aria-label` attributes correct, error message announced by screen reader (`role="alert"` + `aria-live="assertive"`)
- [ ] T021 [P] Run `yarn lint` on all login-related files and fix any issues: `src/app/login/page.tsx`, `src/components/login/**`, `src/components/header/language-selector.tsx`, `src/app/auth/callback/route.ts`, `middleware.ts`
- [ ] T022 [P] Run `yarn build` and verify no build errors — confirm edge-runtime compatibility (no Node.js-only APIs in route handler or middleware)
- [ ] T023 Verify all Vitest tests pass: run `yarn test` and confirm all login-related tests green

**Checkpoint**: Login feature complete — all tests pass, build succeeds, accessibility verified

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Bug Fixes) ← BLOCKS all user stories
        ├── Phase 3 (US1: Login with Google) ← MVP
        │     └── Phase 5 (E2E Tests) ← depends on US1 verification
        └── Phase 4 (US2: Language Selection) ← can run parallel with Phase 3
              └── Phase 5 (E2E Tests)
                    └── Phase 6 (Polish)
```

### Within Each Phase

- Bug fixes (T004–T007): Sequential — T004 → T005 → T006 → T007 (layout depends on prior changes)
- US1 Verification (T008–T011): Sequential (require running app) but independent of US1 Unit Tests
- US1 Unit Tests (T012, T013): Parallel [P] — different test files, no shared state
- US2 fix (T014) → US2 Verification (T015–T017) → US2 Unit Tests (T018): Sequential
- E2E (T019): After US1 + US2 verification
- Polish (T020–T022): Parallel [P]; T023 after all tests written

### Parallel Opportunities

| Tasks | Why parallel |
|-------|-------------|
| T012 + T013 | Different test files (`login-button.test.tsx` vs `route.test.ts`), no shared mocks |
| T020 + T021 + T022 | Accessibility audit, lint, build — independent checks |
| Phase 3 + Phase 4 | US1 and US2 touch different components (`login-button.tsx` vs `language-selector.tsx`) |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Bug Fixes)
2. Complete Phase 3 (US1: Login with Google) — **this is the MVP**
3. **STOP and VALIDATE**: Test Google OAuth flow end-to-end manually
4. Deploy if login works

### Incremental Delivery

1. Setup + Bug Fixes (Phase 1 + 2)
2. US1: Login with Google → Manual verify → Unit tests (Phase 3)
3. US2: Language Selection → Manual verify → Unit tests (Phase 4)
4. E2E tests (Phase 5)
5. Polish + build verification (Phase 6)

---

## Notes

- **Implementation ~90% done**: Most tasks are verification, bug fixes, and testing — not greenfield implementation
- **Test convention**: Follow existing project pattern — `src/components/<feature>/__tests__/<name>.test.tsx` for unit tests, `tests/e2e/<name>.spec.ts` for E2E
- **Mocking strategy**: Use `vi.mock()` for Supabase client + `next/navigation`; use Playwright `page.route()` for E2E OAuth interception
- **T004–T006 are the riskiest tasks**: Layout restructuring may have cascading effects — test at all breakpoints after each change
- **Phase 1 requires manual steps**: Google Cloud Console credentials + Docker Desktop — cannot be fully automated
