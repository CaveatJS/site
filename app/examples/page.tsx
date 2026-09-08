import type { Metadata } from "next";
import { Header, Footer } from "@/components/shell";
import { DesignGallery } from "@/components/design-gallery";
import { readAppearance } from "@/lib/appearance";
export const metadata: Metadata = { title: "Newsletter designs" };
export default async function Examples() {
  return (
    <div className="site-wrap design-page">
      <Header />
      <main id="main">
        <section className="design-intro">
          <p className="eyebrow">A place for your kind of writing</p>
          <h1>
            Find your letter’s
            <br />
            <em>natural voice.</em>
          </h1>
          <p>
            Eight beginnings. A few lovely typefaces. Choose a newsletter, make
            it your own, and keep writing.
          </p>
        </section>
        <DesignGallery appearance={await readAppearance()} />
      </main>
      <Footer />
    </div>
  );
}
