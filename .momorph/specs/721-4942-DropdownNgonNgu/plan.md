# Implementation Plan: Dropdown Ngôn Ngữ (Language Selector)

**Frame**: `721:4942-DropdownNgonNgu`
**Date**: 2026-03-13
**Spec**: `specs/721-4942-DropdownNgonNgu/spec.md`

---

## Summary

Align the existing `LanguageSelector` component (`src/components/header/language-selector.tsx`) with the Figma design. This is a **styling-focused refactor** — the component's logic (controlled/uncontrolled mode, outside click, escape key, toggle) is already correct and needs no changes. The work consists of updating CSS classes on the dropdown container and list items, adding the EN language option with its flag asset, and ensuring the selected item highlight matches the design.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS v4, next/image
**Database**: N/A (client-side only)
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: React useState (local) + controlled props from parent
**API Style**: N/A (no API calls)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions — kebab-case files, PascalCase components, `@/*` imports
- [x] Uses approved libraries and patterns — no new dependencies
- [x] Adheres to folder structure guidelines — modifying existing `src/components/header/` file
- [x] Meets security requirements — no user input, no API calls, no injection risk
- [x] Follows testing standards — unit tests for component behavior

**Violations**: None — no new libraries or patterns needed.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single file modification — `language-selector.tsx` already exists with correct architecture (controlled/uncontrolled, ARIA, keyboard). Only CSS classes change.
- **Styling Strategy**: Tailwind utility classes with arbitrary values (e.g., `bg-[#00070C]`, `border-[#998C5F]`) — consistent with existing codebase patterns.
- **Data Fetching**: N/A — static language list passed as props.

### Backend Approach

- N/A — purely client-side component.

### Integration Points

- **Existing Services**: None.
- **Shared Components**: `LanguageSelector` is consumed by:
  1. `Header` (login variant) — uncontrolled mode, no `isOpen`/`onToggle` props
  2. `HeaderClient` (app variant) — controlled mode via `activeDropdown` state
- **API Contracts**: None.

### Key Constraint: Backward Compatibility

