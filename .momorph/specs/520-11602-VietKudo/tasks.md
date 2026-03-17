# Tasks: Viết Kudo

**Frame**: `520-11602-VietKudo`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this belongs to (US1–US7)
- **|**: File path affected by this task

---

## Phase 1: Setup (Packages, DB, Assets)

**Purpose**: Install dependencies, provision infrastructure, and prepare shared assets before any code can be written.

- [x] T001 Install new runtime packages: `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-character-count tippy.js sanitize-html && yarn add -D @types/sanitize-html` | package.json
- [x] T002 Write Supabase CLI migration file with badges table, kudos column extensions (recipient_ids, badge_id, hashtags, image_urls), user_profiles view, notifications table | supabase/migrations/YYYYMMDD_viet_kudo_schema.sql
- [ ] T003 Apply migration to local Supabase: `supabase db push` — verify all tables and view exist in Supabase dashboard | supabase/migrations/
- [ ] T004 Create `kudos-images` Supabase Storage bucket via dashboard with authenticated user INSERT policy; verify anon INSERT returns 403 and authed INSERT returns 200
- [ ] T005 Seed `badges` table with at least 5 initial badges (name, icon_url, description) — use `supabase/seed.sql` or dashboard SQL editor
- [x] T006 [P] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and document in `.env.example` | .env.example
- [x] T007 [P] Verify/add missing SVG icons to `public/icons/`: `search.svg` and `hash.svg` (check existing files first to avoid duplication) | public/icons/
- [x] T008 Add `createServiceRoleClient()` export to `src/libs/supabase/server.ts` using `process.env.SUPABASE_SERVICE_ROLE_KEY` | src/libs/supabase/server.ts

**Checkpoint**: All packages installed, DB migrated, Storage bucket ready, icons present → Foundation phase can begin

---

## Phase 2: Foundation (Types, Services, Route Handlers)

**Purpose**: Core data types, server-side service functions, and API Route Handlers required by ALL user story components.

⚠️ **CRITICAL**: No component or hook work can begin until this phase is complete.

### Types

- [x] T009 Extend `src/types/kudos.ts`: add `Badge { id, name, icon_url, description }`, `Colleague { id, full_name, avatar_url }`, `KudoSubmitPayload { recipient_ids, badge_id, content, hashtags, image_urls }` types; extend `Kudo` with optional `badge_id?`, `hashtags?`, `image_urls?`, `recipient_ids?` (keep existing `receiver_id`/`receiver_name`) | src/types/kudos.ts

### Utility (TDD)

- [x] T010 Write failing tests for `extractMentionIds`: test valid HTML with mentions, no-mention HTML, XSS payload HTML | src/utils/__tests__/mention-parser.test.ts
- [x] T011 Implement `extractMentionIds(html: string): string[]` — parse `data-mention-id` attributes via regex from sanitised HTML string | src/utils/mention-parser.ts

### Services (TDD — write tests before implementation)

- [x] T012 [P] Write failing tests for `getBadges()`: success path returns Badge[], Supabase error returns [] | src/services/__tests__/badges.test.ts
- [x] T013 [P] Write failing tests for `searchUsers()`: success returns Colleague[], empty query param, max 20 results | src/services/__tests__/users.test.ts
- [x] T014 [P] Write failing tests for `submitKudo()`: success inserts kudos row + notifications rows, populates `receiver_id` with `recipient_ids[0]`, returns created Kudo | src/services/__tests__/kudos-submit.test.ts
- [x] T015 [P] Implement `getBadges(): Promise<Badge[]>` using server Supabase client | src/services/badges.ts
- [x] T016 [P] Implement `searchUsers(query: string, serviceRoleClient): Promise<Colleague[]>` querying `user_profiles` view, max 20 results | src/services/users.ts
- [x] T017 Implement `submitKudo(payload, supabase): Promise<Kudo>` — insert kudos row (with `receiver_id = recipient_ids[0]`, `receiver_name = first recipient full_name`), bulk-insert notifications for mentions via `extractMentionIds` | src/services/kudos-submit.ts

### Route Handlers (edge-compatible, with CORS)

