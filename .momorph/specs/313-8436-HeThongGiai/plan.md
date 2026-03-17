# Implementation Plan: Hệ thống giải (Award System)

**Frame**: `313:8436-HeThongGiai`
**Date**: 2026-03-12
**Spec**: `specs/313-8436-HeThongGiai/spec.md`

---

## Summary

Build the Award System page — a long-form informational page presenting 6 SAA 2025 award categories with alternating image/content layouts, a sticky left sidebar with scroll-spy navigation, a hero keyvisual banner, and a Sun\* Kudos promotional section. The page is primarily static content (SSR/RSC) with client-side interactivity limited to scroll-spy and sidebar menu behavior.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4, Supabase (auth only for this page)
**Database**: Supabase PostgreSQL (award data is static — hardcoded constants, no DB dependency)
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: Local component state (scroll-spy `activeAwardId`, mobile `isMenuVisible`)
**API Style**: N/A — award data is static for SAA 2025; no API endpoint needed

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Code & Source Organization**: kebab-case files, PascalCase components, `@/*` path alias, functions ≤50 lines
- [x] **II. Next.js & Cloudflare Best Practices**: RSC by default, `"use client"` only for sidebar scroll-spy; TailwindCSS v4; no Node.js-only APIs
- [x] **III. Supabase Integration**: Auth via `@supabase/ssr` middleware; no direct DB queries for this page (static data)
- [x] **IV. Responsive Design (Mobile-First)**: Mobile-first styles, `md:` / `lg:` prefixes, touch targets ≥44×44px, `next/image` with `sizes`
- [x] **V. OWASP Security**: Auth via middleware (A07), no user-generated content on this page, no raw queries (A03)
- [x] **VI. Test-First Development**: Unit tests for static data, E2E for P1 user stories before feature complete

**Violations (if any):**

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| None | — | — |

---

## Architecture Decisions

### AD-001: Static Award Data (No API)

**Decision**: Award data will be defined as TypeScript constants, not fetched from a database/API.

**Rationale**: The spec explicitly notes award data is static for SAA 2025 and an API is only "predicted for potential future dynamic content management." Using constants eliminates network latency, simplifies the page to pure RSC, and avoids needing a database migration for `award_categories` that doesn't yet exist with the required schema.

**Implication**: If awards need to be dynamic in the future, create a migration extending `award_categories` with `quantity`, `unit_type`, `prize_subtitle` columns, add a service function, and swap the constant import for the service call.

### AD-002: Server Component Page with Client Sidebar

**Decision**: The page (`src/app/awards/page.tsx`) is a React Server Component. Only the sidebar navigation with scroll-spy behavior is a client component (`<AwardSidebar>`).

**Rationale**: Constitution rule II requires RSC by default. The only browser-API dependency is `IntersectionObserver` for scroll-spy and `scrollIntoView()` for menu clicks — isolated to the sidebar.

### AD-003: Extended AwardCategory Type

**Decision**: Create a new `AwardDetailCategory` type in `src/types/awards.ts` alongside the existing `AwardCategory` type.

**Rationale**: The existing `AwardCategory` type (used by Homepage awards grid) has `prize_value: number` and `badge_image_url`. The Award System page requires additional fields: `quantity`, `unit_type`, `prize_subtitle`, `long_description`, `image_url` (high-res), and the Signature 2025 dual-prize structure. A separate type avoids breaking the Homepage.

### AD-004: Alternating Card Layout via Index

**Decision**: Use the array index to determine image position — `index % 2 === 0` → image LEFT, `index % 2 === 1` → image RIGHT (0-indexed: 1st, 3rd, 5th → LEFT; 2nd, 4th, 6th → RIGHT).

**Rationale**: Confirmed from Figma position data. Simple CSS flex-direction toggle: `flex-row` vs `flex-row-reverse`.

### AD-005: Modify Header & Footer for Active Link + Full Nav Support

**Decision**: The existing `<Header>` and `<Footer>` components require modifications for the Award System page:

