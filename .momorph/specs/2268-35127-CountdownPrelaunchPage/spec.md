# Feature Specification: Countdown — Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Draft

---

## Overview

A fullscreen prelaunch countdown page displayed to visitors when the SAA 2025 event has not yet started. The page shows a dramatic countdown timer with glass-morphism digit cards on top of the event's artistic background. It displays the remaining time in DAYS, HOURS, and MINUTES until the event launch date.

This page replaces the normal Homepage SAA (`2167:9026`) when the event's `event_date` is in the future. Once the countdown reaches zero, the user is redirected to (or the page transitions to) the main homepage.

**Target Users**: All visitors (authenticated and unauthenticated) who access the platform before the event starts.

---

## User Scenarios & Testing

### User Story 1 — View Countdown Timer (Priority: P1)

As a visitor, I want to see how much time remains before the event starts, so that I know when to return.

**Why this priority**: Core functionality — the entire page exists to communicate this single piece of information.

**Independent Test**: Navigate to the prelaunch page → see the title "Sự kiện sẽ bắt đầu sau" → see DAYS, HOURS, MINUTES countdown → digits update every minute (or more frequently for visual effect).

**Acceptance Scenarios**:

1. **Given** the event start date is in the future, **When** a visitor loads the page, **Then** the countdown displays correct remaining DAYS, HOURS, and MINUTES with LED-style digit cards.
2. **Given** the countdown is active, **When** one minute passes, **Then** the MINUTES digit decreases by 1 (and HOURS/DAYS cascade accordingly).
3. **Given** the event start date is more than 99 days away, **When** the page loads, **Then** the DAYS display shows the full number (may overflow 2 digits).

---

### User Story 2 — Transition When Countdown Reaches Zero (Priority: P1)

As a visitor, I want to be automatically redirected to the main event page when the countdown ends, so that I can immediately access the event content.

**Why this priority**: Essential UX — without this, users would be stuck on a completed countdown.

**Independent Test**: Set event start date to 1 minute in the future → wait for countdown to reach 00:00:00 → page transitions to main homepage.

**Acceptance Scenarios**:

1. **Given** the countdown reaches 0 DAYS, 0 HOURS, 0 MINUTES, **When** the timer expires, **Then** the page redirects to the main Homepage SAA (`/`) or shows a "Event has started!" message.
2. **Given** the event has already started (event_date is in the past), **When** a visitor navigates to the prelaunch URL, **Then** they are redirected to the homepage immediately.

---

### User Story 3 — Responsive Experience (Priority: P2)

As a mobile visitor, I want the countdown page to display correctly on my device, so that I can read the countdown without issues.

**Why this priority**: Significant portion of traffic comes from mobile devices.

**Independent Test**: Open prelaunch page on 375px width → countdown units stack or resize appropriately → all text readable → no horizontal scroll.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (< 768px), **When** the page loads, **Then** the countdown units are smaller but readable, with appropriate spacing.
2. **Given** a tablet viewport (768-1023px), **When** the page loads, **Then** the countdown uses medium-sized digit cards.
3. **Given** a desktop viewport (≥ 1024px), **When** the page loads, **Then** the full Figma design is rendered with large digit cards.

---

### Edge Cases

