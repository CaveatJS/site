import { LinkArrow } from "@/components/link-arrow";
import Link from "next/link";
import { getPublicationFont } from "@/lib/publication-fonts";
import type { PublicationExample, ExamplePost } from "@/lib/examples";
import type { CSSProperties } from "react";

export function ExampleMotif() {
  return (
    <svg viewBox="0 0 280 180" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M79 162C105 126 150 102 199 26" />
        <path d="M108 127C74 132 48 117 38 91C73 82 109 97 108 127ZM129 109C122 78 134 51 159 35C179 63 163 99 129 109ZM153 81C177 97 211 91 235 67C205 46 173 54 153 81Z" />
      </g>
    </svg>
  );
}

export function ExampleCover({
  example,
  compact = false,
}: {
  example: PublicationExample;
  compact?: boolean;
}) {
  const Tag = compact ? "div" : "h1";
  return (
    <div className={`example-cover ${compact ? "example-cover-compact" : ""}`}>
      <div>
        <p className="example-kicker">{example.category}</p>
        <Tag className="example-headline">{example.headline}</Tag>
        <p className="example-description">{example.description}</p>
      </div>
      {example.slug === "field-notes" && (
        <div className="example-motif">
          <ExampleMotif />
        </div>
      )}
    </div>
  );
}

export function exampleStyle(example: PublicationExample): CSSProperties {
  return {
    "--example-font": getPublicationFont(example.font).family,
    "--example-bg": example.background,
    "--example-ink": example.ink,
    "--example-muted": example.muted,
    "--example-surface": example.surface,
    "--example-line": example.line,
    "--example-accent": example.accent,
  } as CSSProperties;
}

export function ExamplePublication({
  example,
  post,
}: {
  example: PublicationExample;
  post?: ExamplePost;
}) {
  const home = `/examples/${example.slug}`;
  return (
    <>
      <div className="example-toolbar">
        <Link href="/examples">
          <LinkArrow direction="left" /> All examples
        </Link>
        <span>Sample publication · fictional stories</span>
        <Link href={`/create?example=${example.slug}#design-brief`}>
          Use this design <LinkArrow />
        </Link>
      </div>
      <main
        id="main"
        className={`example-site example-${example.slug}`}
        style={exampleStyle(example)}
      >
        <header className="example-header">
          <Link className="example-name" href={home}>
            {example.name}
            <span aria-hidden="true">
              {example.slug === "signal" ? "_" : "✳"}
            </span>
          </Link>
          <nav aria-label={`${example.name} navigation`}>
            <Link href={`${home}#stories`}>Stories</Link>
            <a href="#about">About</a>
          </nav>
        </header>
        {post ? (
          <article className="example-article">
            <Link className="example-back" href={`${home}#stories`}>
              <LinkArrow direction="left" /> All stories
            </Link>
            <p className="example-kicker">{post.category}</p>
            <h1>{post.title}</h1>
            <p className="example-standfirst">{post.excerpt}</p>
            <p className="example-byline">By {example.author} · Sample story</p>
            <div className="example-article-body">
              {post.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className="example-back" href={home}>
              More from {example.name} <LinkArrow direction="right" />
            </Link>
          </article>
        ) : (
          <>
            <ExampleCover example={example} />
            <section
              id="stories"
              className="example-stories"
              aria-label="Latest stories"
            >
              <div className="example-section-label">
                <h2>
                  {example.slug === "after-hours"
                    ? "On the turntable"
                    : example.slug === "off-script"
                      ? "From the studio"
                      : example.slug === "common-ground"
                        ? "Around the neighbourhood"
                        : "Fresh from the notebook"}
                </h2>
                <span>{example.posts.length} stories</span>
              </div>
              <div className="example-story-grid">
                {example.posts.map((story, index) => (
                  <Link
                    key={story.slug}
                    className={`example-story ${index === 0 ? "example-story-lead" : ""}`}
                    href={`${home}/${story.slug}`}
                  >
                    <span className="example-kicker">{story.category}</span>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <span className="example-read">
                      Read the story{" "}
                      <span aria-hidden="true">
                        <LinkArrow />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
        <section className="example-about" id="about">
          <p className="example-kicker">A note from {example.author}</p>
          <h2>A place to return to.</h2>
          <p>
            {example.description} This is a fictional publication, made to show
            what you can build with Caveat.
          </p>
          <Link
            href={`/create?example=${example.slug}#design-brief`}
            className="example-cta"
          >
            Make something like this{" "}
            <span aria-hidden="true">
              <LinkArrow />
            </span>
          </Link>
        </section>
        <footer className="example-footer">
          <span>
            {example.name} · Design by {example.credit || "Caveat"} · A Caveat
            example
          </span>
          <Link href="/docs#custom-design">
            Make your own design <LinkArrow />
          </Link>
        </footer>
      </main>
    </>
  );
}
