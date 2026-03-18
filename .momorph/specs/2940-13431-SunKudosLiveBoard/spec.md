# Feature Specification: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-17
**Status**: Draft

---

## Overview

The **Sun* Kudos - Live Board** is the main kudos page of the SAA 2025 platform. It serves as the central hub for employee recognition, displaying highlighted kudos, an interactive spotlight board, and a real-time feed of all kudos. Users can send kudos, browse recognition posts, like/share kudos, view personal stats, and open Secret Box gifts. The page features a dark-themed UI with gold accents, reflecting the awards ceremony branding.

**Target Users**: All authenticated Sun* employees participating in SAA 2025.

**Business Context**: This page drives engagement in the employee recognition program by making kudos visible, interactive, and rewarding through gamification (hearts, Secret Boxes, leaderboards).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Highlight Kudos Carousel (Priority: P1)

A user visits the Kudos page and sees the top-5 most liked kudos displayed in a horizontal carousel. They can navigate between cards using prev/next arrows or pagination, and filter by hashtag or department.

**Why this priority**: Highlight kudos are the hero content of the page, driving engagement and showcasing the best recognition messages. Without this, the page has no focal content.

**Independent Test**: Navigate to the Kudos Live Board page, verify the carousel renders 5 cards with sender/receiver info, content preview, hashtags, heart count, and navigation arrows. Verify filtering by hashtag and department changes the displayed cards.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** the page loads, **Then** a carousel of up to 5 highlight kudo cards is displayed with the most-liked kudos, showing sender/receiver avatars, names, department, star count, danh hieu (badge title), timestamp, content (max 3 lines), hashtags, heart count, "Copy Link", and "Xem chi tiet" actions.
2. **Given** the carousel is showing card 2/5, **When** the user clicks the next arrow, **Then** the carousel slides to card 3/5 and the page indicator updates to "3/5".
3. **Given** the carousel is showing card 1/5, **When** the user clicks the previous arrow, **Then** the previous arrow button is disabled.
4. **Given** the carousel is showing card 5/5, **When** the user clicks the next arrow, **Then** the next arrow button is disabled.
5. **Given** the highlight section is visible, **When** the user clicks the "Hashtag" filter button, **Then** a dropdown opens (frame `1002:13013`) listing available hashtags from the database; selecting one filters the carousel to only show kudos with that hashtag.
6. **Given** the highlight section is visible, **When** the user clicks the "Phong ban" filter button, **Then** a dropdown opens (frame `721:5684`) listing departments; selecting one filters the carousel to only show kudos from that department.
7. **Given** the highlight section is loading, **When** the API call is in progress, **Then** skeleton placeholder cards are shown in place of the carousel.
8. **Given** the user clicks "Xem chi tiet" on a highlight card, **When** clicked, **Then** the page scrolls to or navigates to the full kudo post in the "ALL KUDOS" feed below (or opens the kudo detail view if available).

---

### User Story 2 - View All Kudos Feed (Priority: P1)

A user scrolls down to see a chronological feed of all kudos posts. Each card shows full details including sender/receiver info, content, images, hashtags, and interaction buttons.

**Why this priority**: The full kudos feed is the primary content consumption area. Users come here to read, like, and share recognition posts.

**Independent Test**: Scroll to the "ALL KUDOS" section, verify kudo post cards render with all required fields. Verify infinite scroll or pagination loads more posts.

**Acceptance Scenarios**:

