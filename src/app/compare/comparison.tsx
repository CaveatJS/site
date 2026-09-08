"use client";
import { useState } from "react";
import {
  publicationFonts,
  publicationFontStyle,
} from "@/lib/publication-fonts";
import styles from "./compare.module.css";

const googleFontCount = publicationFonts.filter(
  (font) => font.source === "google",
).length;

const platforms = [
  { id: "caveat", name: "Caveat", note: "Your own workspace", href: "/docs" },
  {
    id: "substack",
    name: "Substack",
    note: "Publishing + a network",
    href: "https://substack.com/about",
  },
  {
    id: "ghost",
    name: "Ghost",
    note: "Independent publishing",
    href: "https://ghost.org/",
  },
  {
    id: "beehiiv",
    name: "beehiiv",
    note: "Newsletter growth",
    href: "https://www.beehiiv.com/pricing",
  },
];
const groups = [
  {
    title: "Writing & design",
    rows: [
      [
        "The writing space",
        "Rich text + autosave|Private revisions stay separate from the live post.",
        "Rich text + multimedia",
        "Rich media + content cards",
        "Newsletter editor",
      ],
      [
        "Content blocks",
        "Five reusable blocks|Callout, pull quote, button, link card, and divider. Community contributions through GitHub.",
        "Media embeds",
        "Rich media cards",
        "Email builder",
      ],
      [
        "Make it your own",
        `${googleFontCount} Google Fonts + two system styles|Search, live preview, accent colours, and editable React/CSS.`,
        "Publication design settings|Built-in font choices.",
        "Themes + design settings|Custom themes depend on hosting plan.",
        "Website + email templates|Some customisation is plan-dependent.",
      ],
      [
        "On the web",
        "Your publication website|Posts, archive, about page, and RSS.",
        "Publication website + app",
        "Publication website",
        "Publication website",
      ],
    ],
  },
  {
    title: "Readers & email",
    rows: [
      [
        "Newsletter delivery",
        "Connect your Resend account|Preview, test email, recipient confirmation, and delivery status.",
        "Handled by Substack",
        "Included with Ghost(Pro)|Self-hosted newsletters use Mailgun.",
        "Included in all plans",
      ],
      [
        "Subscriber tools",
        "Signup form + subscriber list|Resend manages contacts and unsubscribe status.",
        "Subscribers + paid members",
        "Free + paid memberships",
        "Subscriber management|Segments and signup forms.",
      ],
      [
        "Finding new readers",
        "Your site, your outreach|Subscription form and RSS. No discovery network.",
        "Notes + recommendations|Discovery through the Substack app.",
        "Recommendations",
        "Recommendation network|Referral and ad tools on paid plans.",
      ],
      [
        "Paid subscriptions",
        "Not included|This release focuses on free publications.",
        "Built in",
        "Available|Ghost(Pro): Publisher plan and above.",
        "Paid plans",
      ],
    ],
  },
  {
    title: "Ownership & costs",
    rows: [
      [
        "Where it lives",
        "Your hosting + database|Run locally; deploy to your Vercel account.",
        "Hosted by Substack",
        "Managed or self-hosted",
        "Hosted by beehiiv",
      ],
      [
        "Taking your work with you",
        "Post + subscriber exports|JSON for posts. CSV for subscribers.",
        "Post + subscriber exports",
        "Content + member exports",
        "Post + subscriber exports",
      ],
      [
        "The software",
        "Open source · MIT|Read it, change it, and run your own copy.",
        "Hosted platform",
        "Open source",
        "Hosted platform",
      ],
      [
        "What you pay for",
        "Your service usage|Hosting, database, and email. No Caveat software fee.",
        "Free to start|10% of paid revenue + payment processing.",
        "Hosting + email|Managed plans or your own infrastructure.",
        "Free and paid plans|Features and audience size determine the plan.",
      ],
    ],
  },
];
const categories = ["Everything", ...groups.map((group) => group.title)];

