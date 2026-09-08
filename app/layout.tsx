import type { Metadata } from "next";
import { site } from "@/site.config";
import "./globals.css";
import "./newsletter-fonts.css";
import "./newsletter-designs.css";
import { readAppearance } from "@/lib/appearance";
import { getDesign, designStyle } from "@/lib/newsletter-designs";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appearance = await readAppearance();
  const design = getDesign(appearance.design)!;
  return (
    <html lang="en">
      <body style={designStyle(design, appearance.font)}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
