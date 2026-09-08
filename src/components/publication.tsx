import Link from "next/link";
import { Subscribe } from "./subscribe";
import type { Publication } from "@/generated/prisma/client";
import {
  getPublicationFont,
  publicationFontStyle,
} from "@/lib/publication-fonts";
export function PublicationFrame({
  publication: p,
  children,
}: {
  publication: Publication;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main"
      className={`publication-site ${getPublicationFont(p.font).kind === "sans" ? "sans-reading" : ""}`}
      style={
        {
          ...publicationFontStyle(p.font),
          "--publication-accent": p.accent,
        } as React.CSSProperties
      }
    >
      <header className="public-header">
        <Link className="publication-name" href="/">
          {p.name}
        </Link>
        <nav aria-label="Publication">
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      {children}
      {p.sendingReady && (
        <section className="subscribe-block">
          <p className="eyebrow">Stay for the next letter</p>
          <h2>A little more to think about.</h2>
          <p>New writing from {p.author}, delivered to your inbox.</p>
          <Subscribe />
          <small>Unsubscribe whenever you like.</small>
        </section>
      )}
      <footer className="public-footer">
        <span>
          © {new Date().getFullYear()} {p.name}
        </span>
        <div>
          <Link href="/rss.xml">RSS</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/create">Made with Caveat ✳</Link>
        </div>
      </footer>
    </main>
  );
}
