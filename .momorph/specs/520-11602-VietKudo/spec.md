# Feature Specification: Viết Kudo

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: [Open in Figma](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=520-11602)
**Created**: 2026-03-11
**Status**: Draft

---

## Overview

The **Viết Kudo** (Write Kudos) screen is a modal dialog that allows authenticated Sun* employees to send appreciation and recognition messages ("kudos") to their teammates. It surfaces within the SAA 2025 platform (on the Homepage or Kudos section) and provides a structured form for composing and submitting a kudo.

Key capabilities:
- Select one or more **recipients** from a searchable colleague list
- Assign a **badge/title** (danh hiệu) that categorises the type of recognition
- Write a **rich-text message** with @mention support and formatting
- Add **hashtags** to categorise the kudo thematically
- Optionally attach **images** to enrich the message

The Viết Kudo modal is the primary write-path for the Sun* Kudos system and is tightly coupled to the real-time Kudos Live Board on the Homepage.

**Target users**: All authenticated Sun* employees participating in the SAA 2025 campaign.

**Business context**: The kudos system drives peer-to-peer recognition and engagement during the SAA 2025 campaign. Each submitted kudo appears on the live board and may contribute to award nominations.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a Kudo Successfully (Priority: P1)

As an authenticated Sun* employee, I want to fill in the Viết Kudo form and submit it so that my appreciation message is delivered to my teammate(s) and published on the Kudos Live Board.

**Why this priority**: This is the core write action of the entire Kudos feature. Without it, the Kudos system has no value. All other stories depend on this being functional first.

**Independent Test**: Open the Viết Kudo modal → Select a recipient → Select a badge → Write a message → Click "Gửi" → Verify the kudo appears on the live board.

**Acceptance Scenarios**:

1. **Given** a user opens the Viết Kudo modal, **When** they select a recipient, choose a badge, and write a message (min 1 char), **Then** the "Gửi" button is clickable and they can submit (validation runs on click, not pre-emptively).
2. **Given** the user clicks "Gửi" with valid form data, **When** the submission API call is in progress, **Then** the "Gửi" button shows a loading spinner, is disabled (cannot double-submit), and the form fields are read-only.
3. **Given** a successful API response, **When** the kudo is saved, **Then** the modal closes automatically, a success toast notification appears ("Gửi kudo thành công!"), and the kudo appears on the Kudos Live Board.
4. **Given** the API returns an error, **When** submission fails, **Then** an inline error message appears below the action buttons (e.g., "Gửi kudo thất bại. Vui lòng thử lại."), the form remains open, and the "Gửi" button is re-enabled.

---

### User Story 2 - Search and Select Recipient (Priority: P1)

As an authenticated Sun* employee, I want to search for and select colleagues as recipients of my kudo so that my message is directed to the right person(s).

**Why this priority**: A kudo without a recipient is meaningless. This is a required field and the first step in the composition flow.

**Independent Test**: Open the modal → Type a colleague name in "Người nhận" → Verify a dropdown of matching colleagues appears → Select one → Verify the selected recipient is shown.

**Acceptance Scenarios**:

1. **Given** the Người nhận field is focused, **When** the user types at least 2 characters, **Then** a dropdown list of matching colleagues appears (name + avatar) within 300ms.
2. **Given** the search results dropdown is visible, **When** the user clicks a colleague's name, **Then** the colleague is added as a recipient chip/tag in the input field and the dropdown closes.
3. **Given** a recipient chip is displayed, **When** the user clicks the "×" on the chip, **Then** the recipient is removed from the selection.
4. **Given** the search term returns no results, **When** no match is found, **Then** the dropdown shows "Không tìm thấy kết quả" and no item is selectable.
5. **Given** a recipient is selected, **When** the user searches again, **Then** multiple recipients can be added (multi-select supported).

---

### User Story 3 - Select Badge/Title (Danh hiệu) (Priority: P1)

As an authenticated Sun* employee, I want to assign a recognition badge to my kudo so that the type of appreciation is clearly categorised.

