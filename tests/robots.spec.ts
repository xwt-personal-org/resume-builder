import { expect, test } from "@playwright/test";

test("serves robots.txt with public pages allowed and private endpoints blocked", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/text\/plain/);
  await expect(response.text()).resolves.toBe(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /export",
      "",
    ].join("\n"),
  );
});
