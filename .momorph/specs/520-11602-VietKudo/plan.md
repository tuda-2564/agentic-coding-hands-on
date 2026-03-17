# Implementation Plan: Viết Kudo

**Frame**: `520-11602-VietKudo`
**Date**: 2026-03-12
**Spec**: `specs/520-11602-VietKudo/spec.md`
**Design**: `specs/520-11602-VietKudo/design-style.md`

---

## Summary

Implement a modal dialog that allows authenticated Sun* employees to compose and submit peer-recognition kudos. The modal includes: multi-recipient search (debounced), badge selection, a rich-text editor with `@mention` support, hashtag pills, and multi-image upload (Supabase Storage). On submission, the form calls `POST /api/kudos`, which persists to Supabase and triggers the existing Realtime subscription on `KudosLiveBoard` to surface the new entry automatically.

The feature requires:
1. **New API routes**: `POST /api/kudos`, `GET /api/users/search`, `GET /api/badges`
2. **DB schema extension**: `kudos` table gains `badge_id`, `hashtags[]`, `image_urls[]`, `recipient_ids[]`; new `badges` table
3. **New dependencies**: `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-mention` + `tippy.js` (required by mention extension); `sanitize-html` + `@types/sanitize-html` (server-side HTML sanitisation per Constitution V)
4. **Modified**: `KudosSection` gains a "Viết Kudo" trigger button; `Kudo` type extended. `KudosLiveBoard` is NOT changed — backward compat achieved by `POST /api/kudos` populating legacy `receiver_id`/`receiver_name` fields.

---