1. **Given** the user scrolls to the "ALL KUDOS" section, **When** the section loads, **Then** a list of kudo post cards is displayed in reverse-chronological order, each showing: sender info (avatar, name, department, stars, danh hieu), arrow icon, receiver info (same), prominent hashtag badge (e.g. "IDOL GIOI TRE" — the primary hashtag displayed as a pill badge), timestamp ("HH:mm - MM/DD/YYYY"), content text (max 5 lines with "..." truncation), image/video gallery (max 5 thumbnails), inline hashtag list (e.g. "#Dedicated #Inspiring..."), heart count with toggle button, and "Copy Link" button.
2. **Given** a kudo post has more than 5 lines of text, **When** displayed, **Then** the content is truncated at 5 lines with "..." appended.
3. **Given** a kudo post has images, **When** the user clicks a thumbnail, **Then** the full image opens in a lightbox/modal.
4. **Given** a kudo post has a video attachment (play icon visible on thumbnail), **When** the user clicks the video thumbnail, **Then** the video opens in a player modal or inline player.
5. **Given** a kudo post is displayed, **When** the user clicks a hashtag (either the badge or an inline tag), **Then** the feed filters to show only kudos with that hashtag.
6. **Given** the feed is loading, **When** data is being fetched, **Then** skeleton cards are shown as placeholders.
7. **Given** the feed has loaded all visible posts, **When** the user scrolls to the bottom, **Then** the next page of kudo posts is loaded (infinite scroll with a loading spinner at the bottom).

---

### User Story 3 - Like and Share Kudos (Priority: P1)

A user can like a kudo by clicking the heart icon and share it by copying the link.

**Why this priority**: Social interaction (likes and sharing) is essential to driving participation and virality of the recognition program.

**Independent Test**: Click the heart button on a kudo card, verify the count increments and icon turns red. Click again to unlike. Click "Copy Link" and verify URL is copied to clipboard.

**Acceptance Scenarios**:

1. **Given** the user has not liked a kudo, **When** they click the heart button, **Then** the heart icon changes from gray to red, the like count increments by 1, and the like is persisted to the database.
2. **Given** the user has already liked a kudo, **When** they click the heart button again, **Then** the heart icon changes from red to gray, the like count decrements by 1, and the unlike is persisted.
3. **Given** each user can only like a kudo once, **When** the user has already liked a kudo, **Then** the heart is displayed as red (active state).
4. **Given** a kudo post is displayed, **When** the user clicks "Copy Link", **Then** the kudo's URL is copied to the clipboard and a toast notification appears: "Link copied — ready to share!".

---

### User Story 4 - View Personal Stats and Open Secret Box (Priority: P2)

A user sees their personal kudos statistics in the sidebar and can open Secret Box gifts.

**Why this priority**: Stats and Secret Boxes are gamification elements that incentivize participation. Important but secondary to core content browsing.

**Independent Test**: Verify the sidebar stats card shows correct counts. Click "Mo qua" button and verify the Secret Box dialog opens.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** the "ALL KUDOS" section loads, **Then** the sidebar displays: "So Kudos ban nhan duoc" (received), "So Kudos ban da gui" (sent), "So tim ban nhan duoc" (hearts received), a divider, "So Secret Box ban da mo" (opened), and "So Secret Box chua mo" (unopened), each with the correct numeric value.
2. **Given** the user has unopened Secret Boxes, **When** they click "Mo qua" button (labeled "Mo Secret Box" with gift icon), **Then** the Open Secret Box dialog (frame `1466:7676`) opens.
3. **Given** the user has zero unopened Secret Boxes, **When** they view the sidebar, **Then** the "Mo qua" button is still visible but the "So Secret Box chua mo" count shows 0.
4. **Given** the stats card is loading, **When** data is being fetched, **Then** skeleton placeholders are shown for all stat values.

---

### User Story 5 - View Spotlight Board (Priority: P2)

A user views the interactive Spotlight Board which displays a word cloud / name diagram showing all kudos recipients, with names sized proportionally to their kudos count.

**Why this priority**: The Spotlight Board provides a visually engaging overview of recognition distribution, but is supplementary to the core feed.

**Independent Test**: Scroll to the Spotlight Board section, verify the canvas renders with name elements, a total kudos counter, search input, and pan/zoom control.

**Acceptance Scenarios**:

