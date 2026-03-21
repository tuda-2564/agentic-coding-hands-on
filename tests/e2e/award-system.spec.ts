import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Inject auth cookie and navigate to the Award System page. */
async function goToAwards(page: Page) {
  if (process.env.E2E_AUTH_COOKIE) {
    const cookies = JSON.parse(process.env.E2E_AUTH_COOKIE) as Array<{
      name: string;
      value: string;
      domain: string;
      path: string;
    }>;
    await page.context().addCookies(cookies);
  }
  await page.goto("/awards");
  await page.waitForLoadState("networkidle");
}

const AWARD_IDS = [
  "top-talent",
  "top-project",
  "top-project-leader",
  "best-manager",
  "signature-2025",
  "mvp",
];

const AWARD_NAMES = [
  "Top Talent",
  "Top Project",
  "Top Project Leader",
  "Best Manager",
  "Signature 2025 - Creator",
  "MVP (Most Valuable Person)",
];

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

test.describe("Unauthenticated access", () => {
  test("redirects to /login when not authenticated", async ({ page }) => {
    await page.goto("/awards");
    await expect(page).toHaveURL(/\/login/);
  });
});

// ---------------------------------------------------------------------------
// US1 — View Award Categories Overview (P1)
// ---------------------------------------------------------------------------

