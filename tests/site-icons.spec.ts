import { expect, test } from "@playwright/test";

function expectLink(html: string, rel: string, href: string) {
  const hrefPattern = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  expect(html).toMatch(new RegExp(`<link[^>]+rel="${rel}"[^>]+href="${hrefPattern}"|<link[^>]+href="${hrefPattern}"[^>]+rel="${rel}"`));
}

test("publishes site icons and web app manifest metadata", async ({ request }) => {
  const page = await request.get("/");
  expect(page.ok()).toBe(true);
  const html = await page.text();

  expectLink(html, "icon", "/favicon.ico");
  expectLink(html, "apple-touch-icon", "/apple-touch-icon.png");
  expectLink(html, "manifest", "/site.webmanifest");

  const favicon = await request.get("/favicon.ico");
  expect(favicon.ok()).toBe(true);
  expect(await favicon.body()).not.toHaveLength(0);

  const appleTouchIcon = await request.get("/apple-touch-icon.png");
  expect(appleTouchIcon.ok()).toBe(true);
  expect(appleTouchIcon.headers()["content-type"]).toContain("image/png");
  expect(await appleTouchIcon.body()).not.toHaveLength(0);

  const manifest = await request.get("/site.webmanifest");
  expect(manifest.ok()).toBe(true);
  expect(manifest.headers()["content-type"]).toContain("application/manifest+json");
  await expect(manifest.json()).resolves.toMatchObject({
    name: "Resume Builder",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    theme_color: "#1d4ed8",
  });
});
