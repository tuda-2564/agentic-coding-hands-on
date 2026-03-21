# Feature Specification: Hệ thống giải (Award System)

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-12
**Status**: Draft

---

## Overview

The **Award System** page ("Hệ thống giải thưởng SAA 2025") is the main informational page for the Sun\* Annual Awards 2025 campaign. It presents the complete award category system — 6 award types — with detailed descriptions, quantities, and prize values. The page includes a sticky left-side navigation menu for quick access to each category, a hero keyvisual banner, and a promotional section for the Sun\* Kudos recognition program.

**Target Users**: All Sun\* employees viewing award information for SAA 2025.
**Business Context**: Central hub for employees to understand all SAA 2025 award categories, motivating participation and nominations.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Award Categories Overview (Priority: P1)

As a Sun\* employee, I want to see all 6 award categories with their descriptions, quantities, and prize values, so that I understand what awards are available in SAA 2025.

**Why this priority**: This is the core purpose of the page — presenting award information is the primary value proposition.

**Independent Test**: Navigate to the Award System page and verify all 6 award cards are displayed with correct information.

**Acceptance Scenarios**:

1. **Given** the user navigates to the Award System page, **When** the page loads, **Then** all 6 award categories are displayed: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.
2. **Given** the page has loaded, **When** the user scrolls through award cards, **Then** each card shows: award image, title, description text, number of prizes (with unit type), and prize value in VNĐ.
3. **Given** the page has loaded, **When** viewing "Top Talent" card, **Then** it displays on a **single horizontal row**: diamond icon + "Số lượng giải thưởng:" label + quantity "10" + unit "Cá nhân"; and below a separate section: "7.000.000 VNĐ" with subtitle "cho mỗi giải thưởng".
4. **Given** the page has loaded, **When** viewing "Signature 2025 - Creator" card, **Then** it displays: unit "Cá nhân hoặc tập thể", and two separate prize value blocks — "5.000.000 VNĐ" (cho giải cá nhân), a **"Hoặc"** separator with a horizontal divider line, then "8.000.000 VNĐ" (cho giải tập thể).
5. **Given** the page has loaded, **When** viewing award cards, **Then** odd-indexed cards (1st, 3rd, 5th) show the image on the LEFT side, and even-indexed cards (2nd, 4th, 6th) show the image on the RIGHT side (alternating layout).
6. **Given** the page has loaded, **When** viewing any award card quantity section, **Then** the diamond icon, "Số lượng giải thưởng:" label, quantity number, and unit type all appear on the **same single horizontal row** (NOT split across multiple lines).

---

### User Story 2 - Navigate Between Award Categories (Priority: P1)

As a Sun\* employee, I want to use the left sidebar menu to quickly jump to a specific award category, so that I can find the award I'm interested in without scrolling the entire page.

**Why this priority**: With 6 award sections spanning a long page (~6400px), sidebar navigation is essential for usability.

**Independent Test**: Click each menu item and verify the page scrolls to the corresponding award card.

**Acceptance Scenarios**:

1. **Given** the user is on the Award System page, **When** they click "Top Project" in the left menu, **Then** the page smoothly scrolls to the Top Project award card section.
2. **Given** the user clicks a menu item, **When** the page scrolls to the target section, **Then** the clicked menu item becomes visually active (gold text with indicator).
3. **Given** the user is scrolling the page manually, **When** a new award section enters the viewport, **Then** the corresponding menu item automatically highlights (scroll-spy behavior).
4. **Given** the user is on desktop (≥1024px), **When** they scroll through award sections, **Then** the left menu remains sticky/visible on screen.

---

### User Story 3 - View Hero Keyvisual Banner (Priority: P2)

As a Sun\* employee, I want to see an engaging hero banner when I first land on the page, so that I feel the excitement and prestige of the SAA 2025 campaign.

**Why this priority**: The keyvisual sets the visual tone but is not functionally critical.

**Independent Test**: Load the page and verify the keyvisual banner renders correctly with artwork and gradient overlay.

**Acceptance Scenarios**:

1. **Given** the user navigates to the Award System page, **When** the page loads, **Then** the hero keyvisual displays the "ROOT FURTHER" artwork with the campaign branding.
2. **Given** the keyvisual is rendered, **When** viewing on desktop, **Then** it spans full width (1440px) with a gradient overlay fading to the dark background.

---

### User Story 4 - Navigate to Sun\* Kudos (Priority: P2)

As a Sun\* employee, I want to learn about and navigate to the Sun\* Kudos recognition program from this page, so that I can participate in peer recognition.

