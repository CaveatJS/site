import { LinkArrow } from "@/components/link-arrow";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "@/components/product-shell";
import { CopyText } from "@/components/copy-text";
import { newsletterComponents } from "@/lib/newsletter-components";
import { renderContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Newsletter components",
  description:
    "Reusable callouts, quotes, buttons, link cards, and dividers for Caveat posts and emails. Browse the starter library and learn how to contribute.",
};
export default function Components() {
  return (
    <ProductShell current="components">
      <section className="product-hero">
        <p className="eyebrow">Small pieces for a good letter</p>
        <h1>
          Your words.
          <br />
          <em>A few useful components.</em>
        </h1>
        <p>
          Give an idea a little emphasis, share a useful link, or invite your
          readers to take the next step. Every block below works in the website
          and renders to HTML for email.
        </p>
        <div className="components-how">
          <span className="badge">5 starter components</span>
          <span>
            In the editor:{" "}
            <strong>Insert component → customise → insert</strong>
          </span>
        </div>
      </section>
      <section
        className="component-catalogue"
        aria-label="Newsletter component library"
      >
        {newsletterComponents.map((component) => {
          const content = {
            type: "doc",
            content: [
              { type: "newsletterComponent", attrs: component.defaults },
            ],
          };
          const json = JSON.stringify(content.content[0], null, 2);
          return (
            <article
              className="component-catalogue-card"
              key={component.id}
              id={component.id}
            >
              <div
                className="component-sample"
                dangerouslySetInnerHTML={{ __html: renderContent(content) }}
              />
              <div className="component-card-heading">
                <h2>{component.name}</h2>
                <span>Web & email</span>
              </div>
              <p>{component.description}</p>
              <div className="component-credit">
                <span>By {component.author} · MIT</span>
                <Link href="/dashboard">
                  Use in a post <LinkArrow direction="right" />
                </Link>
              </div>
              <details className="example-resources">
                <summary>Developer example</summary>
                <div>
                  <p>
                    The editor stores this as structured content. Add it through
                    the picker, or use it with Tiptap’s{" "}
                    <code>insertContent</code> command.
                  </p>
                  <CopyText text={json} label={`Copy ${component.name} JSON`} />
                  <pre>
                    <code>{json}</code>
                  </pre>
                </div>
              </details>
            </article>
          );
        })}
      </section>
      <section className="component-contribute" id="contribute">
        <div>
          <p className="eyebrow">A library we can grow together</p>
          <h2>
            Made by Caveat.
            <br />
            Open to the community.
          </h2>
          <p>
            These first five components are included with Caveat. Community
            submissions are welcome through the project repository; there are no
            community entries yet.
          </p>
          <a
            className="button primary"
            href="https://github.com/CaveatJS/site/issues/new"
          >
            Suggest a component <LinkArrow />
          </a>
        </div>
        <div>
          <h3>What makes a good contribution?</h3>
          <ul>
            <li>A clear purpose, author credit, and a compatible licence.</li>
            <li>Editable fields and a static HTML version for email.</li>
            <li>A mobile preview, safe links, and readable fallbacks.</li>
            <li>Checks for saving, reopening, publishing, and rendering.</li>
          </ul>
          <p>
            Contributions are reviewed and shipped with an application update.
            The editor does not fetch or execute remote component code.
          </p>
          <Link href="/docs#components" className="product-text-link">
            Read the contribution guide <LinkArrow direction="right" />
          </Link>
        </div>
      </section>
      <p className="component-email-note">
        Email clients render HTML differently. Preview your letter and send
        yourself a test before sending to readers. Interactive React components
        belong on your website; email blocks use their static HTML equivalent.
      </p>
    </ProductShell>
  );
}
