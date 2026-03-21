# Feature Specification: Thể lệ — Kudos Rules Panel

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-19
**Status**: Draft

---

## Overview

The **Thể lệ** screen is a right-side panel/overlay that displays the official rules and mechanics of the **Sun* Kudos** feature within the SAA 2025 (Sun* Annual Awards) platform.

When opened, the panel slides in from the right and presents three information sections:

1. **Người nhận Kudos** — Explains the **Hero Badge** tier system awarded to Sunners who *receive* Kudos from colleagues.
2. **Người gửi Kudos** — Explains the **Collectible Icon** system (6 exclusive SAA icons) and the Secret Box mechanic for Sunners who *send* Kudos.
3. **Kudos Quốc Dân** — Explains the special "National Kudos" award for the top 5 most-liked Kudos across the company.

The panel has two footer action buttons: **Đóng** (close/dismiss) and **Viết KUDOS** (navigate to write a Kudos).

**Target Users**: All authenticated Sunner employees who want to understand how the Kudos feature works before participating.

**Business Context**: This rules panel is a prerequisite for user participation — informed users are more likely to engage correctly with the Kudos mechanics. It is accessible from the `/kudos` page and possibly from other entry points within SAA 2025.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Kudos Rules Panel (Priority: P1)

A Sunner opens the Kudos rules panel to understand how the system works before sending or checking their first Kudos.

**Why this priority**: This is the primary purpose of the screen — displaying the rules. Without this, the feature has no value.

**Independent Test**: Navigate to the Kudos page and open the rules panel; verify all three sections render correctly with accurate content.

**Acceptance Scenarios**:

1. **Given** a Sunner is on the `/kudos` page, **When** they open the Thể lệ panel, **Then** the panel slides in from the right and displays the title "Thể lệ" in gold.
2. **Given** the panel is open, **When** the user reads Section 1, **Then** they see the heading "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC" followed by body text: "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile".
3. **Given** the panel is open, **When** the user reads the Hero Badge tiers, **Then** they see exactly 4 rows: New Hero (1–4 people), Rising Hero (5–9), Super Hero (10–20), Legend Hero (20+), each with: an image-based pill badge on the top-left, condition text to the right of the badge, and a full-width description below them.
4. **Given** the panel is open, **When** the user reads Section 2, **Then** they see the heading "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN" and the Secret Box mechanic explanation.
5. **Given** the panel is open, **When** the user views the icon grid, **Then** they see a 2×3 grid of 6 collectible icons: REVIVAL, TOUCH OF LIGHT, STAY GOLD (row 1) and FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER (row 2).
6. **Given** the panel is open, **When** the user reads Section 3, **Then** they see "KUDOS QUỐC DÂN" heading and the explanation that the top 5 most-liked Kudos become "Kudos Quốc Dân" and receive a special prize (Root Further).

---

### User Story 2 — Navigate to Write a Kudos (Priority: P1)

A Sunner, after reading the rules, decides to write a Kudos immediately by clicking the primary CTA button.

**Why this priority**: This is the primary conversion action of the panel — moving users from information to action. It is the main business goal of showing the rules.

**Independent Test**: Open the rules panel and click "Viết KUDOS"; verify navigation to the Viết Kudo screen.

**Acceptance Scenarios**:

1. **Given** the Thể lệ panel is open, **When** the user clicks the "Viết KUDOS" button, **Then** they are navigated to the Viết Kudo screen (route corresponding to Figma frame `520:11602`, e.g. `/kudos/write`).
2. **Given** the panel is open on mobile, **When** the user taps "Viết KUDOS", **Then** the navigation works identically to desktop.
3. **Given** the "Viết KUDOS" button is focused via keyboard, **When** the user presses Enter, **Then** navigation occurs as expected.

---

### User Story 3 — Close the Panel (Priority: P1)

A Sunner who has finished reading the rules (or changed their mind) closes the panel to return to the main Kudos page.

**Why this priority**: Panel dismissal is essential UX — users must be able to exit without navigating away from the page.

**Independent Test**: Open the panel and click "Đóng"; verify the panel closes and the underlying page is accessible again.

**Acceptance Scenarios**:

1. **Given** the Thể lệ panel is open, **When** the user clicks the "Đóng" button, **Then** the panel closes (slides out to the right) and the underlying page is restored.
2. **Given** the panel is open, **When** the user presses the **Escape** key, **Then** the panel closes.
3. **Given** the panel is open and a backdrop overlay covers the page, **When** the user clicks the backdrop, **Then** the panel closes.
4. **Given** the panel has just closed, **When** the page is visible again, **Then** keyboard focus returns to the element that triggered the panel (focus restoration).