**Why this priority**: The badge field is required. It categorises the kudo (e.g., "Teamwork", "Innovation") and drives analytics and award eligibility.

**Independent Test**: Open the modal → Click the Danh hiệu selector → Verify the badge list dropdown appears → Select a badge → Verify the selected badge name and icon appear in the field.

**Acceptance Scenarios**:

1. **Given** the Danh hiệu selector is clicked, **When** the dropdown opens, **Then** a list of available badges with their icons and names is displayed.
2. **Given** the badge dropdown is open, **When** the user selects a badge, **Then** the badge icon and name appear in the selector field and the dropdown closes.
3. **Given** a badge is already selected, **When** the user clicks the selector again, **Then** the dropdown reopens allowing badge change.
4. **Given** no badge is selected and the user clicks "Gửi", **When** validation triggers, **Then** the Danh hiệu field shows a validation error ("Vui lòng chọn danh hiệu").

---

### User Story 4 - Write Kudo Message with Rich Text (Priority: P1)

As an authenticated Sun* employee, I want to write and format a kudo message with rich text and @mention support so that my appreciation is clearly expressed.

**Why this priority**: The message is the core content of a kudo. It must support basic formatting and @mention to notify mentioned colleagues.

**Independent Test**: Open the modal → Type in the Nội dung area → Test B/I/U formatting → Type "@" and a name to trigger mention → Verify the character counter updates.

**Acceptance Scenarios**:

1. **Given** the user focuses the Nội dung area, **When** they type text, **Then** the character counter updates in real time (format: `{current}/500`).
2. **Given** the user selects text and clicks Bold (B), **When** formatting is applied, **Then** the selected text renders in bold.
3. **Given** the user types "@" followed by a name, **When** at least 2 characters follow "@", **Then** a mention suggestion dropdown appears with matching colleagues.
4. **Given** the user selects a mention suggestion, **When** the mention is inserted, **Then** the name appears highlighted (e.g., in gold) in the message body and the mention triggers a notification to the mentioned user.
5. **Given** the message is empty and the user clicks "Gửi", **When** validation triggers, **Then** the Nội dung field shows a validation error ("Vui lòng nhập nội dung").
6. **Given** the message exceeds 500 characters, **When** the limit is hit, **Then** further typing is blocked and the counter turns red (e.g., `500/500`).

---

### User Story 5 - Add Hashtags (Priority: P2)

As an authenticated Sun* employee, I want to add hashtags to my kudo so that it can be discovered and filtered by topic.

**Why this priority**: Hashtags enrich kudo discoverability but are optional. Core flow works without them.

**Independent Test**: Open the modal → Type a hashtag in the Hashtag field → Press Enter → Verify the hashtag pill appears → Add another → Remove one.

**Acceptance Scenarios**:

1. **Given** the user types a hashtag value and presses Enter or clicks "Thêm hashtag", **When** the tag is submitted, **Then** a gold hashtag pill appears in the hashtag section with the entered text (e.g., "#teamwork").
2. **Given** a hashtag pill exists, **When** the user hovers and clicks the "×" on the pill, **Then** the hashtag is removed.
3. **Given** the hashtag input is focused, **When** the user types an invalid character (e.g., space, special chars other than "-"), **Then** invalid characters are ignored or stripped.
4. **Given** the user adds more than 5 hashtags, **When** the limit is reached, **Then** the "Thêm hashtag" button is hidden and a hint "Tối đa 5 hashtag" appears.

---

### User Story 6 - Attach Images (Priority: P2)

As an authenticated Sun* employee, I want to attach images to my kudo so that I can include visual context or fun graphics in my appreciation message.

**Why this priority**: Images are optional enrichment. The kudo flow is complete without them.

**Independent Test**: Open the modal → Click the image upload area → Select an image → Verify the thumbnail appears → Remove it.

**Acceptance Scenarios**:

