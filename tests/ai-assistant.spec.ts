import { expect, test, type Page } from "@playwright/test";

async function hideNextDevTools(page: Page) {
  await page.addStyleTag({
    content: `
      [data-nextjs-dev-tools-button],
      [data-nextjs-dev-tools-panel],
      nextjs-portal {
        display: none !important;
      }
    `,
  });
}

async function resetApp(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await hideNextDevTools(page);
  await expect(page.locator("#resume-preview")).toBeVisible();
}

test.describe("AI assistant panel", () => {
  test("renders AI assistant tab and panel", async ({ page }) => {
    await resetApp(page);

    // Click AI Assist tab
    const aiTab = page.getByRole("button", { name: /AI 助手|AI Assist/i });
    await expect(aiTab).toBeVisible();
    await aiTab.click();

    // Verify AI mode cards are visible
    await expect(page.getByText(/智能生成|Generate/i)).toBeVisible();
    await expect(page.getByText(/针对优化|Optimize/i)).toBeVisible();
    await expect(page.getByText(/润色提升|Polish/i)).toBeVisible();
    await expect(page.getByText(/中英翻译|Translate/i)).toBeVisible();

    // Verify privacy notice is visible
    await expect(page.getByText(/Google Gemini API/i).first()).toBeVisible();
  });

  test("displays error when API key is not configured", async ({ page }) => {
    await resetApp(page);

    // Intercept the AI API call to simulate missing API key
    await page.route("/api/ai/resume", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "AI 功能未配置。请在 .env.local 中设置 GOOGLE_AI_API_KEY。",
          code: "MISSING_API_KEY",
        }),
      });
    });

    // Switch to AI tab
    const aiTab = page.getByRole("button", { name: /AI 助手|AI Assist/i });
    await aiTab.click();

    // Click generate button (should work even without JD for polish/translate modes)
    // First switch to polish mode which doesn't require JD
    await page.getByText(/润色提升|Polish/i).click();

    const generateBtn = page.getByRole("button", { name: /开始生成|Generate/i });
    await generateBtn.click();

    // Wait for error to appear
    const alertBanner = page.locator(".ai-error-banner");
    await expect(alertBanner).toBeVisible({ timeout: 10000 });
    await expect(alertBanner).toContainText(/API|配置|未配置|not configured/i);
  });

  test("workspace tabs switch correctly", async ({ page }) => {
    await resetApp(page);

    // Verify Edit tab is active by default — section tabs should be visible
    await expect(page.getByText(/基本信息|Personal Info/i).first()).toBeVisible();

    // Switch to AI Assist tab
    await page.getByRole("button", { name: /AI 助手|AI Assist/i }).click();
    await expect(page.getByText(/选择 AI 功能|AI Mode/i)).toBeVisible();

    // Switch to Layout tab
    await page.getByRole("button", { name: /布局|Layout/i }).click();
    await expect(page.getByText(/展示设置|Display/i)).toBeVisible();

    // Switch to Export tab
    await page.getByRole("button", { name: /导出|Export/i }).click();
    await expect(page.getByText(/一键导出 PDF|Export PDF/i)).toBeVisible();

    // Switch back to Edit
    await page.getByRole("button", { name: /编辑|Edit/i }).click();
    await expect(page.getByText(/基本信息|Personal Info/i).first()).toBeVisible();

    // A4 preview should always be visible
    await expect(page.locator("#resume-preview")).toBeVisible();
  });

  test("AI result preview shows apply/discard after mocked response", async ({ page }) => {
    await resetApp(page);

    // Intercept the AI API call and return a mocked response
    await page.route("/api/ai/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          summary: "Mocked AI optimization complete",
          proposedResumePatch: {
            personalInfo: {
              summary: { zh: "AI 优化后的个人简介", en: "AI optimized summary" },
            },
          },
          sectionNotes: {
            personalInfo: "Updated summary with stronger opening",
          },
          warnings: ["This is a test warning"],
        }),
      });
    });

    // Switch to AI Assist tab
    await page.getByRole("button", { name: /AI 助手|AI Assist/i }).click();

    // Select polish mode (doesn't require JD)
    await page.getByText(/润色提升|Polish/i).click();

    // Click generate
    await page.getByRole("button", { name: /开始生成|Generate/i }).click();

    // Wait for result preview
    await expect(page.getByText("Mocked AI optimization complete")).toBeVisible({ timeout: 5000 });

    // Verify apply and discard buttons are visible
    await expect(page.getByRole("button", { name: /应用到简历|Apply to Resume/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /放弃更改|Discard Changes/i })).toBeVisible();

    // Verify warning is shown
    await expect(page.getByText("This is a test warning")).toBeVisible();
  });

  test("discard returns to AI form", async ({ page }) => {
    await resetApp(page);

    // Intercept the AI API call
    await page.route("/api/ai/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          summary: "Test result",
          proposedResumePatch: {},
          sectionNotes: {},
          warnings: [],
        }),
      });
    });

    // Switch to AI tab and generate
    await page.getByRole("button", { name: /AI 助手|AI Assist/i }).click();
    await page.getByText(/润色提升|Polish/i).click();
    await page.getByRole("button", { name: /开始生成|Generate/i }).click();

    // Wait for result
    await expect(page.getByText("Test result")).toBeVisible({ timeout: 5000 });

    // Click discard
    await page.getByRole("button", { name: /放弃更改|Discard Changes/i }).click();

    // Should be back to AI form
    await expect(page.getByText(/选择 AI 功能|AI Mode/i)).toBeVisible();
  });

  test("apply writes AI patch to store", async ({ page }) => {
    await resetApp(page);

    const testSummaryZh = "AI生成的测试简介_" + Date.now();

    // Intercept the AI API call
    await page.route("/api/ai/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          summary: "Applied patch",
          proposedResumePatch: {
            personalInfo: {
              summary: { zh: testSummaryZh, en: "AI test summary" },
            },
          },
          sectionNotes: {},
          warnings: [],
        }),
      });
    });

    // Switch to AI tab and generate
    await page.getByRole("button", { name: /AI 助手|AI Assist/i }).click();
    await page.getByText(/润色提升|Polish/i).click();
    await page.getByRole("button", { name: /开始生成|Generate/i }).click();

    // Wait for result
    await expect(page.getByText("Applied patch")).toBeVisible({ timeout: 5000 });

    // Click apply
    await page.getByRole("button", { name: /应用到简历|Apply to Resume/i }).click();

    // Switch to Edit tab and check that the summary was updated
    await page.getByRole("button", { name: /编辑|Edit/i }).click();

    // The resume preview should contain the AI-generated text
    await expect(page.locator("#resume-preview")).toContainText(testSummaryZh);
  });
});
