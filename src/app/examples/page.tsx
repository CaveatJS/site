import { LinkArrow } from "@/components/link-arrow";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "@/components/product-shell";
import { ExampleCover, exampleStyle } from "@/components/example-publication";
import { CopyText } from "@/components/copy-text";
import { submitExampleUrl, exampleGuideUrl } from "@/lib/example-contributions";
import {
  publicationExamples,
  examplePrompt,
  exampleCss,
  exampleReact,
} from "@/lib/examples";

export const metadata: Metadata = {
  title: "Example publications",
  description: `Explore ${publicationExamples.length} Caveat publication designs, personalise a prompt, or contribute your own example through GitHub.`,
};

export default function Examples() {
  return (
    <ProductShell current="examples">
      <section className="product-hero examples-hero">
        <p className="eyebrow">A few possible beginnings</p>
        <h1>
          Find a look.
          <br />
          <em>Make it your own.</em>
        </h1>
        <p>
          {publicationExamples.length} sample publications, each with its own
          voice. Choose a design before you create your site, then make it yours
          with a personal brief.
        </p>
        <div className="examples-intro-note">
          <span aria-hidden="true">
            <LinkArrow direction="turn" />
          </span>{" "}
          Fictional blogs, real React and CSS. Your own posts stay yours.
        </div>
        <div className="examples-hero-actions">
          <Link href="/create?example=custom#design-brief" className="button">
            Write my own design brief <LinkArrow direction="right" />
          </Link>
          <a href="#contribute-example" className="product-text-link">
            Add an example <LinkArrow direction="right" />
          </a>
        </div>
      </section>
      <section
        className="examples-prompt-note"
        aria-labelledby="examples-prompt-title"
      >
        <h2 id="examples-prompt-title">
          A prompt is a design brief for your AI coding tool.
        </h2>
        <p>
          It asks the tool to create a Caveat project, then customise the public
          site’s layout, fonts, colours, and branding. You can add your
          publication name and your own instructions. Copying alone doesn’t
          change or publish anything.
        </p>
        <p>
          Choose <strong>Use this design</strong> to personalise the prompt, or{" "}
          <strong>Copy prompt</strong> for the example as shown. Paste it into
          your coding tool, then review the site it builds.
        </p>
      </section>
      <section className="examples-gallery" aria-label="Example blogs">
        {publicationExamples.map((example) => (
          <article
            key={example.slug}
            id={example.slug}
            className="example-card"
          >
            <Link
              href={`/examples/${example.slug}`}
              className={`example-thumbnail example-${example.slug}`}
              style={exampleStyle(example)}
              aria-label={`Explore ${example.name}`}
            >
              <div className="example-mini-header">
                <span>{example.name}</span>
                <span aria-hidden="true">✳</span>
              </div>
              <ExampleCover example={example} compact />
              <div className="example-mini-story">
                <span>{example.posts[0].category}</span>
                <p>{example.posts[0].title}</p>
              </div>
            </Link>
            <div className="example-card-caption">
              <span className="eyebrow">{example.category}</span>
              <h2>{example.name}</h2>
              <p>{example.design}</p>
              <small className="example-design-credit">
                Design by {example.credit || "Caveat"}
              </small>
              <div className="example-card-actions">
                <Link
                  className="button primary"
                  href={`/create?example=${example.slug}#design-brief`}
                >
                  Use this design <LinkArrow direction="right" />
                </Link>
                <CopyText text={examplePrompt(example)} label="Copy prompt" />
                <Link
                  className="product-text-link"
                  href={`/examples/${example.slug}`}
                >
                  Explore the blog <LinkArrow direction="right" />
                </Link>
              </div>
            </div>
            <details className="example-resources">
              <summary>React & CSS starters</summary>
              <div>
                <h3>Start with colours</h3>
                <p>
                  Paste into <code>src/themes/custom.css</code>, then choose the
                  matching font in Settings. This changes colours; the example’s
                  layout needs React edits.
                </p>
                <CopyText
                  text={exampleCss(example)}
                  label={`Copy ${example.name} CSS`}
                />
                <pre>
                  <code>{exampleCss(example)}</code>
                </pre>
                <h3>A React starting point</h3>
                <p>
                  A homepage intro that uses your real publication data. The
                  complete demo lives in{" "}
                  <code>src/components/example-publication.tsx</code>.
                </p>
                <CopyText
                  text={exampleReact(example)}
                  label={`Copy ${example.name} React intro`}
                />
                <pre>
                  <code>{exampleReact(example)}</code>
                </pre>
              </div>
            </details>
          </article>
        ))}
      </section>
      <section className="examples-freedom">
        <div>
          <p className="eyebrow">You have the source</p>
          <h2>The design is yours to change.</h2>
          <p>
            Use Settings for fonts and an accent colour. Use CSS for your own
            visual style. Use React to rethink the layout, or describe the
            result you want to a coding assistant.
          </p>
          <Link className="product-text-link" href="/docs#custom-design">
            How custom designs work <LinkArrow direction="right" />
          </Link>
        </div>
        <div>
          <h3>One prompt to start building.</h3>
          <p>
            Choose an example and copy its prompt into your coding assistant.
            The prompt starts with{" "}
            <code>npm create caveat@latest my-newsletter</code>, then guides the
            design changes inside that Caveat project.
          </p>
          <p>
            These demos were made with React, CSS, and fictional stories inside
            this project. They are design references, not separately installed
            publications. The starter colours and prompts help you reproduce the
            direction with your own content.
          </p>
          <Link
            className="product-text-link"
            href="/create?example=custom#design-brief"
          >
            Create a prompt from your own idea <LinkArrow direction="right" />
          </Link>
        </div>
      </section>
      <section className="example-contribute" id="contribute-example">
        <div>
          <p className="eyebrow">Made something worth sharing?</p>
          <h2>Add your own example.</h2>
          <p>
            Share a design, a preview, or an idea on GitHub. Include your name,
            the design direction, and any asset licences. You can open an issue
            first or contribute the code in a pull request.
          </p>
          <p>
            The six starter designs are by Caveat. Community submissions are
            reviewed before joining this gallery, with credit to their creators.
          </p>
        </div>
        <div className="stack">
          <a
            className="button primary"
            href={submitExampleUrl}
            target="_blank"
            rel="noreferrer"
          >
            Submit an example on GitHub <LinkArrow />
          </a>
          <a
            className="product-text-link"
            href={exampleGuideUrl}
            target="_blank"
            rel="noreferrer"
          >
            Read the contribution guide <LinkArrow />
          </a>
        </div>
      </section>
    </ProductShell>
  );
}