1. **Given** the user clicks the image add button, **When** the file picker opens and a valid image file (JPEG/PNG/GIF/WEBP, max 5MB) is selected, **Then** a thumbnail preview appears in the image section.
2. **Given** a thumbnail is displayed, **When** the user clicks the "×" on the thumbnail, **Then** the image is removed.
3. **Given** the user selects a file larger than 5MB, **When** validation runs, **Then** an error message appears ("Ảnh phải nhỏ hơn 5MB") and the image is not added.
4. **Given** the user has added 5 images, **When** they try to add a 6th, **Then** the add button is hidden (or disabled) with a hint "Tối đa 5 ảnh".

---

### User Story 7 - Cancel / Close Modal (Priority: P1)

As an authenticated Sun* employee, I want to close the Viết Kudo modal without submitting so that I can dismiss it if I change my mind.

**Why this priority**: Every modal must be dismissible. Critical UX requirement.

**Independent Test**: Open modal → Fill in some data → Click "Hủy" → Verify modal closes and form data is not saved.

**Acceptance Scenarios**:

1. **Given** the Viết Kudo modal is open, **When** the user clicks the "Hủy" (Cancel) button, **Then** the modal closes immediately and all form data is discarded.
2. **Given** the modal is open, **When** the user clicks the "✕" close icon in the header, **Then** the modal closes and form data is discarded.
3. **Given** the modal is open, **When** the user presses the `Escape` key, **Then** the modal closes and form data is discarded.
4. **Given** the modal is open, **When** the user clicks outside the modal (on the backdrop), **Then** the modal closes and form data is discarded.
5. **Given** the form has unsaved data, **When** any close action is triggered, **Then** the modal closes without any confirmation prompt (data loss is acceptable per UX design).

---

### Edge Cases

- **Empty required fields on submit**: Show inline validation messages below each required field (Người nhận, Danh hiệu, Nội dung). "Gửi" button should not be disabled pre-emptively — validation triggers on submit click.
- **Network timeout**: If the submit API call takes >10s, show a timeout error and re-enable the form.
- **Recipient not found**: If the search API returns 0 results for a query, show "Không tìm thấy đồng nghiệp" with suggestion to check the name spelling.
- **Duplicate submission**: Rapid double-clicking of "Gửi" must only trigger one API call (button disabled on first click).
- **Very long message**: If paste causes the message to exceed 500 characters, truncate to 500 and show the counter at `500/500` in red.
- **Image upload failure**: If an image upload to storage fails, show an inline error on that thumbnail and allow retry without losing other form data.
- **Session expiry during form fill**: If the session expires while the user is composing, the submit API returns 401. Show "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." and redirect to `/login`.

---

## UI/UX Requirements *(from Figma)*

> Visual specifications, exact dimensions, colors, and typography are defined in
> [`design-style.md`](./design-style.md). This section describes *behavior* and *structure*.

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Modal Backdrop | `520:11601` | Semi-transparent dark overlay covering the full viewport | Click → close modal |
| Modal Container | `520:11602` | Scrollable modal card with all form content | — |
| Modal Header | `520:11603` | Title "Gửi lời cảm ơn và ghi nhận đến đồng đội" + close button | — |
| Close Button (✕) | `520:11604` | Icon button to dismiss the modal | Click / Escape → close |
| Người nhận field | `520:11610` | Searchable multi-select input for choosing recipient colleagues | Type → search dropdown; click result → add chip |
| Danh hiệu selector | `520:11620` | Dropdown to select a recognition badge/title | Click → badge list dropdown |
| Nội dung editor | `520:11630` | Rich text area for the kudo message (with formatting toolbar) | Type → updates content; "@" → mention dropdown |
| Hashtag section | `520:11640` | Tag input with existing pills and "Thêm hashtag" button | Enter → add pill; "×" → remove pill |
| Image section | `520:11650` | Thumbnail grid with "+" add button for image uploads | Click "+" → file picker; "×" → remove image |
| Instructional text | `520:11658` | Static label above action buttons: "Gửi lời cảm ơn và ghi nhận đến doanh" — reminds users of the purpose | None |
| Cancel Button | `520:11660` | "Hủy" — dismiss modal without saving | Click → close modal |
| Send Button | `520:11661` | "Gửi ►" — submit the kudo | Click → validate → submit API |

