import { LinkArrow } from "@/components/link-arrow";
import Link from "next/link";
import { Logo } from "./ui";

type ProductPage =
  "create" | "compare" | "why" | "docs" | "examples" | "components";
const links = [
  { page: "examples", href: "/examples", label: "Examples" },
  { page: "components", href: "/components", label: "Components" },
  { page: "why", href: "/why-caveat", label: "Why Caveat" },
  { page: "compare", href: "/compare", label: "Compare" },
  { page: "docs", href: "/docs", label: "Docs" },
] as const;

export function ProductHeader({ current }: { current: ProductPage }) {
  return (
    <header className="product-header">
      <Logo href="/create" />
      <nav aria-label="Caveat">
        {links.map(({ page, href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={current === page ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        {current !== "create" && (
          <Link className="button primary product-start" href="/create">
            Get started{" "}
            <span aria-hidden="true">
              <LinkArrow />
            </span>
          </Link>
        )}
      </nav>
    </header>
  );
}

export function ProductFooter() {
  return (
    <footer className="product-footer">
      <p>A little space for your next good idea.</p>
      <nav aria-label="Caveat resources">
        <Link href="/examples">Examples</Link>
        <Link href="/components">Components</Link>
        <Link href="/why-caveat">Why Caveat</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/docs">Documentation</Link>
        <a href="https://github.com/CaveatJS/site">
          GitHub <LinkArrow />
        </a>
      </nav>
    </footer>
  );
}

export function ProductShell({
  current,
  children,
}: {
  current: ProductPage;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="product-page">
      <ProductHeader current={current} />
      {children}
      <ProductFooter />
    </main>
  );
}

export function ProductInvitation() {
  return (
    <section className="product-invitation">
      <div>
        <p className="eyebrow">Make room for the writing</p>
        <h2>Your next letter starts here.</h2>
      </div>
      <Link href="/create" className="button primary">
        Create your newsletter{" "}
        <span aria-hidden="true">
          <LinkArrow />
        </span>
      </Link>
    </section>
  );
}
