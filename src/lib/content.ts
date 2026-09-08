import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import sanitize from "sanitize-html";
import { z } from "zod";
import { NewsletterComponent } from "./newsletter-component-extension";
export const blankContent = { type: "doc", content: [{ type: "paragraph" }] };
export const contentSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (value) => value.type === "doc" && JSON.stringify(value).length <= 200000,
    "Post is too large or invalid.",
  );
export function renderContent(content: unknown) {
  return sanitize(
    generateHTML(content as typeof blankContent, [
      StarterKit,
      NewsletterComponent,
    ]),
    {
      allowedTags: [
        "p",
        "div",
        "h2",
        "h3",
        "h4",
        "strong",
        "em",
        "s",
        "code",
        "pre",
        "blockquote",
        "ul",
        "ol",
        "li",
        "a",
        "hr",
        "br",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel", "style"],
        div: [
          "style",
          "data-caveat-component",
          "data-kind",
          "data-title",
          "data-body",
          "data-url",
          "data-label",
          "data-attribution",
        ],
        p: ["style"],
        blockquote: ["style"],
        hr: ["style"],
      },
      // Styles come from the built-in renderer, never arbitrary saved HTML.
      allowedStyles: {
        "*": {
          color: [/^#[0-9a-f]{6}$/i],
          "background-color": [/^#[0-9a-f]{6}$/i],
          margin: [/^[0-9px ]+$/],
          padding: [/^[0-9px ]+$/],
          border: [/^0$/, /^\d+px solid #[0-9a-f]{6}$/i],
          "border-left": [/^\d+px solid #[0-9a-f]{6}$/i],
          "border-top": [/^\d+px solid #[0-9a-f]{6}$/i],
          "border-radius": [/^\d+px$/],
          "font-size": [/^\d+px$/],
          "font-family": [/^Arial,sans-serif$/],
          "font-weight": [/^bold$/],
          "font-style": [/^(italic|normal)$/],
          "line-height": [/^\d+(\.\d+)?$/],
          "text-decoration": [/^(none|underline)$/],
          display: [/^inline-block$/],
          "white-space": [/^pre-wrap$/],
        },
      },
      allowedSchemes: ["https", "http", "mailto"],
      transformTags: {
        a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }),
      },
    },
  );
}
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
export function plainText(content: unknown) {
  return sanitize(renderContent(content), {
    allowedTags: [],
    allowedAttributes: {},
  });
}
export function csv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map(
          (value) =>
            '"' +
            (/^[=+@\-\t\r]/.test(value) ? "'" : "") +
            value.replaceAll('"', '""') +
            '"',
        )
        .join(","),
    )
    .join("\r\n");
}
export function emailHtml(
  name: string,
  subject: string,
  content: unknown,
  url: string,
  broadcast = true,
) {
  const unsubscribe = broadcast
    ? '<p style="font-size:12px;color:#666">You subscribed to this publication. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p>'
    : '<p style="font-size:12px;color:#666">This is a test email. No subscribers were emailed.</p>';
  return `<!doctype html><html><body style="margin:0;padding:32px 20px;background:#f4f6f4;color:#22322d;font-family:Georgia,serif"><main style="max-width:620px;margin:auto;background:white;padding:32px"><p style="font:13px Arial,sans-serif">${escapeHtml(name)}</p><h1 style="font-size:32px">${escapeHtml(subject)}</h1><div style="font-size:18px;line-height:1.7">${renderContent(content)}</div><hr><p><a href="${escapeHtml(url)}">Visit the publication</a></p>${unsubscribe}</main></body></html>`;
}