### Navigation Flow

- **From**: Homepage SAA (click "Viết Kudo" / "Gửi kudo" CTA button in the Kudos section)
- **To (success)**: Modal closes → success toast → Kudos Live Board updates
- **To (cancel)**: Modal closes → returns to previous page state
- **Triggers**:
  - "Gửi" (Send) → POST kudo API → modal closes on success
  - "Hủy" (Cancel) / "✕" / Escape / backdrop click → modal closes

### Visual Requirements

- **Design reference**: See [design-style.md](./design-style.md) for all tokens and component styles
- **Responsive breakpoints**:
  - Mobile (`< 768px`): Bottom-sheet modal (slides up), full-width buttons stacked vertically
  - Tablet (`768px – 1023px`): Centered modal, `min(560px, 90vw)` width
  - Desktop (`≥ 1024px`): Centered modal, fixed `600px` width
- **Modal scroll structure**: The modal header (title + close button) and footer (Hủy + Gửi buttons) MUST be fixed/sticky; only the form body (Người nhận → Image fields) scrolls when content overflows `max-height`
- **Modal animation**: Fade-in + scale-up (0.95→1.0) on open; fade-out + scale-down on close (200ms ease-out)
- **Loading state**: "Gửi" button shows a circular spinner, is disabled; form fields become read-only
- **Error state**: Inline error text below each failing field; global API error below action buttons
- **Success state**: Modal closes; toast notification appears (top-right, auto-dismiss after 4s)

### Accessibility Requirements

- **Keyboard navigation**:
  - Tab order: Close button → Người nhận → Danh hiệu → Nội dung → Hashtag input → Image add → Hủy → Gửi
  - `Escape` → close modal
  - `Enter` in hashtag input → add hashtag pill
  - Arrow keys in dropdowns → navigate options; `Enter` → select; `Escape` → close dropdown
