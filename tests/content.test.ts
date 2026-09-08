import { test } from "node:test";
import assert from "node:assert/strict";
import { renderContent, csv, emailHtml, escapeHtml } from "../src/lib/content";
import { seal, unseal, sign, verify } from "../src/lib/crypto";
import { validateDeployment } from "../scripts/deploy.mjs";
process.env.BETTER_AUTH_SECRET =
  "test-only-secret-longer-than-thirty-two-characters";
const content = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "<script>alert(1)</script>",
          marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
        },
      ],
    },
  ],
};
test("rich text and email output cannot introduce executable markup", () => {
  const html = renderContent(content);
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(
    emailHtml("A & B", "<title>", content, "https://example.com").includes(
      "{{{RESEND_UNSUBSCRIBE_URL}}}",
    ),
  );
  assert.ok(
    !emailHtml("A", "Title", content, "https://example.com", false).includes(
      "{{{RESEND_UNSUBSCRIBE_URL}}}",
    ),
  );
  assert.equal(escapeHtml("a & b"), "a &amp; b");
});
test("CSV quotes and neutralises spreadsheet formulas", () => {
  assert.equal(
    csv([["=CMD()", 'a"b', "normal"]]),
    '"\'=CMD()","a""b","normal"',
  );
});
test("stored API credentials are authenticated and encrypted", () => {
  const encrypted = seal("re_secret");
  assert.equal(unseal(encrypted), "re_secret");
  assert.ok(!encrypted.includes("re_secret"));
  const parts = encrypted.split(".");
  parts[2] = "AA";
  assert.throws(() => unseal(parts.join(".")));
});
test("send confirmations reject tampering", () => {
  const token = sign({ count: 5 });
  assert.deepEqual(verify(token), { count: 5 });
  assert.throws(() => verify(token + "changed"));
});
test("preview deployments fail closed without separate database settings", () => {
  const keys = {
    BETTER_AUTH_SECRET: "a".repeat(32),
    CAVEAT_SETUP_KEY: "b".repeat(32),
  };
  assert.throws(() =>
    validateDeployment({
      ...keys,
      VERCEL_ENV: "preview",
      DATABASE_URL: "postgres://production",
    }),
  );
  assert.throws(() =>
    validateDeployment({
      ...keys,
      VERCEL_ENV: "preview",
      DATABASE_URL: "postgres://production",
      PREVIEW_DATABASE_URL: "postgres://production",
    }),
  );
  validateDeployment({
    ...keys,
    VERCEL_ENV: "production",
    DATABASE_URL: "postgres://production",
  });
});
