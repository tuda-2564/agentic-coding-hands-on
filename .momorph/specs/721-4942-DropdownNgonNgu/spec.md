# Feature Specification: Dropdown Ngôn Ngữ (Language Selector)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Draft

---

## Overview

A language selector dropdown component used across the application (Login header, App header). It allows users to switch the UI language between Vietnamese (VN) and English (EN). The dropdown displays the currently selected language with its flag icon and code, and opens a list of available language options on click.

This is a **shared component** already partially implemented at `src/components/header/language-selector.tsx`. The spec focuses on aligning the existing implementation with the Figma design pixel-perfectly.

**Target Users**: All authenticated and unauthenticated users of the SAA 2025 platform.

---

## User Scenarios & Testing

### User Story 1 - Select a Language from Dropdown (Priority: P1)

As a user, I want to click the language selector button and choose a language from the dropdown list, so that the UI displays content in my preferred language.

**Why this priority**: Core functionality — without this, users cannot switch languages.

**Independent Test**: On any page with a header, click the language button → dropdown opens showing VN and EN options → click EN → dropdown closes, button now shows EN flag + code.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the language button, **Then** the dropdown list opens below the button showing all available languages (VN, EN) with their flag icons and codes.
2. **Given** the dropdown is open and VN is selected, **When** the user clicks "EN", **Then** the selected language updates to EN (flag + code change), and the dropdown closes.
3. **Given** the dropdown is open, **When** the user clicks the same currently-selected language, **Then** the dropdown closes with no change.

---

### User Story 2 - Close Dropdown Without Selection (Priority: P1)

As a user, I want the dropdown to close when I click outside or press Escape, so that I can dismiss it without making a change.

**Why this priority**: Essential UX — users must be able to dismiss without selecting.

**Independent Test**: Open the dropdown → click outside the dropdown area → dropdown closes. Open again → press Escape → dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks anywhere outside the dropdown container, **Then** the dropdown closes without changing the selected language.
2. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes without changing the selected language.

---

### User Story 3 - Keyboard Navigation (Priority: P2)

As a keyboard-only user, I want to navigate the dropdown using keyboard controls, so that the component is fully accessible.

**Why this priority**: Accessibility requirement (WCAG compliance) but not blocking MVP.

**Independent Test**: Tab to the language button → press Enter → dropdown opens → use arrow keys or Tab to navigate options → press Enter to select.

**Acceptance Scenarios**:

1. **Given** the language button is focused, **When** the user presses Enter or Space, **Then** the dropdown opens.
2. **Given** the dropdown is open, **When** the user presses Escape, **Then** the dropdown closes and focus returns to the trigger button.

---

### Edge Cases

- What happens when only one language is available? → Dropdown still opens but shows single option; clicking it closes dropdown.
- What happens on mobile touch devices? → Same behavior as click; touch target must be ≥ 44×44px.
- What happens when the dropdown is near the viewport edge? → Dropdown is positioned `absolute right-0` to avoid overflow on the right side.
- What happens when the user double-clicks the trigger rapidly? → Toggle behavior is idempotent; rapid clicks simply toggle open/close without race conditions.
- What happens when the user scrolls while dropdown is open? → Dropdown stays open and scrolls with the header (header is `fixed`/`absolute`, so dropdown moves with it).
- What happens when both language and profile dropdowns are triggered in App header? → Only one dropdown can be open at a time — controlled via `activeDropdown` state in `HeaderClient` (mutual exclusion).

---

## UI/UX Requirements

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Language Button (trigger) | Shows selected language flag + code + chevron icon | Click: toggle dropdown open/close |
| Dropdown Container | Dark panel with gold border, contains language option list | Appears below trigger on open |
| Language Option (selected) | Row with flag icon + language code, highlighted background | Click: close dropdown (already selected) |
| Language Option (unselected) | Row with flag icon + language code, dark background | Click: select language, close dropdown |
| Chevron Icon | Down arrow on trigger button | Rotates 180° when dropdown is open |

### Navigation Flow

- **From**: Login page header, App page header (used in both contexts)
- **To**: Same page (language switch is an in-place state change)
- **Triggers**: Click on language button opens/closes dropdown; click on option selects language

### Visual Requirements

