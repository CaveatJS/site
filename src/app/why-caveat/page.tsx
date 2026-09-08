import { LinkArrow } from "@/components/link-arrow";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell, ProductInvitation } from "@/components/product-shell";

export const metadata: Metadata = {
  title: "Why Caveat",
  description:
    "A simple place to write, publish, and send a newsletter on infrastructure you own.",
};

export default function WhyCaveat() {
  return (
    <ProductShell current="why">
      <section className="product-hero why-hero">
        <div>
          <p className="eyebrow">Why we are building Caveat</p>
          <h1>
            Good writing deserves
            <br />a home <em>of its own.</em>
          </h1>
          <p>
            A place for the letters you keep meaning to write. A website that
            feels like you. And the freedom to shape what comes next.
          </p>
          <Link href="/docs" className="product-text-link">
            See how it works <LinkArrow direction="right" />
          </Link>
        </div>
        <aside className="why-note" aria-label="The idea behind Caveat">
          <span className="eyebrow">A note to ourselves</span>
          <p>Opening your publication should feel like opening a notebook.</p>
          <p>
            There is a page.
            <br />
            There is something to say.
            <br />
            <em>That is enough to begin.</em>
          </p>
          <span className="why-signature">
            The idea behind Caveat <span aria-hidden="true">✳</span>
          </span>
        </aside>
      </section>
      <section className="why-principles" aria-label="What matters to us">
        <article>
          <p className="eyebrow">Room to write</p>
          <h2>Three places. Easy to find.</h2>
          <p>
            Posts for your writing. Subscribers for your readers. Settings for
            the personal touches. Drafts save as you go, so you can keep your
            attention on the next sentence.
          </p>
          <div className="workspace-tabs" aria-label="Dashboard sections">
            <span>Posts</span>
            <span>Subscribers</span>
            <span>Settings</span>
          </div>
        </article>
        <article>
          <p className="eyebrow">A deliberate send</p>
          <h2>Publish when you are ready.</h2>
          <p>
            Put a piece on your website, then decide whether to send it as a
            newsletter. Preview the email, send yourself a test, and check the
            recipient count before it leaves.
          </p>
          <p className="why-detail">
            Editing a published post keeps the live version in place until you
            publish again.
          </p>
        </article>
        <article>
          <p className="eyebrow">Something of your own</p>
          <h2>Your publication, in your hands.</h2>
          <p>
            The application runs in your Vercel account. Posts live in your
            database. Subscriber contacts live in your Resend account. Export
            your writing and subscriber list whenever you need them.
          </p>
          <p className="why-detail">
            You manage the connected services, their bills, updates, and
            backups.
          </p>
        </article>
        <article>
          <p className="eyebrow">A little character</p>
          <h2>Let it sound and look like you.</h2>
          <p>
            Choose a reading typeface, set an accent colour, and give your
            publication a name. The website comes with an archive, an about
            page, and an RSS feed. Add a custom domain when you want one.
          </p>
          <Link href="/docs#appearance" className="product-text-link">
            Make it yours <LinkArrow direction="right" />
          </Link>
        </article>
      </section>
      <section className="why-scope">
        <div>
          <p className="eyebrow">The first release</p>
          <h2>A small, useful beginning.</h2>
        </div>
        <div>
          <p>
            Caveat is for one person running one publication. Writing, a public
            website, and email are the focus. Paid subscriptions, scheduling,
            and team collaboration are not included.
          </p>
          <p>
            If your publication needs those today, another tool may fit better.
            Our comparison makes those differences clear.
          </p>
          <Link className="product-text-link" href="/compare">
            Find the right fit <LinkArrow direction="right" />
          </Link>
        </div>
      </section>
      <ProductInvitation />
    </ProductShell>
  );
}
