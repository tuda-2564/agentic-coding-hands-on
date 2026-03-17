import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to the home page (assumes user is already authenticated via cookies). */
async function goHome(page: Page) {
  await page.goto("/");
}

/** Click the "Viết Kudo" trigger button and wait for the modal to appear. */
async function openModal(page: Page) {
  await page.getByRole("button", { name: /Viết Kudo/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

// ---------------------------------------------------------------------------
// T044 — US1 Happy Path
// ---------------------------------------------------------------------------

test.describe("US1: Submit a kudo (happy path)", () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    "Requires E2E_AUTH_COOKIE env var to authenticate"
  );

  test.beforeEach(async ({ page }) => {
    // Inject auth cookie so the page loads as an authenticated user.
    if (process.env.E2E_AUTH_COOKIE) {
      const cookies = JSON.parse(process.env.E2E_AUTH_COOKIE) as Array<{
        name: string;
        value: string;
        domain: string;
        path: string;
      }>;
      await page.context().addCookies(cookies);
    }
    await goHome(page);
    await openModal(page);
  });

  test("fills required fields and submits successfully", async ({ page }) => {
    // Intercept POST /api/kudos so we don't need a real DB
    await page.route("**/api/kudos", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "test-kudo-id" }),
      });
    });

    // Intercept GET /api/users/search for recipient
    await page.route("**/api/users/search**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "u1", full_name: "Alice Nguyen", avatar_url: null }]),
      });
    });

    // Intercept GET /api/badges
    await page.route("**/api/badges**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "b1", name: "Innovator", icon_url: null, description: "Innovation award" },
        ]),
      });
    });

    // 1. Add recipient via search
    const recipientInput = page.getByLabel(/Người nhận/i).or(
      page.locator('[aria-label*="Người nhận"]')
    );
    await recipientInput.fill("Alice");
    await page.getByText("Alice Nguyen").click();
    await expect(page.getByText("Alice Nguyen")).toBeVisible();

    // 2. Select badge
    await page.getByRole("combobox", { name: /Danh hiệu/i }).click();
    await page.getByText("Innovator").click();

    // 3. Type content into rich-text editor
    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type("Great work on the project!");

    // 4. Submit
    await page.getByRole("button", { name: /Gửi/i }).click();

    // 5. Modal should close and success toast should appear
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText(/Gửi kudo thành công/i).or(page.getByRole("alert"))
    ).toBeVisible({ timeout: 5000 });
  });

  test("shows loading state during submission", async ({ page }) => {
    // Delay the API response so we can observe the loading state
    await page.route("**/api/kudos", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "test-kudo-id" }),
      });
    });

    await page.route("**/api/users/search**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "u1", full_name: "Bob Tran", avatar_url: null }]),
      });
    });

    await page.route("**/api/badges**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "b1", name: "Team Player", icon_url: null, description: null },
        ]),
      });
    });

    const recipientInput = page.getByLabel(/Người nhận/i).or(
      page.locator('[aria-label*="Người nhận"]')
    );
    await recipientInput.fill("Bob");
    await page.getByText("Bob Tran").click();

    await page.getByRole("combobox", { name: /Danh hiệu/i }).click();
    await page.getByText("Team Player").click();

    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type("Thanks for the help!");

    const submitBtn = page.getByRole("button", { name: /Gửi/i });
    await submitBtn.click();

    // Button should be disabled/aria-busy during submission
    await expect(submitBtn).toBeDisabled();
  });

  test("shows inline error on API failure", async ({ page }) => {
    await page.route("**/api/kudos", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.route("**/api/users/search**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "u1", full_name: "Carol Le", avatar_url: null }]),
      });
    });

    await page.route("**/api/badges**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "b1", name: "Star", icon_url: null, description: null },
        ]),
      });
    });

    const recipientInput = page.getByLabel(/Người nhận/i).or(
      page.locator('[aria-label*="Người nhận"]')
    );
    await recipientInput.fill("Carol");
    await page.getByText("Carol Le").click();

    await page.getByRole("combobox", { name: /Danh hiệu/i }).click();
    await page.getByText("Star").click();

    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type("Well done!");

    await page.getByRole("button", { name: /Gửi/i }).click();

    // Modal stays open, error message appears
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/Gửi kudo thất bại/i)).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// T045 — US7 Cancel scenarios
// ---------------------------------------------------------------------------