1. **Given** the user scrolls to the "SPOTLIGHT BOARD" section, **When** it loads, **Then** an interactive canvas displays names of kudos recipients, sized proportionally to their kudos count, with a total "388 KUDOS" (dynamic number) header.
2. **Given** the Spotlight Board is displayed, **When** the user types a name in the search input, **Then** matching names are highlighted or the view pans to them.
3. **Given** the Spotlight Board is displayed, **When** the user clicks the pan/zoom toggle, **Then** the interaction mode switches between pan and zoom.
4. **Given** the Spotlight Board is displayed, **When** the user hovers over a name, **Then** a tooltip or preview of that person's kudos count appears.

---

### User Story 6 - Send a Kudo (Priority: P1)

A user clicks the recognition input bar to open the kudo composition dialog.

**Why this priority**: Sending kudos is the core action of the platform. The input bar is the primary call-to-action.

**Independent Test**: Click the recognition input bar, verify the Viet Kudo modal (frame `520:11602`) opens.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** they click the recognition input bar ("Hom nay, ban muon gui loi cam on va ghi nhan den ai?"), **Then** the Viet Kudo dialog opens.
2. **Given** the user clicks the search sunner input, **When** they type a name, **Then** search results for sunner profiles are displayed.

---

### User Story 7 - View Sunner Leaderboards (Priority: P3)

A user views two sidebar leaderboards: "10 SUNNER CO SU THANG HANG MOI NHAT" (top rising sunners) and "10 SUNNER NHAN QUA MOI NHAT" (latest gift recipients).

**Why this priority**: Leaderboards are nice-to-have engagement features that show social proof and encourage participation.

**Independent Test**: Verify both sidebar lists show up to 10 sunner items each with avatar, name, and description.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** the sidebar loads, **Then** a list titled "10 SUNNER NHAN QUA MOI NHAT" displays up to 10 items, each with a circular avatar, name, and gift description.
2. **Given** the user is on the Kudos Live Board, **When** the sidebar loads, **Then** a list titled "10 SUNNER CO SU THANG HANG MOI NHAT" displays up to 10 items, each with a circular avatar, name, and ranking/promotion description.
3. **Given** a sunner item is displayed in either list, **When** the user clicks the avatar or name, **Then** the profile page for that sunner opens.
4. **Given** a sunner item is displayed, **When** the user hovers over the avatar or name, **Then** a profile preview tooltip appears (frame `721:5827`).
5. **Given** either list has no data, **When** displayed, **Then** the list shows an empty state message.

---

### User Story 8 - Navigate via Profile Previews (Priority: P3)

A user hovers over any sender/receiver avatar or name to see a profile preview, or clicks to open the full profile.

**Why this priority**: Profile navigation is a secondary interaction that enhances social discovery.

**Independent Test**: Hover over a sender avatar in a kudo card, verify a profile preview tooltip appears (frame `721:5827`). Click the avatar and verify navigation to profile page.

**Acceptance Scenarios**:

1. **Given** a kudo card displays sender/receiver info, **When** the user hovers over the avatar or name, **Then** a profile preview tooltip (frame `721:5827`) appears showing summary info.
2. **Given** a kudo card displays sender/receiver info, **When** the user clicks the avatar or name, **Then** they are navigated to that sunner's profile page.
3. **Given** a sender's star count is displayed, **When** the user hovers over it, **Then** a tooltip describes the star logic/formula.

---

### Edge Cases

