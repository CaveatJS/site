import Link from "next/link";
import { Header, Footer } from "@/components/shell";
export default function NotFound() {
  return (
    <div className="site-wrap">
      <Header />
      <main id="main" className="empty-state">
        <p className="eyebrow">Page not found</p>
        <h1>A loose leaf.</h1>
        <p>This page is unavailable or hasn’t been published.</p>
        <Link className="button" href="/">
          Back to the journal
        </Link>
      </main>
      <Footer />
    </div>
  );
}
