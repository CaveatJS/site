import { Header, Footer } from "@/components/shell";
import { site } from "@/site.config";
export const metadata = { title: "About" };
export default function About() {
  return (
    <div className="site-wrap">
      <Header />
      <main id="main" className="about-page">
        <p className="eyebrow">About the publication</p>
        <h1>A little context.</h1>
        <div className="prose">
          <p>{site.about}</p>
          <h2>Stay in the conversation</h2>
          <p>
            You can follow every new piece through our{" "}
            <a href="/rss.xml">RSS feed</a>. No algorithm, just the writing.
          </p>
        </div>
        <p className="about-signature">
          {site.author}
          <span aria-hidden="true">*</span>
        </p>
      </main>
      <Footer />
    </div>
  );
}