1. **Header** (`header-client.tsx`): Currently renders all nav links with the same style (`text-white/80`). Must add an `activeHref` prop to highlight the current page's nav link with gold text (#FFEA9E), underline, and text-shadow glow per design-style.md. The Header also uses `h-16` (64px) but the design specifies 80px — this discrepancy should be resolved (either update Header height globally or use current height and adjust sidebar `top` offset to match).
2. **Footer** (`footer.tsx`): The current `variant="app"` only shows copyright + generic links (Điều khoản, Chính sách, Liên hệ). The design requires a completely different layout: logo (69×64) + SAA nav links (About SAA 2025, Award Information\*, Sun\* Kudos, Tiêu chuẩn chung) + copyright in Montserrat Alternates. Must add a new variant `"saa"` (or extend `"app"`) with full nav, active link highlighting (bg `rgba(255,234,158,0.1)`, gold text-shadow), and the logo.
3. **KeyVisual** (`key-visual.tsx`): Current implementation is full-screen absolute positioned. The Award System needs a 627px-tall contained banner with a specific gradient overlay (`linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)`). Must create a new `<AwardKeyVisual>` component or add a `height` prop to the existing one.

**Rationale**: Codebase inspection reveals these components do NOT support the Award System's requirements out of the box. Explicit modifications are scoped to avoid breaking Homepage usage.

### AD-006: Route Structure

**Decision**: New page at `src/app/awards/page.tsx` (route: `/awards`).

