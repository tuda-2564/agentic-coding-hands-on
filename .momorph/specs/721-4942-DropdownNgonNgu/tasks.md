# Tasks: Dropdown Ngôn Ngữ (Language Selector)

**Frame**: `721:4942-DropdownNgonNgu`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download required assets and verify prerequisites

- [x] T001 Download EN flag icon (UK/GB) from Figma using `get_media_files` tool and save to `public/icons/flag-en.svg`. Verify it renders correctly at 24×24.
- [x] T002 Verify existing VN flag icon renders at 24×24 in `public/icons/flag-vn.svg`

**Checkpoint**: All flag assets available and verified

---

## Phase 2: Foundation (Add EN Language)

**Purpose**: Make EN language available in the dropdown — prerequisite for all styling work

**⚠️ CRITICAL**: Must complete before US1 styling work begins

- [x] T003 Add EN language entry `{ code: "EN", label: "English", flag: "/icons/flag-en.svg" }` to `DEFAULT_LANGUAGES` array in `src/components/header/header.tsx`

**Checkpoint**: Dropdown now shows both VN and EN options (with current styling)

---

## Phase 3: User Story 1 — Select a Language from Dropdown (Priority: P1) 🎯 MVP

**Goal**: Update dropdown visual styling to match Figma design — gold border, dark bg, selected highlight, correct spacing/dimensions