- What happens when there are no kudos yet? Display an empty state with a prompt to send the first kudo.
- What happens when a kudo has no images? The image gallery section is hidden.
- What happens when a kudo has a video attachment? Display a thumbnail with a play icon overlay; clicking opens the video player.
- What happens when a kudo has more than 5 hashtags? Display max 5 hashtags on one line with "..." for overflow.
- What happens when the carousel has fewer than 5 highlight kudos? Show only available cards and adjust pagination (e.g. "1/2").
- What happens when the carousel has 0 highlight kudos? Hide the section or show a placeholder message.
- What happens when the user's session expires while on this page? Redirect to login page.
- What happens when the API fails to load kudos? Show error state with retry option.
- What happens when a copied link is invalid or the kudo is deleted? Show "Kudo not found" message on the linked page.
- What happens when the like API fails after optimistic update? Revert the UI to the previous state and show an error toast.
- What happens when the Spotlight Board data is empty? Show a placeholder message inside the canvas.
- What happens when a kudo has multiple receivers? Display all receiver info blocks in sequence (the design shows a single receiver per card but multiple receivers are supported by the Viet Kudo modal).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| KV Kudos Banner (A) | Hero section with "He thong ghi nhan va cam on" title and KUDOS logo | Readonly, decorative |
| Recognition Input (A.1) | Pill-shaped input bar to trigger kudo dialog | Click: opens Viet Kudo modal |
| Search Sunner Input | Pill-shaped search input for finding profiles | Type: search, Enter: execute |
| Highlight Kudos Section (B) | Carousel of top-5 most-liked kudos | Prev/Next, filter by hashtag/department |
| Filter Buttons (B.1.1, B.1.2) | "Hashtag" and "Phong ban" dropdown triggers | Click: open dropdown |
| Highlight Kudo Card (B.3) | Individual carousel card with sender/receiver, content, actions | Click details, like, copy link |
| Carousel Side Arrows (B.2.1, B.2.2) | Large overlay prev/next arrows on carousel edges | Click: navigate carousel slides |
| Carousel Pagination (B.5) | Page indicator "2/5" with prev/next arrows below carousel | Click arrows to navigate |
| Spotlight Board (B.7) | Interactive word cloud/name diagram canvas | Pan, zoom, search, hover names |
| All Kudos Section (C) | Two-column layout with kudo feed and sidebar | Scroll, interact with cards |
| Kudo Post Card (C.3) | Full kudo card with all details and actions | Like, copy link, click images/tags/profiles |
| Stats Card (D.1) | Personal stats overview (kudos/hearts/Secret Box counts) | Read-only stats, "Mo qua" button |
| "Mo Qua" Button (D.1.8) | Primary gold button to open Secret Box | Click: opens Secret Box dialog |
| Sunner Gift List (D.3) | List of 10 latest gift recipients | Click avatar/name: open profile |
| Sunner Ranking List | List of 10 top rising sunners ("10 SUNNER CO SU THANG HANG MOI NHAT"). **Note**: Mentioned in sidebar overview (D) but no dedicated Figma design items exist — reuse D.3 visual pattern (same card style, same sunner item layout). | Click avatar/name: open profile |
| Hashtag Badge (C.3, D.4) | Prominent pill badge showing the primary hashtag (e.g. "IDOL GIOI TRE") | Click: filter by this hashtag |
| Hashtag List (B.4.3, C.3.7) | Inline row of hashtag tags (e.g. "#Dedicated #Inspiring #Dedicated") below content | Click individual tag: filter |
| Section Sub-heading | Repeating "Sun* Annual Awards 2025" text above each section title (Highlight, Spotlight, All Kudos) | Readonly, decorative |
| Spotlight Counter (B.7.1) | Dynamic total "388 KUDOS" header inside Spotlight Board canvas | Readonly, value from DB |
| Footer | Shared footer with copyright, nav links | Readonly, shared component |

### Navigation Flow

- From: Homepage SAA (via "Sun* Kudos" nav or scroll)
- From: Header navigation ("Sun* Kudos" active tab)
- To: Viet Kudo modal (click recognition input)
- To: Secret Box dialog (click "Mo qua")
- To: Profile page (click avatar/name)
- To: Dropdown Hashtag (click filter)
- To: Dropdown Phong ban (click filter)
- To: Profile Preview tooltip (hover avatar/name)

### Visual Requirements