---

### User Story 4 — Understand Hero Badge Tiers (Priority: P2)

A Sunner who has received Kudos wants to understand which Hero Badge tier they qualify for based on the number of unique senders.

**Why this priority**: This is informational depth content — important for engagement but not blocking the core panel experience.

**Independent Test**: Verify each of the 4 Hero Badge rows renders with correct pill style, condition text, and description.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user sees the Hero Badge rows, **Then** each row displays a gold-bordered pill badge on the left, the sender count condition in the middle, and a descriptive phrase below.
2. **Given** the user reads the New Hero row, **Then** they see: image-based pill "New Hero" (top-left) + condition text "Có 1-4 người gửi Kudos cho bạn" (top-right of badge) + description below: "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn."
3. **Given** the user reads the Legend Hero row, **Then** they see: pill "Legend Hero" + condition text "Có hơn 20 người gửi Kudos cho bạn" + description below: "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình."

---

### User Story 5 — Understand Collectible Icon System (Priority: P2)

A Sunner wants to understand the 6 collectible icons and how to earn Secret Boxes.

**Why this priority**: Important engagement mechanic explanation — motivates users to send Kudos repeatedly.

**Independent Test**: Verify the 6-icon grid renders correctly with circular icons, labels, and collection note.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user views the icon grid, **Then** 6 circular icons are displayed in a 2×3 grid with white borders.
2. **Given** the icon grid is visible, **Then** each icon has a centered label below it (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER).
3. **Given** the body text above the grid, **Then** the text explains: "Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA."
4. **Given** the collection note below the grid, **Then** it reads: "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025."

---

### User Story 6 — Accessible Keyboard and Screen Reader Navigation (Priority: P3)

A Sunner using a keyboard or screen reader can fully navigate and use the rules panel.

**Why this priority**: Accessibility is a WCAG compliance requirement and organizational standard.

**Independent Test**: Tab through the panel; verify focus order, ARIA roles, and screen reader announcements.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user tabs through, **Then** focus moves in logical order: content sections → "Đóng" button → "Viết KUDOS" button.
2. **Given** a screen reader is active, **When** the panel opens, **Then** focus is set to the panel title "Thể lệ" and the panel is announced as a dialog.
3. **Given** the panel is rendered, **Then** it uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title element.
4. **Given** the panel is open, **When** the user presses Tab, **Then** focus is trapped inside the panel (cannot tab to background content).
5. **Given** the "Đóng" button, **Then** it has `aria-label="Đóng"` or visible text "Đóng" and is keyboard activatable.

---

### Edge Cases

- **Collectible icon images fail to load**: Display a placeholder circle with the icon label text. The border and label must remain visible.
- **Panel opened with slow connection**: Show a loading state or skeleton for icon images while content text renders immediately.
- **Very long screen / short viewport**: The panel must be scrollable internally if content exceeds viewport height; footer buttons must remain fixed at the bottom.
- **Multiple rapid open/close clicks**: Debounce or disable the trigger button during the open/close animation to prevent state conflicts.
- **Deep link to panel**: If `/kudos?rules=true` or `/kudos#rules` is a supported entry point, the panel opens automatically on page load.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component              | Description                                                        | Interactions                                   |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| Panel Container        | Dark right-side overlay (553px wide, full height)                 | Slides in on open, slides out on close         |
| Backdrop Overlay       | Semi-transparent dark overlay covering left content               | Click to close panel                           |
| Panel Title "Thể lệ"  | Gold Montserrat 45px heading, top of content area                 | Non-interactive display                        |
| Section 1 Heading      | "NGƯỜI NHẬN KUDOS..." — gold uppercase 22px                       | Non-interactive display                        |
| Section 1 Body         | Explanatory paragraph about Hero Badges                           | Non-interactive display                        |
| Hero Badge Row × 4     | 2-tier row: [image-based badge pill + condition text] on top, [description] below | Non-interactive display               |
| Section 2 Heading      | "NGƯỜI GỬI KUDOS..." — gold uppercase 22px                        | Non-interactive display                        |
| Section 2 Body         | Explanation of Secret Box / heart mechanics                       | Non-interactive display                        |
| Collectible Icon Grid  | 2×3 grid of circular collectible SAA icons                        | Non-interactive display (icons are decorative) |
| Collection Note        | "Những Sunner thu thập trọn bộ 6 icon..." body text              | Non-interactive display                        |
| Kudos Quốc Dân Heading | "KUDOS QUỐC DÂN" — gold uppercase 24px                            | Non-interactive display                        |
| Kudos Quốc Dân Body    | Top-5-most-liked Kudos explanation                                | Non-interactive display                        |
| Footer: "Đóng" Button  | Transparent gold-tinted border button with X icon                 | Click → close panel                            |
| Footer: "Viết KUDOS"   | Solid gold button with pencil icon                                | Click → navigate to Viết Kudo screen           |