**Why this priority**: Cross-promotion of Kudos is important but secondary to the award information itself.

**Independent Test**: Verify the Kudos section displays and the "Chi tiết" button navigates correctly.

**Acceptance Scenarios**:

1. **Given** the user scrolls past all award categories, **When** the Sun\* Kudos section is visible, **Then** it displays: subtitle "Phong trào ghi nhận", title "Sun\* Kudos" (gold), description text starting with "ĐIỂM MỚI CỦA SAA 2025...", the Sun\* Kudos logo image, the large "KUDOS" decorative text, and a "Chi tiết" action button.
2. **Given** the user sees the Kudos section, **When** they click "Chi tiết", **Then** they are navigated to the **Sun\* Kudos Live Board page** (`/kudos`, frame `2940:13431`).

---

### User Story 5 - Responsive Award Viewing (Priority: P2)

As a Sun\* employee on a mobile or tablet device, I want the award system page to be fully readable and navigable, so that I can view award information on any device.

**Why this priority**: Mobile-first is a constitutional requirement; many employees may access on mobile.

**Independent Test**: View the page at mobile (<768px), tablet (768-1023px), and desktop (≥1024px) breakpoints.

**Acceptance Scenarios**:

1. **Given** the user opens the page on mobile (<768px), **When** the page renders, **Then** award cards stack vertically (image above content), and no horizontal scrollbar appears.
2. **Given** the user is on mobile, **When** viewing the awards, **Then** the left sidebar menu is hidden or converted to horizontal tabs/selector.
3. **Given** the user is on tablet (768-1023px), **When** viewing award cards, **Then** the layout adapts with reduced image sizes and appropriate spacing.

---

### User Story 6 - Use Header and Footer Navigation (Priority: P3)

As a Sun\* employee, I want to navigate between SAA 2025 pages using the header and footer, so that I can explore other sections like "About SAA 2025" or "Tiêu chuẩn chung".

**Why this priority**: Navigation is shared across pages and likely already implemented.

**Independent Test**: Click header/footer nav links and verify navigation.

**Acceptance Scenarios**:

1. **Given** the user is on the Award System page, **When** viewing the header, **Then** "Award Information" nav link is highlighted as active (gold text with glow and underline).
2. **Given** the user clicks "Sun\* Kudos" in the header or footer, **When** navigation occurs, **Then** they are taken to the Sun\* Kudos Live Board page (`/kudos`).

---

### Edge Cases

- What happens when the page is accessed without authentication? → Redirect to login.
- How does the page handle very long award descriptions? → Text should be contained within the 480px content block with proper overflow handling.
- What happens when award data fails to load? → Show error state or fallback static content.
- How does scroll-spy behave when between two sections? → The section most visible in viewport should be active in menu.
- What if award images fail to load? → Show placeholder with award name.
- What happens while the page is loading? → Show skeleton placeholders matching card layout dimensions.
- What if the user navigates directly to an anchor (e.g., `#mvp`)? → Page should scroll to the MVP section and activate the corresponding menu item.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Header | Top navigation bar with logo, page links, notification, language, user | Sticky top, nav click |
| Keyvisual Banner | Hero artwork with "ROOT FURTHER" branding | Static display |
| Section Title | "Hệ thống giải thưởng SAA 2025" heading | Static display |
| Award Menu (Sidebar) | Left-side vertical navigation with 6 award category links | Click to scroll, active state, sticky |
| Award Card (×6) | Card with image, title, description, quantity, prize value | Static display, scroll target |
| Award Image | 336×336px framed image with gold border and glow | Static display |
| Award Content | Text block with title, description, metadata | Static display |
| Sun\* Kudos Section | Promotional block with title, description, CTA button | "Chi tiết" click navigates |
| Footer | Bottom navigation with logo, links, copyright | Nav click |

> **Visual specifications** → See [design-style.md](./design-style.md) for complete CSS values, colors, typography, and spacing.

### Navigation Flow

- **From**: Header "Award Information" nav link — from any SAA 2025 page (Homepage, Kudos Live Board)
- **From**: Homepage SAA award card click
- **Within**: Left sidebar menu → smooth scroll to award section (anchor navigation, same page)
- **To**: Sun\* Kudos Live Board (`/kudos`, frame `2940:13431`) — via "Chi tiết" button in Kudos section, or "Sun\* Kudos" in header/footer nav
- **To**: Homepage SAA (`/`) — via "About SAA 2025" in header nav
- **To**: "Tiêu chuẩn chung" page — via footer nav only (not in header)
- **To**: Login (`/login`) — on session expiry (middleware redirect)