test.describe("US1: Award categories overview", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    await goToAwards(page);
  });

  test("displays all 6 award categories", async ({ page }) => {
    for (const name of AWARD_NAMES) {
      await expect(
        page.getByRole("heading", { name, level: 3 })
      ).toBeVisible();
    }
  });

  test("each award card shows required data fields", async ({ page }) => {
    // Check Top Talent card as representative sample
    const card = page.locator("#top-talent");
    await expect(card).toBeVisible();
    await expect(card.getByText("Số lượng giải thưởng:")).toBeVisible();
    await expect(card.getByText("10")).toBeVisible();
    await expect(card.getByText("Cá nhân")).toBeVisible();
    await expect(card.getByText("Giá trị giải thưởng:")).toBeVisible();
    await expect(card.getByText("7.000.000 VNĐ")).toBeVisible();
    await expect(card.getByText("cho mỗi giải thưởng")).toBeVisible();
  });

  test("quantity row is on a single horizontal line (not stacked)", async ({
    page,
  }) => {
    const card = page.locator("#top-talent");
    const quantityLabel = card.getByText("Số lượng giải thưởng:");
    const quantityValue = card.getByText("10");
    const labelBox = await quantityLabel.boundingBox();
    const valueBox = await quantityValue.boundingBox();
    expect(labelBox).not.toBeNull();
    expect(valueBox).not.toBeNull();
    // Both elements should be on the same vertical line (same Y center ±10px)
    const labelCenter = labelBox!.y + labelBox!.height / 2;
    const valueCenter = valueBox!.y + valueBox!.height / 2;
    expect(Math.abs(labelCenter - valueCenter)).toBeLessThan(10);
  });

  test("Signature 2025 shows unit 'Cá nhân hoặc tập thể'", async ({
    page,
  }) => {
    const card = page.locator("#signature-2025");
    await expect(card.getByText("Cá nhân hoặc tập thể")).toBeVisible();
  });

  test("Signature 2025 shows both prize tiers with Hoặc separator", async ({
    page,
  }) => {
    const card = page.locator("#signature-2025");
    await expect(card.getByText("5.000.000 VNĐ")).toBeVisible();
    await expect(card.getByText("8.000.000 VNĐ")).toBeVisible();
    await expect(card.getByText("Hoặc")).toBeVisible();
    await expect(card.getByText("cho giải cá nhân")).toBeVisible();
    await expect(card.getByText("cho giải tập thể")).toBeVisible();
  });

  test("odd-indexed cards (1st, 3rd, 5th) have image on the left side", async ({
    page,
  }) => {
    const oddIds = ["top-talent", "top-project-leader", "signature-2025"];
    for (const id of oddIds) {
      const card = page.locator(`#${id}`);
      const image = card.locator("img").first();
      const content = card.locator('[class*="w-full"][class*="flex-col"]').first();
      const imageBox = await image.boundingBox();
      const contentBox = await content.boundingBox();
      if (imageBox && contentBox) {
        // Image should be to the LEFT of content (image.x < content.x)
        expect(imageBox.x).toBeLessThan(contentBox.x);
      }
    }
  });

  test("even-indexed cards (2nd, 4th, 6th) have image on the right side", async ({
    page,
  }) => {
    const evenIds = ["top-project", "best-manager", "mvp"];
    for (const id of evenIds) {
      const card = page.locator(`#${id}`);
      const image = card.locator("img").first();
      const content = card.locator('[class*="w-full"][class*="flex-col"]').first();
      const imageBox = await image.boundingBox();
      const contentBox = await content.boundingBox();
      if (imageBox && contentBox) {
        // Image should be to the RIGHT of content (image.x > content.x)
        expect(imageBox.x).toBeGreaterThan(contentBox.x);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// US2 — Navigate Between Award Categories via Sidebar (P1)
// ---------------------------------------------------------------------------

test.describe("US2: Sidebar navigation and scroll-spy", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    await goToAwards(page);
  });

  test("sidebar menu is visible on desktop", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: "Danh mục giải thưởng" })
    ).toBeVisible();
  });

  test("sidebar shows all 6 category labels", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Danh mục giải thưởng" });
    for (const name of AWARD_NAMES) {
      await expect(nav.getByText(name)).toBeVisible();
    }
  });

  test("clicking sidebar item scrolls to the corresponding award section", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Danh mục giải thưởng" });
    await nav.getByText("MVP (Most Valuable Person)").click();
    await page.waitForTimeout(600); // allow smooth scroll to complete
    const mvpSection = page.locator("#mvp");
    await expect(mvpSection).toBeInViewport();
  });

  test("clicked sidebar item becomes visually active (gold text)", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Danh mục giải thưởng" });
    const mvpButton = nav.getByRole("button", {
      name: /MVP/i,
    });
    await mvpButton.click();
    await page.waitForTimeout(200);
    await expect(mvpButton).toHaveAttribute("aria-current", "true");
  });

  test("sidebar button has aria-current=true on active item", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Danh mục giải thưởng" });
    const firstButton = nav.getByRole("button").first();
    await expect(firstButton).toHaveAttribute("aria-current", "true");
  });

  test("URL hash navigation — /awards#mvp scrolls to MVP section", async ({
    page,
  }) => {
    if (process.env.E2E_AUTH_COOKIE) {
      const cookies = JSON.parse(process.env.E2E_AUTH_COOKIE) as Array<{
        name: string;
        value: string;
        domain: string;
        path: string;
      }>;
      await page.context().addCookies(cookies);
    }
    await page.goto("/awards#mvp");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    const mvpSection = page.locator("#mvp");
    await expect(mvpSection).toBeInViewport();
  });
});

// ---------------------------------------------------------------------------
// US3 — Hero Keyvisual Banner (P2)
// ---------------------------------------------------------------------------

test.describe("US3: Hero keyvisual banner", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    await goToAwards(page);
  });

  test("keyvisual image is visible at top of page", async ({ page }) => {
    const keyvisual = page.locator("img[src*='root-further']");
    await expect(keyvisual).toBeVisible();
    const box = await keyvisual.boundingBox();
    // Image should be near the top of the page
    expect(box?.y).toBeLessThan(100);
  });

  test("section title overlays the keyvisual (not below it)", async ({
    page,
  }) => {
    const keyvisual = page.locator("img[src*='root-further']");
    const title = page.getByRole("heading", {
      name: "Hệ thống giải thưởng SAA 2025",
      level: 1,
    });
    const kvBox = await keyvisual.boundingBox();
    const titleBox = await title.boundingBox();
    // Title bottom edge should be within the keyvisual bounds (overlaid)
    if (kvBox && titleBox) {
      expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(
        kvBox.y + kvBox.height + 20
      );
    }
  });

  test("section title shows subtitle and main title", async ({ page }) => {
    await expect(page.getByText("Sun* Annual Awards 2025")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Hệ thống giải thưởng SAA 2025",
        level: 1,
      })
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// US4 — Sun* Kudos Section (P2)
// ---------------------------------------------------------------------------

test.describe("US4: Sun* Kudos promotional section", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    await goToAwards(page);
  });

  test("Kudos section is visible after scrolling past awards", async ({
    page,
  }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(
      page.getByRole("heading", { name: "Sun* Kudos", level: 2 })
    ).toBeVisible();
    await expect(page.getByText("Phong trào ghi nhận")).toBeVisible();
    await expect(page.getByText(/ĐIỂM MỚI CỦA SAA 2025/)).toBeVisible();
  });

  test("Chi tiết button links to /kudos", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const chiTietLink = page.getByRole("link", { name: /Chi tiết/i });
    await expect(chiTietLink).toBeVisible();
    await expect(chiTietLink).toHaveAttribute("href", "/kudos");
  });
});