- What happens when the event has already started? → Redirect to homepage immediately (server-side or client-side check).
- What happens if the campaign has no event_date? → Show the homepage directly (no prelaunch page).
- What happens if JavaScript is disabled? → The page should show the static countdown values rendered server-side (SSR).
- What happens if the user's clock is wrong? → Use server time for the target date; client countdown may drift slightly but is acceptable.
- What happens on very slow connections? → Background image should have a fallback color (#00101A) while loading.

---

## UI/UX Requirements

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Background Image | Artistic event branding artwork, full bleed | None (static) |
| Gradient Overlay | Bottom-left gradient fading to dark | None (static) |
| Title Text | "Sự kiện sẽ bắt đầu sau" — event countdown header | None (static) |
| Digit Card | Glass-morphism card displaying a single digit (LED-style font) | Animates on digit change |
| Countdown Unit | Group of 2 digit cards + label (e.g., "DAYS") | Updates periodically |
| Unit Label | Text below digit cards: "DAYS", "HOURS", "MINUTES" | None (static) |

### Navigation Flow

- **From**: Direct URL access, or redirect from homepage when event hasn't started
- **To**: Homepage SAA (`/`) when countdown reaches zero or event has started
- **Triggers**: Automatic redirect on countdown expiry; no user action required

### Visual Requirements

- See [design-style.md](design-style.md) for all visual specifications
- Responsive: 3 breakpoints (mobile, tablet, desktop) — see design-style.md
- Animations: digit change animation (fade/flip), page fade-in on load
- Background image: must load with fallback color
- Custom font: "Digital Numbers" for LED-style digits (requires font loading)
- Accessibility:
  - `role="timer"` on countdown container
  - `aria-live="polite"` for periodic updates
  - `aria-label` with human-readable remaining time
  - Sufficient color contrast for white text on dark background

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a countdown timer showing remaining DAYS, HOURS, and MINUTES until the event start date.
- **FR-002**: System MUST update the countdown at least once per minute (may update every second for smoother UX).
- **FR-003**: System MUST redirect to the homepage when the countdown reaches zero.
- **FR-004**: System MUST redirect to the homepage if the event has already started (event_date is past).
- **FR-005**: System MUST display each digit in a glass-morphism card with LED-style font.
- **FR-006**: System MUST show the background artwork image with gradient overlay.
- **FR-007**: System MUST be fully rendered on first paint via SSR (no layout shift).

### Technical Requirements

- **TR-001**: Page MUST be server-rendered (RSC) for SEO and initial paint speed; countdown tick logic runs client-side.
- **TR-002**: Background image MUST use `next/image` with `priority` for fast loading.
- **TR-003**: "Digital Numbers" font MUST be loaded as a custom font (local or Google Fonts).
- **TR-004**: Page MUST NOT show a header or footer — standalone fullscreen layout.
- **TR-005**: Countdown target date MUST come from the campaign's `event_date` (fetched server-side from Supabase).

### Key Entities

- **Campaign**: `{ id, name, theme, event_date, description, is_active, created_at }` — provides the countdown target date via `event_date`.

---

## State Management

### Local State (client-side)

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | `number` | computed | Remaining days |
| `hours` | `number` | computed | Remaining hours (0-23) |
| `minutes` | `number` | computed | Remaining minutes (0-59) |
| `isExpired` | `boolean` | `false` | Whether countdown has reached zero |

### Server State

- Campaign `event_date` fetched via RSC from Supabase (same as existing campaign service)
- If no active campaign or event_date is past → render homepage instead

### Global State

- No global state required. Campaign data is fetched server-side.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/campaign/active` (or direct Supabase query in RSC) | GET | Fetch active campaign with `event_date` | Exists |

**Note**: No new API endpoints needed. The existing campaign data fetching provides the `event_date` for the countdown target.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Countdown matches the actual time remaining (within 1 second accuracy).
- **SC-002**: Page loads with background image visible within 2 seconds on 3G.
- **SC-003**: Automatic redirect works when countdown expires.
- **SC-004**: Page is fully responsive across all 3 breakpoints.

---

## Out of Scope

- Header navigation (page is standalone, no header)
- Footer (page is standalone, no footer)
- Language selector on this page (future enhancement)
- Seconds display (design shows only DAYS, HOURS, MINUTES)
- User authentication check (page is accessible to all visitors)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Campaign service exists (`src/services/campaign.ts`)
- [x] Countdown hook exists (`src/hooks/use-countdown.ts`) — may need adaptation
- [ ] "Digital Numbers" custom font availability
- [ ] Background image asset from Figma (MM_MEDIA_BG)

---

## Notes

- The existing `useCountdown` hook (`src/hooks/use-countdown.ts`) can be reused directly: it returns `{ days, hours, minutes, seconds, isExpired }`. This page only displays DAYS, HOURS, MINUTES (ignore `seconds`). The `isExpired` flag can trigger the redirect.
- The existing homepage `CountdownTimer` component (`src/components/home/countdown-timer.tsx`) is a small widget; this prelaunch page is a completely different fullscreen design and should be a separate page/component.
- The decision of when to show this page vs the homepage should be made in the page route (`src/app/page.tsx` or a dedicated `/countdown` route) based on the campaign's `event_date`.
- The background image is tagged `MM_MEDIA_BG` in Figma and should be downloaded during asset preparation.
- No header or footer — the language selector dropdown is not visible on this page.