**Rationale**: Clean URL for the award system page. Protected by existing middleware (redirects unauthenticated users to `/login`).

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313-8436-HeThongGiai/
├── spec.md              # Feature specification
├── plan.md              # This file
├── design-style.md      # Design specifications
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot
```

### New Files

| File | Purpose | Type |
|------|---------|------|
| `src/app/awards/page.tsx` | Award System page (RSC) | Page |
| `src/components/awards/award-card.tsx` | Single award card with alternating image/content layout | RSC |
| `src/components/awards/award-image.tsx` | Award image with client-side error fallback | Client |
| `src/components/awards/award-sidebar.tsx` | Sticky sidebar with scroll-spy + URL hash support | Client |
| `src/components/awards/awards-section.tsx` | Awards layout wrapper (sidebar + card list) | RSC |
| `src/components/awards/award-keyvisual.tsx` | 627px keyvisual banner with gradient overlay | RSC |
| `src/components/awards/section-title.tsx` | "Hệ thống giải thưởng SAA 2025" heading block | RSC |
| `src/components/awards/kudos-promo.tsx` | Sun\* Kudos promotional section with CTA | RSC |
| `src/utils/award-data.ts` | Static award category constants (6 categories) | Data |
| `src/utils/__tests__/award-data.test.ts` | Unit tests validating static data integrity | Test |
| `tests/e2e/award-system.spec.ts` | E2E tests for P1 user stories | Test |
| `public/images/awards/top-talent.png` | High-res award image (336×336) | Asset |
| `public/images/awards/top-project.png` | High-res award image (336×336) | Asset |
| `public/images/awards/top-project-leader.png` | High-res award image (336×336) | Asset |
| `public/images/awards/best-manager.png` | High-res award image (336×336) | Asset |
| `public/images/awards/signature-2025.png` | High-res award image (336×336) | Asset |
| `public/images/awards/mvp.png` | High-res award image (336×336) | Asset |
| `public/icons/target.svg` | Award title/menu icon | Asset |
| `public/icons/diamond.svg` | Quantity label icon | Asset |
| `public/icons/license.svg` | Prize value label icon | Asset |
| `public/icons/arrow-right.svg` | "Chi tiết" button icon | Asset |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/awards.ts` | Add `PrizeTier` and `AwardDetailCategory` types alongside existing `AwardCategory` |
| `src/components/header/header.tsx` | Add `activeHref?: string` prop, pass through to `HeaderClient` |
| `src/components/header/header-client.tsx` | Accept `activeHref` prop; apply gold text (#FFEA9E), border-bottom, text-shadow glow to matching nav link; keep existing styles for non-active links |
| `src/components/footer/footer.tsx` | Add `"saa"` variant with: logo (69×64), SAA nav links (About SAA 2025, Award Information, Sun\* Kudos, Tiêu chuẩn chung), active link highlight (bg `rgba(255,234,158,0.1)`), copyright in Montserrat Alternates. Accept `activeHref` prop for active link styling |
| `src/app/globals.css` | Add `scroll-padding-top: 64px` and `scroll-behavior: smooth` to `html` element — required for FR-009 (native hash/anchor navigation) and TR-005 (smooth scroll). Without `scroll-padding-top`, direct URL navigation to `#mvp` will be hidden behind the fixed header. |

### Existing Files (no changes)

| File | Usage |
|------|-------|
| `src/utils/format.ts` | `formatVND()` for prize value formatting |
| `src/components/ui/scroll-reveal.tsx` | Entrance animations for sections |
| `src/components/ui/icon.tsx` | Icon rendering for menu items and labels |
| `src/components/ui/section-skeleton.tsx` | Loading skeleton pattern (reference) |
| `middleware.ts` | Auth protection — `/awards` is protected by default (no change needed) |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| None | — | No new dependencies required |

---

## Implementation Strategy

### Phase 0: Asset Preparation

**Goal**: Download and organize all visual assets needed for the Award System page.

**Tasks**:
1. Download 6 high-res award category images (336×336) from Figma using `get_media_files` tool → `public/images/awards/`
2. Download icons: target, diamond, license, arrow-right → `public/icons/`
3. Verify the existing `root-further.png` keyvisual image works for this page (may need award-system-specific variant)
4. Verify SVN-Gotham font availability (for "KUDOS" text in promo section)

**Considerations**:
- If SVN-Gotham font is not available, use a CSS fallback or render as image
- Award images should be optimized (WebP preferred) before adding to `public/`

---

### Phase 1: Foundation — Types & Data

**Goal**: Establish the data layer and type definitions.

**Tasks**:
1. **Extend `src/types/awards.ts`** — Add `AwardDetailCategory` type:
   ```typescript
   export type PrizeTier = {
     label: string;         // e.g., "cho giải cá nhân"
     value: string;         // e.g., "5.000.000 VNĐ"
   };

   export type AwardDetailCategory = {
     id: string;            // URL-safe slug: "top-talent", "mvp", etc.
     name: string;          // Display name: "Top Talent"
     description: string;   // Full Vietnamese description
     imageUrl: string;      // Path to /public/images/awards/...
     quantity: number;      // Number of prizes
     unitType: string;      // "Cá nhân" | "Tập thể" | "Cá nhân + Tập thể"
     prizeTiers: PrizeTier[]; // Single or dual prize tiers
   };
   ```

2. **Create `src/utils/award-data.ts`** — Static data constant `AWARD_CATEGORIES: AwardDetailCategory[]` for all 6 categories matching the spec's data table. Each entry includes:
   - `id`: URL-safe slug used as anchor hash (e.g., `"top-talent"`, `"mvp"`)
   - `name`: Display name (e.g., `"Top Talent"`)
   - `description`: Full Vietnamese description text (to be extracted from Figma frame content)
   - `imageUrl`: Path to `/images/awards/{slug}.png`
   - `quantity`, `unitType`: From spec data table
   - `prizeTiers`: Array — single entry for most categories, two entries for Signature 2025

   > **Note**: Placed in `src/utils/` per constitution folder structure (no `src/data/` directory allowed). Named `award-data.ts` to distinguish from service functions.

3. **Write unit test** `src/utils/__tests__/award-data.test.ts` — Verify:
   - Exactly 6 categories exist
   - All required fields are non-empty strings / positive numbers
   - All `id` values are URL-safe (lowercase, hyphenated, no spaces)
   - All `id` values are unique
   - Signature 2025 has exactly 2 prize tiers
   - All other categories have exactly 1 prize tier
   - Categories are in correct display order: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP

---

### Phase 2: Core Components — Award Cards (US1, P1)

**Goal**: Implement the award card display with alternating layout.

**Tasks**:
1. **Create `src/components/awards/section-title.tsx`** (RSC):
   - Subtitle: "Sun\* Annual Awards 2025" (24px, white)
   - Title: "Hệ thống giải thưởng SAA 2025" (57px, gold #FFEA9E)
   - Responsive: 57px → ~36px on mobile
   - `text-left` alignment per design

2. **Create `src/components/awards/award-image.tsx`** (`"use client"`):
   - Props: `src: string`, `alt: string`
   - Wraps `next/image` (336×336px) with gold border, rounded-3xl, glow shadow, `mix-blend-mode: screen`
   - `onError` handler: on load failure, replace image with a fallback container showing the award name in gold text on dark bg, maintaining 336×336 dimensions
   - Responsive: `w-full max-w-[336px]` on mobile, fixed 336px on desktop

   > **Why a separate client component**: `onError` requires browser-side JS. Isolating this into a thin client wrapper keeps the parent `award-card.tsx` as RSC.

3. **Create `src/components/awards/award-card.tsx`** (RSC):
   - Props: `category: AwardDetailCategory`, `index: number`
   - Alternating layout: `flex-row` (even index) / `flex-row-reverse` (odd index) on desktop; always `flex-col` (image above content) on mobile
   - Uses `<AwardImage>` for the image block
   - Content block: 480px on desktop / full width on mobile, `backdrop-filter: blur(32px)`, gap-8, rounded-2xl
   - Inner structure:
     - Title row: `<Icon name="target" />` + award name (Montserrat 24px/32px 700, gold #FFEA9E)
     - Description: Montserrat 16px/24px 700, white, `text-justify`
     - Divider: 1px solid #2E3940
     - Quantity row: label "Số lượng giải thưởng:" (24px gold) + value (36px white) + unit type (14px white)
     - Divider: 1px solid #2E3940
     - Prize value block: label "Giá trị giải thưởng:" (24px gold) + value(s) (36px white) + subtitle(s) (14px white)
   - **Multi-tier handling** (Signature 2025): iterate `prizeTiers[]` array, rendering each tier's value and label
   - `id` attribute on card root for anchor navigation (e.g., `id="top-talent"`)
   - Accessibility: `<h3>` for award name, alt text on image via `<AwardImage>`

4. **Responsive behavior**:
   - Mobile (<768px): Stack vertically (image above content), full width, no alternation
   - Tablet (768-1023px): Reduced image size (240px), content fills remaining
   - Desktop (≥1024px): Side-by-side as designed

---

### Phase 3: Sidebar Navigation & Scroll-Spy (US2, P1)

**Goal**: Implement the sticky sidebar menu with scroll-spy behavior.

**Tasks**:
1. **Create `src/components/awards/award-sidebar.tsx`** (`"use client"`):
   - Props: `categories: { id: string; name: string }[]`
   - Renders vertical menu with `<Icon name="target" />` + label for each category
   - **Scroll-spy**: Uses `IntersectionObserver` with `rootMargin: "-64px 0px -50% 0px"` (offset for header height 64px, trigger when section crosses top half of viewport). Observes each award card by `id`. On intersection, updates `activeAwardId` state to the most visible section.
   - **Click handler**: `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })`. After click, also update `activeAwardId` immediately (don't wait for observer).
   - **Active state**: Gold text (#FFEA9E), text-shadow glow, left border indicator or underline
   - **Default state**: White text (#FFFFFF), no indicator
   - **Keyboard nav**: Menu items are `<button>` elements (not links) — Tab through, Enter/Space to activate scroll
   - **ARIA**: Wrapper `<nav role="navigation" aria-label="Danh mục giải thưởng">`, active item has `aria-current="true"`
   - CSS: `position: sticky`, `top: 64px` (matches actual header height `h-16`), `self-start` for flex alignment
   - Touch targets: ≥ 44×44px (`p-4` = 16px padding on all sides)
   - **URL hash support** (FR-009): On mount, check `window.location.hash` → if matches a category id, set it as active (the browser + CSS `scroll-padding-top: 64px` from globals.css handles the initial scroll position correctly). On sidebar click, update URL hash via `history.replaceState` (no page reload).
   - Cleanup: disconnect `IntersectionObserver` on unmount

2. **Create `src/components/awards/awards-section.tsx`** (RSC):
   - Layout wrapper: flex row with sidebar (178px) + card list (853px)
   - Maps award data to `<AwardCard>` components with 80px gap
   - Dividers between cards (1px, #2E3940)
   - Passes category list to `<AwardSidebar>`

3. **Responsive behavior**:
   - Mobile: Sidebar hidden (FR-007, US5)
   - Tablet: Sidebar hidden or collapsible
   - Desktop: Sidebar visible, sticky

---

### Phase 4: Hero Keyvisual & Kudos Section (US3, US4 — P2)

**Goal**: Implement the hero banner and Kudos promotional section.

**Tasks**:
1. **Create `src/components/awards/award-keyvisual.tsx`** (RSC):
   - **Why new component**: The existing `<KeyVisual>` is a full-screen absolute-positioned background (`absolute inset-0`) used by Homepage. The Award System needs a 627px-tall contained banner with a different gradient, so a separate component avoids breaking Homepage.
   - Structure: Relative container, `h-[627px] w-full` on desktop, responsive height on mobile
   - Background: `root-further.png` image via `next/image` with `fill` + `object-cover`
   - Gradient overlay: `<div>` with `background: linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)` positioned absolute over the image
   - `aria-hidden="true"`, `pointer-events-none`
   - Responsive: Height scales down on mobile (e.g., `h-[300px] md:h-[450px] lg:h-[627px]`)

2. **Create `src/components/awards/kudos-promo.tsx`** (RSC):
   - Two-column layout on desktop (content left, branding right), stacked on mobile
   - **Left content**:
     - Label: "Phong trào ghi nhận" (Montserrat 24px/32px 700, white)
     - Title: "Sun\* Kudos" (Montserrat 57px 700, gold #FFEA9E, responsive: ~36px on mobile)
     - Description paragraph (Montserrat 16px/24px 700, white)
     - "Chi tiết" button: `<Link href="/#kudos-heading">` (navigates to Homepage Kudos section), gold bg (#FFEA9E), dark text (#00101A), `<Icon name="arrow-right" />`, padding 16px, rounded-sm, hover: opacity 0.9, focus: outline 2px solid #FFEA9E
   - **Right branding**:
     - "KUDOS" text: SVN-Gotham 96px, #DBD1C1, `letter-spacing: -0.13em`. If SVN-Gotham unavailable, use Montserrat bold as fallback with reduced letter-spacing.
   - Responsive: Stack vertically on mobile, hide "KUDOS" text or reduce to 48px

---

### Phase 5: Page Assembly & Responsive (US5, US6 — P2/P3)

**Goal**: Assemble the full page, modify Header/Footer, and ensure responsive behavior.

**Tasks**:

1. **Modify `src/components/header/header.tsx`** — Add `activeHref?: string` prop, pass to `HeaderClient`.

2. **Modify `src/components/header/header-client.tsx`** — Accept `activeHref` prop. In the nav link loop, compare `link.href` with `activeHref`:
   - **Match**: Apply `text-gold border-b border-gold` + `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`
   - **No match**: Keep existing `text-white/80 hover:text-gold`
   - This does NOT break Homepage — Homepage doesn't pass `activeHref`, so all links render with default style.

3. **Modify `src/components/footer/footer.tsx`** — Add `variant="saa"` with:
   - Layout: `flex justify-between items-center`, `border-top: 1px solid #2E3940`, `py-10 px-6 md:px-12 lg:px-[90px]`
   - Left: Logo image (69×64) + nav links (flex, gap-12) — "About SAA 2025" (`/`), "Award Information" (`/awards`), "Sun\* Kudos" (`/#kudos-heading`), "Tiêu chuẩn chung" (`/standards`)
   - Active link: Compare with `activeHref` prop → apply bg `rgba(255,234,158,0.1)`, gold text-shadow
   - Right: Copyright "Bản quyền thuộc về Sun\* © 2025" in Montserrat Alternates
   - Responsive: Stack vertically on mobile, center-align, hide logo on mobile
   - Existing `variant="app"` and `variant="login"` remain unchanged.

4. **Modify `src/app/globals.css`** — Add to the `html` rule:
   ```css
   html {
     scroll-behavior: smooth;       /* TR-005: native smooth scroll for anchor links */
     scroll-padding-top: 64px;      /* FR-009: offset for fixed header (h-16 = 64px) */
   }
   ```
   > **Why**: When a user navigates directly to `/awards#mvp`, the browser scrolls natively before React hydrates. Without `scroll-padding-top`, the target section is hidden behind the fixed 64px header. `scroll-behavior: smooth` provides native smooth scrolling for all anchor links, complementing the JS-based `scrollIntoView` in the sidebar.

5. **Create `src/app/awards/page.tsx`** (RSC):
   ```tsx
   import { redirect } from "next/navigation";
   import { createClient } from "@/libs/supabase/server";
   import Header from "@/components/header/header";
   import Footer from "@/components/footer/footer";
   import AwardKeyVisual from "@/components/awards/award-keyvisual";
   import SectionTitle from "@/components/awards/section-title";
   import AwardsSection from "@/components/awards/awards-section";
   import KudosPromo from "@/components/awards/kudos-promo";
   import ScrollReveal from "@/components/ui/scroll-reveal";
   import { AWARD_CATEGORIES } from "@/utils/award-data";

   const NAV_LINKS = [
     { label: "About SAA 2025", href: "/" },
     { label: "Award Information", href: "/awards" },
     { label: "Sun* Kudos", href: "/#kudos-heading" },
   ];

   export default async function AwardsPage() {
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) redirect("/login");

     return (
       <main className="relative min-h-screen bg-navy overflow-hidden">
         <AwardKeyVisual />
         <Header
           variant="app"
           navLinks={NAV_LINKS}
           activeHref="/awards"
           user={{
             name: user.user_metadata?.full_name || user.email || "User",
             avatar_url: user.user_metadata?.avatar_url,
           }}
         />
         <div className="relative">
           <SectionTitle />
           <ScrollReveal>
             <AwardsSection categories={AWARD_CATEGORIES} />
           </ScrollReveal>
           <ScrollReveal>
             <KudosPromo />
           </ScrollReveal>
         </div>
         <Footer variant="saa" activeHref="/awards" />
       </main>
     );
   }
   ```
   > **Note**: No `pt-16` on the content wrapper. Unlike Homepage (where `<KeyVisual>` is `absolute inset-0` and takes no flow space), `<AwardKeyVisual>` is in-flow (627px tall). Content naturally starts after the keyvisual. The fixed header overlays the keyvisual's top 64px, which is intentional (decorative banner).

6. **Responsive verification** at all 3 breakpoints:
   - Mobile (<768px): No sidebar, cards stacked vertically, section padding `px-4`, page title ~36px
   - Tablet (768-1023px): No sidebar, smaller images (240px), section padding `px-12`
   - Desktop (≥1024px): Full layout as designed, `px-36` (144px), sidebar visible + sticky

---

### Phase 6: Polish & Accessibility

**Goal**: Error handling, accessibility, and performance optimization.

**Tasks**:
1. **Loading state clarification**: Since award data is static (imported constants, not fetched), there is no `isLoading` state and no skeleton needed for content. The spec's `isLoading` state only applies if data were fetched from an API. If the page itself is slow to stream from the server, Next.js `loading.tsx` can be added as a Suspense boundary, but this is unlikely needed given no async data fetching on this page.
2. **Image error handling**: Already covered by `<AwardImage>` client component (Phase 2). Verify fallback renders correctly for all 6 categories.
3. **Accessibility audit**:
   - All award images have descriptive alt text (e.g., "Giải thưởng Top Talent") via `<AwardImage>`
   - Sidebar: `role="navigation"`, `aria-label="Danh mục giải thưởng"`, `aria-current="true"` on active item (Phase 3)
   - Focus visible on all interactive elements: sidebar items, nav links, "Chi tiết" button — `outline: 2px solid #FFEA9E, outline-offset: 2px`
   - Keyboard: Tab through sidebar items, Enter/Space to scroll to section
   - Touch targets ≥ 44×44px on sidebar items (`p-4`), nav links, CTA button
   - WCAG AA color contrast: gold #FFEA9E on dark #00101A = ~13:1 ratio (passes AAA)
   - Award card headings use `<h3>` (page title is `<h1>`, section subtitle could be `<h2>`)
4. **Performance**:
   - `next/image` with `sizes="(max-width: 768px) 100vw, 336px"` for responsive award images
   - Lazy loading for below-fold images: first 2 cards `priority`, remaining 4 use default lazy loading
   - No client-side JS except sidebar scroll-spy + image error fallback (minimal bundle)
   - Verify Lighthouse performance ≥ 90 on desktop (SC-003)
5. **ScrollReveal**: Already integrated in Phase 5 page assembly — `<AwardsSection>` and `<KudosPromo>` wrapped with `<ScrollReveal>` for `motion-safe` entrance animations
6. **Long description handling**: Verify Vietnamese award descriptions render correctly within the 480px content block with `text-justify`. No line clamping needed per spec (full text always displayed).

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Sidebar scroll-spy ↔ Award card sections
- [ ] **External dependencies**: None (static data, auth only via middleware)
- [ ] **Data layer**: N/A (no database queries)
- [x] **User workflows**: Navigate via sidebar, view all awards, click Kudos CTA

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Scroll-spy highlights correct menu item; menu click scrolls to target |
| Service ↔ Service | No | — |
| App ↔ External API | No | — |
| App ↔ Data Layer | No | Static data, no queries |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local development, CI (Playwright)
- **Test data strategy**: Static constants (no mocking needed)
- **Isolation approach**: Each E2E test navigates to `/awards` fresh

### Test Scenarios Outline

1. **Happy Path**
   - [x] Page loads with all 6 award categories displayed with correct data
   - [x] Each award card shows: image, title, description, quantity, unit type, prize value
   - [x] Odd cards (1st, 3rd, 5th) have image LEFT, even cards (2nd, 4th, 6th) image RIGHT
   - [x] Sidebar menu click scrolls to correct award section smoothly
   - [x] Scroll-spy updates active menu item when scrolling through sections
   - [x] "Chi tiết" button navigates to Kudos section/page
   - [x] Header "Award Information" nav link is highlighted gold with glow (US6)
   - [x] Footer "Award Information" nav link has active background highlight (US6)
   - [x] Keyvisual banner renders with gradient overlay (US3)

2. **Edge Cases**
   - [x] URL hash `#mvp` scrolls to MVP section and activates menu item on page load
   - [x] Signature 2025 displays dual prize tiers (5M individual + 8M team) correctly
   - [x] Mobile (<768px): sidebar hidden, cards stacked vertically, no horizontal overflow
   - [x] Tablet (768-1023px): sidebar hidden, reduced image sizes
   - [x] Keyboard navigation: Tab through sidebar items, Enter/Space activates scroll
   - [x] Unauthenticated access redirects to `/login`

3. **Error Handling**
   - [x] Award image load failure shows fallback container with award name

### Tooling & Framework

- **Unit tests**: Vitest — static data validation
- **E2E tests**: Playwright — P1 user stories (sidebar nav, scroll-spy, card display)
- **CI integration**: Run on PR gate

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Static data constants | 100% | High |
| Scroll-spy behavior | E2E coverage | High |
| Responsive layout | Visual regression (E2E screenshots) | Medium |
| Accessibility (keyboard, ARIA) | E2E + manual audit | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Header/Footer modifications break Homepage | Medium | High | Changes are additive (new optional props `activeHref`, new Footer variant `"saa"`). Existing callers don't pass these props, so behavior is unchanged. Verify Homepage still renders correctly after modifications. |
| `backdrop-filter: blur(32px)` browser support | Low | Medium | TailwindCSS `backdrop-blur-[32px]` has broad support (93%+ globally); fallback to `bg-navy/80` solid bg via `@supports not (backdrop-filter: blur(32px))` |
| SVN-Gotham font unavailable | Medium | Low | Used only for "KUDOS" decorative text in promo section; fallback to Montserrat bold with tight letter-spacing |
| Scroll-spy IntersectionObserver threshold tuning | Medium | Medium | Start with `rootMargin: "-64px 0px -50% 0px"` and `threshold: [0, 0.3]`; test with various scroll positions; adjust in E2E tests |
| Award images not in Figma exports | Medium | Medium | Use placeholder colored rectangles (336×336, dark bg with gold border) during development; replace with final assets |
| Sticky sidebar overlaps on smaller desktop screens (1024-1200px) | Low | Medium | Hide sidebar below `lg` breakpoint (1024px); show only on `lg:flex`. Content area takes full width when sidebar hidden. |
| Header height mismatch (design 80px vs actual 64px) | Low | Low | Use actual header height (64px / `h-16`) for sidebar `top` offset. Design discrepancy is minor and does not affect functionality. Document for design team. |

### Estimated Complexity

- **Frontend**: Medium (scroll-spy logic, alternating layout, responsive breakpoints)
- **Backend**: Low (no API, no DB — auth only via middleware)
- **Testing**: Medium (E2E scroll behavior, responsive screenshots)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] `design-style.md` complete with all visual specifications
- [ ] Award category images available (high-res 336×336)
- [ ] Icons available: target, diamond, license, arrow-right
- [ ] Verify SVN-Gotham font availability

### External Dependencies

- Supabase Auth (already configured, no changes needed)
- Figma asset export (award images, icons)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** Phase 0 (asset preparation) — download images/icons from Figma
4. **Begin** Phase 1 (types & data) in parallel with Phase 0

---

## Notes

- The existing `AwardCategory` type and `getAwardCategories()` service (used by Homepage) remain unchanged. The Award System page uses a separate `AwardDetailCategory` type with richer data in `src/types/awards.ts`.
- Static data lives in `src/utils/award-data.ts` per constitution folder structure (no `src/data/` directory). Named `award-data.ts` to distinguish from utility functions.
- The `award_categories` database table currently lacks columns for `quantity`, `unit_type`, `prize_subtitle`, and `long_description`. Since data is static for SAA 2025, we avoid a migration. If dynamic content is needed later, create a migration to add these columns and swap the constant import for a service call.
- **Header modification** (Phase 5): Adding `activeHref` prop is backward-compatible — Homepage doesn't pass it, so all links render with default style. Verified from codebase: `HeaderClient` currently has no active state logic.
- **Footer modification** (Phase 5): Adding `variant="saa"` does NOT modify existing `"app"` or `"login"` variants. The current `"app"` variant has generic links (Điều khoản, Chính sách, Liên hệ) which differ from the design's SAA nav links.
- **Middleware**: `/awards` is automatically protected — the middleware redirects all non-public routes to `/login`. Only `/login` and `/auth/callback` are public. No middleware changes needed.
- **Award descriptions**: The Vietnamese text content for each category's description must be extracted from the Figma frame during implementation. These are not in the spec — they are visible in the frame screenshot and the design items data.