## Technical Context

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, RSC + Client Components) |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS v4 |
| Auth / DB / Storage | Supabase (`@supabase/ssr` v0.8, `@supabase/supabase-js` v2) |
| Edge Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| Rich Text | **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-mention`) — new dep, see justification |
| Testing | Vitest + `@testing-library/react` (unit/component); Playwright (E2E) |
| State Management | Local component state (no global store needed) |
| API Style | REST Route Handlers, edge-runtime compatible |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Rule | Principle | Status |
|------|-----------|--------|
| Client Components (`"use client"`) only where interactive | II | ✅ Modal is `"use client"`; API routes are RSC/Route Handlers |
| RSC by default | II | ✅ New API routes are Route Handlers; page.tsx stays RSC |
| Route Handlers edge-compatible | II | ✅ No Node.js-only APIs used |
| Supabase `@supabase/ssr` for server access | III | ✅ Route Handlers use `createClient()` from `libs/supabase/server.ts` |
| Browser Supabase client for client uploads | III | ✅ Image upload uses `libs/supabase/client.ts` |
| RLS enabled on all tables | III | ✅ Planned in schema (see DB section) |
| Mobile-first responsive | IV | ✅ Mobile bottom-sheet + tablet/desktop centered modal |
| No `dangerouslySetInnerHTML` (XSS) | V | ✅ Tiptap outputs HTML; `sanitize-html` strips unsafe tags server-side before Supabase insert; display uses Tiptap renderer (no raw `dangerouslySetInnerHTML`) |
| `HttpOnly` cookies for auth | V | ✅ Inherited from existing Supabase SSR setup |
| Secrets in env only | V | ✅ Supabase URL/key from `process.env` |
| TDD: tests before implementation | VI | ✅ Unit + E2E tests planned per phase |
| 80% coverage on services/utils | VI | 📋 Planned in each phase |
| Folder structure: `@/*` aliases | I | ✅ All imports use `@/` alias |
| kebab-case filenames | I | ✅ All new files use kebab-case |

**New Dependency Justification:**

| Package | Version | Justification |
|---------|---------|---------------|
| `@tiptap/react` | ^2 | Rich text editor required by FR-004. `contenteditable` + `execCommand` is deprecated and XSS-prone. `dangerouslySetInnerHTML` is forbidden by Constitution Principle V. Tiptap is purpose-built for React, XSS-safe HTML output, and provides a first-class `@mention` extension meeting FR-004 and FR-012. |
| `@tiptap/starter-kit` | ^2 | Bundles Bold/Italic/Underline/List extensions — matches toolbar spec exactly. |
| `@tiptap/extension-mention` | ^2 | `@mention` in-content colleague tagging (FR-004 + FR-012). No viable alternative without re-implementing a suggestion engine from scratch. |
| `@tiptap/extension-character-count` | ^2 | Character count + 500-char hard limit with paste truncation. **Not included in StarterKit** — must be installed separately. Used via `limit: 500` option. |
| `tippy.js` | ^6 | Required peer dependency of `@tiptap/extension-mention` for the suggestion popup UI. Cannot use extension without it. |
| `sanitize-html` | ^2 | Server-side HTML sanitisation in `POST /api/kudos` before database insert (Constitution Principle V — XSS A03). Uses `htmlparser2` (pure JS, edge-compatible). Strips disallowed tags/attributes server-side. |
| `@types/sanitize-html` | ^2 | TypeScript types for `sanitize-html` (devDependency). |

**Alternatives rejected**: Quill (legacy, poor SSR support), Slate.js (over-engineered for this use case), plain `<textarea>` (no formatting or mention capability), Tiptap JSON output (would require a custom renderer component on display, adding complexity).

---

## Architecture Decisions

### Frontend

- **Component pattern**: Feature folder `src/components/kudo-modal/` with atomic sub-components
- **Modal trigger**: `KudosSection` becomes `"use client"` and manages `isOpen` state; renders `KudoModal` conditionally
- **State**: All form state in `useKudoForm` custom hook — keeps `KudoModal` lean
- **Image upload**: Browser Supabase client uploads file to `kudos-images/{user_id}/{uuid}.ext` before form POST. Parallel uploads for multiple files.
- **Mention flow**: Tiptap extension triggers user search; on select, stores `{ id, label }` node; serialised to `{ content, mentions: string[] }` on submit
- **Live board update**: After successful `POST /api/kudos`, Supabase Realtime (already subscribed in `useKudosStream`) fires `postgres_changes INSERT` and prepends the new kudo automatically — no manual refetch needed

### Backend (Route Handlers)

- **`POST /api/kudos`**: Validates session (401 → `{ error: 'Unauthorized' }`). Accepts `{ recipient_ids, badge_id, content, hashtags, image_urls }`. Manual validation (no Zod — not in package.json): checks required fields, returns 422 with `{ field, message }` on failure. Sanitises `content` HTML with `sanitize-html` (allowList: `b, i, u, ul, li, span[data-mention-id]`). Inserts into `kudos` table **also populating `receiver_id = recipient_ids[0]` and `receiver_name` for KudosLiveBoard backward compat**. Extracts `data-mention-id` attribute values from content and bulk-inserts into `notifications` table. Returns created kudo row. Note: `POST /api/notifications` (listed in spec as separate endpoint) is handled inline in this handler — no separate route needed.
- **`GET /api/users/search?q={query}`**: Validates session. Requires `q` param ≥ 2 chars. Queries `user_profiles` via `supabase.from('user_profiles').select(...)` — this view wraps `auth.users`. **Critical**: The view must be created with `SECURITY DEFINER` OR the Route Handler must use the Supabase service role key (stored as `SUPABASE_SERVICE_ROLE_KEY` in env) to bypass RLS on `auth.users`. Returns `{ id, full_name, avatar_url }[]`, max 20 results.
- **`GET /api/badges`**: Validates session. Fetches all rows from `badges` table. Add `Cache-Control: public, max-age=3600` header (static data). Returns `Badge[]`.
- All three routes use `createClient()` from `@/libs/supabase/server` for auth context. `/api/users/search` uses service role client for `auth.users` access.

### Database

New tables / changes (via Supabase CLI migrations):

```sql
-- New table
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_url text,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_public_read" ON badges FOR SELECT USING (true);

-- Extend kudos table
ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS recipient_ids uuid[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge_id uuid REFERENCES badges(id),
  ADD COLUMN IF NOT EXISTS hashtags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
  -- receiver_id and receiver_name KEPT: POST /api/kudos populates them with
  -- recipient_ids[0] so KudosLiveBoard keeps working without changes

-- user_profiles view (SECURITY DEFINER so authenticated users can query it)
-- Alternative: query auth.users using service_role key in Route Handler
CREATE OR REPLACE VIEW user_profiles
  WITH (security_invoker = false)
AS
  SELECT id, email,
    raw_user_meta_data->>'full_name' AS full_name,
    raw_user_meta_data->>'avatar_url' AS avatar_url
  FROM auth.users;
-- RLS on view: authenticated users can read any profile (for colleague search)
GRANT SELECT ON user_profiles TO authenticated;

-- notifications table (for @mention)
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  kudo_id uuid NOT NULL REFERENCES kudos(id),
  type text DEFAULT 'mention',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_owner_read" ON notifications FOR SELECT USING (auth.uid() = user_id);
```

### Supabase Storage

- Bucket: `kudos-images` (public or signed URLs)
- Path: `{user_id}/{uuid}.{ext}`
- RLS: authenticated user can INSERT into their own subfolder; everyone can SELECT (if public bucket)

---

## Project Structure

### Documentation

```text
.momorph/specs/520-11602-VietKudo/
├── spec.md              ✅ Feature specification
├── design-style.md      ✅ Design specifications
├── plan.md              ← This file
└── tasks.md             (next step — run /momorph.tasks)
```

### New Files

| File | Purpose |
|------|---------|
| `src/components/kudo-modal/kudo-modal.tsx` | Root modal component — backdrop, container, focus trap (manual tabindex cycling), Escape handler, open/close animations |
| `src/components/kudo-modal/recipient-search.tsx` | Searchable multi-select: owns `query`, `results`, `isDropdownOpen` state; calls `/api/users/search` with 300ms debounce; emits `recipients` array up to `useKudoForm` |
| `src/components/kudo-modal/badge-selector.tsx` | Dropdown badge picker: fetches `/api/badges` on first open, caches in local state; owns `isOpen` state; emits `selectedBadge` up to `useKudoForm` |
| `src/components/kudo-modal/rich-text-editor.tsx` | Tiptap editor: `StarterKit` (Bold/Italic/Underline/List) + `Mention` extension (Tippy.js popup) + `CharacterCount({ limit: 500 })`; char counter `{count}/500`, turns red at limit; blocks further input and truncates paste via CharacterCount limit; calls `/api/users/search` for @mention suggestions; emits `content` (HTML string) up |
| `src/utils/mention-parser.ts` | `extractMentionIds(html: string): string[]` — parses `data-mention-id` attributes from sanitised HTML; used in `kudos-submit.ts` to extract mentioned user IDs |
| `src/components/kudo-modal/hashtag-input.tsx` | Pill list + input: owns `hashtagInput` state; Enter → add pill (strip non-alphanumeric except "-"); max 5 guard; "×" → remove; emits `hashtags[]` up |
| `src/components/kudo-modal/image-upload.tsx` | Thumbnail grid + file picker: owns `previews` (object URLs, revoked on unmount); max 5 guard; 5MB validation; emits `images` (File[]) up; previews via `URL.createObjectURL` |
| `src/components/ui/toast.tsx` | Success/error toast notification: fixed top-right, auto-dismisses after 4s (US1 Scenario 3) |
| `src/hooks/use-kudo-form.ts` | Form state for submission payload: `recipients: Colleague[]`, `selectedBadge: Badge\|null`, `content: string`, `hashtags: string[]`, `images: File[]`, `isSubmitting: boolean`, `submitError: string\|null`, `fieldErrors: Record<string,string>`. Actions: addRecipient, removeRecipient, setBadge, setContent, addHashtag, removeHashtag, addImages, removeImage, submit, reset |
| `src/services/badges.ts` | `getBadges(): Promise<Badge[]>` — called by `/api/badges` Route Handler |
| `src/services/users.ts` | `searchUsers(query: string, serviceRoleClient): Promise<Colleague[]>` — called by `/api/users/search` Route Handler using service role client |
| `src/services/kudos-submit.ts` | `submitKudo(payload, supabase): Promise<Kudo>` — inserts kudos row + notifications rows; called by `POST /api/kudos` Route Handler |
| `src/app/api/kudos/route.ts` | `POST /api/kudos` Route Handler (edge-compatible) |
| `src/app/api/users/search/route.ts` | `GET /api/users/search` Route Handler (edge-compatible) |
| `src/app/api/badges/route.ts` | `GET /api/badges` Route Handler (edge-compatible, cached) |
| `supabase/migrations/YYYYMMDD_viet_kudo_schema.sql` | DB migration: badges table, kudos column extensions, notifications table, user_profiles view |
| `public/icons/search.svg` | Search icon for recipient input (check existing public/icons/ first) |
| `public/icons/hash.svg` | Hash "#" prefix icon for hashtag input |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/kudos.ts` | Add `Badge { id, name, icon_url, description }`, `Colleague { id, full_name, avatar_url }`, `KudoSubmitPayload { recipient_ids, badge_id, content, hashtags, image_urls }` types; extend `Kudo` with optional `badge_id`, `hashtags`, `image_urls`, `recipient_ids` (existing `receiver_id` / `receiver_name` kept) |
| `src/components/home/kudos-section.tsx` | Add `"use client"` directive; add `isOpen: boolean` state; add "Viết Kudo" CTA button (gold-bordered, triggers `setIsOpen(true)`); conditionally render `<KudoModal isOpen onClose={...} />`. `initialKudos` prop unchanged. |
| `src/services/kudos.ts` | No change to `getRecentKudos`. |
| `src/libs/supabase/server.ts` | Add `createServiceRoleClient()` export using `SUPABASE_SERVICE_ROLE_KEY` for `user_profiles` queries. |

### Tests

| File | Type | Covers |
|------|------|--------|
| `src/services/__tests__/badges.test.ts` | Unit (TDD — write first) | `getBadges()` Supabase call |
| `src/services/__tests__/users.test.ts` | Unit (TDD — write first) | `searchUsers()` Supabase call |
| `src/services/__tests__/kudos-submit.test.ts` | Unit (TDD — write first) | `submitKudo()` insert + `receiver_id` backfill + notifications insert |
| `src/utils/__tests__/mention-parser.test.ts` | Unit (TDD — write first) | `extractMentionIds()` with valid HTML, no mentions, XSS payloads |
| `src/hooks/__tests__/use-kudo-form.test.ts` | Unit (TDD — write first) | Validation, double-submit guard, 401 redirect, 10s timeout, partial image upload failure |
| `tests/e2e/viet-kudo.spec.ts` | E2E (Playwright) | US1 happy path, US7 cancel/close, validation errors, US6 image limit |

---

## Implementation Strategy

### Phase 0 — DB Migration & Asset Preparation

1. Install new packages: `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-character-count tippy.js sanitize-html && yarn add -D @types/sanitize-html`
2. Write Supabase CLI migration file `supabase/migrations/YYYYMMDD_viet_kudo_schema.sql` (schema above)
3. Apply migration: `supabase db push` (or `supabase migration up`)
4. Create `kudos-images` Supabase Storage bucket via dashboard or CLI with authenticated user INSERT policy
5. Seed `badges` table with initial data (at least 3–5 badges with name + icon_url)
6. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and `.env.example` (for user search)
7. Verify/add missing SVG icons to `public/icons/`: `search.svg`, `hash.svg` (check existing files first)
8. Add `createServiceRoleClient()` to `src/libs/supabase/server.ts`

### Phase 1 — Types, Service Layer & API Routes (TDD)

1. Extend `src/types/kudos.ts` with `Badge`, `Colleague`, `KudoSubmitPayload`
2. Create `src/utils/mention-parser.ts` — stub `extractMentionIds(html: string): string[]`
3. **Write failing tests first** (RED):
   - `src/utils/__tests__/mention-parser.test.ts`
   - `src/services/__tests__/badges.test.ts`
   - `src/services/__tests__/users.test.ts`
   - `src/services/__tests__/kudos-submit.test.ts`
4. Implement to make tests green (GREEN):
   - `src/utils/mention-parser.ts` — implement using regex on `data-mention-id` attributes
   - `src/services/badges.ts` — `getBadges()`
   - `src/services/users.ts` — `searchUsers(query, serviceRoleClient)`
   - `src/services/kudos-submit.ts` — `submitKudo(payload, supabase)` (calls `extractMentionIds` internally)
5. Create API Route Handlers (test each with `fetch` mocks or integration tests):
   - `GET /api/badges` — include `Cache-Control: public, max-age=3600` + CORS header
   - `GET /api/users/search` — min 2 chars guard, service role client, max 20 results + CORS header
   - `POST /api/kudos` — session check, manual validation, `sanitize-html`, `submitKudo`, 422/401/500 responses + CORS header

> **CORS note** (Constitution V — Security Misconfiguration A05): All three Route Handlers MUST set explicit `Access-Control-Allow-Origin` to the app origin (from `process.env.NEXT_PUBLIC_APP_URL`). Wildcard `*` is forbidden in production.

### Phase 2 — Form State Hook

1. Create `src/hooks/use-kudo-form.ts`:
   - **State**: `recipients: Colleague[]`, `selectedBadge: Badge|null`, `content: string`, `hashtags: string[]`, `images: File[]`, `isSubmitting: boolean`, `submitError: string|null`, `fieldErrors: Record<string,string>`
   - **Actions**: `addRecipient`, `removeRecipient`, `setBadge`, `setContent`, `addHashtag`, `removeHashtag`, `addImages`, `removeImage`, `submit`, `reset`
   - **Validation on submit**: recipients.length > 0, selectedBadge != null, content.trim().length > 0 → if invalid, set fieldErrors and abort
   - **Submission flow**:
     1. `setIsSubmitting(true)`, clear errors
     2. Upload `images` in parallel to Supabase Storage (browser client), collect `image_urls[]`
     3. If any image upload fails: show per-image error, do NOT abort — continue with successfully uploaded images
     4. `fetch('POST /api/kudos', payload)` with `AbortController` timeout of **10 seconds** (spec edge case)
     5. On timeout (10s): `setSubmitError("Gửi kudo quá thời gian. Vui lòng thử lại.")`, re-enable form
     6. On 401 response: `router.push('/login')` — session expired (spec edge case)
     7. On 422 response: map field errors from response body into `fieldErrors`
     8. On other error: `setSubmitError("Gửi kudo thất bại. Vui lòng thử lại.")`
     9. On success: call `onSuccess()` callback (closes modal, shows toast)
   - `reset()` clears all state (called on modal close)
2. Write unit tests for `use-kudo-form` covering: validation with missing fields, double-submit guard (isSubmitting prevents second call), 401 redirect, 10s timeout error, image upload partial failure, successful submission state transitions

### Phase 3 — Atomic Components (US2, US3, US5, US6)

Build and test each component in isolation:

1. **`RecipientSearch`** — manages own `query: string`, `results: Colleague[]`, `isDropdownOpen: boolean`. Debounced fetch (300ms) to `GET /api/users/search?q=`. Renders chips for selected recipients (from `recipients` prop). "×" on chip calls `onRemove`. Empty state: "Không tìm thấy đồng nghiệp". Min 2 chars before search fires.
2. **`BadgeSelector`** — manages own `badgeList: Badge[]`, `isDropdownOpen: boolean`. Fetches `GET /api/badges` once on first open (lazy, not on modal mount). Chevron rotates 180° when open. Selected badge shows icon + name. Dropdown items: hover gold tint, selected gold background.
3. **`RichTextEditor`** — Tiptap `useEditor` with `StarterKit` + `Mention({ suggestion: { items: fetchUsers } })` + `CharacterCount({ limit: 500 })`. `CharacterCount` blocks input and truncates paste once the 500-char ceiling is hit (use `editor.storage.characterCount.characters()`). Character counter below: `{count}/500`, turns `#EF4444` at limit. `@` triggers Tippy.js suggestion popup (calls `/api/users/search`). Emits `content` (HTML string) via `onChange` prop.
4. **`HashtagInput`** — manages own `hashtagInput: string`. Strips chars matching `/[^a-zA-Z0-9\-]/g` on change. Enter → appends to `hashtags` prop (via `onAdd`). Hides "Thêm hashtag" button + shows "Tối đa 5 hashtag" hint when `hashtags.length >= 5`. "×" on pill calls `onRemove`.
5. **`ImageUpload`** — manages own `previews: string[]` (object URLs). On file select: validate type (`image/jpeg|png|gif|webp`), size (≤ 5MB) — show inline error on invalid. Valid files added to `previews` + emit via `onAdd(files)`. "×" on thumbnail: `URL.revokeObjectURL(preview)` then calls `onRemove(index)`. Hides add button when `images.length >= 5`. `useEffect` cleanup revokes all object URLs on unmount.
6. **`Toast`** — fixed `top-4 right-4 z-50`, `bg-[#0A1E2B]` card with gold border, auto-dismisses after 4s via `setTimeout`. Accepts `message` and `type: 'success'|'error'`.

### Phase 4 — Modal Assembly (US1, US7)

1. Create `src/components/kudo-modal/kudo-modal.tsx`:
   - **Focus trap**: manual implementation — on mount, collect all focusable elements inside modal; on Tab key, cycle within that set; on Shift+Tab, reverse cycle. On close, `triggerRef.current?.focus()` to restore focus.
   - **Backdrop click**: `onClick` on backdrop div, `e.stopPropagation()` on modal container
   - **Escape key**: `useEffect` adds `keydown` listener to `document`; removes on unmount
   - **Scroll structure**: `flex flex-col overflow-hidden` container; header `flex-shrink-0`; body `flex-1 overflow-y-auto`; footer `flex-shrink-0`
   - **Animation**: CSS `transition: opacity, transform` — opens with `opacity-100 scale-100`, closed with `opacity-0 scale-95`; use `data-state="open|closed"` attribute + Tailwind transitions
   - **Success flow**: `useKudoForm.submit()` calls `onSuccess` → modal closes + `<Toast message="Gửi kudo thành công!" type="success" />` renders in `KudosSection`
   - **`triggerRef`**: passed from `KudosSection` so focus returns to "Viết Kudo" button on close
2. Update `KudosSection`:
   - Add `"use client"`, `useState<boolean>(false)` for `isOpen`
   - Add `useRef` for "Viết Kudo" button (`triggerRef`)
   - Add "Viết Kudo" button with gold border styling (see design-style.md)
   - Render `{isOpen && <KudoModal ... />}` and `{toastVisible && <Toast ... />}`
3. Phase 4 unit/integration: test modal opens/closes on Escape, backdrop click, Hủy button; test full submit with mocked `fetch` for all 3 API calls; test field error display

### Phase 5 — Responsive & Accessibility Polish

1. Mobile bottom-sheet layout (slide-up from bottom, `border-radius: 16px 16px 0 0`)
2. Tablet centered modal (`min(560px, 90vw)`)
3. Full keyboard navigation (Tab order, arrow keys in dropdowns)
4. Focus trap + focus restoration to trigger button on close
5. All ARIA attributes per spec (dialog, combobox, alert roles)
6. Color contrast audit (all WCAG AA)

### Phase 6 — E2E Tests

1. Write Playwright E2E tests covering:
   - US1: Open modal → fill form → submit → verify success toast + live board update
   - US7: Open modal → click Hủy → modal closes
   - Validation: submit empty form → field errors appear
   - Escape key closes modal
   - US6: Upload 5 images → add button hides

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap v2 + React 19 compatibility | Medium | High | Tiptap v2 targets React 18; React 19.1.4 is in use. Verify peer deps at install time. If compat issues arise, wrap with `--legacy-peer-deps` or wait for Tiptap v3 RC. Monitor for React 19 support in `@tiptap/react` changelog. |
| `sanitize-html` edge runtime compatibility | Low | High | `sanitize-html` uses `htmlparser2` (pure JS, no native addons). Should work in Cloudflare Workers but must be confirmed at deploy time. Fallback: replace with `xss` npm package (verified edge-compatible). |
| Tiptap `@mention` + `tippy.js` integration complexity | Medium | High | Use official extension API; allocate Phase 3 for isolated component build + test before modal assembly |
| `user_profiles` view requires service role key | Medium | High | `createServiceRoleClient()` added in Phase 0; `SUPABASE_SERVICE_ROLE_KEY` env var documented in `.env.example` |
| DB schema migration breaks existing kudos live board | Low | High | `ADD COLUMN IF NOT EXISTS`; POST handler populates legacy `receiver_id` + `receiver_name` fields |
| `sanitize-html` config too permissive (XSS) | Low | High | Explicit allowList in `kudos-submit.ts`: only `b, i, u, ul, li, span[data-mention-id]`; tested with OWASP XSS payloads in unit tests |
| Supabase Storage RLS misconfiguration | Low | High | Test PUT with anon token (expect 403) + authed token (expect 200) before launch |
| Tiptap char limit paste edge case | Medium | Medium | Use `@tiptap/extension-character-count` (separate package, added to deps); `limit: 500` option blocks paste that exceeds limit; test via simulated paste in unit test |
| Image `object URL` memory leaks | Low | Medium | `useEffect` cleanup in `ImageUpload` revokes all URLs; confirmed in unit test via `URL.revokeObjectURL` spy |
| Session expiry mid-form (401 from API) | Low | Medium | `useKudoForm` checks response status; 401 triggers `router.push('/login')` |
| Network timeout (submit > 10s) | Low | Medium | `AbortController` with 10s timeout in `useKudoForm`; shows timeout error and re-enables form |
| Mobile bottom-sheet animation jank | Low | Low | CSS `transform` + `will-change: transform`; test on Chrome DevTools mobile emulation |

### Estimated Complexity

| Area | Complexity | Reason |
|------|-----------|--------|
| Frontend | **High** | Rich text editor with @mention, focus trap, responsive bottom-sheet |
| Backend | **Medium** | 3 new Route Handlers + DB migration (all well-patterned) |
| Testing | **Medium** | E2E requires real Supabase for realtime verification |

---

## Integration Testing Strategy

### Test Scope

- [x] **Component ↔ Hook**: `KudoModal` + `useKudoForm` form state and validation
- [x] **Client ↔ API**: `RecipientSearch` debounced call → `/api/users/search`; `BadgeSelector` → `/api/badges`
- [x] **API ↔ Supabase**: Route Handlers insert/query correctly with RLS
- [x] **Storage**: Image upload to `kudos-images` bucket succeeds / fails gracefully
- [x] **Realtime**: After POST, `KudosLiveBoard` auto-updates via existing Supabase channel

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|-----------|---------------|
| UI ↔ Logic | Yes | Form submit → validation → API call → modal close / error show |
| App ↔ External API | Yes | `/api/users/search` debounce, `/api/badges` cache, `/api/kudos` POST |
| App ↔ Data Layer | Yes | Supabase insert, Storage upload, Realtime INSERT event |
| Cross-platform | Yes | Mobile bottom-sheet vs desktop centered modal at 360/768/1440px |

### Test Environment

- **Unit/component**: Happy-dom via Vitest; Supabase client mocked
- **E2E**: Real Supabase dev project (staging); Playwright runs against `next dev`
- **Isolation**: Fresh Supabase rows per E2E test run (test seeds + cleanup)

### Mocking Strategy

| Dependency | Unit Tests | E2E |
|-----------|-----------|-----|
| Supabase client | Mocked (vi.mock) | Real dev instance |
| Supabase Storage | Mocked | Real dev bucket |
| `/api/users/search` | Real handler with mocked Supabase | Real |
| `/api/badges` | Real handler with mocked Supabase | Real |

### Coverage Goals

| Area | Target |
|------|--------|
| `src/services/` | 80% |
| `src/hooks/use-kudo-form.ts` | 90% |
| E2E P1 stories (US1, US2, US3, US7) | 100% covered |

---

## Dependencies & Prerequisites

### Required Before Implementation Start

- [x] `constitution.md` reviewed
- [x] `spec.md` in Draft status (Q1–Q4 open questions do not block implementation of core flow)
- [x] `design-style.md` complete
- [ ] Supabase project has `kudos-images` Storage bucket created
- [ ] Tiptap packages installed (`yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-character-count tippy.js sanitize-html && yarn add -D @types/sanitize-html`)
- [ ] DB migration applied (badges table + kudos extensions)
- [ ] `badges` table seeded with initial badge data
- [ ] `.momorph/contexts/BACKEND_API_TESTCASES.md` — not present; API contracts self-contained in plan

### External Dependencies

- **Supabase Storage** bucket `kudos-images` with authenticated user INSERT policy
- **`user_profiles` view** on `auth.users` with `SECURITY DEFINER` grant OR `SUPABASE_SERVICE_ROLE_KEY` env var set
- **Tiptap v2** packages + `tippy.js` + `sanitize-html` (new additions to `package.json`)
- **`SUPABASE_SERVICE_ROLE_KEY`** env var in `.env.local` and Cloudflare Workers secrets

---

## Open Questions

> **Q1–Q4** do not block Phase 1–4 implementation. Must be answered before Phase 5 polish.
> **Q5–Q6** must be resolved during Phase 0 before any API work begins.

- [ ] **Q1 (Spec)**: Does the Figma frame include an "Ẩn danh" (anonymous) checkbox? If yes, add `is_anonymous: boolean` to `KudoSubmitPayload`, DB column, and new User Story.
- [ ] **Q2 (Spec)**: Is "Nickname" a visible form field (seen in Figma inspector panel) or a component property? If a field, add to form and `KudoSubmitPayload`.
- [ ] **Q3 (Spec)**: Confirm the exact helper text below the Danh hiệu field (currently assumed incorrect in design-style.md).
- [ ] **Q4 (Spec)**: Confirm Nội dung character limit — assumed **500** from screenshot counter.
- [ ] **Q5 (Infra — Phase 0 blocker)**: For `/api/users/search`, should the plan use `SUPABASE_SERVICE_ROLE_KEY` in the Route Handler, or create a `user_profiles` view with `SECURITY DEFINER`? Default plan: service role key approach (simpler, no migration complexity).
- [ ] **Q6 (Infra — Phase 0 blocker)**: Should `kudos-images` bucket be **public** (direct CDN URLs stored in `image_urls`, simplest) or **private with signed URLs** (generated per-request, more secure but adds latency)? Default plan: public bucket.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate phased task breakdown
2. **Install** Tiptap packages and run DB migration (Phase 0)
3. **Begin** Phase 1 — types and service layer with tests

---

## Notes

- **Live board backward compat**: The existing `KudosLiveBoard` reads `kudo.receiver_name` (from `receiver_id`). `POST /api/kudos` handler MUST populate `receiver_id = recipient_ids[0]` and `receiver_name = first_recipient.full_name` so new kudos display correctly without changing the live board component.
- **`/api/notifications` not a separate route**: Spec lists `POST /api/notifications` as a predicted API, but the plan intentionally handles this inline inside `POST /api/kudos` (single transaction). No separate notifications route is needed.
- **Supabase Realtime triggers on DB insert**: `useKudosStream` subscribes to `postgres_changes INSERT` on `kudos` table — new kudo auto-appears on live board without any extra wiring after `POST /api/kudos` succeeds.
- **State split**: `useKudoForm` owns submission payload state (`recipients[]`, `selectedBadge`, `content`, `hashtags`, `images[]`). Each sub-component (`RecipientSearch`, `BadgeSelector`, `HashtagInput`, `ImageUpload`) owns its own UI interaction state (search query, dropdown open, input text, previews) and emits changes up via callbacks.
- **Focus trap**: implemented manually (no additional library) — collects `querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')` within modal on open, cycles on Tab/Shift+Tab.
- **`page.tsx` stays RSC** — `KudosSection` becomes `"use client"` and manages its own modal state; `initialKudos` prop passed from server unchanged.
- **All Vietnamese UI text is hardcoded** — no i18n library needed per spec scope.
- **Image previews**: `URL.createObjectURL` → stored in `ImageUpload` local state → revoked in `useEffect` cleanup. Not in `useKudoForm` (file objects are there; previews are display-only).
