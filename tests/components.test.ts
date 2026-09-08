import { test } from "node:test";
import assert from "node:assert/strict";
import { generateJSON } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import { newsletterComponents } from "../src/lib/newsletter-components";
import { NewsletterComponent } from "../src/lib/newsletter-component-extension";
import { renderContent, emailHtml, plainText } from "../src/lib/content";

test("newsletter components preserve attributes through HTML and render in email", () => {
  for (const component of newsletterComponents) {
    const doc = {
      type: "doc",
      content: [{ type: "newsletterComponent", attrs: component.defaults }],
    };
    const html = renderContent(doc);
    assert.ok(html.includes(`data-caveat-component="${component.id}"`));
    const parsed = generateJSON(html, [StarterKit, NewsletterComponent]);
    assert.equal(parsed.content?.[0].type, "newsletterComponent");
    assert.deepEqual({ ...parsed.content?.[0].attrs }, component.defaults);
    const email = emailHtml(
      "Example",
      "A newsletter",
      doc,
      "https://example.com",
    );
    assert.ok(email.includes(html));
    if (component.id === "button") {
      assert.ok(html.includes("background-color:#315b50"));
      assert.ok(html.includes("color:#ffffff"));
      assert.ok(html.includes('href="https://example.com"'));
      assert.ok(plainText(doc).includes("Read more"));
    }
  }
});

test("component text cannot introduce markup and component links reject active schemes", () => {
  const base = newsletterComponents[0].defaults;
  const html = renderContent({
    type: "doc",
    content: [
      {
        type: "newsletterComponent",
        attrs: {
          ...base,
          title: '<img src=x onerror="alert(1)">',
          body: "<script>alert(1)</script>",
        },
      },
    ],
  });
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("<script>"));
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///etc/passwd",
    "//example.com",
    "java\nscript:alert(1)",
  ]) {
    assert.throws(() =>
      renderContent({
        type: "doc",
        content: [
          {
            type: "newsletterComponent",
            attrs: { ...newsletterComponents[2].defaults, url },
          },
        ],
      }),
    );
  }
  assert.throws(() =>
    renderContent({
      type: "doc",
      content: [
        {
          type: "newsletterComponent",
          attrs: { ...base, kind: "remote-script" },
        },
      ],
    }),
  );
});