- See [design-style.md](design-style.md) for all visual specifications
- Responsive: component renders identically at all breakpoints (fixed width 108px trigger)
- Animations: chevron rotation 150ms ease-in-out; dropdown appear/disappear instant
- Accessibility:
  - Trigger: `aria-expanded`, `aria-haspopup="listbox"`, `aria-label="Select language, current: {label}"`
  - Dropdown list: `role="listbox"`, `aria-label="Select language"`
  - Each option: `role="option"`, `aria-selected="true|false"`
  - Focus management: when dropdown closes, focus MUST return to the trigger button
  - Keyboard: Enter/Space to open, Escape to close, Tab between options

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display the currently selected language's flag icon and code on the trigger button.
- **FR-002**: System MUST open a dropdown list showing all available languages when the trigger button is clicked.
- **FR-003**: System MUST close the dropdown and update the selected language when a language option is clicked.
- **FR-004**: System MUST close the dropdown without changing selection when user clicks outside or presses Escape.
- **FR-005**: System MUST rotate the chevron icon 180° when dropdown is open.
- **FR-006**: System MUST highlight the currently selected language option with a distinct background color (`rgba(255, 234, 158, 0.2)`).
- **FR-007**: System MUST support both controlled mode (via `isOpen`/`onToggle` props from parent) and uncontrolled mode (internal state).
- **FR-008**: Dropdown container MUST have a gold border (`#998C5F`), dark background (`#00070C`), and 8px border-radius.

### Technical Requirements

- **TR-001**: Component MUST be a client component (`"use client"`) since it uses browser events and state.
- **TR-002**: Component MUST work with the existing `Language` type from `src/types/auth.ts`.
- **TR-003**: Touch targets MUST be ≥ 44×44px (WCAG 2.5.5) — current design uses 108×56px items.
- **TR-004**: Component MUST support `next/image` for flag icons.

### Key Entities

- **Language**: `{ code: string; label: string; flag: string }` — represents a selectable language option.

---

## State Management

### Local State (within `LanguageSelector`)

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `internalIsOpen` | `boolean` | `false` | Dropdown open/close state (uncontrolled mode only) |
| `selected` | `Language` | `languages[0]` | Currently selected language |

### Controlled vs Uncontrolled Mode

The component supports two modes:
- **Uncontrolled** (Login header): manages `isOpen` internally via `internalIsOpen` state.
- **Controlled** (App header): receives `isOpen` and `onToggle` props from `HeaderClient`, which manages mutual exclusion with `ProfileDropdown` via a single `activeDropdown` state (`"profile" | "language" | null`).

### Global State

- No global state required. Language preference is component-local.
- Future: may integrate with i18n context or persist to cookie/localStorage.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | — | Language selection is client-side only (no API call) | Exists |

**Note**: Language preference is currently stored in client-side state only. Future i18n integration may require persisting preference to user profile or cookie.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Dropdown visual matches Figma design pixel-perfectly (gold border, dark bg, correct spacing, selected highlight).
- **SC-002**: All ARIA attributes are present and correct for screen reader compatibility.
- **SC-003**: Touch targets ≥ 44×44px on all interactive elements.

---

## Out of Scope

- Actual i18n/localization implementation (translating UI text) — this spec covers only the language selector UI component.
- Persisting language preference to backend/database.
- Adding languages beyond VN and EN.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Existing implementation at `src/components/header/language-selector.tsx`
- [x] Language type defined at `src/types/auth.ts`

---

## Notes

- The existing `LanguageSelector` component is already functional but its dropdown styling does not match the Figma design. Key differences:
  - **Dropdown container**: Currently `bg-[#0B0F12] border-[#2E3940]` → should be `bg-[#00070C] border-[#998C5F]` with `rounded-lg` (8px)
  - **Selected item highlight**: Missing `bg-[rgba(255,234,158,0.2)]` on selected option
  - **Dropdown padding**: Missing 6px internal padding on the dropdown container
  - **Item border-radius**: Selected item should have 2px radius, unselected 4px radius
  - **Item dimensions**: 108×56px with 16px padding, gap 2px between flag and code
  - **Dropdown width**: Should match trigger width (108px) — currently correct
- The component is used in two contexts: Login header (uncontrolled) and App header (controlled via `activeDropdown` state in `HeaderClient`).