- Responsive breakpoints: Mobile (< 768px), Tablet (768-1023px), Desktop (>= 1024px)
- Animations: Carousel slide transitions (300ms), heart toggle animation (200ms), scroll reveal for sections
- Accessibility: WCAG AA compliance, 44x44px touch targets
  - **Keyboard Navigation**: Carousel prev/next arrows focusable via Tab, activated via Enter/Space. Filter dropdowns openable via Enter/Space, navigable via Arrow keys, closable via Escape. Heart and Copy Link buttons focusable and activatable via Enter/Space. Infinite scroll feed items focusable in tab order.
  - **ARIA Labels**: Carousel region: `aria-label="Highlight Kudos Carousel"`, `aria-roledescription="carousel"`. Each carousel slide: `role="group"`, `aria-label="Slide {n} of {total}"`. Heart button: `aria-pressed="true|false"`, `aria-label="Like kudo, {count} likes"`. Filter buttons: `aria-haspopup="listbox"`, `aria-expanded="true|false"`. Pagination: `aria-label="Carousel pagination"`, `aria-current="true"` on active indicator.
  - **Screen Reader**: Live region (`aria-live="polite"`) for toast notifications (copy link success) and optimistic like count updates. Spotlight word cloud names announced with kudos count context. Stats card values use `aria-label` for full descriptions (e.g., `aria-label="Kudos received: 25"`).
  - **Focus Management**: When a filter dropdown closes, focus returns to the trigger button. When the Viet Kudo modal opens from the action bar, focus moves to the modal; on close, focus returns to the trigger. Skip-to-content link targets the main content area below the header.
- See [design-style.md](design-style.md) for complete visual specifications

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a carousel of up to 5 highlight kudos sorted by heart count descending
- **FR-002**: System MUST allow filtering highlight kudos by hashtag and department via dropdown selectors
- **FR-003**: System MUST display an interactive Spotlight Board with a word cloud of kudos recipients sized by count
- **FR-004**: System MUST display a scrollable feed of all kudos in reverse-chronological order
- **FR-005**: System MUST allow users to like/unlike a kudo (toggle, max 1 like per user per kudo)
- **FR-006**: System MUST allow users to copy a kudo's shareable link to clipboard with confirmation toast
- **FR-007**: System MUST display personal stats in the sidebar (kudos received/sent, hearts, Secret Boxes)
- **FR-008**: System MUST provide a "Mo qua" (Open Gift) button that opens the Secret Box dialog
- **FR-009**: System MUST display a leaderboard of the 10 most recent gift recipients
- **FR-010**: System MUST open the Viet Kudo dialog when the recognition input bar is clicked
- **FR-011**: System MUST display profile preview tooltip on hover over any avatar/name
- **FR-012**: System MUST truncate kudo content at 3 lines (highlight) / 5 lines (all kudos) with "..."
- **FR-013**: System MUST display image galleries (max 5 thumbnails) with click-to-expand functionality
- **FR-014**: System MUST display hashtag badges and lists, clickable to filter
- **FR-015**: System MUST display a "10 SUNNER CO SU THANG HANG MOI NHAT" leaderboard in the sidebar
- **FR-016**: System MUST support video thumbnails with play icon overlay in kudo image galleries
- **FR-017**: System MUST display loading skeletons for all sections during initial data fetch
- **FR-018**: System MUST display error states with retry buttons when API calls fail
- **FR-019**: System MUST support infinite scroll pagination for the All Kudos feed
- **FR-020**: System MUST display a dynamic total kudos counter on the Spotlight Board (e.g. "388 KUDOS"), fetched from the database

### Technical Requirements

- **TR-001**: Page MUST load initial above-the-fold content within 2 seconds on desktop
- **TR-002**: Carousel interaction (prev/next) MUST respond within 300ms
- **TR-003**: Like/unlike MUST be optimistically updated in the UI before API confirmation
- **TR-004**: All API calls MUST use authenticated Supabase client with RLS enforcement
- **TR-005**: Spotlight Board MUST handle 500+ names without degrading performance
- **TR-006**: Kudo feed MUST support pagination or infinite scroll for large datasets
- **TR-007**: Page MUST use RSC for initial data fetch; client components only for interactive elements