export function ComparisonTable() {
  const [category, setCategory] = useState("Everything");
  const [competitor, setCompetitor] = useState("all");
  const columns = platforms
    .map((platform, index) => ({ ...platform, index }))
    .filter(
      (platform) =>
        platform.id === "caveat" ||
        competitor === "all" ||
        platform.id === competitor,
    );
  const visible = groups.filter(
    (group) => category === "Everything" || group.title === category,
  );
  const count = visible.reduce((total, group) => total + group.rows.length, 0);
  return (
    <>
      <div className={styles.controls}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter comparison by topic"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className={styles.platformSelect}>
          Compare with
          <select
            value={competitor}
            onChange={(event) => setCompetitor(event.target.value)}
          >
            <option value="all">All platforms</option>
            {platforms.slice(1).map((platform) => (
              <option value={platform.id} key={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className={styles.resultCount} role="status">
        {count} features ·{" "}
        {competitor === "all"
          ? "All four platforms"
          : "Caveat and " +
            platforms.find((platform) => platform.id === competitor)?.name}
      </p>
      <p className={styles.scrollHint} id="compare-scroll-help">
        Swipe across the table, or choose one platform above for a closer
        comparison.
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        tabIndex={0}
        aria-label="Publication platform comparison"
        aria-describedby="compare-scroll-help"
      >
        <table className={styles.table} data-pair={competitor !== "all"}>
          <caption className="visually-hidden">
            Caveat compared with{" "}
            {columns
              .slice(1)
              .map((column) => column.name)
              .join(", ")}
            . {category}.
          </caption>
          <thead>
            <tr>
              <th scope="col">In the details</th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={
                    column.id === "caveat" ? styles.caveatColumn : undefined
                  }
                >
                  <a href={column.href}>
                    {column.name}
                    {column.id === "caveat" && (
                      <span aria-hidden="true">✳</span>
                    )}
                  </a>
                  <small>{column.note}</small>
                </th>
              ))}
            </tr>
          </thead>
          {visible.map((group) => (
            <tbody key={group.title}>
              <tr className={styles.groupHeading}>
                <th colSpan={columns.length + 1} scope="rowgroup">
                  {group.title}
                </th>
              </tr>
              {group.rows.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {columns.map((column) => {
                    const [title, detail] = cells[column.index].split("|");
                    return (
                      <td
                        key={column.id}
                        className={
                          column.id === "caveat"
                            ? styles.caveatColumn
                            : undefined
                        }
                      >
                        <span className={styles.cellTitle}>{title}</span>
                        {detail && (
                          <span className={styles.cellDetail}>{detail}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
}
const accents = [
  { name: "Forest", value: "#315b50" },
  { name: "Plum", value: "#6a4c68" },
  { name: "Ink", value: "#35516c" },
];
export function ReadingPreview() {
  const [font, setFont] = useState("serif");
  const [accent, setAccent] = useState(accents[0].value);
  return (
    <div className={styles.specimen}>
      <div className={styles.specimenLabel}>
        <span>A little look at Caveat</span>
        <span>Interactive preview</span>
      </div>
      <div
        className={styles.readingPaper}
        style={{ ...publicationFontStyle(font), color: accent }}
      >
        <div className={styles.paperMasthead}>
          <span>The Sunday letter</span>
          <span aria-hidden="true">✳</span>
        </div>
        <p className={styles.paperIssue}>Notes on a life well noticed</p>
        <h2>
          A small place
          <br />
          for big ideas.
        </h2>
        <p className={styles.paperCopy}>
          The things you notice deserve somewhere to live. A passing thought. A
          better question. A letter worth opening.
        </p>
        <div className={styles.paperByline}>
          <span>By you, for your readers</span>
          <span>3 min read</span>
        </div>
      </div>
      <div className={styles.specimenControls}>
        <label>
          Reading style
          <select
            value={font}
            onChange={(event) => setFont(event.target.value)}
          >
            {publicationFonts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Accent</legend>
          <div className={styles.swatches}>
            {accents.map((item) => (
              <button
                type="button"
                key={item.value}
                aria-label={item.name + " accent"}
                aria-pressed={accent === item.value}
                style={{ backgroundColor: item.value }}
                onClick={() => setAccent(item.value)}
              />
            ))}
          </div>
        </fieldset>
      </div>
      <p className={styles.specimenFootnote}>
        {googleFontCount} Google Fonts and two system styles. Try one here;
        search the full library in Settings.
      </p>
    </div>
  );
}
