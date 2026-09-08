"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Pencil } from "lucide-react";
import { ExampleCover, exampleStyle } from "./example-publication";
import { CopyText } from "./copy-text";
import { LinkArrow } from "./link-arrow";
import { designPrompt, getExample, publicationExamples } from "@/lib/examples";

export function DesignStarter({ initialExample }: { initialExample?: string }) {
  const [choice, setChoice] = useState(initialExample || "");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [brief, setBrief] = useState("");
  const [existing, setExisting] = useState(false);
  const briefSection = useRef<HTMLElement>(null);
  const example = getExample(choice);
  const prompt = designPrompt(example, { name, author, brief, existing });
  useEffect(() => {
    if (choice) briefSection.current?.focus({ preventScroll: true });
    if (choice)
      briefSection.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }, [choice]);
  return (
    <>
      <section
        className="design-selection"
        id="choose-design"
        aria-labelledby="design-selection-title"
      >
        <div className="design-section-heading">
          <div>
            <p className="eyebrow">1 · Choose a starting point</p>
            <h2 id="design-selection-title">Which one feels like you?</h2>
          </div>
          <Link href="/examples" className="product-text-link">
            Explore the full examples <LinkArrow />
          </Link>
        </div>
        <div className="design-choice-grid">
          {publicationExamples.map((item) => (
            <button
              type="button"
              key={item.slug}
              className={`design-choice example-${item.slug}`}
              style={exampleStyle(item)}
              aria-label={`Choose ${item.name}`}
              aria-pressed={choice === item.slug}
              onClick={() => setChoice(item.slug)}
            >
              <div className="design-choice-heading">
                <strong>{item.name}</strong>
                {choice === item.slug && <Check size={18} aria-hidden="true" />}
              </div>
              <ExampleCover example={item} compact />
              <span className="design-choice-footer">
                {item.category}
                <span>
                  Choose design <LinkArrow direction="right" />
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="design-own">
          <div>
            <h3>Something entirely your own?</h3>
            <p>
              Describe a look, a mood, or a layout. We’ll turn your brief into a
              prompt you can copy.
            </p>
          </div>
          <button
            type="button"
            className="button"
            aria-pressed={choice === "custom"}
            onClick={() => setChoice("custom")}
          >
            <Pencil size={15} /> Start with my own idea
          </button>
        </div>
      </section>
      {choice && (
        <section
          id="design-brief"
          ref={briefSection}
          tabIndex={-1}
          className="design-brief"
          aria-labelledby="design-brief-title"
        >
          <div className="design-brief-intro">
            <p className="eyebrow">2 · Make it yours</p>
            <h2 id="design-brief-title">
              {example
                ? `${example.name}, in your own voice.`
                : "Tell us what you have in mind."}
            </h2>
            <p>
              {example
                ? example.design
                : "A quiet journal, a colourful magazine, a bold studio blog—describe the publication you want to make."}
            </p>
            {example && (
              <Link
                className="product-text-link"
                href={`/examples/${example.slug}`}
                target="_blank"
              >
                Preview {example.name} <LinkArrow />
              </Link>
            )}
            <div className="prompt-explained">
              <h3>What does the prompt do?</h3>
              <p>
                It asks your AI coding tool to create a Caveat project with{" "}
                <code>npm create caveat@latest</code>, or customise your
                existing one.
              </p>
              <p>
                It changes the public site’s layout, fonts, colours, and
                branding using your brief. A name you enter here becomes the
                requested publication name.
              </p>
              <p>
                Your posts, subscribers, sign-in, and email sending stay intact.
                The example stories are just a preview.
              </p>
            </div>
          </div>
          <div className="design-brief-fields stack">
            <label>
              Project
              <select
                aria-label="Project"
                value={existing ? "existing" : "new"}
                onChange={(event) =>
                  setExisting(event.target.value === "existing")
                }
              >
                <option value="new">Create a new Caveat site</option>
                <option value="existing">
                  Customise my existing Caveat site
                </option>
              </select>
            </label>
            <label>
              Publication name <span className="field-optional">Optional</span>
              <input
                value={name}
                aria-label="Publication name"
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                placeholder="e.g. Notes from home"
              />
            </label>
            <label>
              Your name <span className="field-optional">Optional</span>
              <input
                value={author}
                aria-label="Your name"
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={80}
                placeholder="The name on your letters"
              />
            </label>
            <label>
              {example ? "What would you like to change?" : "Your design brief"}
              <textarea
                aria-label={
                  example
                    ? "What would you like to change?"
                    : "Your design brief"
                }
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                rows={5}
                maxLength={3000}
                placeholder={
                  example
                    ? "Keep the layout, use blue and white, and give the homepage a larger introduction…"
                    : "A journal about architecture. Big photography, generous white space, a simple archive, and a quiet serif typeface…"
                }
              />
            </label>
            <div className="prompt-next-step">
              <p className="eyebrow">3 · Copy, paste, build</p>
              <p>
                Paste this into your AI coding tool with access to your project.
                Review its local preview before deploying.
              </p>
              <CopyText key={prompt} text={prompt} label="Copy my prompt" />
              <small>
                Copying prepares instructions. It doesn’t run AI, change your
                site, or deploy anything here.
              </small>
            </div>
            <details className="prompt-full-text">
              <summary>Read the full prompt</summary>
              <pre>{prompt}</pre>
            </details>
          </div>
        </section>
      )}
    </>
  );
}
