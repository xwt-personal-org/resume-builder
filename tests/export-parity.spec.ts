import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const templates = ["classic", "modern", "minimal", "compact"] as const;
const languages = ["zh", "en"] as const;
const screenshotDir = path.join("test-results", "export-parity");

const templateNames = {
  classic: /经典|Classic/i,
  modern: /现代|Modern/i,
  minimal: /简约|Minimal/i,
  compact: /紧凑|Compact/i,
} as const;

type TemplateName = (typeof templates)[number];
type Language = (typeof languages)[number];

interface PreviewSnapshot {
  attrs: {
    template: string | null;
    language: string | null;
    exportMode: string | null;
    exportReady: string | null;
  };
  rect: {
    width: number;
    height: number;
  };
  text: string;
  rootStyle: {
    boxShadow: string;
    backgroundColor: string;
  };
  childStyle: {
    fontFamily: string;
    color: string;
    backgroundColor: string;
    paddingTop: string;
    paddingLeft: string;
    lineHeight: string;
  };
}

async function installPrintMock(context: BrowserContext) {
  await context.addInitScript(() => {
    window.print = () => {
      (window as unknown as { __resumePrintCalled?: boolean }).__resumePrintCalled = true;
      window.dispatchEvent(new Event("resume-print-called"));
    };
  });
}

async function resetApp(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.reload();
  await hideNextDevTools(page);
  await expect(page.locator("#resume-preview")).toBeVisible();
}

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

async function selectTemplate(page: Page, template: TemplateName) {
  await page.getByRole("button", { name: templateNames[template] }).click();
  await expect(page.locator("#resume-preview")).toHaveAttribute("data-template", template);
}

async function setLanguage(page: Page, lang: Language) {
  const buttonName = lang === "en" ? "EN" : "中文";
  const button = page.getByRole("button", { name: buttonName, exact: true });
  if (await button.isVisible()) {
    await button.click();
  }
  await expect(page.locator("#resume-preview")).toHaveAttribute("data-language", lang);
}

async function snapshotPreview(page: Page): Promise<PreviewSnapshot> {
  return page.locator("#resume-preview").evaluate((node) => {
    const preview = node as HTMLElement;
    const child = preview.firstElementChild as HTMLElement | null;
    const rect = preview.getBoundingClientRect();
    const rootStyle = window.getComputedStyle(preview);
    const childStyle = child ? window.getComputedStyle(child) : rootStyle;
    return {
      attrs: {
        template: preview.dataset.template ?? null,
        language: preview.dataset.language ?? null,
        exportMode: preview.dataset.exportMode ?? null,
        exportReady: preview.dataset.exportReady ?? null,
      },
      rect: {
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
      },
      text: preview.innerText.replace(/\s+/g, " ").trim(),
      rootStyle: {
        boxShadow: rootStyle.boxShadow,
        backgroundColor: rootStyle.backgroundColor,
      },
      childStyle: {
        fontFamily: childStyle.fontFamily,
        color: childStyle.color,
        backgroundColor: childStyle.backgroundColor,
        paddingTop: childStyle.paddingTop,
        paddingLeft: childStyle.paddingLeft,
        lineHeight: childStyle.lineHeight,
      },
    };
  });
}

async function savePreviewScreenshot(page: Page, filename: string) {
  await fs.mkdir(screenshotDir, { recursive: true });
  await page.locator("#resume-preview").screenshot({
    path: path.join(screenshotDir, filename),
  });
}

function expectScreenParity(main: PreviewSnapshot, exported: PreviewSnapshot) {
  expect(exported.attrs.template).toBe(main.attrs.template);
  expect(exported.attrs.language).toBe(main.attrs.language);
  expect(exported.attrs.exportMode).toBe("true");
  expect(exported.attrs.exportReady).toBe("true");
  expect(exported.text).toBe(main.text);
  expect(exported.rect.width).toBeCloseTo(main.rect.width, 0);
  expect(exported.rect.height).toBeCloseTo(main.rect.height, 0);
  expect(exported.childStyle).toEqual(main.childStyle);
}

test.describe("export parity", () => {
  test.beforeEach(async ({ context }) => {
    await installPrintMock(context);
  });

  for (const template of templates) {
    for (const language of languages) {
      test(`${template} ${language} main/export/print parity`, async ({ page }) => {
        await resetApp(page);
        await selectTemplate(page, template);
        await setLanguage(page, language);

        const mainSnapshot = await snapshotPreview(page);
        await savePreviewScreenshot(page, `main-preview-${template}-${language}.png`);

        // Switch to Export tab first
        await page.getByRole("button", { name: /导出|Export/i }).first().click();

        const [popup] = await Promise.all([
          page.waitForEvent("popup"),
          page.getByRole("button", { name: /一键导出 PDF|Export PDF/i }).click(),
        ]);

        await popup.waitForLoadState("domcontentloaded");
        await hideNextDevTools(popup);
        expect(popup.url()).toContain("/export");
        expect(popup.url()).not.toContain("data=");
        await expect(popup.locator("#resume-preview")).toBeVisible();
        await expect(popup.locator("#resume-preview")).toHaveAttribute("data-export-ready", "true");
        await expect
          .poll(() => popup.evaluate(() => (window as unknown as { __resumePrintCalled?: boolean }).__resumePrintCalled === true))
          .toBe(true);

        const exportSnapshot = await snapshotPreview(popup);
        expectScreenParity(mainSnapshot, exportSnapshot);
        await savePreviewScreenshot(popup, `export-preview-${template}-${language}.png`);

        await popup.emulateMedia({ media: "print" });
        const printSnapshot = await snapshotPreview(popup);
        expect(printSnapshot.attrs.template).toBe(template);
        expect(printSnapshot.attrs.language).toBe(language);
        expect(printSnapshot.rootStyle.boxShadow).toBe("none");
        expect(printSnapshot.rootStyle.backgroundColor).toBe("rgb(255, 255, 255)");
        expect(printSnapshot.rect.width).toBeGreaterThan(790);
        expect(printSnapshot.rect.width).toBeLessThan(796);
        expect(printSnapshot.rect.height).toBeGreaterThan(1118);
        await savePreviewScreenshot(popup, `export-print-${template}-${language}.png`);

        await popup.close();
      });
    }
  }
});