- [x] T018 [P] Create `GET /api/badges` Route Handler: validate session, call `getBadges()`, set `Cache-Control: public, max-age=3600` + CORS header (`NEXT_PUBLIC_APP_URL` origin), return `Badge[]` | src/app/api/badges/route.ts
- [x] T019 [P] Create `GET /api/users/search` Route Handler: validate session, require `q` ≥ 2 chars (400 otherwise), call `searchUsers()` with service role client, return `Colleague[]` max 20 + CORS header | src/app/api/users/search/route.ts
- [x] T020 Create `POST /api/kudos` Route Handler: validate session (401), manual field validation (422 with `{ field, message }`), sanitise `content` with `sanitize-html` (allowList: `b,i,u,ul,li,span[data-mention-id]`), call `submitKudo()`, return created Kudo + CORS header | src/app/api/kudos/route.ts

**Checkpoint**: All services and Route Handlers passing tests → User story component work can begin in parallel

---

## Phase 3: US2 — Recipient Search (Priority: P1)

**Goal**: User can type in the Người nhận field and select one or more colleagues as kudo recipients via a debounced search dropdown.

**Independent Test**: Type 2+ chars in Người nhận → dropdown appears with matching colleagues → click a name → chip appears in input → click "×" on chip → chip removed.

### Component (US2)

- [x] T021 [US2] Create `RecipientSearch` component: controlled input with 300ms debounced fetch to `GET /api/users/search?q=`; min 2-char guard; renders results dropdown (name + avatar); click result → emits via `onAdd(colleague)`; chip display with "×" remove; empty state "Không tìm thấy đồng nghiệp"; owns `query`, `results`, `isDropdownOpen` state | src/components/kudo-modal/recipient-search.tsx
- [x] T022 [US2] Write component tests for `RecipientSearch`: renders empty state, debounce fires after 300ms, dropdown closes on selection, chip renders, chip removal fires `onRemove` | src/components/kudo-modal/recipient-search.tsx

**Checkpoint**: US2 independently testable — RecipientSearch works as a standalone component

---

## Phase 4: US3 — Badge Selection (Priority: P1)

**Goal**: User can click the Danh hiệu selector, see a list of available recognition badges, and select one.

**Independent Test**: Click Danh hiệu selector → dropdown opens with badge list → select a badge → badge icon + name appear in selector → chevron rotates 180° → re-click → dropdown reopens.

### Component (US3)

- [x] T023 [US3] Create `BadgeSelector` component: fetches `GET /api/badges` lazily on first open (cached in local state); owns `badgeList`, `isDropdownOpen` state; selected badge shows icon + name; chevron rotates 180° when open; dropdown items with gold hover/selected states per design-style.md; emits `onSelect(badge)` | src/components/kudo-modal/badge-selector.tsx
- [x] T024 [US3] Write component tests for `BadgeSelector`: opens dropdown on click, closes on selection, fetches badges once (not on re-open), emits selected badge, chevron rotates | src/components/kudo-modal/badge-selector.tsx

**Checkpoint**: US3 independently testable — BadgeSelector works as a standalone component

---

## Phase 5: US4 — Rich Text Editor (Priority: P1)

**Goal**: User can write a kudo message with Bold/Italic/Underline formatting, type "@" to mention colleagues (with suggestion dropdown), and see a live character counter that enforces a 500-char limit.

**Independent Test**: Type text → counter updates to `n/500`; select text + click B → bold renders; type "@" + 2 chars → suggestion dropdown appears with matching colleagues; paste text exceeding 500 chars → truncated at 500; counter turns red at 500/500.

### Component (US4)

- [x] T025 [US4] Create `RichTextEditor` component using Tiptap `useEditor` with `StarterKit` + `Mention({ suggestion: { items: fetchUsersForMention } })` + `CharacterCount({ limit: 500 })`; render formatting toolbar (B/I/U/List — 28×28px per design-style.md); render character counter `{count}/500` below (turns `#EF4444` at limit); `@` triggers Tippy.js suggestion popup calling `GET /api/users/search`; emits `content` (HTML string) via `onChange` prop | src/components/kudo-modal/rich-text-editor.tsx
- [x] T026 [US4] Write component tests for `RichTextEditor`: char counter updates on input, Bold applies on toolbar click, counter turns red at 500, paste truncates at 500, `@mention` fires search | src/components/kudo-modal/rich-text-editor.tsx

**Checkpoint**: US4 independently testable — RichTextEditor formats, counts characters, and handles @mention

---

## Phase 6: US1 + US7 — Form Submission & Modal (Priority: P1) 🎯 MVP

**Goal**: All components wired together into a fully functional modal. User fills in form and submits → kudo created, modal closes, live board updates. User can cancel/close at any time.