### Visual Requirements

- Responsive breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (≥1024px)
- Animations: Smooth scroll on menu click (300ms ease-out), nav hover transitions (200ms)
- Accessibility:
  - Alt text on all award images (e.g., "Giải thưởng Top Talent")
  - Keyboard navigation: Tab through menu items, Enter/Space to activate scroll
  - Focus ring: visible outline on all interactive elements (menu items, nav links, CTA button)
  - ARIA: sidebar menu uses `role="navigation"` with `aria-label="Danh mục giải thưởng"`, active item uses `aria-current="true"`
  - WCAG AA color contrast: gold #FFEA9E on dark #00101A (ratio ~13:1, passes)
  - Touch targets: all menu items and nav links ≥ 44×44px (constitution requirement)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all 6 award categories with title, description, quantity, unit type, and prize value.
- **FR-002**: System MUST provide a sticky left sidebar navigation menu that scrolls to the corresponding award section on click.
- **FR-003**: System MUST implement scroll-spy behavior — the active menu item updates based on which section is in the viewport.
- **FR-004**: System MUST render the hero keyvisual banner with gradient overlay at the top of the page.
- **FR-005**: System MUST display the Sun\* Kudos promotional section with a working "Chi tiết" navigation button.
- **FR-006**: System MUST highlight "Award Information" as the active page in both header and footer navigation.
- **FR-007**: System MUST be fully responsive across mobile, tablet, and desktop breakpoints.
- **FR-008**: Award cards MUST alternate image position: odd cards (1st, 3rd, 5th) show image LEFT, even cards (2nd, 4th, 6th) show image RIGHT.
- **FR-009**: System MUST support URL hash/anchor navigation (e.g., `#top-talent`) so users can deep-link to specific award sections.
- **FR-010**: Sidebar menu MUST be accessible via keyboard (Tab navigation, Enter/Space to activate) with proper ARIA roles.

### Technical Requirements

- **TR-001**: Page MUST load within 3 seconds on 4G connection (Core Web Vitals compliance).
- **TR-002**: Award images MUST use `next/image` with optimized loading and proper `sizes` attribute.
- **TR-003**: Page MUST be server-side rendered (RSC) for SEO and performance — client components only for scroll-spy and menu interactivity.
- **TR-004**: Sticky sidebar MUST use CSS `position: sticky` with proper `top` offset for header clearance (80px).
- **TR-005**: Smooth scroll MUST use native CSS `scroll-behavior: smooth` or `scrollIntoView({ behavior: 'smooth' })`.

### Key Entities *(data)*

- **Award Category**: Represents one award type with properties: id, name, description, imageUrl, quantity, unitType, prizeTiers[].

| Award | id | imageUrl |
|-------|----|----------|
| Top Talent | `top-talent` | `/images/awards/top-talent.svg` |
| Top Project | `top-project` | `/images/awards/best-project.svg` |
| Top Project Leader | `top-project-leader` | `/images/awards/culture-champion.svg` |
| Best Manager | `best-manager` | `/images/awards/best-manager.svg` |
| Signature 2025 - Creator | `signature-2025` | `/images/awards/innovation.svg` |
| MVP (Most Valuable Person) | `mvp` | `/images/awards/mvp.svg` |
- **Award Data** (static for SAA 2025):

| Award | Quantity | Unit | Prize Value | Prize Subtitle |
|-------|----------|------|-------------|----------------|
| Top Talent | 10 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng |
| Top Project | 02 | Tập thể | 15.000.000 VNĐ | cho mỗi giải thưởng |
| Top Project Leader | 03 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng |
| Best Manager | 01 | Cá nhân | 10.000.000 VNĐ | — |
| Signature 2025 - Creator | 01 | Cá nhân hoặc tập thể | 5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể) | cho giải cá nhân / cho giải tập thể |
| MVP (Most Valuable Person) | 01 | Cá nhân | 15.000.000 VNĐ | — |

- **Award Descriptions** (exact content from Figma — must match verbatim):

| Award | Description |
|-------|-------------|
| Top Talent | Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể. |
| Top Project | Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp. |
| Top Project Leader | Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy "Aim High – Be Agile" trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình. |
| Best Manager | Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng. |
| Signature 2025 - Creator | **Paragraph 1:** Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun\* hướng tới trong từng thời kỳ. **Paragraph 2:** Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun\*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun\* tạo giá trị. |
| MVP (Most Valuable Person) | **Paragraph 1:** Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun\*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun\* suốt năm qua. **Paragraph 2:** Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun\* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun\*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới. |

