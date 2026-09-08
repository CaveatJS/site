import Link from "next/link";
import { site } from "@/site.config";

export function Header() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.name === "Caveat" ? "caveat" : site.name}
        <span aria-hidden="true">✳</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Journal</Link>
        <Link href="/about">About</Link>
        <a href="/rss.xml">
          RSS <span aria-hidden="true">↗</span>
        </a>
        {process.env.NODE_ENV === "development" && (
          <Link className="studio-link" href="/studio">
            Open editor <span aria-hidden="true">↗</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>{site.name} · An independent publication</span>
      <span>
        Made with <a href="https://github.com/CaveatJS/site">Caveat</a>
      </span>
    </footer>
  );
}

export function DateLabel({ date }: { date: string }) {
  return (
    <time dateTime={date}>
      {new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
}
