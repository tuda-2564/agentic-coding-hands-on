# Feature Specification: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

The Homepage SAA is the main landing page for the SAA 2025 (Sun* Awards & Appreciation) internal platform — codenamed "ROOT FURTHER". It serves as the central hub where authenticated users can:

- View the SAA 2025 campaign branding and countdown timer
- Browse the awards system ("Hệ thống giải thưởng") with various award categories
- Access the Sun* Kudos live board to send/receive kudos
- Navigate to other sections of the platform via the fixed header

The page features a premium dark theme with gold accents, creating a luxury award-ceremony aesthetic.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Homepage and Campaign Info (Priority: P1)

As an authenticated Sun* employee, I want to see the SAA 2025 homepage with the "ROOT FURTHER" campaign branding so that I understand the current campaign theme and timeline.

**Why this priority**: This is the first screen users see after login. It establishes the campaign identity and provides essential information (countdown, campaign details).

**Independent Test**: Navigate to `/` after login and verify the hero section, countdown timer, and campaign description are visible.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they navigate to the homepage, **Then** they see the "ROOT FURTHER" hero section with gold gradient text, a countdown timer showing remaining time until the event, and campaign description text.
2. **Given** a user is authenticated, **When** the page loads, **Then** the fixed header is visible with logo, navigation links, profile avatar, and language selector.
3. **Given** the countdown timer is running, **When** time passes, **Then** the Days/Hours/Minutes/Seconds values update every second in real time without page refresh or layout shift.
4. **Given** a user is not authenticated, **When** they try to access the homepage, **Then** they are redirected to the Login page (`/login`).

---

### User Story 2 - Browse Awards System (Priority: P1)

As an authenticated Sun* employee, I want to browse the "Hệ thống giải thưởng" (Awards System) section so that I can see available award categories, their descriptions, and prize values.

**Why this priority**: The awards system is the core value proposition of the SAA platform. Users need to understand what awards exist and their prizes.

**Independent Test**: Scroll to the awards section and verify all award cards render correctly with titles, descriptions, and prize values.

**Acceptance Scenarios**:

1. **Given** a user is on the homepage, **When** they scroll to the awards section, **Then** they see a grid of award cards including TOP TALENT, BEST MANAGER, BEST NEWCOMER, MVP, and other categories.
2. **Given** the awards grid is visible, **When** a user hovers over an award card, **Then** the card shows a hover effect (gold border glow, slight elevation).
3. **Given** each award card, **When** rendered, **Then** it displays: award badge/image, award title, award description/subtitle, and prize value (e.g., "7,000,000 VND").
4. **Given** the awards grid on desktop, **When** viewed at ≥1024px, **Then** the cards display in a 4-column grid layout.

---

### User Story 3 - Access Sun* Kudos Section (Priority: P2)

As an authenticated Sun* employee, I want to access the Sun* Kudos section so that I can view the live kudos board and engage with the kudos system.

**Why this priority**: The Kudos feature drives employee engagement but is secondary to understanding the awards system.

**Independent Test**: Scroll to the Kudos section and verify the "#KUDOS" branding and live board area are visible and interactive.

**Acceptance Scenarios**:

1. **Given** a user is on the homepage, **When** they scroll to the Sun* Kudos section, **Then** they see the "#KUDOS" branding with the live board area.
2. **Given** the Kudos live board is visible, **When** new kudos are sent by other users, **Then** the board updates in real time (or near real time).

---

### User Story 4 - Navigate via Header (Priority: P1)

As an authenticated Sun* employee, I want to use the fixed header to navigate to different sections of the platform so that I can quickly access features like profile, language settings, and other pages.

**Why this priority**: Navigation is essential for platform usability and is always visible via the fixed header.

**Independent Test**: Click on header navigation items and verify they navigate to the correct destinations.

**Acceptance Scenarios**:

