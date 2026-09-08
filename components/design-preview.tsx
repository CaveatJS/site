"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  designStyle,
  getReadingFont,
  readingFonts,
  type NewsletterDesign,
  type Appearance,
} from "@/lib/newsletter-designs";
import { Icon } from "./icon";
export function DesignPreview({
  design,
  appearance,
  canApply,
}: {
  design: NewsletterDesign;
  appearance: Appearance;
  canApply: boolean;
}) {
  const router = useRouter();
  const [font, setFont] = useState(
    appearance.design === design.id ? appearance.font : design.font,
  );
  const [saved, setSaved] = useState(appearance);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const current = saved.design === design.id && saved.font === font;
  async function apply() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/studio/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design: design.id, font }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not apply this design.");
      setSaved(result);
      setMessage(
        design.name +
          " with " +
          getReadingFont(font).name +
          " is now your publication design.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="design-preview-page">
      <header className="design-preview-toolbar">
        <Link href="/examples">
          <Icon name="back" size={16} /> All designs
        </Link>
        <div className="design-preview-controls">
          {canApply ? (
            <button
              className="button primary"
              disabled={busy || current}
              onClick={apply}
            >
              {busy
                ? "Applying…"
                : current
                  ? "Current design"
                  : "Use this design"}{" "}
              {!busy && <Icon name="forward" size={16} />}
            </button>
          ) : (
            <span className="design-local-note">
              Apply designs in your local editor
            </span>
          )}
        </div>
      </header>
      <div className="design-preview-description">
        <div>
          <h1>{design.name}</h1>
          <p>{design.description}</p>
        </div>
        <p>
          Example writing below.
          <br />
          Your posts stay yours when you apply a design.
        </p>
      </div>
      <section className="design-fonts" aria-label="Reading font">
        <p>Choose a reading font — the preview changes as you choose.</p>
        <div
          className="design-font-options"
          role="group"
          aria-label="Font choices"
        >
          {readingFonts.map((f) => (
            <button
              key={f.id}
              aria-pressed={font === f.id}
              disabled={busy}
              onClick={() => {
                setFont(f.id);
                setMessage("");
              }}
            >
              <span style={{ fontFamily: f.family }} aria-hidden="true">
                Aa
              </span>
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      </section>
      {message && (
        <p className="design-feedback" role="status">
          {message}{" "}
          <Link href="/">
            View publication <Icon name="arrow" size={16} />
          </Link>{" "}
          · <Link href="/studio">Open editor</Link>
        </p>
      )}
      {error && (
        <p className="design-feedback error" role="alert">
          {error}
        </p>
      )}
      <div className="design-stage" style={designStyle(design, font)}>
        <div className="site-wrap newsletter-frame" data-layout={design.layout}>
          <div className="design-sample-header">
            <span className="design-sample-name">
              {design.name}
              <span aria-hidden="true"> ✳</span>
            </span>
            <span>Letters · About · Subscribe</span>
          </div>
          <main id="main">
            <section className="journal-intro">
              <p className="eyebrow">{design.category}</p>
              <h2>{design.headline}</h2>
              <p>{design.deck}</p>
            </section>
            <section className="journal-grid">
              <div className="writing-column">
                <article className="featured-post">
                  <div className="post-meta">
                    <span className="label-dot">The latest letter</span>
                    <span>Sunday, 8 September</span>
                  </div>
                  <h2>{design.story}</h2>
                  <p>{design.deck}</p>
                  <span className="read-link">
                    A five-minute read <Icon name="arrow" size={16} />
                  </span>
                </article>
                <div className="archive-heading">
                  <h2>Earlier letters</h2>
                  <span>From the archive</span>
                </div>
                {[
                  "The things we return to",
                  "A little room for something new",
                ].map((title, i) => (
                  <article className="post-row" key={title}>
                    <div className="post-meta">Issue {i + 1} · 4 min read</div>
                    <h3>{title}</h3>
                    <p>
                      A small observation, a useful question, and something to
                      carry into the week.
                    </p>
                  </article>
                ))}
              </div>
              <aside className="margin-note">
                <span className="asterisk" aria-hidden="true">
                  ✳
                </span>
                <h2>A note from the writer</h2>
                <p>
                  A place for considered ideas and things worth sharing. Written
                  slowly, sent when there is something to say.
                </p>
                <div className="feed-note">
                  <h3>Something good to read.</h3>
                  <p>A letter for your Sunday morning.</p>
                </div>
              </aside>
            </section>
            <article className="design-reading-sample">
              <p className="eyebrow">A little further into the letter</p>
              <div className="prose">
                <h2>{design.story}</h2>
                <p>
                  I went out without a particular destination. There was a book
                  in my bag, a little time before the afternoon began, and no
                  good reason to hurry.
                </p>
                <p>
                  Somewhere along the way, I stopped trying to make the day
                  useful. A familiar street, a conversation through an open
                  window, the light moving across a wall. It was enough to
                  notice.
                </p>
                <blockquote>
                  <p>
                    Some things are worth keeping simply because they made us
                    pay attention.
                  </p>
                </blockquote>
                <p>
                  That is what this letter is for: a place to put the things
                  that might otherwise slip past.
                </p>
              </div>
            </article>
          </main>
          <footer className="site-footer">
            <span>{design.name} · An example publication</span>
            <span>Made with Caveat</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
