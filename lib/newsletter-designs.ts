import type { CSSProperties } from "react";
import fontCatalogue from "./reading-fonts.json";

const curatedFonts = [
  {
    id: "source-serif",
    name: "Source Serif 4",
    kind: "serif",
    family: '"Source Serif 4", Georgia, serif',
  },
  {
    id: "radley",
    name: "Radley",
    kind: "serif",
    family: '"Radley", Georgia, serif',
  },
  {
    id: "inter",
    name: "Inter",
    kind: "sans",
    family: '"Inter", Arial, sans-serif',
  },
  {
    id: "palatino",
    name: "Palatino",
    kind: "serif",
    family: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
  },
  {
    id: "radio-canada-big",
    name: "Radio Canada Big",
    kind: "sans",
    family: '"Radio Canada Big", Arial, sans-serif',
  },
  {
    id: "lato",
    name: "Lato",
    kind: "sans",
    family: '"Lato", Arial, sans-serif',
  },
  {
    id: "alegreya",
    name: "Alegreya",
    kind: "serif",
    family: '"Alegreya", Georgia, serif',
  },
  {
    id: "newsreader",
    name: "Newsreader",
    kind: "serif",
    family: '"Newsreader", Georgia, serif',
  },
  { id: "lora", name: "Lora", kind: "serif", family: '"Lora", Georgia, serif' },
  {
    id: "libre-baskerville",
    name: "Libre Baskerville",
    kind: "serif",
    family: '"Libre Baskerville", Georgia, serif',
  },
] as const;
export type ReadingFont = {
  id: string;
  name: string;
  kind: string;
  family: string;
  favourite: boolean;
};
const favouriteIds = new Set([
  "source-serif",
  "radley",
  "inter",
  "palatino",
  "radio-canada-big",
  "lato",
  "alegreya",
]);
const fallbacks: Record<string, string> = {
  serif: "Georgia, serif",
  sans: "Arial, sans-serif",
  display: "Georgia, serif",
  handwriting: "cursive",
  monospace: "monospace",
};
export const readingFonts: ReadingFont[] = [
  ...curatedFonts.map((font) => ({
    ...font,
    favourite: favouriteIds.has(font.id),
  })),
  {
    id: "sans",
    name: "Modern (system sans)",
    kind: "sans",
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    favourite: false,
  },
  ...fontCatalogue
    .filter((font) => !curatedFonts.some((existing) => existing.id === font.id))
    .map((font) => ({
      id: font.id,
      name: font.name,
      kind: font.kind,
      family: '"' + font.name + '", ' + fallbacks[font.kind],
      favourite: false,
    })),
];
export type Appearance = { design: string; font: string };
export type NewsletterDesign = {
  id: string;
  name: string;
  category: string;
  description: string;
  font: string;
  layout: "margin" | "letter" | "cards";
  headline: string;
  story: string;
  deck: string;
  paper: string;
  background: string;
  ink: string;
  muted: string;
  accent: string;
  wash: string;
  line: string;
};
export const newsletterDesigns: NewsletterDesign[] = [
  {
    id: "margin",
    name: "In the Margin",
    category: "Essays & observations",
    description: "The original Caveat. A green margin note and space to think.",
    font: "palatino",
    layout: "margin",
    headline: "Worth a closer look.",
    story: "A notebook for unfinished thoughts",
    deck: "An idea does not need to be complete to deserve a page.",
    paper: "#fcfdfa",
    background: "#edf1ee",
    ink: "#263a32",
    muted: "#68786f",
    accent: "#315b50",
    wash: "#eff3e7",
    line: "#dce3dc",
  },
  {
    id: "letters",
    name: "The Long Letter",
    category: "Personal letters",
    description:
      "Source Serif, a generous reading column, and very little in the way.",
    font: "source-serif",
    layout: "letter",
    headline: "Some things take a little longer to say.",
    story: "On making room for an ordinary day",
    deck: "A walk, a conversation, a book left open. Nothing remarkable, and everything worth keeping.",
    paper: "#fffdf8",
    background: "#efeee8",
    ink: "#303b39",
    muted: "#66726d",
    accent: "#42655a",
    wash: "#f2f3e9",
    line: "#dce1d6",
  },
  {
    id: "sunday",
    name: "Sunday Post",
    category: "Culture & everyday life",
    description: "Radley gives a quiet weekend letter a little character.",
    font: "radley",
    layout: "letter",
    headline: "A good day to take your time.",
    story: "The pleasure of an unhurried table",
    deck: "Things to read, things to make, and a few reasons to stay a little longer.",
    paper: "#fffbf0",
    background: "#f0eadd",
    ink: "#52412d",
    muted: "#756951",
    accent: "#756035",
    wash: "#f5edcf",
    line: "#e3d7b9",
  },
  {
    id: "dispatch",
    name: "Dispatch",
    category: "Ideas & technology",
    description: "Inter, a crisp blue palette, and a useful grid of stories.",
    font: "inter",
    layout: "cards",
    headline: "Make something. Share what you learn.",
    story: "Small tools, surprisingly useful",
    deck: "Notes from the workbench: what worked, what broke, and what comes next.",
    paper: "#f8fbff",
    background: "#e9eff5",
    ink: "#243e51",
    muted: "#607586",
    accent: "#305c85",
    wash: "#e9f1f8",
    line: "#d7e3ed",
  },
  {
    id: "frequency",
    name: "Open Frequency",
    category: "Design & new ideas",
    description:
      "Radio Canada Big brings an open, confident voice to the page.",
    font: "radio-canada-big",
    layout: "margin",
    headline: "A different way of looking.",
    story: "The ideas hiding in plain sight",
    deck: "A letter about design, attention, and the details that change how something feels.",
    paper: "#f6faf6",
    background: "#e4eee8",
    ink: "#173f36",
    muted: "#59776b",
    accent: "#276452",
    wash: "#e3efe5",
    line: "#cdded1",
  },
  {
    id: "neighbours",
    name: "Good Company",
    category: "People & community",
    description:
      "Lato and a warm, open layout for stories that bring people together.",
    font: "lato",
    layout: "cards",
    headline: "There is a story next door.",
    story: "The people who make a place",
    deck: "Conversations, familiar corners, and the small things we build together.",
    paper: "#fffaf5",
    background: "#f2e9e0",
    ink: "#4b4035",
    muted: "#786b5d",
    accent: "#856348",
    wash: "#f4eadc",
    line: "#e6d9c8",
  },
  {
    id: "fieldwork",
    name: "Fieldwork",
    category: "Books & the outdoors",
    description:
      "Alegreya and soft botanical colours for stories with a slower rhythm.",
    font: "alegreya",
    layout: "letter",
    headline: "Pay attention to the small things.",
    story: "A path I had never noticed",
    deck: "Letters from outside, between the pages of a book, and on the way home.",
    paper: "#f8faf0",
    background: "#e9edde",
    ink: "#36442c",
    muted: "#6a765d",
    accent: "#516441",
    wash: "#eef1de",
    line: "#dce3c9",
  },
  {
    id: "commonplace",
    name: "Commonplace",
    category: "Reading & reflection",
    description:
      "Newsreader, a restrained plum accent, and notes in the margin.",
    font: "newsreader",
    layout: "margin",
    headline: "A few things worth keeping.",
    story: "What stays with us after the last page",
    deck: "Sentences, conversations, and ideas to return to when the day gets quiet.",
    paper: "#fdf9fc",
    background: "#eee8ef",
    ink: "#493c4a",
    muted: "#796c7c",
    accent: "#755d7d",
    wash: "#f0e8f1",
    line: "#e3d7e6",
  },
];
export const defaultAppearance: Appearance = {
  design: "margin",
  font: "palatino",
};
export function getDesign(id: string) {
  return newsletterDesigns.find((d) => d.id === id);
}
export function getReadingFont(id: string) {
  return readingFonts.find((f) => f.id === id) ?? readingFonts[3];
}
export function parseAppearance(value: unknown): Appearance | null {
  if (!value || typeof value !== "object") return null;
  const { design, font } = value as Record<string, unknown>;
  return typeof design === "string" &&
    typeof font === "string" &&
    getDesign(design) &&
    readingFonts.some((f) => f.id === font)
    ? { design, font }
    : null;
}
export function designStyle(
  design: NewsletterDesign,
  font = design.font,
): CSSProperties {
  return {
    "--paper": design.paper,
    "--bg": design.background,
    "--ink": design.ink,
    "--muted": design.muted,
    "--accent": design.accent,
    "--wash": design.wash,
    "--line": design.line,
    "--highlight": design.wash,
    "--serif": getReadingFont(font).family,
  } as CSSProperties;
}