Both consumption points must continue working after changes. The component signature (`languages`, `isOpen?`, `onToggle?`) remains unchanged — only internal rendering/classes change.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721-4942-DropdownNgonNgu/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma reference ✅
```

### Source Code (affected areas)

#### New Files

| File | Purpose |
|------|---------|
| `public/icons/flag-en.svg` | EN (UK/GB) flag icon for English language option |

#### Modified Files

| File | Changes |
|------|---------|
| `src/components/header/language-selector.tsx` | Update dropdown container classes, add selected item highlight, update item dimensions/styling |
| `src/components/header/header.tsx` | Add EN language to `DEFAULT_LANGUAGES` array |

#### No Changes Needed

| File | Reason |
|------|--------|
| `src/components/header/header-client.tsx` | Already passes `languages` and controlled props correctly |
| `src/types/auth.ts` | `Language` type already has `code`, `label`, `flag` fields |
| `src/app/login/page.tsx` | Consumes `Header` with default props — no code changes, but **verify regression**: Login header will now show 2 languages (VN+EN) instead of 1 after `DEFAULT_LANGUAGES` update |
| `src/app/awards/page.tsx` | Consumes `Header variant="app"` — no code changes, but **verify regression**: App header dropdown styling changes |
| `src/app/page.tsx` | Homepage — **verify regression**: uses Header, will inherit new dropdown styling + languages |

### Dependencies

None — no new packages required.

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset Preparation

- Download EN flag icon from Figma using `get_media_files` tool → `public/icons/flag-en.svg`
- Verify flag renders at 24×24 correctly

#### Phase 1: Foundation — Add EN Language (US1 prerequisite)

- Add EN language entry `{ code: "EN", label: "English", flag: "/icons/flag-en.svg" }` to `DEFAULT_LANGUAGES` in `src/components/header/header.tsx`
- This makes both VN and EN available in the dropdown immediately

#### Phase 2: Core Styling — Dropdown Visual Alignment (US1)

Update `src/components/header/language-selector.tsx` — **CSS-only changes**, no logic modifications:

**Dropdown container (`<ul>`):**
- `bg-[#0B0F12]` → `bg-[#00070C]`
- `border-[#2E3940]` → `border-[#998C5F]`
- `rounded` → `rounded-lg`
- Add `p-1.5` (6px internal padding)
- `w-[108px]` → remove fixed width. Container auto-sizes from item content (items are 108px + 6px×2 padding + 1px×2 border = ~122px total).

**List items (`<li>`):**
- `px-4 py-3` → `w-[108px] h-14 p-4` (108px width matching Figma, 56px height, 16px padding all sides)
- `gap-2` → `gap-1` (4px between flag and code)
- `items-center` → `flex flex-row items-center` (explicit row direction)
- Add `cursor-pointer` explicitly
- Flag image: `width={20} height={20}` → `width={24} height={24}`, add `shrink-0`
- Code text: `text-sm` → `text-base leading-6 tracking-[0.15px] text-center`
- Selected item: add `bg-[rgba(255,234,158,0.2)] rounded-sm`
- Unselected item: add `rounded hover:bg-white/10`

**Note on width strategy**: Items use explicit `w-[108px]` (matching Figma's 108px item width). Do NOT use `w-full` — this creates a circular sizing dependency with a fit-content container. The container has no fixed width and auto-sizes from item content: 108px items + 6px×2 padding + 1px×2 border = ~122px total. This is slightly wider than the trigger (108px), matching the Figma screenshot.

#### Phase 3: Polish — Accessibility & Edge Cases (US2 + US3)

- Verify focus returns to trigger button after dropdown closes (already handled by existing `handleClose`)
- Verify `aria-selected` correctly reflects selected state (already implemented)
- Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50` to list items for keyboard navigation
- Test in both controlled (App header) and uncontrolled (Login header) modes
- Test mutual exclusion with ProfileDropdown in App header

---

## Detailed CSS Change Map

Reference from `design-style.md` "Differences from Current Implementation" table:

| Element | Current Class | Target Class | Change Type |
|---------|--------------|--------------|-------------|
| `<ul>` container | `bg-[#0B0F12]` | `bg-[#00070C]` | Color update |
| `<ul>` container | `border-[#2E3940]` | `border-[#998C5F]` | Color update (gold) |
| `<ul>` container | `rounded` | `rounded-lg` | Radius increase (4→8px) |
| `<ul>` container | (none) | `p-1.5` | Add 6px padding |
| `<ul>` container | `w-[108px]` | remove (auto-size from content) | Width strategy change |
| `<li>` items | `px-4 py-3` | `w-[108px] h-14 p-4` | Width + dimension update |
| `<li>` items | `gap-2` | `gap-1` | Gap reduction (8→4px) |
| `<li>` items | (none) | `flex flex-row` | Explicit flex direction |
| `<li>` items | (none) | `cursor-pointer` | Add pointer cursor |
| `<li>` selected | (none) | `bg-[rgba(255,234,158,0.2)] rounded-sm` | Add highlight |
| `<li>` unselected | (none) | `rounded hover:bg-white/10` | Add radius + hover |
| `<li>` flag image | `width={20} height={20}` | `width={24} height={24}` | Size increase |
| `<li>` flag image | (none) | `className="shrink-0"` | Prevent shrink |
| `<li>` code text | `text-sm` | `text-base leading-6 tracking-[0.15px] text-center` | Typography + alignment |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| EN flag SVG not available in Figma | Low | Medium | Create minimal UK flag SVG manually or use open-source flag icon |
| Styling breaks Login header layout | Low | Medium | Test uncontrolled mode explicitly; Login header has simpler layout |
| Controlled mode visual regression in App header | Low | Medium | Test with ProfileDropdown mutual exclusion |
| Dropdown clips behind header on scroll | Very Low | Low | Already `z-50`; header is fixed/absolute positioned |

### Estimated Complexity

- **Frontend**: Low — CSS class updates only, no logic changes
- **Backend**: N/A
- **Testing**: Low — behavioral tests already exist via ARIA/interaction patterns

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: LanguageSelector ↔ HeaderClient (controlled mode), LanguageSelector ↔ Header (uncontrolled mode)
- [ ] **External dependencies**: N/A
- [ ] **Data layer**: N/A
- [x] **User workflows**: Open dropdown → select language → dropdown closes with updated selection

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Dropdown toggle, language selection, chevron rotation |
| Service ↔ Service | No | — |
| App ↔ External API | No | — |
| App ↔ Data Layer | No | — |
| Cross-platform | Yes | Touch targets ≥ 44×44px at all breakpoints |

### Test Environment

- **Environment type**: Local (Vitest for unit, Playwright for E2E)
- **Test data strategy**: Static language array fixture `[VN, EN]`
- **Isolation approach**: Component rendering in isolation (Vitest + React Testing Library)

### Test Scenarios Outline

1. **Happy Path**
   - [x] Dropdown opens on trigger click, shows VN and EN options
   - [x] Clicking EN selects it, closes dropdown, trigger shows EN flag+code
   - [x] Selected item has gold highlight background
   - [x] Dropdown has gold border and dark background

2. **Dismissal**
   - [x] Click outside closes dropdown
   - [x] Escape key closes dropdown
   - [x] Clicking trigger again closes dropdown

3. **Edge Cases**
   - [x] In App header, opening language dropdown closes profile dropdown
   - [x] Rapid double-click toggles without errors
   - [x] Component works in both controlled and uncontrolled modes

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Dropdown open/close behavior | 90%+ | High |
| Language selection + visual state | 90%+ | High |
| Keyboard accessibility | 80%+ | Medium |
| Controlled/uncontrolled modes | 80%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (reviewed and finalized)
- [x] `design-style.md` approved (reviewed and finalized)
- [ ] EN flag icon asset available

### External Dependencies

- EN flag SVG icon — download from Figma or source from open icon library

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- This is a **low-risk, low-complexity** change — primarily CSS class updates on an existing, working component.
- No component signature changes → zero risk of breaking consumers.
- The biggest visual change is the dropdown container: gold border (`#998C5F`), darker background (`#00070C`), 8px radius, 6px internal padding, and selected item highlight (`rgba(255,234,158,0.2)`).
- The only functional addition is the EN language in `DEFAULT_LANGUAGES` — making the dropdown actually useful for language switching.
- Future work (out of scope): actual i18n integration, persisting preference to cookie/localStorage.
