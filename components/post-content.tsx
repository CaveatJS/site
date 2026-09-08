import Markdown from "react-markdown";
import { componentAttributesSchema } from "@/lib/newsletter-components";
import { ComponentBody } from "./component-body";

export function PostContent({ children }: { children: string }) {
  return <Markdown components={{
    pre({ node, children, ...props }) {
      const code = node?.children[0];
      if (code?.type === "element" && code.tagName === "code" &&
        Array.isArray(code.properties.className) && code.properties.className.includes("language-caveat-component")) {
        const source = code.children.map(child => child.type === "text" ? child.value : "").join("");
        try {
          const result = componentAttributesSchema.safeParse(JSON.parse(source));
          if (result.success) return <ComponentBody value={result.data} />;
        } catch { /* Malformed blocks remain readable code, never executable HTML. */ }
      }
      return <pre {...props}>{children}</pre>;
    },
  }}>{children}</Markdown>;
}
