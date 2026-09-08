import { z } from "zod";
import type { DOMOutputSpec } from "@tiptap/pm/model";

export const componentKinds = [
  "callout",
  "quote",
  "button",
  "link-card",
  "divider",
] as const;
export function safeComponentUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}
export const componentAttributesSchema = z
  .object({
    kind: z.enum(componentKinds),
    title: z.string().max(120).default(""),
    body: z.string().max(2000).default(""),
    url: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (value) => !value || safeComponentUrl(value),
        "Use a full http://, https://, or mailto: link.",
      )
      .default(""),
    label: z.string().max(80).default(""),
    attribution: z.string().max(160).default(""),
  })
  .superRefine((value, context) => {
    if ((value.kind === "button" || value.kind === "link-card") && !value.url)
      context.addIssue({
        code: "custom",
        path: ["url"],
        message: "Add a destination link.",
      });
    if (value.kind === "button" && !value.label.trim())
      context.addIssue({
        code: "custom",
        path: ["label"],
        message: "Give the button a label.",
      });
  });
export type ComponentAttributes = z.infer<typeof componentAttributesSchema>;
type Field = "title" | "body" | "url" | "label" | "attribution";
type ComponentDefinition = {
  id: ComponentAttributes["kind"];
  name: string;
  description: string;
  author: string;
  fields: Field[];
  defaults: ComponentAttributes;
};
const empty = { title: "", body: "", url: "", label: "", attribution: "" };
export const newsletterComponents: ComponentDefinition[] = [
  {
    id: "callout",
    name: "Callout",
    description: "Give an idea or announcement a little more room.",
    author: "Caveat",
    fields: ["title", "body"],
    defaults: {
      ...empty,
      kind: "callout",
      title: "Worth keeping",
      body: "A small idea you want your readers to remember.",
    },
  },
  {
    id: "quote",
    name: "Pull quote",
    description: "A memorable line, with space for its author.",
    author: "Caveat",
    fields: ["body", "attribution"],
    defaults: {
      ...empty,
      kind: "quote",
      body: "There is always something worth paying attention to.",
      attribution: "From my notebook",
    },
  },
  {
    id: "button",
    name: "Button",
    description: "One clear next step for your readers.",
    author: "Caveat",
    fields: ["label", "url"],
    defaults: {
      ...empty,
      kind: "button",
      label: "Read more",
      url: "https://example.com",
    },
  },
  {
    id: "link-card",
    name: "Link card",
    description: "Share a useful read with your own introduction.",
    author: "Caveat",
    fields: ["title", "body", "url"],
    defaults: {
      ...empty,
      kind: "link-card",
      title: "Something worth reading",
      body: "A useful reference to come back to when you have a quiet moment.",
      url: "https://example.com",
    },
  },
  {
    id: "divider",
    name: "Divider",
    description: "A quiet pause between sections of your letter.",
    author: "Caveat",
    fields: [],
    defaults: { ...empty, kind: "divider" },
  },
];

export function newsletterComponentDOM(raw: unknown): DOMOutputSpec {
  const value = componentAttributesSchema.parse(raw);
  const { kind, title, body, url, label, attribution } = value;
  const metadata = Object.fromEntries(
    Object.entries(value).map(([key, text]) => [`data-${key}`, text]),
  );
  const textStyle = "margin:0;line-height:1.7;white-space:pre-wrap;";
  const headingStyle = "margin:0 0 8px;font-weight:bold;line-height:1.4;";
  const link = { href: url, target: "_blank", rel: "noopener noreferrer" };
  let inner: DOMOutputSpec;
  switch (kind) {
    case "callout":
      inner = [
        "div",
        {
          style:
            "margin:24px 0;padding:20px;border-left:4px solid #92a875;background-color:#f0f4e8;color:#263a32;",
        },
        ["p", { style: headingStyle }, title],
        ["p", { style: textStyle }, body],
      ];
      break;
    case "quote":
      inner = [
        "blockquote",
        {
          style:
            "margin:24px 0;padding:0 0 0 20px;border-left:3px solid #a8b68e;color:#3e5142;",
        },
        [
          "p",
          {
            style:
              "margin:0 0 12px;font-size:23px;font-style:italic;line-height:1.6;white-space:pre-wrap;",
          },
          body,
        ],
        [
          "p",
          {
            style: "margin:0;font-size:13px;font-style:normal;line-height:1.5;",
          },
          attribution,
        ],
      ];
      break;
    case "button":
      inner = [
        "p",
        { style: "margin:24px 0;" },
        [
          "a",
          {
            ...link,
            style:
              "display:inline-block;background-color:#315b50;border:1px solid #315b50;border-radius:4px;padding:12px 20px;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;line-height:1.5;text-decoration:none;",
          },
          label,
        ],
      ];
      break;
    case "link-card":
      inner = [
        "div",
        {
          style:
            "margin:24px 0;padding:20px;border:1px solid #d5decf;border-radius:5px;background-color:#fafbf7;color:#263a32;",
        },
        [
          "p",
          { style: headingStyle },
          [
            "a",
            { ...link, style: "color:#315b50;text-decoration:underline;" },
            title || url,
          ],
        ],
        ["p", { style: textStyle }, body],
      ];
      break;
    case "divider":
      inner = [
        "hr",
        { style: "margin:30px 0;border:0;border-top:1px solid #b6c4ab;" },
      ];
      break;
  }
  return ["div", { "data-caveat-component": kind, ...metadata }, inner];
}