- **Focus trap**: When modal is open, keyboard focus MUST be trapped inside the modal (cannot tab to background content)
- **Focus restoration**: When modal closes, focus MUST return to the trigger button (e.g., "Viết Kudo" on the Homepage)
- **ARIA**:
  - Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="kudo-modal-title"`
  - Title: `id="kudo-modal-title"`
  - Recipient input: `aria-label="Tìm kiếm đồng nghiệp"`, `aria-autocomplete="list"`, `aria-expanded="true|false"`, `aria-haspopup="listbox"`
  - Badge selector: `role="combobox"`, `aria-expanded="true|false"`, `aria-haspopup="listbox"`
  - Error messages: `role="alert"` for live regions
  - Required fields: `aria-required="true"`
  - Send button (loading): `aria-busy="true"`, `aria-disabled="true"`
- **Color contrast**: All text on dark modal backgrounds meets WCAG AA (4.5:1 minimum)
- **Touch targets**: All interactive elements ≥ 44×44px on mobile (WCAG 2.5.5)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the Viết Kudo modal when triggered from the Homepage Kudos section.
- **FR-002**: Users MUST be able to search for and select one or more recipients from the colleague list.
- **FR-003**: Users MUST be able to select a recognition badge (Danh hiệu) from a predefined list.
- **FR-004**: Users MUST be able to write a rich-text kudo message (bold, italic, underline, @mention) with a 500-character limit.
- **FR-005**: Users MUST be able to add and remove hashtags (maximum 5 per kudo).
- **FR-006**: Users MUST be able to upload and remove images (maximum 5, max 5MB each, JPEG/PNG/GIF/WEBP).
- **FR-007**: The system MUST validate required fields (Người nhận, Danh hiệu, Nội dung) on submit and display inline error messages.
- **FR-008**: The system MUST prevent duplicate submissions (disable "Gửi" button immediately on click).
- **FR-009**: On successful submission, the modal MUST close and the kudo MUST appear on the Kudos Live Board.
- **FR-010**: On API failure, the modal MUST remain open with an error message and the form MUST be re-editable.
- **FR-011**: The modal MUST be dismissible via the ✕ button, "Hủy" button, Escape key, or backdrop click.
- **FR-012**: The @mention feature MUST trigger a notification to the mentioned colleague.

### Technical Requirements

- **TR-001**: The modal MUST be implemented as a React Client Component (`"use client"`) due to interactive state (Constitution Principle II).
- **TR-002**: Form state (recipients, badge, content, hashtags, images) MUST be managed with local component state; no global state needed unless the kudo feed requires a refetch signal (Constitution Principle II).
- **TR-003**: Image uploads MUST be uploaded to Supabase Storage before kudo submission; the upload URL is stored in the kudo record (Constitution Principle III).
- **TR-004**: All API calls MUST use typed Supabase client calls or Route Handler endpoints; no raw SQL from client (Constitution Principle III).
- **TR-005**: All three responsive breakpoints (mobile bottom-sheet, tablet/desktop centered modal) MUST be implemented (Constitution Principle IV).
- **TR-006**: All Route Handler endpoints MUST be edge-runtime compatible (Constitution Principle II).
- **TR-007**: `dangerouslySetInnerHTML` MUST NOT be used for the rich text editor; use a vetted library (e.g., Tiptap, Quill) or controlled editor approach (Constitution Principle V — XSS).
- **TR-008**: User mention data MUST be validated server-side; client-supplied user IDs MUST NOT bypass RLS (Constitution Principle III + V).
- **TR-009**: E2E tests MUST cover P1 user stories (US1–US3, US7) before feature is marked done (Constitution Principle VI).

### Key Entities

- **Kudo**: The appreciation message entity. Key attributes: `id`, `sender_id`, `recipient_ids[]`, `badge_id`, `content` (rich text), `hashtags[]`, `image_urls[]`, `created_at`.
- **Badge (Danh hiệu)**: A predefined recognition category. Attributes: `id`, `name`, `icon_url`, `description`.
- **User (Colleague)**: The Supabase Auth user + profile. Attributes: `id`, `full_name`, `avatar_url`, `email`.
- **Mention**: A tagged colleague within the kudo content. Triggers an in-app notification.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/users/search?q={query}` | GET | Search colleagues for recipient selection | New (predicted) |
| `/api/badges` | GET | Fetch available recognition badges (Danh hiệu) | New (predicted) |
| `/api/kudos` | POST | Submit the kudo (recipients, badge, content, hashtags, image_urls) | New (predicted) |
| Supabase Storage `/kudos-images/{uuid}` | PUT | Upload image attachment before kudo submission | New (predicted — Supabase Storage) |
| `/api/notifications` | POST | Send mention notifications to tagged users | New (predicted) |

> All endpoints are predicted based on UI requirements. Actual endpoint design may vary.

---

## State Management

| State | Type | Location | Description |
|-------|------|----------|-------------|
| `isOpen` | `boolean` | Parent (Homepage) or URL param | Controls modal visibility; `true` when triggered |
| `recipients` | `User[]` | KudoModal local state | Selected colleagues; updated by recipient search |
| `recipientQuery` | `string` | KudoModal local state | Search term for colleague lookup; drives debounced API call |
| `isRecipientDropdownOpen` | `boolean` | KudoModal local state | Controls search results dropdown visibility |
| `searchResults` | `User[]` | KudoModal local state | Colleague search results for dropdown |
| `selectedBadge` | `Badge \| null` | KudoModal local state | Selected recognition badge |
| `badgeList` | `Badge[]` | KudoModal local state | Fetched on modal open; cached for session |
| `isDropdownOpen` | `boolean` | KudoModal local state | Badge selector dropdown visibility |
| `content` | `string` (rich text) | KudoModal local state | Editor content (HTML or JSON depending on library) |
| `hashtags` | `string[]` | KudoModal local state | Array of hashtag strings |
| `hashtagInput` | `string` | KudoModal local state | Current hashtag input text before confirm |
| `images` | `File[]` | KudoModal local state | Selected image File objects |
| `imagePreviews` | `string[]` | KudoModal local state | Object URL previews for thumbnails |
| `isSubmitting` | `boolean` | KudoModal local state | `true` while API call is in progress |
| `submitError` | `string \| null` | KudoModal local state | Global API error message |
| `fieldErrors` | `Record<string, string>` | KudoModal local state | Per-field validation error messages |