1. **Given** a user is on any scroll position, **When** they look at the top of the viewport, **Then** the header remains fixed and visible with glassmorphism effect.
2. **Given** the header is visible, **When** a user clicks the profile avatar, **Then** a profile dropdown menu appears (see Dropdown-profile frame).
3. **Given** the header is visible, **When** a user clicks the language selector, **Then** a language dropdown appears (see Dropdown-ngôn ngữ frame).
4. **Given** the header navigation links, **When** a user clicks a nav link, **Then** they are navigated to the corresponding page/section.

---

### User Story 5 - Responsive Homepage Experience (Priority: P2)

As a Sun* employee using a mobile or tablet device, I want the homepage to adapt to my screen size so that I can comfortably view all content.

**Why this priority**: Mobile-first is a constitution requirement (Principle IV). Many employees may access on mobile.

**Independent Test**: Resize viewport to mobile (375px) and tablet (768px) and verify all sections adapt correctly.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (<768px), **When** the homepage loads, **Then** the awards grid displays in 1 or 2 columns, hero title is smaller, and header collapses to hamburger menu.
2. **Given** a tablet viewport (768-1023px), **When** the homepage loads, **Then** the awards grid displays in 2 columns and layout adjusts proportionally.
3. **Given** any viewport, **When** viewing the page, **Then** no horizontal scrollbar appears and all content is accessible.

---

### Edge Cases

- What happens when the countdown timer reaches zero? → Display "Event Started" or switch to a post-event state. *(Clarification needed — see open questions.)*
- What happens when the awards API fails to load? → Show skeleton loaders, then an error state with retry button.
- What happens when the Kudos live board WebSocket disconnects? → Show stale data with a "reconnecting" indicator.
- What happens when award card images fail to load? → Show a placeholder badge image with the award name as alt text.
- What happens on extremely long award descriptions? → Truncate with ellipsis after 2 lines (`line-clamp-2`).
- What happens when the user's session expires while on the homepage? → Middleware redirects to `/login` on next navigation; real-time streams should detect 401 and show a "Session expired" prompt.
- What happens with no campaign active (e.g., off-season)? → *(Clarification needed — hide countdown? show "Coming soon"?)*
- What happens when the page is accessed with JavaScript disabled? → RSC sections (header, awards grid, footer) MUST render; countdown and live board degrade gracefully (show static server-rendered values).
- What happens on concurrent profile + language dropdown opens? → Only one dropdown can be open at a time; opening one closes the other.

---

## State Management

### Server State (RSC — fetched at render time)
- **Campaign data**: Active campaign info (name, theme, event_date, description) — fetched via Supabase server client in Server Component.
- **Award categories**: All award categories with badges and prizes — fetched via Supabase server client in Server Component.

### Client State (`"use client"` components)
- **Countdown timer**: `{ days, hours, minutes, seconds }` — derived from `campaign.event_date`, updated every second via `setInterval`.
- **Kudos feed**: `Kudo[]` — initial batch fetched via REST, then appended via WebSocket/SSE stream.
- **Header scroll state**: `isScrolled: boolean` — toggles glassmorphism intensity on scroll.
- **Profile dropdown**: `isProfileOpen: boolean` — controls dropdown visibility.
- **Language dropdown**: `isLangOpen: boolean` — controls language selector visibility.

### Loading & Error States
| Section | Loading State | Error State | Empty State |
|---------|--------------|-------------|-------------|
| Campaign / Hero | Skeleton placeholder for title + countdown | "Unable to load campaign" with retry button | N/A (campaign always exists) |
| Awards Grid | 4–8 skeleton cards in grid layout | "Unable to load awards" with retry button | "No awards configured yet" message |
| Kudos Live Board | Pulsing skeleton feed | "Live board unavailable" + stale data indicator | "No kudos yet — be the first!" |
| Header | Static shell renders immediately (SSR) | N/A | N/A |
| Footer | Static shell renders immediately (SSR) | N/A | N/A |

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| A1_Header | Fixed header with logo, nav, profile, lang selector | Click nav links, profile dropdown, lang dropdown |
| Hero Section (Bìa) | "ROOT FURTHER" title, countdown timer, campaign visuals | Countdown auto-updates; decorative only |
| Campaign Info | Long-form text about SAA 2025 campaign | Scroll to read |
| Awards Grid | 4-column grid of award category cards | Hover for glow effect; click to view award details |
| Award Card | Individual card with badge, title, subtitle, prize | Hover: gold border glow, elevation |
| Sun* Kudos | Kudos branding and live board | Real-time updates, interaction with kudos system |
| 7_Footer | Footer with links and copyright | Click footer links |
| 3.5_Keyvisual | Decorative background graphics | Non-interactive, visual only |
| Cover | Background image layer | Non-interactive |

