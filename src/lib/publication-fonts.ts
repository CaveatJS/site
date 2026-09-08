import type { CSSProperties } from "react";
import googleFonts from "./google-fonts.json";

export const fontCategories = {
  serif: "Serif",
  sans: "Sans serif",
  display: "Display",
  handwriting: "Handwritten",
  monospace: "Monospace",
} as const;
export type FontKind = keyof typeof fontCategories;
export type PublicationFont = {
  id: string;
  name: string;
  kind: FontKind;
  family: string;
  description: string;
  recommended: boolean;
  source: "system" | "google";
};
const descriptions: Record<FontKind, string> = {
  serif: "A classic reading style for stories, essays, and longer letters.",
  sans: "Clean, open letters for a contemporary publication.",
  display: "An expressive choice. Try a full post to check longer passages.",
  handwriting: "A personal, handwritten feel, especially for shorter letters.",
  monospace:
    "Evenly spaced letters with the feel of a typewriter or code editor.",
};
const fallbacks: Record<FontKind, string> = {
  serif: "Georgia, serif",
  sans: "Arial, sans-serif",
  display: "Georgia, serif",
  handwriting: "cursive",
  monospace: "monospace",
};

// IDs are persisted in Prisma. Keep existing IDs stable when extending the catalogue.
export const publicationFonts: PublicationFont[] = [
  {
    id: "serif",
    name: "Literary",
    kind: "serif",
    family: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
    description: "The original Caveat reading style. No font download needed.",
    recommended: true,
    source: "system",
  },
  {
    id: "sans",
    name: "Modern",
    kind: "sans",
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    description: "Simple and familiar. No font download needed.",
    recommended: true,
    source: "system",
  },
  ...googleFonts.map((font) => {
    const kind = font.kind as FontKind;
    return {
      ...font,
      kind,
      family: `var(--font-${font.id}), ${fallbacks[kind]}`,
      description: descriptions[kind],
      source: "google" as const,
    };
  }),
];
export const publicationFontIds = publicationFonts.map((font) => font.id);
export function getPublicationFont(id: string) {
  return publicationFonts.find((font) => font.id === id) ?? publicationFonts[0];
}
export function publicationFontStyle(id: string): CSSProperties {
  return { "--display": getPublicationFont(id).family } as CSSProperties;
}