### Data Requirements (Display Fields & Validation)

| Field | Context | Type | Validation / Display Rule |
|-------|---------|------|--------------------------|
| Kudo content text | Highlight card | string | Max **3 lines**, truncate with "..." (from Figma B.4.2) |
| Kudo content text | All Kudos card | string | Max **5 lines**, truncate with "..." (from Figma C.3.5) |
| Hashtag list | All cards | string[] | Max **5 hashtags** on one line; if overflow, show "..." (from Figma B.4.3, C.3.7) |
| Image gallery | All Kudos card | url[] | Max **5 thumbnails**, ~80x80px each, horizontal row |
| Heart count | All cards | number | Display formatted (e.g. "1,000"), min 0 |
| Timestamp | All cards | datetime | Format: `HH:mm - MM/DD/YYYY` (from Figma C.3.4) |
| User name | All cards | string | Required, display full name |
| Department | All cards | string | Optional, muted text below name |
| Star count (hoa thi) | All cards | number | Gold text with star icon, required |
| Danh hieu (badge) | All cards | string | Optional, muted text label below star count |
| Hashtag badge | All cards | string | Primary hashtag displayed as prominent pill badge (e.g. "IDOL GIOI TRE") |
| Avatar | All cards | url | Gmail profile image, circular, required |
| Carousel page | Pagination | string | Format: `{current}/{total}`, e.g. "2/5" |
| Stats values | Sidebar | number | 6 values: kudos received, kudos sent, hearts received, Secret Box opened, Secret Box unopened — each displayed as label + number |
| Spotlight total | Spotlight Board | number | Dynamic counter, e.g. "388 KUDOS", queried from DB (from Figma B.7.1) |
| Sunner list item | Leaderboards | object | Avatar (40px circle) + name + description text, max 10 items |

### Key Entities *(if feature involves data)*

