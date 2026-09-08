import { test, expect } from "@playwright/test";
const origin = "http://localhost:3100";
test("owner setup, writing, publishing, privacy, exports, and mobile", async ({
  page,
  browser,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Make yourself at home." }),
  ).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Alex Morgan");
  await page
    .getByLabel("Private setup key")
    .fill("caveat-test-setup-key-0000000000000000000000");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("owner@example.com");
  await page
    .getByLabel("Password", { exact: true })
    .fill("a-long-test-password-123");
  await page.getByRole("button", { name: "Create my publication" }).click();
  await expect(page).toHaveURL(/dashboard\/settings/);
  await page.getByLabel("Publication name").fill("Field Notes");
  await page
    .getByLabel("A short description")
    .fill("Small observations. Ideas worth keeping.");
  await page
    .getByRole("button", { name: "Start writing", exact: true })
    .click();
  await expect(page).toHaveURL(/dashboard$/);
  await page.screenshot({
    path: ".local/screenshots/dashboard.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "New post", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\/posts\//);
  const editUrl = page.url();
  const id = editUrl.split("/").at(-1)!;
  await page
    .getByRole("textbox", { name: "Post title" })
    .fill("On paying closer attention");
  await page
    .getByRole("textbox", { name: "Post body" })
    .fill("Some ideas arrive quietly. Give them somewhere to go.");
  await expect(page.getByRole("status")).toHaveText("All changes saved");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Post title" })).toHaveValue(
    "On paying closer attention",
  );
  await expect(page.getByRole("textbox", { name: "Post body" })).toContainText(
    "Some ideas arrive quietly.",
  );
  const guest = await browser.newContext({ baseURL: origin });
  const guestPage = await guest.newPage();
  await guestPage.goto(editUrl + "/preview");
  await expect(guestPage).toHaveURL(/login/);
  const denied = await guest.request.post(origin + "/api/posts", {
    headers: { origin },
  });
  expect(denied.status()).toBe(401);
  const registration = await guest.request.post(
    origin + "/api/auth/sign-up/email",
    {
      headers: { origin },
      data: {
        name: "Intruder",
        email: "intruder@example.com",
        password: "another-long-password-123",
      },
    },
  );
  expect(registration.ok()).toBe(false);
  await page
    .getByRole("button", { name: "Publish to website", exact: true })
    .click();
  await expect(
    page.getByText("Published to your website. No email was sent."),
  ).toBeVisible();
  await guestPage.goto("/");
  await guestPage
    .getByRole("heading", { name: "On paying closer attention" })
    .click();
  await expect(
    guestPage.getByText(
      "Some ideas arrive quietly. Give them somewhere to go.",
    ),
  ).toBeVisible();
  const publicUrl = guestPage.url();
  await page
    .getByRole("textbox", { name: "Post body" })
    .fill("A private revision that has not been published.");
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await guestPage.reload();
  await expect(guestPage.getByText("A private revision")).not.toBeVisible();
  const rss = await guest.request.get(origin + "/rss.xml");
  expect(await rss.text()).toContain("Some ideas arrive quietly.");
  expect(await rss.text()).not.toContain("A private revision");
  const exported = await page.request.get("/api/export/posts");
  expect(exported.ok()).toBe(true);
  expect((await exported.json()).posts).toHaveLength(1);
  const stale = await page.request.patch("/api/posts/" + id, {
    headers: { origin },
    data: {
      title: "Stale edit",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      revision: 0,
    },
  });
  expect(stale.status()).toBe(409);
  const csrf = await page.request.post("/api/posts", {
    headers: { origin: "https://evil.example" },
  });
  expect(csrf.status()).toBe(403);
  await page
    .getByRole("button", { name: "Send newsletter", exact: true })
    .click();
  await expect(
    page.getByText("Connect and verify Resend in Settings first."),
  ).toBeVisible();
  await page.screenshot({
    path: ".local/screenshots/editor.png",
    fullPage: true,
  });
  await page.goto("/dashboard/settings");
  await page.getByLabel("Resend API key").fill("invalid-key");
  await page
    .getByLabel("Send from", { exact: true })
    .fill("letters@example.com");
  // Validate the input locally without making an external delivery.
  await page.route("**/api/settings", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "Resend could not validate this connection. Check that your API key has full access, then try again.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Resend could not validate" }),
  ).toContainText("Resend could not validate");
  await page.unroute("**/api/settings");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.screenshot({
    path: ".local/screenshots/mobile-dashboard.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await guestPage.setViewportSize({ width: 390, height: 844 });
  await guestPage.goto(publicUrl);
  await guestPage.screenshot({
    path: ".local/screenshots/mobile-publication.png",
    fullPage: true,
  });
  expect(
    await guestPage.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/create");
  await page.screenshot({
    path: ".local/screenshots/create.png",
    fullPage: true,
  });
  await page.goto("/dashboard");
  await page.route("**/api/auth/sign-out", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Temporarily unavailable" }),
    }),
  );
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Could not sign out" }),
  ).toHaveText("Could not sign out. Please try again.");
  await expect(page).toHaveURL(/dashboard$/);
  await expect(page.getByRole("button", { name: "Sign out" })).toBeEnabled();
  await page.unroute("**/api/auth/sign-out");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/login/);
  expect((await page.request.get("/api/export/posts")).status()).toBe(401);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/login/);
  await page
    .getByLabel("Email address", { exact: true })
    .fill("owner@example.com");
  await page
    .getByLabel("Password", { exact: true })
    .fill("a-long-test-password-123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard$/);
  expect(errors).toEqual([]);
  await guest.close();
});
