import { Node } from "@tiptap/core";
import { newsletterComponentDOM, componentAttributesSchema } from "./newsletter-components";

export const NewsletterComponent = Node.create({
  name: "newsletterComponent",
  // Parse our fenced blocks before ordinary code, while keeping Paragraph
  // (priority 1000) as the default block in a new document.
  priority: 999,
  markdownTokenName: "code",
  parseMarkdown(token) {
    if (token.lang !== "caveat-component") return [];
    try {
      const result = componentAttributesSchema.safeParse(JSON.parse(token.text || ""));
      return result.success ? { type: "newsletterComponent", attrs: result.data } : [];
    } catch { return []; }
  },
  renderMarkdown(node) {
    const attrs = componentAttributesSchema.parse(node.attrs);
    return "\x60\x60\x60caveat-component\n" + JSON.stringify(attrs) + "\n\x60\x60\x60";
  },
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return Object.fromEntries(
      ["kind", "title", "body", "url", "label", "attribution"].map((key) => [
        key,
        {
          default: key === "kind" ? "callout" : "",
          parseHTML: (element: HTMLElement) =>
            element.getAttribute(`data-${key}`) ||
            (key === "kind" ? "callout" : ""),
        },
      ]),
    );
  },
  parseHTML() {
    return [{ tag: "div[data-caveat-component]", getAttrs(element) {
      const attrs = Object.fromEntries(["kind", "title", "body", "url", "label", "attribution"].map(key => [key, element.getAttribute(`data-${key}`) || ""]));
      const result = componentAttributesSchema.safeParse(attrs);
      return result.success ? result.data : false;
    } }];
  },
  renderHTML({ node }) {
    return newsletterComponentDOM(node.attrs);
  },
});