**Independent Test**:
- **US1**: Open modal → fill recipient + badge + content → click Gửi → success toast appears → kudo appears on live board.
- **US7**: Open modal → fill partial data → click Hủy → modal closes, data discarded. Press Escape → modal closes. Click backdrop → modal closes.

### Form Hook (TDD)

- [x] T027 Write failing tests for `useKudoForm` (RED): validation fails if recipient missing, badge missing, or content empty; `isSubmitting` blocks double-submit; 401 response triggers router redirect; 10s AbortController timeout sets submitError; image upload partial failure continues without aborting; success calls `onSuccess()` | src/hooks/__tests__/use-kudo-form.test.ts
- [x] T028 Implement `useKudoForm` hook (GREEN): state `{ recipients, selectedBadge, content, hashtags, images, isSubmitting, submitError, fieldErrors }`; actions `{ addRecipient, removeRecipient, setBadge, setContent, addHashtag, removeHashtag, addImages, removeImage, submit, reset }`; submission flow: validate → parallel image upload (Supabase Storage browser client) → `fetch POST /api/kudos` with 10s AbortController → handle 401/422/timeout/success | src/hooks/use-kudo-form.ts

### Toast Component

- [x] T029 [P] Create `Toast` component: `position: fixed top-4 right-4 z-50`; `bg-[#0A1E2B]` with gold border; accepts `message: string` and `type: 'success'|'error'`; auto-dismisses after 4s via `setTimeout` (cleared on unmount) | src/components/ui/toast.tsx

### Modal Assembly

- [x] T030 Create `KudoModal` component: backdrop (`onClick` → `onClose`); modal container (`e.stopPropagation()`); manual focus trap (collect focusable elements on mount, cycle Tab/Shift+Tab within modal); `useEffect` Escape key listener; fixed header (`flex-shrink-0`) + scrollable body (`flex-1 overflow-y-auto`) + fixed footer (`flex-shrink-0`); open/close CSS animation (`opacity + scale 0.95→1.0`, 200ms); wire `RecipientSearch`, `BadgeSelector`, `RichTextEditor`, `HashtagInput`, `ImageUpload` to `useKudoForm`; render field errors below each field; render global submit error below action buttons; `triggerRef` prop for focus restoration on close | src/components/kudo-modal/kudo-modal.tsx
- [x] T031 Update `KudosSection` to `"use client"`: add `isOpen: boolean` state; add `triggerRef` for "Viết Kudo" button; add "Viết Kudo" CTA button (gold-bordered per design-style.md); conditionally render `<KudoModal isOpen={isOpen} onClose={...} triggerRef={triggerRef} onSuccess={...} />`; conditionally render `<Toast />` on success | src/components/home/kudos-section.tsx

### Integration Tests

- [x] T032 Write integration tests for modal submit flow: mock `fetch` for all 3 API calls; test open → fill → submit → modal closes + toast visible; test Escape closes; test backdrop click closes; test Hủy button closes; test field error display on empty submit | src/components/kudo-modal/kudo-modal.tsx

**Checkpoint**: US1 + US7 complete and independently testable — full kudo creation flow works end-to-end

---

## Phase 7: US5 — Add Hashtags (Priority: P2)

**Goal**: User can add hashtag pills to their kudo, remove them, and is blocked from adding more than 5.

**Independent Test**: Type a hashtag → press Enter → gold pill appears; click "×" on pill → removed; add 5 pills → "Thêm hashtag" button hides + "Tối đa 5 hashtag" hint appears; type special chars → stripped automatically.

### Component (US5)

- [x] T033 [US5] Create `HashtagInput` component: owns `hashtagInput: string` state; strip `/[^a-zA-Z0-9\-]/g` on change; Enter → call `onAdd(tag)` and clear input; display existing pills (gold `#C8A96E`, `rounded-full`, `#0F2A3D` bg per design-style.md) with "×" remove button (calls `onRemove(tag)`); hide "Thêm hashtag" button and show "Tối đa 5 hashtag" hint when `hashtags.length >= 5` | src/components/kudo-modal/hashtag-input.tsx
- [x] T034 [US5] Write component tests for `HashtagInput`: pill renders on Enter, invalid chars stripped, max-5 guard hides button, "×" fires onRemove, input clears after add | src/components/kudo-modal/hashtag-input.tsx

**Checkpoint**: US5 independently testable — hashtag pills add/remove with max-5 guard

---

## Phase 8: US6 — Attach Images (Priority: P2)

**Goal**: User can upload up to 5 image thumbnails, preview them inline, remove individual images, and is blocked from adding a 6th.