// ---------------------------------------------------------------------------
// US5 — Responsive Layout (P2)
// ---------------------------------------------------------------------------

test.describe("US5: Responsive layout", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test("mobile: sidebar is hidden on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToAwards(page);
    const sidebar = page.getByRole("navigation", {
      name: "Danh mục giải thưởng",
    });
    await expect(sidebar).toBeHidden();
  });

  test("mobile: no horizontal scrollbar appears", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToAwards(page);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("mobile: award cards stack vertically (image above content)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToAwards(page);
    const card = page.locator("#top-talent");
    const image = card.locator("img").first();
    const title = card.getByRole("heading", { name: "Top Talent", level: 3 });
    const imageBox = await image.boundingBox();
    const titleBox = await title.boundingBox();
    if (imageBox && titleBox) {
      // Image should be ABOVE the title (image.y < title.y)
      expect(imageBox.y).toBeLessThan(titleBox.y);
    }
  });
});

// ---------------------------------------------------------------------------
// US6 — Header/Footer Navigation Active State (P3)
// ---------------------------------------------------------------------------

test.describe("US6: Header and footer navigation", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    await goToAwards(page);
  });

  test("header 'Award Information' link is marked active", async ({ page }) => {
    const activeLink = page
      .getByRole("navigation")
      .filter({ hasNot: page.getByRole("navigation", { name: "Danh mục giải thưởng" }) })
      .getByRole("link", { name: "Award Information" })
      .first();
    // Active link should have gold color class or aria-current indicator
    const className = await activeLink.getAttribute("class");
    expect(className).toMatch(/gold|FFEA9E|active/i);
  });

  test("footer 'Sun* Kudos' link points to /kudos", async ({ page }) => {
    const footerNav = page.getByRole("navigation", {
      name: "Footer navigation",
    });
    const kudosLink = footerNav.getByRole("link", { name: "Sun* Kudos" });
    await expect(kudosLink).toHaveAttribute("href", "/kudos");
  });

  test("footer 'Award Information' link is marked active", async ({ page }) => {
    const footerNav = page.getByRole("navigation", {
      name: "Footer navigation",
    });
    const awardLink = footerNav.getByRole("link", {
      name: "Award Information",
    });
    const className = await awardLink.getAttribute("class");
    expect(className).toMatch(/gold|FFEA9E/i);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

test.describe("Edge cases", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test("all 6 award sections have unique id anchors", async ({ page }) => {
    await goToAwards(page);
    for (const id of AWARD_IDS) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test("award image fallback renders when image fails to load", async ({
    page,
  }) => {
    // Block award images so they fail to load
    await page.route("**/images/awards/**", (route) => route.abort());
    await goToAwards(page);
    // After image failure, fallback container with award name should appear
    await expect(page.getByText("Top Talent").first()).toBeVisible();
  });

  test("MVP description renders as two separate paragraphs", async ({
    page,
  }) => {
    await goToAwards(page);
    const card = page.locator("#mvp");
    const paragraphs = card.locator("p");
    // MVP has 2-paragraph description — at least 2 <p> elements in content
    const count = await paragraphs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
