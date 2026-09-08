"use client";
import { useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  fontCategories,
  getPublicationFont,
  publicationFonts,
  publicationFontStyle,
  type FontKind,
} from "@/lib/publication-fonts";

function FontPreview({ id }: { id: string }) {
  const font = getPublicationFont(id);
  return (
    <div
      className="font-preview"
      style={publicationFontStyle(id)}
      data-font-kind={font.kind}
      role="region"
      aria-label="Typeface preview"
    >
      <p className="eyebrow">Your words in {font.name}</p>
      <h3>A thought worth sharing.</h3>
      <p className="font-preview-copy">
        Some ideas arrive quietly. A sentence in a book, a conversation on a
        walk, a small detail you almost missed.{" "}
        <em>Give them somewhere to go.</em>
      </p>
      <span className="font-preview-note">
        The quick brown fox · 0123456789
      </span>
    </div>
  );
}

export function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [candidate, setCandidate] = useState(value);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"recommended" | "all" | FontKind>(
    "recommended",
  );
  const selected = getPublicationFont(value);
  const preview = getPublicationFont(candidate);
  const matches = publicationFonts.filter(
    (font) =>
      (category === "all" ||
        (category === "recommended"
          ? font.recommended
          : font.kind === category)) &&
      font.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  function show() {
    setCandidate(value);
    setQuery("");
    setCategory("recommended");
    setOpen(true);
    dialog.current?.showModal();
    searchInput.current?.focus();
  }
  return (
    <div className="font-picker">
      <input type="hidden" name="font" value={value} />
      <label htmlFor="font-picker-trigger">Reading typeface</label>
      <button
        type="button"
        id="font-picker-trigger"
        className="font-picker-trigger"
        aria-haspopup="dialog"
        onClick={show}
      >
        <span>{selected.name}</span>
        <span>
          Browse fonts <ChevronDown size={15} />
        </span>
      </button>
      <p className="font-description">
        100 Google Fonts, plus two classic defaults. Start with our favourites.
      </p>
      <FontPreview id={value} />
      <p className="font-description">
        Save changes to apply this typeface to your website.
      </p>
      <dialog
        ref={dialog}
        className="font-dialog"
        aria-labelledby="font-dialog-title"
        onClose={() => setOpen(false)}
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow">A little character</p>
            <h2 id="font-dialog-title">Find your type.</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close font picker"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <p className="font-dialog-intro">
          Start with a favourite, or find something that feels like you.
        </p>
        <div className="font-search">
          <Search size={17} aria-hidden="true" />
          <input
            ref={searchInput}
            aria-label="Search fonts"
            type="search"
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Search 100 Google Fonts…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (category === "recommended") setCategory("all");
            }}
          />
        </div>
        <div className="font-filters" role="group" aria-label="Font categories">
          {(
            [
              ["recommended", "Recommended"],
              ["all", "All fonts"],
              ...Object.entries(fontCategories),
            ] as const
          ).map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={category === id}
              onClick={() => setCategory(id as typeof category)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="font-browser">
          <div className="font-results">
            <p className="font-result-count" role="status">
              {matches.length} {matches.length === 1 ? "typeface" : "typefaces"}
            </p>
            <div
              className="font-options"
              role="group"
              aria-label="Available typefaces"
            >
              {matches.map((font) => (
                <button
                  type="button"
                  key={font.id}
                  aria-pressed={candidate === font.id}
                  onClick={() => setCandidate(font.id)}
                >
                  <span>
                    <strong>{font.name}</strong>
                    <small>
                      {font.source === "system"
                        ? "Classic default"
                        : fontCategories[font.kind]}
                    </small>
                  </span>
                  {candidate === font.id && (
                    <Check size={17} aria-hidden="true" />
                  )}
                </button>
              ))}
              {!matches.length && (
                <p className="font-empty">
                  No fonts found. Try another name or choose All fonts.
                </p>
              )}
            </div>
          </div>
          <div className="font-candidate">
            {open && <FontPreview id={candidate} />}
            <p className="font-description">{preview.description}</p>
            <p className="font-description">
              Website & editor · Email keeps its familiar reading font.
            </p>
          </div>
        </div>
        <div className="font-dialog-actions">
          <button
            type="button"
            className="button"
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              onChange(candidate);
              dialog.current?.close();
            }}
          >
            Use {preview.name}
          </button>
        </div>
      </dialog>
    </div>
  );
}