**Independent Test**: Click "+" → select valid image → 64×64px thumbnail appears with "×" button; click "×" → thumbnail removed; select 5 images → add "+" button hides; select image > 5MB → error message appears, image not added.

### Component (US6)

- [x] T035 [US6] Create `ImageUpload` component: own `previews: string[]` (object URLs); on file select: validate MIME type (`image/jpeg|png|gif|webp`) and size (≤ 5MB) — show inline error on invalid; valid files: create object URLs via `URL.createObjectURL`, add to `previews`, emit via `onAdd(files)`; "×" on thumbnail: `URL.revokeObjectURL(preview)` then call `onRemove(index)`; hide add button when `images.length >= 5`; `useEffect` cleanup revokes all object URLs on unmount to prevent memory leaks | src/components/kudo-modal/image-upload.tsx
- [x] T036 [US6] Write component tests for `ImageUpload`: valid file adds thumbnail, >5MB file shows error and is rejected, wrong MIME type rejected, 5-image limit hides add button, "×" revokes object URL and calls onRemove, useEffect cleanup spies on revokeObjectURL | src/components/kudo-modal/image-upload.tsx

**Checkpoint**: US6 independently testable — image upload, preview, and removal with max-5 guard and memory-safe cleanup

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, full accessibility, E2E tests, and security hardening.

### Responsive Layout

- [x] T037 [P] Implement mobile bottom-sheet layout for `KudoModal` (`< 768px`): `width: 100vw`, `max-height: 100dvh`, `border-radius: 16px 16px 0 0`, `position: fixed bottom-0`, backdrop `align-items: flex-end`; action buttons stack vertically full-width; image thumbnails 56×56px; title 16px | src/components/kudo-modal/kudo-modal.tsx
- [x] T038 [P] Implement tablet layout (`768px–1023px`): `width: min(560px, 90vw)`, centered; and desktop (`≥ 1024px`): `width: 600px`, centered per design-style.md breakpoints | src/components/kudo-modal/kudo-modal.tsx

### Accessibility

- [x] T039 [P] Add all ARIA attributes per spec: modal `role="dialog" aria-modal="true" aria-labelledby="kudo-modal-title"`; recipient input `aria-label` + `aria-autocomplete` + `aria-expanded` + `aria-haspopup`; badge selector `role="combobox"` + `aria-expanded`; error messages `role="alert"`; required fields `aria-required="true"`; send button `aria-busy` + `aria-disabled` when loading | src/components/kudo-modal/kudo-modal.tsx
- [x] T040 [P] Verify keyboard Tab order (Close → Người nhận → Danh hiệu → Nội dung → Hashtag → Image → Hủy → Gửi); verify arrow keys navigate dropdowns; verify Enter selects in dropdowns; verify Escape closes dropdowns then modal | src/components/kudo-modal/kudo-modal.tsx
- [x] T041 [P] Run color contrast audit: verify all text/background combinations meet WCAG AA (4.5:1 minimum); fix any violations; white on `#0A1E2B` = 14.5:1 ✅, `#C8A96E` on `#00101A` ✅ | src/components/kudo-modal/

### Security

- [x] T042 [P] Add OWASP XSS test cases to `kudos-submit.test.ts`: submit payload with `<script>`, `onerror=`, `javascript:` in content → verify sanitised output contains none of these | src/services/__tests__/kudos-submit.test.ts
- [x] T043 [P] Run `yarn audit` — verify no high/critical vulnerabilities from new packages (Tiptap, tippy.js, sanitize-html); document any accepted exceptions per Constitution V | package.json

### E2E Tests

- [x] T044 Write E2E test — US1 happy path: authenticated user opens modal → fills recipient + badge + content → clicks Gửi → verifies success toast + kudo appears on live board | tests/e2e/viet-kudo.spec.ts
- [x] T045 [P] Write E2E test — US7 cancel scenarios: click Hủy → modal closes; press Escape → modal closes; click backdrop → modal closes | tests/e2e/viet-kudo.spec.ts
- [x] T046 [P] Write E2E test — validation errors: click Gửi with empty form → three inline error messages appear (Người nhận, Danh hiệu, Nội dung) | tests/e2e/viet-kudo.spec.ts
- [x] T047 [P] Write E2E test — US6 image limit: add 5 images → "+" button disappears; verify no 6th image can be added | tests/e2e/viet-kudo.spec.ts
- [x] T048 [P] Write E2E test — responsive: verify modal renders correctly at 360px, 768px, 1440px (no horizontal scroll, no layout overflow) | tests/e2e/viet-kudo.spec.ts