**Independent Test**: Click language button → dropdown opens with gold border, dark bg (#00070C), 8px radius, 6px internal padding → VN shows gold highlight bg → click EN → dropdown closes, button shows EN flag+code

### Dropdown Container Styling (US1)

- [x] T004 [US1] Update `<ul>` container background from `bg-[#0B0F12]` to `bg-[#00070C]` in `src/components/header/language-selector.tsx`
- [x] T005 [US1] Update `<ul>` container border from `border-[#2E3940]` to `border-[#998C5F]` (gold) in `src/components/header/language-selector.tsx`
- [x] T006 [US1] Update `<ul>` container border-radius from `rounded` to `rounded-lg` (8px) in `src/components/header/language-selector.tsx`
- [x] T007 [US1] Add `p-1.5` (6px internal padding) to `<ul>` container and remove fixed `w-[108px]` width (let container auto-size from items) in `src/components/header/language-selector.tsx`

### List Item Styling (US1)

- [x] T008 [US1] Update `<li>` item classes: replace `px-4 py-3` with `w-[108px] h-14 p-4`, replace `gap-2` with `gap-1`, add explicit `flex flex-row`, add `cursor-pointer` in `src/components/header/language-selector.tsx`
- [x] T009 [US1] Update flag image dimensions from `width={20} height={20}` to `width={24} height={24}` and add `className="shrink-0"` in `src/components/header/language-selector.tsx`
- [x] T010 [US1] Update code text classes from `text-sm` to `text-base leading-6 tracking-[0.15px] text-center` in `src/components/header/language-selector.tsx`

### Selected Item Highlight (US1)

- [x] T011 [US1] Add conditional styling on `<li>`: when `aria-selected="true"` apply `bg-[rgba(255,234,158,0.2)] rounded-sm`, when `aria-selected="false"` apply `rounded hover:bg-white/10` in `src/components/header/language-selector.tsx`

**Checkpoint**: US1 complete — dropdown visually matches Figma design with gold border, correct spacing, selected highlight

---

## Phase 4: User Story 2 — Close Dropdown Without Selection (Priority: P1)

**Goal**: Verify existing close behavior works correctly with new styling — no code changes expected

**Independent Test**: Open dropdown → click outside → dropdown closes. Open again → press Escape → dropdown closes. Verify no visual glitch on close.

- [x] T012 [US2] Verify outside click dismissal works in both controlled (App header) and uncontrolled (Login header) modes — no code changes, manual test only in `src/components/header/language-selector.tsx`
- [x] T013 [US2] Verify Escape key dismissal works in both modes — no code changes, manual test only in `src/components/header/language-selector.tsx`

**Checkpoint**: US2 verified — close behavior works with updated styling

---

## Phase 5: User Story 3 — Keyboard Navigation (Priority: P2)

**Goal**: Add focus-visible styles for keyboard-only navigation accessibility

**Independent Test**: Tab to language button → press Enter → dropdown opens → Tab between options → items show visible focus outline → press Escape → focus returns to trigger button

- [x] T014 [US3] Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50` to `<li>` items for keyboard navigation in `src/components/header/language-selector.tsx`

**Checkpoint**: US3 complete — keyboard users see visible focus indicators on dropdown items

---

## Phase 6: Polish & Regression Verification

**Purpose**: Verify no regressions across all pages using the LanguageSelector

- [x] T015 [P] Verify Login page header renders correctly with 2 languages (VN+EN) — dropdown opens/closes, styling matches design at `src/app/login/page.tsx`
- [x] T016 [P] Verify Homepage header renders correctly with updated dropdown styling at `src/app/page.tsx`
- [x] T017 [P] Verify App header mutual exclusion: opening language dropdown closes profile dropdown in `src/components/header/header-client.tsx`
- [x] T018 Run build (`next build`) to verify no TypeScript or compilation errors

**Checkpoint**: All regressions verified, build passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundation (Phase 2)**: Depends on Phase 1 (flag asset must exist before adding to languages)
- **US1 (Phase 3)**: Depends on Phase 2 (EN language must be in list to test dropdown with 2 items)
- **US2 (Phase 4)**: Depends on Phase 3 (verify close behavior with new styling)
- **US3 (Phase 5)**: Can run after Phase 3 (independent of US2)
- **Polish (Phase 6)**: Depends on Phase 3, 4, 5 all complete

### Within Phase 3 (US1)

```
T004, T005, T006, T007 (container) → T008, T009, T010 (items) → T011 (selected highlight)
```

All container tasks (T004–T007) affect the same `<ul>` element — apply together in one edit.
All item tasks (T008–T010) affect the same `<li>` element — apply together in one edit.

### Parallel Opportunities

- T001 and T002 (asset verification) can run in parallel
- T015, T016, T017 (regression checks) can run in parallel
- T004–T007 should be applied as a single edit (same element)
- T008–T010 should be applied as a single edit (same element)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (assets + EN language)
2. Complete Phase 3 (US1 — all styling changes)
3. **STOP and VALIDATE**: Visual match with Figma
4. Complete Phase 4 + 5 (verify close behavior + keyboard)
5. Complete Phase 6 (regression)

### Practical Note

Since all CSS changes are in a single file (`language-selector.tsx`), Phases 3–5 can realistically be implemented in a single editing session. The phase separation exists for logical tracking, not physical separation.

---

## Notes

- This is a **low-risk, CSS-only refactor** — no component logic changes
- All changes are in 2 files: `language-selector.tsx` (styling) and `header.tsx` (EN language)
- 1 new file: `public/icons/flag-en.svg`
- No new dependencies required
- Commit after Phase 2 (functional change: add EN) and after Phase 5 (visual changes complete)

---

## Phase 7: Cross-Screen Bug Fixes

**Purpose**: Fix UI bugs found during cross-screen review

- [x] T019 Fix countdown number font size from `text-xl md:text-3xl` to `text-[32px]` with `leading-10` in `src/components/home/countdown-timer.tsx`
- [x] T020 Fix countdown label font size from `text-[10px] md:text-xs` to `text-xs` (12px all breakpoints) in `src/components/home/countdown-timer.tsx`
- [x] T021 Fix campaign info mobile horizontal padding from `px-4 md:px-6` to `px-6` (24px all breakpoints) in `src/components/home/campaign-info.tsx`
- [x] T022 Fix awards grid mobile horizontal padding from `px-4 md:px-6` to `px-6` (24px all breakpoints) in `src/components/home/awards-grid.tsx`
- [x] T023 Fix error message missing `leading-5` (line-height: 20px) in `src/components/login/error-message.tsx`
- [x] T024 Fix kudo modal footer padding from `pt-3 pb-5 md:pb-6` to `pt-4 pb-6` in `src/components/kudo-modal/kudo-modal.tsx`
- [x] T025 Fix kudos promo button border-radius from `rounded-sm` (2px) to `rounded` (4px) in `src/components/awards/kudos-promo.tsx`

**Checkpoint**: All cross-screen UI bugs fixed, build passes
