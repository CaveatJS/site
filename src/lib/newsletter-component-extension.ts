import { Node } from "@tiptap/core";
import { newsletterComponentDOM } from "./newsletter-components";

export const NewsletterComponent = Node.create({
  name: "newsletterComponent",
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
    return [{ tag: "div[data-caveat-component]" }];
  },
  renderHTML({ node }) {
    return newsletterComponentDOM(node.attrs);
  },
});