> See `design-style.md` for all visual specs (colors, typography, spacing, states).

### Navigation Flow

- **Entry points**:
  - From `/kudos` page → clicking a "Thể lệ" / "Xem thể lệ" trigger button
  - Possibly from `/awards` page → "Tìm hiểu thêm về Kudos" CTA
  - Deep link via URL query `?rules=open` or hash `#rules`

- **Exit points**:
  - Click "Đóng" → closes panel, stays on current page
  - Press Escape → closes panel, stays on current page
  - Click backdrop → closes panel, stays on current page
  - Click "Viết KUDOS" → navigates to Viết Kudo screen (`/kudos/write` or equivalent)

- **Scroll within panel**: If content exceeds viewport, panel content area scrolls internally; footer buttons remain sticky at panel bottom.

### Visual Requirements

- **Responsive breakpoints**:
  - **Mobile** (< 768px): Panel is full-screen width, padding reduced to `16px 20px`
  - **Tablet** (768px–1023px): Panel width 480px
  - **Desktop** (≥ 1024px): Panel width 553px (per Figma spec)
- **Animations/Transitions**:
  - Panel slides in from right on open (200ms, ease-out)
  - Panel slides out to right on close (150ms, ease-in)
  - Backdrop fades in/out (200ms)
  - Buttons: `opacity` transition on hover (150ms)
- **Accessibility**: WCAG AA minimum; focus trap inside panel; `role="dialog"` with `aria-modal="true"`

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the panel as an overlay above the current page without full-page navigation.
- **FR-002**: System MUST display all 3 sections (Hero Badges, Collectible Icons, Kudos Quốc Dân) with correct content.
- **FR-003**: System MUST show exactly 4 Hero Badge tiers with accurate sender count thresholds.
- **FR-004**: System MUST show exactly 6 collectible icons in a 2×3 grid with labels.
- **FR-005**: Users MUST be able to close the panel via the "Đóng" button, Escape key, or backdrop click.
- **FR-006**: Users MUST be able to navigate to the Viết Kudo screen via the "Viết KUDOS" button.
- **FR-007**: System MUST trap keyboard focus inside the panel while it is open.
- **FR-008**: System MUST restore focus to the trigger element when the panel closes.
- **FR-009**: Collectible icon images MUST have a visible fallback (circle + label) if images fail to load.
- **FR-010**: Panel MUST be scrollable internally if viewport height is insufficient.

### Technical Requirements

- **TR-001**: Panel MUST be implemented as a client component (`"use client"`) since it requires interactive state (open/close) — the parent page that embeds it can remain a Server Component.
- **TR-002**: Panel content (hero badge data, icon data) MUST be defined as static data constants (no API call needed for rules content).
- **TR-003**: The component MUST follow constitution naming: `kudos-rules-panel.tsx` in `src/components/kudos/`.
- **TR-004**: Font "Montserrat" MUST be available via `next/font/google` or pre-loaded in global CSS.
- **TR-005**: Collectible icon images MUST be served from `/images/icons/` or `/public/` as static assets; use `next/image` for optimization.
- **TR-006**: Focus trap MUST use a lightweight approach (manual Tab key handler or a library like `focus-trap-react`) — do not introduce large dependencies without justification.
- **TR-007**: Panel open/close animation MUST use CSS transitions (`transition-transform`, `transition-opacity`) rather than JavaScript animation libraries.
- **TR-008**: The "Viết KUDOS" navigation target route MUST match the actual implemented route for frame `520:11602`.

### State Management

#### Local Component State

| State Variable   | Type      | Initial Value | Description                                               |
| ---------------- | --------- | ------------- | --------------------------------------------------------- |
| `isOpen`         | `boolean` | `false`       | Controls panel visibility and animation trigger           |
| `triggerRef`     | `RefObject<HTMLElement>` | `null` | Ref to element that opened the panel — for focus restoration on close |

#### Derived States to Handle