test.describe("US7: Cancel / dismiss modal", () => {
  test.beforeEach(async ({ page }) => {
    await goHome(page);
  });

  test("Hủy button closes modal", async ({ page }) => {
    await openModal(page);
    await page.getByRole("button", { name: /Hủy/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("Escape key closes modal", async ({ page }) => {
    await openModal(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("clicking backdrop closes modal", async ({ page }) => {
    await openModal(page);
    // Click outside the modal panel (the semi-transparent backdrop)
    await page.mouse.click(10, 10);
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("X close button closes modal", async ({ page }) => {
    await openModal(page);
    await page.getByRole("button", { name: /close|✕|×|đóng/i }).first().click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// T046 — Validation errors on empty submit
// ---------------------------------------------------------------------------

test.describe("Form validation: empty submit shows inline errors", () => {
  test.beforeEach(async ({ page }) => {
    await goHome(page);
    await openModal(page);
  });

  test("shows errors for all three required fields when submitting empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Gửi/i }).click();

    // All three error messages must appear
    await expect(
      page.getByText(/Vui lòng chọn ít nhất một người nhận/i)
    ).toBeVisible({ timeout: 3000 });
    await expect(
      page.getByText(/Vui lòng chọn danh hiệu/i)
    ).toBeVisible({ timeout: 3000 });
    await expect(
      page.getByText(/Vui lòng nhập nội dung/i)
    ).toBeVisible({ timeout: 3000 });
  });

  test("no network request is made when validation fails", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/kudos")) {
        apiCalls.push(req.url());
      }
    });

    await page.getByRole("button", { name: /Gửi/i }).click();

    // Wait briefly then confirm no API call was made
    await page.waitForTimeout(500);
    expect(apiCalls).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// T047 — US6 Image upload limit
// ---------------------------------------------------------------------------

test.describe("US6: Image upload limit (max 5)", () => {
  test.beforeEach(async ({ page }) => {
    await goHome(page);
    await openModal(page);
  });

  test("add button disappears after 5 images are attached", async ({ page }) => {
    // Create 5 small fake image files
    for (let i = 0; i < 5; i++) {
      const addButton = page.getByRole("button", { name: /Thêm ảnh/i });
      await expect(addButton).toBeVisible();

      // Set files directly on the hidden input
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.setInputFiles({
        name: `image-${i}.png`,
        mimeType: "image/png",
        buffer: Buffer.from(
          // Minimal valid PNG (1x1 pixel)
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "base64"
        ),
      });
    }

    // After 5 images, the add button should be gone
    await expect(page.getByRole("button", { name: /Thêm ảnh/i })).not.toBeVisible();
  });

  test("rejects files larger than 5MB", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    // Create a buffer > 5MB
    const largeBuf = Buffer.alloc(6 * 1024 * 1024, 0);
    await fileInput.setInputFiles({
      name: "large.png",
      mimeType: "image/png",
      buffer: largeBuf,
    });

    await expect(page.getByText(/5MB/i)).toBeVisible({ timeout: 3000 });
    // Confirm no thumbnail was added
    await expect(page.getByRole("img", { name: /Ảnh 1/i })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// T048 — Responsive layout at 360px, 768px, 1440px
// ---------------------------------------------------------------------------

test.describe("Responsive layout", () => {
  const viewports = [
    { name: "mobile 360px", width: 360, height: 780 },
    { name: "tablet 768px", width: 768, height: 1024 },
    { name: "desktop 1440px", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`no overflow and correct layout at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await goHome(page);
      await openModal(page);

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();

      // Verify the modal is within viewport (no horizontal overflow)
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1); // +1 for sub-pixel
      }

      // Check for horizontal scrollbar: scrollWidth should not exceed clientWidth
      const hasHorizontalScroll = await page.evaluate(
        () => document.body.scrollWidth > document.body.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);

      // On mobile, buttons should be stacked (full-width, one per column)
      if (vp.width < 768) {
        const cancelBtn = page.getByRole("button", { name: /Hủy/i });
        const submitBtn = page.getByRole("button", { name: /Gửi/i });
        const cancelBox = await cancelBtn.boundingBox();
        const submitBox = await submitBtn.boundingBox();

        if (cancelBox && submitBox) {
          // Stacked buttons: they should not be side-by-side
          expect(Math.abs(cancelBox.y - submitBox.y)).toBeGreaterThan(20);
        }
      }
    });
  }
});
