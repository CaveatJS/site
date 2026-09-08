"use client";
import Link from "next/link";
import { useState } from "react";
import {
  newsletterDesigns,
  readingFonts,
  getReadingFont,
  designStyle,
  type Appearance,
} from "@/lib/newsletter-designs";
import { Icon } from "./icon";
export function DesignGallery({ appearance }: { appearance: Appearance }) {
  const [filter, setFilter] = useState("all");
  const shown = newsletterDesigns.filter(
    (d) => filter === "all" || getReadingFont(d.font).kind === filter,
  );
  return (
    <>
      <div className="design-gallery-bar">
        <div role="group" aria-label="Filter designs">
          {[
            ["all", "All designs"],
            ["serif", "Serif"],
            ["sans", "Sans serif"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <span>{shown.length} newsletters to explore</span>
      </div>
      <div className="design-gallery">
        {shown.map((d) => (
          <article className="design-card" key={d.id}>
            <Link
              className={"design-mini design-mini-" + d.layout}
              href={"/examples/" + d.id}
              style={designStyle(d)}
              aria-label={"Preview " + d.name}
            >
              <div className="design-mini-masthead">
                <span>{d.name}</span>
                <span aria-hidden="true">✳</span>
              </div>
              <p className="design-mini-category">{d.category}</p>
              <h2>{d.headline}</h2>
              <div className="design-mini-story">
                <span>Latest letter</span>
                <h3>{d.story}</h3>
                <p>{d.deck}</p>
              </div>
              <div className="design-mini-bottom">
                <span>A letter worth opening.</span>
                <Icon name="arrow" />
              </div>
            </Link>
            <div className="design-card-caption">
              <div>
                <h3>{d.name}</h3>
                <p>
                  {getReadingFont(d.font).name} · {d.category}
                </p>
              </div>
              {appearance.design === d.id && (
                <span className="design-current">Your design</span>
              )}
            </div>
            <p className="design-card-description">{d.description}</p>
            <Link className="design-preview-link" href={"/examples/" + d.id}>
              Preview & customise <Icon name="forward" size={16} />
            </Link>
          </article>
        ))}
      </div>
      <section className="design-font-note">
        <span aria-hidden="true">Aa</span>
        <div>
          <h2>A little change in type. A different feeling.</h2>
          <p>
            Source Serif 4, Radley, Inter, Palatino, Radio Canada Big, Lato,
            Alegreya, and the full library of {readingFonts.length} fonts.
            Search by name, explore a category, and try any font with any
            design.
          </p>
          <p>
            Palatino and Modern use the fonts on your device; the other families
            are included with your site.
          </p>
        </div>
      </section>
    </>
  );
}