> **Note on Signature 2025 prize section**: Between the two prize tiers (5.000.000 VNĐ and 8.000.000 VNĐ), the design shows a "Hoặc" separator — a row with the text "Hoặc" followed by a horizontal divider line (Figma node: Frame 524). This separator must be rendered between the two prize value blocks.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/awards | GET | Fetch award categories with descriptions and values | Predicted (New) |
| /api/campaign | GET | Fetch campaign info (title, dates, keyvisual) | Predicted (may exist) |

> **Note**: Award data may be static/hardcoded for SAA 2025. If so, no API is needed — data can be defined as constants. API is predicted for potential future dynamic content management.

---

## State Management

### Local Component State
- `activeAwardId: string` — Currently active/visible award section (for menu highlight via scroll-spy)
- `isMenuVisible: boolean` — Mobile menu visibility toggle
- `isLoading: boolean` — Page loading state (for skeleton display if data is fetched)

### Global State
- None required — this is primarily a display/informational page.
- Auth session: read from Supabase cookies (middleware enforced, no local state needed).

### Loading & Error States
- **Loading**: Show skeleton placeholders matching card layout (image placeholder 336×336, text placeholders for title/description/value).
- **Error (data fetch failure)**: Display inline error message with retry button. Fallback to static hardcoded data if API fails.
- **Image load failure**: Show a fallback container with the award name in gold text on dark background, maintaining 336×336 dimensions.

### Cache Requirements
- Award data can be cached indefinitely (static content for SAA 2025 campaign)
- Images should leverage `next/image` built-in optimization and caching

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 award categories render correctly with accurate data (quantity, value) — 100% content accuracy.
- **SC-002**: Sidebar menu click-to-scroll works for all 6 categories with <300ms response time.
- **SC-003**: Page passes Lighthouse performance score ≥ 90 on desktop.
- **SC-004**: Page is fully functional at all 3 breakpoints (mobile, tablet, desktop) with no layout overflow.
- **SC-005**: Scroll-spy correctly highlights the active menu item as the user scrolls through sections.

---

## Out of Scope

- Award nomination/voting functionality (separate feature)
- Dynamic award data management/CMS (awards are static for SAA 2025)
- Animation effects beyond smooth scroll and hover transitions
- Award detail sub-pages (clicking an award card does not navigate anywhere)
- Internationalization (page is in Vietnamese only for this iteration)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — may not be needed if data is static
- [ ] Database design completed — may not be needed if data is static
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Existing components: `<Header>`, `<Footer>`, `<KeyVisual>` (from Homepage SAA spec)

---

## Notes

- Award card image/content alternation: Based on the Figma design, **odd-indexed cards** (Top Talent, Top Project Leader, Signature 2025) have the image on the **left**, while **even-indexed cards** (Top Project, Best Manager, MVP) have the image on the **right** (content on left). This alternating layout creates visual rhythm.
- The "Signature 2025 - Creator" award has **two prize tiers**: individual (5.000.000 VNĐ) and team (8.000.000 VNĐ), unlike other awards which have a single value.
- The left sidebar menu uses icons (target icon) before each label — all icons should use the project's Icon Component pattern.
- The page title uses a very large font (57px) — ensure responsive scaling for smaller screens.
- Award descriptions are in Vietnamese and contain long paragraphs — ensure proper `text-align: justify` and line clamping if needed.
- The `backdrop-filter: blur(32px)` on award content blocks provides a frosted glass effect — verify browser support.
- **Signature 2025 unit type** is "Cá nhân hoặc tập thể" (NOT "Cá nhân + Tập thể").
- **Signature 2025 and MVP** have **two-paragraph descriptions**; render as separate `<p>` elements with spacing between them.
- **Quantity row layout**: The diamond icon, label "Số lượng giải thưởng:", quantity number, and unit text are ALL displayed on a **single horizontal row** (`display: flex; flex-direction: row; align-items: center`). Do NOT place number/unit on a separate row.
- **Prize value layout**: The license icon + label "Giá trị giải thưởng:" is on row 1; the prize amount is on row 2 (no left indent); the subtitle is on row 3 (no left indent). Do NOT add `padding-left` to the value/subtitle.
- **Kudos description** (exact content from Figma): "ĐIỂM MỚI CỦA SAA 2025 Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun\* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải."