### Navigation Flow

- **From**: Login page (after successful OAuth) or any authenticated page
- **To**: Award detail pages, Kudos live board, Profile, other nav destinations
- **Triggers**:
  - Header nav links → Navigate to corresponding pages
  - Profile avatar → Open profile dropdown
  - Language selector → Open language dropdown
  - Award card click → Navigate to award detail (TBD)

### Visual Requirements

- Responsive breakpoints: mobile (<768px), tablet (768-1023px), desktop (≥1024px)
- Animations/Transitions: Hero entrance animation on load, scroll-reveal for sections, hover effects on cards, countdown tick animation
- See [design-style.md](design-style.md) for complete visual specifications

### Accessibility Requirements

- **WCAG AA compliance** on all text: minimum 4.5:1 contrast ratio for normal text, 3:1 for large text (≥18px bold or ≥24px). Gold text (#C8A96E) on dark background (#00101A) achieves ~7.2:1 — passes. White (#FFF) on #00101A achieves ~19:1 — passes. Secondary text (#B0BEC5) on #00101A achieves ~10:1 — passes.
- **Keyboard navigation**: All interactive elements (nav links, award cards, dropdowns, footer links) MUST be reachable via Tab key in logical reading order. Focus MUST be visible with a clear outline (e.g., 2px solid #C8A96E, offset 2px).
- **ARIA labels**:
  - Header: `<nav aria-label="Main navigation">`
  - Countdown: `<div role="timer" aria-live="polite" aria-label="Countdown to SAA 2025 event">`
  - Awards section: `<section aria-labelledby="awards-heading">`
  - Award cards: `role="article"` or semantic `<article>` with descriptive `aria-label`
  - Kudos section: `<section aria-labelledby="kudos-heading">`, live board: `aria-live="polite"`
  - Profile dropdown: `aria-expanded`, `aria-haspopup="true"`
  - Language selector: `aria-expanded`, `aria-haspopup="listbox"`
- **Screen reader**: Countdown values MUST be announced periodically (not every second — use `aria-live="polite"` with throttled updates every 60s). Award card images MUST have descriptive alt text.
- **Touch targets**: All interactive elements MUST meet 44×44px minimum (Constitution Principle IV / WCAG 2.5.5).
- **Reduced motion**: Animations (hero entrance, scroll-reveal, card hover) MUST respect `prefers-reduced-motion: reduce` media query.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the "ROOT FURTHER" hero section with gold gradient text on page load.
- **FR-002**: System MUST render a real-time countdown timer showing days, hours, minutes, and seconds until the SAA event date (derived from `campaign.event_date`).
- **FR-003**: System MUST display the "Hệ thống giải thưởng" section with a grid of award category cards fetched from the API.
- **FR-004**: System MUST render each award card with: badge image, title, description, and prize value.
- **FR-005**: System MUST display the Sun* Kudos section with a live board area.
- **FR-006**: System MUST keep the header fixed at the top of the viewport during scroll with glassmorphism effect.
- **FR-007**: System MUST redirect unauthenticated users to `/login`.
- **FR-008**: System MUST render the footer with appropriate links and copyright.
- **FR-009**: Users MUST be able to interact with header navigation (profile dropdown, language selector, nav links).
- **FR-010**: System MUST display the page responsively across mobile, tablet, and desktop viewports.
- **FR-011**: System MUST show skeleton loading states for each data-dependent section (hero/campaign, awards grid, kudos board) while data is being fetched.
- **FR-012**: System MUST display contextual error states with retry buttons when API calls fail.
- **FR-013**: All animations and transitions MUST respect the user's `prefers-reduced-motion` system setting.

### Technical Requirements

- **TR-001**: Page initial load (LCP) MUST complete within 2.5 seconds on a 4G connection.
- **TR-002**: Countdown timer MUST update every second using client-side JavaScript (requires `"use client"` component).
- **TR-003**: Authentication MUST be verified via Supabase session in Next.js middleware before rendering.
- **TR-004**: Award data MUST be fetched server-side (RSC) to minimize client bundle and improve SEO.
- **TR-005**: Images MUST use `next/image` with appropriate `sizes` and lazy loading for below-fold content.
- **TR-006**: The Kudos live board SHOULD use WebSocket or Server-Sent Events for real-time updates.
- **TR-007**: Data fetching MUST use Supabase server client (`@supabase/ssr`) in RSC; browser client MUST only be used for real-time subscriptions (Kudos stream) — per Constitution Principle III.
- **TR-008**: The page MUST follow RSC-first architecture: only `CountdownTimer`, `KudosLiveBoard`, `ProfileDropdown`, and `LanguageSelector` require `"use client"` — per Constitution Principle II.
- **TR-009**: All award images MUST use `next/image` with `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"` for responsive loading — per Constitution Principle IV.
- **TR-010**: Route `/` (homepage) MUST be a protected route enforced by Next.js middleware reading Supabase session cookie — per Constitution Principle V.

### Key Entities *(if feature involves data)*

- **Award Category**: Represents a type of award (e.g., TOP TALENT, MVP). Key attributes: id, name, description, badge_image_url, prize_value, sort_order.
- **Campaign**: The SAA event itself. Key attributes: id, name, theme, event_date, description, is_active.
- **Kudos**: A recognition message from one employee to another. Key attributes: id, sender_id, receiver_id, message, created_at.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/campaign/active` | GET | Fetch active campaign info (name, event_date, description) | Predicted (New) |
| `/api/awards/categories` | GET | Fetch all award categories with badge images and prizes | Predicted (New) |
| `/api/kudos/live` | GET | Fetch recent kudos for the live board | Predicted (New) |
| `/api/kudos/live/stream` | WebSocket/SSE | Real-time kudos stream | Predicted (New) |
| Supabase Auth session | — | Verify authentication via middleware | Exists |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Homepage renders completely (all sections visible) within 3 seconds on desktop (4G).
- **SC-002**: Countdown timer updates accurately every second without layout shift.
- **SC-003**: All award cards render with correct data (no missing images, titles, or prices).
- **SC-004**: Page passes Lighthouse accessibility audit with score ≥ 90.
- **SC-005**: No horizontal scrollbar appears at any of the three responsive breakpoints.
- **SC-006**: All header navigation interactions (profile dropdown, lang selector) work correctly.

---

## Out of Scope

- Award nomination/voting functionality (separate screen)
- Kudos sending form (separate interaction/modal — see "Sun* Kudos - Live board" frame)
- Admin dashboard/management features (separate section)
- Post-event state of the homepage (when countdown reaches zero)
- Secret box / gift box interactions (separate frames: "Open secret box", "Open Giftbox")
- Community standards page ("Tiêu chuẩn cộng đồng" — separate frame)
- Edit post functionality ("Màn Sửa bài viết- edit mode" — separate frame)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Login screen spec completed (`.momorph/specs/662-14387-Login/spec.md`)

---

## Notes

- The "ROOT FURTHER" theme suggests growth and advancement — the visual language (gold, dark luxury) reinforces a premium awards ceremony aesthetic.
- The frame is 1,512px × 4,480px, indicating a long scrollable page with multiple sections.
- Related Figma frames that interact with this page: Hover campain, Hover danh hiệu (Legend/Super/Rising/New Hero), Alert Overlay, Dropdown-profile, Dropdown-ngôn ngữ, Sun* Kudos - Live board.
- The countdown timer requires the campaign event date — this should come from the API or environment config.
- Award cards show Vietnamese currency (VND), confirming localization needs.
- The Figma design shows both "User" and "Admin" sections — this spec covers the User-facing homepage only.