---

## Phase 10: Bug Fixes (UI & Logic Review)

**Purpose**: Fix visual and logic regressions discovered during design review of implemented screens.

- [x] T049 Install `@tiptap/extension-underline` and add to RichTextEditor extensions — `StarterKit` does NOT include Underline; `toggleUnderline()` silently fails | src/components/kudo-modal/rich-text-editor.tsx
- [x] T050 [P] Fix `RecipientSearch` dropdown clipped by modal body `overflow-y-auto` — use `createPortal` + `position: fixed` with `getBoundingClientRect()` | src/components/kudo-modal/recipient-search.tsx
- [x] T051 [P] Fix `BadgeSelector` dropdown clipped by modal body `overflow-y-auto` — use `createPortal` + `position: fixed` with `getBoundingClientRect()` | src/components/kudo-modal/badge-selector.tsx
- [x] T052 [P] Fix modal footer border opacity: `border-gold/10` → `border-gold/20` (design: `rgba(200,169,110,0.2)`) | src/components/kudo-modal/kudo-modal.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation: Types → Utils → Services → Routes)
    ↓ (all user story phases depend on Phase 2)
Phase 3 (US2: RecipientSearch) ──────────────┐
Phase 4 (US3: BadgeSelector)  ───────────────┤ all can run in
Phase 5 (US4: RichTextEditor) ───────────────┤ parallel once
                                              ↓ Phase 2 done
Phase 6 (US1+US7: useKudoForm + KudoModal) ←─┘
    ↓
Phase 7 (US5: HashtagInput)  ─┐ both depend on
Phase 8 (US6: ImageUpload)  ──┘ Phase 6 (wired into modal)
    ↓
Phase 9 (Polish + E2E)
```

### Within Phase 2 (Foundation)

```
T009 (Types)
    ↓
T010 → T011 (mention-parser: RED → GREEN)
    ↓
T012/T013/T014/T015/T016 (service tests in parallel [P])
    ↓
T015/T016/T017 (implement services: badges [P], users [P], kudos-submit)
    ↓
T018/T019/T020 (Route Handlers: badges [P], users/search [P], kudos)
```

### Within Phase 6 (US1+US7)

```
T027 → T028 (useKudoForm: RED → GREEN)   T029 [P] (Toast)
                    ↓                          ↓
                T030 (KudoModal — requires US2+US3+US4+US5+US6 components)
                    ↓
                T031 (KudosSection update)
                    ↓
                T032 (integration tests)
```

### Parallel Opportunities

| Group | Tasks | Note |
|-------|-------|------|
| Phase 1 | T006, T007 | Different env/assets files |
| Phase 2 services (write tests) | T012, T013, T014 | Different service files |
| Phase 2 services (implement) | T015, T016 | badges.ts and users.ts independent |
| Phase 2 routes | T018, T019 | badges and users/search routes |
| Phase 3, 4, 5 | T021–T026 | All 3 component sets independent |
| Phase 9 a11y/security | T039, T040, T041, T042, T043 | Different concerns |
| Phase 9 E2E | T045, T046, T047, T048 | Different scenarios |

---

## Implementation Strategy

### MVP (P1 User Stories only — Phases 1–6)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundation)
3. Complete Phases 3 + 4 + 5 in parallel (components)
4. Complete Phase 6 (modal assembly — wires all P1 components)
5. **STOP AND VALIDATE**: Full kudo create flow works end-to-end
6. Deploy MVP

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 + 4 + 5 (parallel) → All P1 components ready
3. Phase 6 → MVP: Full kudo submit flow
4. Phase 7 + 8 → P2 features: hashtags + images
5. Phase 9 → Production-ready: responsive, accessible, E2E tested

---

## Notes

- Mark each task `[x]` as soon as it's complete — do not batch-complete
- Run `yarn test` after each phase before proceeding to the next
- Commit after each logical group (e.g., after all Phase 2 services pass)
- The `KudoModal` (T030) requires all sub-components (RecipientSearch, BadgeSelector, RichTextEditor, HashtagInput, ImageUpload) to be at least stubbed before assembly; build stubs if not yet complete
- For TDD tasks: write the test (RED), verify it fails, then implement (GREEN), then verify it passes — never skip the RED step
- Answer Open Questions Q5+Q6 before T004 and T019 (Supabase Storage bucket type + user_profiles access strategy)
- Total tasks: **48** across 9 phases
