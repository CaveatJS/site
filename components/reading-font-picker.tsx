"use client";
import { useState } from "react";
import { readingFonts, getReadingFont } from "@/lib/newsletter-designs";
const categories = [
  ["favourites", "Favourites"],
  ["all", "All fonts"],
  ["serif", "Serif"],
  ["sans", "Sans serif"],
  ["display", "Display"],
  ["handwriting", "Handwritten"],
  ["monospace", "Monospace"],
] as const;
export function ReadingFontPicker({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (font: string) => void;
}) {
  const [category, setCategory] = useState<string>("favourites");
  const [query, setQuery] = useState("");
  const shown = readingFonts.filter(
    (font) =>
      (category === "all" ||
        (category === "favourites"
          ? font.favourite
          : font.kind === category)) &&
      font.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <section className="design-fonts" aria-label="Reading font">
      <div className="font-library-heading">
        <div>
          <h2>Find your type.</h2>
          <p>
            {readingFonts.length} fonts. Your favourites first. Try any in the
            letter below.
          </p>
        </div>
        <label className="font-library-search">
          <span className="sr-only">Search fonts</span>
          <input
            type="search"
            placeholder="Search fonts…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setCategory("all");
            }}
          />
        </label>
      </div>
      <div
        className="font-library-categories"
        role="group"
        aria-label="Font categories"
      >
        {categories.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => {
              setCategory(id);
              setQuery("");
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="font-library-status">
        <span role="status">
          {shown.length} {shown.length === 1 ? "font" : "fonts"}
        </span>
        <span>
          Selected: <strong>{getReadingFont(value).name}</strong>
        </span>
      </div>
      <div
        className="design-font-options font-library-results"
        role="group"
        aria-label="Font choices"
      >
        {shown.map((font) => (
          <button
            key={font.id}
            type="button"
            aria-pressed={value === font.id}
            disabled={disabled}
            onClick={() => onChange(font.id)}
          >
            <span style={{ fontFamily: font.family }} aria-hidden="true">
              Aa
            </span>
            <span>{font.name}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="font-library-empty">
          <p>No fonts match “{query}”.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Show all fonts
          </button>
        </div>
      )}
    </section>
  );
}