| State          | Trigger                                | UI Response                                           |
| -------------- | -------------------------------------- | ----------------------------------------------------- |
| **Opening**    | User clicks trigger (e.g. "Thể lệ")   | Animate panel in from right (200ms); trap focus; set `aria-modal` |
| **Open**       | `isOpen === true`                      | Full panel visible; backdrop shown; focus inside panel |
| **Closing**    | Click "Đóng" / Escape / backdrop click | Animate panel out (150ms); restore focus to `triggerRef` |
| **Closed**     | `isOpen === false`                     | Panel hidden (`display:none` or `translate-x-full`)   |
| **Icon loading** | After panel opens                    | Icon images fetch; show placeholder circle until loaded |
| **Icon error** | Image load fails                       | Show solid circle + label text as fallback             |

#### Global / Parent State

- `isOpen` state may be lifted to the parent page (`/kudos`) if the trigger button lives outside the panel component.
- No server state or data-fetching state needed — all content is static.

---

### Key Entities *(static data — no DB required)*

- **HeroBadgeTier**: `{ id, label, condition, description }` — 4 items, defined as a constant.
- **CollectibleIcon**: `{ id, label, imageSrc, alt }` — 6 items, defined as a constant.
- **KudosRulesSection**: `{ heading, body }` — 3 sections.

---

## API Dependencies

This feature is **purely informational** — all content is static. No API calls are required to render the panel.

| Endpoint | Method | Purpose | Status |
| -------- | ------ | ------- | ------ |
| N/A      | —      | Rules content is static data | N/A |

> If in the future the rules content becomes CMS-managed, a `GET /api/kudos/rules` endpoint would be needed. This is **out of scope** for the current implementation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 3 sections render with 100% accurate content matching the Figma copy.
- **SC-002**: All 4 Hero Badge rows display with correct tier names, sender count thresholds, and description text.
- **SC-003**: All 6 collectible icons display in the correct 2×3 grid layout with correct labels.
- **SC-004**: "Đóng" button closes the panel; "Viết KUDOS" navigates to the correct screen.
- **SC-005**: Panel passes WCAG AA color contrast requirements (verified via automated a11y test).
- **SC-006**: Focus is trapped inside the panel while open and restored on close.
- **SC-007**: Panel renders correctly on mobile (375px), tablet (768px), and desktop (1440px) viewports.
- **SC-008**: Panel open/close animation plays smoothly at 60fps (no jank).

---

## Out of Scope

- The left-side **decorative artwork** area of the frame — this is part of the `/kudos` page layout, not the panel itself.
- The **Viết Kudo screen** implementation (Figma frame `520:11602`) — a separate feature spec.
- CMS-based dynamic rules content — rules are static strings for this version.
- **Sharing or saving** the rules content — no share/export functionality.
- **Displaying the user's current Hero Badge** status within the panel — this belongs to a profile/dashboard feature.
- **Real-time heart/Secret Box count** — not shown in this panel.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`) — not required for this feature
- [ ] Database design completed (`.momorph/contexts/database-schema.sql`) — not required for this feature
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`) — should include `3204:6051` as Kudos Rules Panel node
- [ ] Viết Kudo screen (`520:11602`) route is defined in the routing configuration
- [ ] Collectible icon image assets are present in `/public/images/icons/` (revival.png, touch-of-light.png, stay-gold.png, flow-to-horizon.png, beyond-the-boundary.png, root-further.png)
- [ ] Montserrat font is configured in the project

---

## Notes

- The Figma frame `3204:6051` is 1440×1796px total; the **implementable panel component** occupies the right 553px (x:887 onward). The left portion is decorative background art belonging to the `/kudos` page.
- The panel is a **modal/drawer pattern**: it appears above the page, not inline. Implement with `position: fixed`, `z-index` above page content, and a backdrop overlay.
- The badge pill borders in Figma are `0.579px` — render as `1px` in CSS (sub-pixel borders are not cross-browser reliable).
- **Hero badge pills are image-based** (`MM_MEDIA_New Hero`, `MM_MEDIA_Rising Hero`, etc.) — they contain a background badge artwork image with a dark overlay and white text. If assets are available as separate files (e.g. `new-hero-badge.png`), use `<Image>`. Fallback: styled `<span>` with `border border-kudos-gold rounded-full text-white text-[13px] font-bold`.
- The collectible icon images are the same 6 icons used in the `/awards` page Hero section — reuse existing image assets where applicable.
- "Kudos Quốc Dân" prize is described as "Root Further" in the body text — this aligns with the Root Further icon being the rarest/most prestigious collectible.
- The design shows emoji ❤️ inline in body text — render using Unicode character `❤️` directly in JSX (no custom component needed).
- If the panel is implemented as a Next.js Dialog (via `<dialog>` HTML element), ensure it uses `showModal()` for native focus trapping and backdrop support.