### Submission Flow

```
User clicks "Gửi"
  → Validate required fields (recipients, badge, content)
  → If invalid: set fieldErrors, scroll to first error, stop
  → If valid:
      → setIsSubmitting(true)
      → Upload images to Supabase Storage (parallel)
      → POST /api/kudos { recipients, badge_id, content, hashtags, image_urls }
      → On success:
          → setIsSubmitting(false)
          → onClose() (modal closes)
          → Show success toast
          → Trigger Kudos Live Board refetch/update
      → On error:
          → setIsSubmitting(false)
          → setSubmitError("Gửi kudo thất bại. Vui lòng thử lại.")
```

---

## Success Criteria *(mandatory)*

- **SC-001**: A user can successfully compose and submit a kudo (recipient + badge + message) within 60 seconds on a standard connection.
- **SC-002**: The submitted kudo appears on the Kudos Live Board within 5 seconds of successful submission.
- **SC-003**: All required field validations are shown immediately on the submit attempt without page reload.
- **SC-004**: The modal renders correctly (no overflow, no broken layout) at 360px, 768px, and 1440px viewport widths.
- **SC-005**: The "Gửi" button is keyboard-accessible, has a visible focus ring, and can be triggered with `Enter`.
- **SC-006**: Double-clicking "Gửi" results in exactly one API call (no duplicate kudo records).
- **SC-007**: Image uploads of valid files (JPEG/PNG/GIF/WEBP ≤5MB) complete within 5 seconds on a standard connection.
- **SC-008**: Adding 5 images and then attempting a 6th shows the limit hint without page reload or error flash.

---

## Out of Scope

- Kudo editing after submission — kudos are immutable once sent.
- Kudo deletion by the sender — not available in this design.
- Kudo drafts / auto-save — form data is discarded on modal close.
- GIF search / external media — only local image file upload is supported.
- Emoji picker — plain text emoji via keyboard is acceptable; no dedicated picker component.
- Kudo reactions (likes, comments) — handled by a separate feature.
- Email notifications for mentions — in-app notifications only per this design.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Design style documented (`design-style.md`)
- [x] Homepage SAA spec exists (entry point to this modal — see [HomepageSAA spec](../2167-9026-HomepageSAA/spec.md))
- [ ] API specifications available (`.momorph/API.yml`) — not yet created; endpoints are predicted
- [ ] Database design completed (`.momorph/database.sql`) — `kudos`, `badges`, `mentions` tables required
- [ ] Rich text editor library decided (Tiptap recommended — check `package.json`)

---

## Notes

- The modal title "Gửi lời cảm ơn và ghi nhận đến đồng đội" translates to "Send appreciation and recognition to teammates" — this is the visual header text.
- The feature name "Viết Kudo" translates to "Write Kudo".
- The `content` rich text field must sanitise HTML output server-side before storage to prevent XSS (Constitution Principle V).
- The recipient search (`/api/users/search`) should be debounced (300ms) to avoid excessive API calls.
- Badge list (`/api/badges`) should be fetched once on modal open and cached; it is a relatively static list.
- Image files should be uploaded to a Supabase Storage bucket (`kudos-images`) with per-user RLS policies.
- The `@mention` feature in the rich text area is complex — consider using Tiptap's `@tiptap/extension-mention` for implementation.
- On mobile, the modal should use a bottom-sheet animation (slides in from bottom) to feel native on touch devices.
- The Kudos Live Board refetch after submission can be achieved via Supabase Realtime subscriptions (already planned in Homepage SAA spec).
- Locale: All UI text is in Vietnamese; no i18n required for this screen based on current design.