- **Kudo**: A recognition post with sender, receivers, content, hashtags, images, badge, timestamps
- **KudoLike**: A like relationship between a user and a kudo (unique per user-kudo pair)
- **User/Sunner**: Employee profile with avatar (Gmail), name, department, star count, badge
- **SecretBox**: Gift box associated with a user, with opened/unopened state
- **Hashtag**: Tag associated with kudos for categorization and filtering
- **Department (Phong ban)**: Organizational unit for filtering
- **Danh Hieu (Badge Title)**: Title/badge displayed next to user names (e.g. role-based or achievement-based). Shown as a small label beneath the user name in kudo cards. Data source: user profile.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/kudos/highlight?hashtag={id}&department={id}` | GET | Fetch top-5 highlight kudos (most hearts), filterable by hashtag and department | New (predicted) |
| `/api/kudos?cursor={id}&limit={n}` | GET | Fetch paginated all-kudos feed (cursor-based, default limit=10) | Exists |
| `/api/kudos/{id}/like` | POST | Toggle like on a kudo | New (predicted) |
| `/api/sunners/ranking` | GET | Fetch 10 top rising sunners | New (predicted) |
| `/api/kudos/stats` | GET | Fetch personal stats (received, sent, hearts, Secret Boxes) | New (predicted) |
| `/api/kudos/spotlight` | GET | Fetch spotlight data (names + kudos counts) | New (predicted) |
| `/api/sunners/gift-recipients` | GET | Fetch 10 most recent gift recipients | New (predicted) |
| `/api/users/search?q={query}` | GET | Search sunner profiles | Exists |
| `/api/hashtags` | GET | Fetch available hashtags for filter | New (predicted) |
| `/api/departments` | GET | Fetch departments for filter | New (predicted) |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads with highlight carousel and first 10 kudo posts within 2 seconds
- **SC-002**: Users can complete a like/unlike interaction in under 500ms (optimistic UI)
- **SC-003**: Carousel navigation responds within 300ms with smooth animation
- **SC-004**: All interactive elements are keyboard-accessible (WCAG AA)
- **SC-005**: Page renders correctly at all 3 breakpoints (mobile, tablet, desktop)
- **SC-006**: Zero XSS vulnerabilities (no dangerouslySetInnerHTML, sanitized user content)

---

## State Management

### Server State (RSC — initial load)
- **Highlight Kudos**: Fetched server-side via RSC for initial render (top 5 by hearts)
- **Spotlight Data**: Fetched server-side (names + counts for word cloud)
- **All Kudos (first page)**: Fetched server-side for SSR
- **User Stats**: Fetched server-side (personal stats for sidebar)
- **Leaderboards**: Fetched server-side (gift recipients + ranking lists)

### Client State (interactive)
- `carouselIndex: number` — Current carousel slide (0-4), used by pagination and prev/next
- `highlightFilters: { hashtagId?: string, departmentId?: string }` — Active filter selections
- `kudosFeed: Kudo[]` — Client-side kudo list, appended via infinite scroll
- `feedPage: number` — Current pagination cursor for infinite scroll
- `feedLoading: boolean` — Loading state for next page fetch
- `likedKudoIds: Set<string>` — Optimistic like state (toggled immediately, reconciled on API response)
- `spotlightMode: 'pan' | 'zoom'` — Current Spotlight Board interaction mode
- `spotlightSearch: string` — Search query for Spotlight name filter
- `toastMessage: string | null` — Toast notification text (e.g. "Link copied — ready to share!")

### Loading & Error States
| Component | Loading State | Error State |
|-----------|--------------|-------------|
| Highlight Carousel | Skeleton cards (3 placeholder cards) | "Failed to load highlights" + Retry button |
| Spotlight Board | Spinner overlay on canvas | "Failed to load spotlight" + Retry button |
| All Kudos Feed | Skeleton cards (3 placeholder cards) | "Failed to load kudos" + Retry button |
| Infinite Scroll | Spinner at bottom of feed | Toast: "Failed to load more" + auto-retry on scroll |
| Stats Card | Skeleton rows (6 lines) | "—" for all values |
| Leaderboard Lists | Skeleton items (5 rows) | "No data available" |
| Like Toggle | Optimistic (instant UI update) | Revert to previous state + error toast |
| Copy Link | Instant clipboard write | Toast: "Failed to copy link" |

---

## Out of Scope

- Real-time WebSocket/SSE updates for the kudo feed (may be added later)
- Full profile page implementation (only preview tooltip in scope)
- Secret Box opening dialog content (handled by frame `1466:7676`)
- Hashtag/Department dropdown internal UI (handled by frames `1002:13013` and `721:5684`)
- Kudo detail page (dedicated page/modal for full kudo view) — "Xem chi tiet" on highlight cards will scroll to the card in the All Kudos feed as an interim behavior
- Admin/moderation features for kudos content
- Push notifications for new kudos

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Viet Kudo modal spec exists (`specs/520-11602-VietKudo/spec.md`)
- [x] Header component spec exists (shared across pages)

---

## Notes

- The page shares the Header and Footer components with Homepage SAA and other pages
- The "Sun* Kudos" nav item in the header should be styled as active (gold color, bold) when on this page
- Kudo content may contain mentions (@user) that should be parsed and linked
- The Spotlight Board is a complex interactive visualization — consider using a canvas-based library (e.g., D3.js or react-force-graph) or CSS-based word cloud
- Star count (hoa thi) next to user names appears to follow a specific business logic formula — should be clarified with stakeholders
- The "IDOL GIOI TRE" hashtag badge appears prominent in kudo cards — it may be a special/featured hashtag category
- Image gallery in kudo cards supports video (play icon visible in design) — video playback behavior should be clarified
