import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell, ProductInvitation } from "@/components/product-shell";
import { ComparisonTable, ReadingPreview } from "./comparison";
import styles from "./compare.module.css";

export const metadata: Metadata = {
  title: "Compare Caveat",
  description:
    "Compare Caveat with Substack, Ghost, and beehiiv: writing, design, newsletter delivery, ownership, and costs.",
};

export default function Compare() {
  return (
    <ProductShell current="compare">
      <section className={styles.hero} aria-labelledby="compare-title">
        <div>
          <p className="eyebrow">Caveat, in good company</p>
          <h1 id="compare-title">
            Your words.
            <br />
            Your readers.
            <br />
            <em>Your call.</em>
          </h1>
          <p className={styles.intro}>
            A place to write, a website to make your own, and a letter straight
            to your readers. See how Caveat compares with Substack, Ghost, and
            beehiiv.
          </p>
          <div className={styles.actions}>
            <a className="button primary" href="#comparison">
              Compare the details
            </a>
            <Link href="/create">Start with Caveat</Link>
          </div>
          <p className={styles.heroNote}>
            Open-source software. Your hosting. Your publication.
          </p>
        </div>
        <ReadingPreview />
      </section>
      <section
        className={styles.highlights}
        aria-label="What is included in Caveat"
      >
        <article>
          <span className={styles.kicker}>A calmer writing workflow</span>
          <h2>
            Find the words.
            <br />
            Keep the flow.
          </h2>
          <p>
            Write directly in rich text, with autosave and private revisions.
            Add callouts, quotes, buttons, and link cards as your letter takes
            shape.
          </p>
        </article>
        <article>
          <span className={styles.kicker}>From your desk to their inbox</span>
          <h2>
            Send with
            <br />a little more care.
          </h2>
          <p>
            Connect Resend, preview your newsletter, send yourself a test, and
            confirm your audience before sending.
          </p>
        </article>
        <article>
          <span className={styles.kicker}>Room to make it yours</span>
          <h2>
            Your style.
            <br />
            Your next chapter.
          </h2>
          <p>
            Explore six example designs, choose your type and accent colour, or
            copy a design prompt for your AI coding tool. Edit the React and CSS
            to make the layout your own.
          </p>
        </article>
      </section>
      <section
        id="comparison"
        className={styles.comparison}
        aria-labelledby="comparison-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className="eyebrow">The practical differences</p>
            <h2 id="comparison-title">What matters to your publication?</h2>
          </div>
          <p>
            Four good tools.
            <br />
            Different things taken care of.
          </p>
        </div>
        <ComparisonTable />
        <div className={styles.sourceNote}>
          <p>
            Checked <time dateTime="2026-09-08">8 September 2026</time>. Caveat
            features reflect this application; provider features and plans can
            change. Hosting, database, and email usage are billed by your chosen
            services.
          </p>
          <details>
            <summary>Sources &amp; comparison notes</summary>
            <div>
              <p>
                Some capabilities require a paid plan or a connected service. An
                export is a copy of your data; it does not imply automatic
                migration.
              </p>
              <ul>
                <li>
                  <a href="https://substack.com/about">
                    Substack: features and fees
                  </a>
                  ;{" "}
                  <a href="https://support.substack.com/hc/en-us/articles/360037833231-Can-I-use-custom-fonts-on-Substack">
                    font choices
                  </a>
                  .
                </li>
                <li>
                  <a href="https://ghost.org/">Ghost: features</a>;{" "}
                  <a href="https://ghost.org/pricing/">plans</a>;{" "}
                  <a href="https://docs.ghost.org/newsletters">email setup</a>;{" "}
                  <a href="https://ghost.org/help/exports/">exports</a>.
                </li>
                <li>
                  <a href="https://www.beehiiv.com/pricing">
                    beehiiv: plans and features
                  </a>
                  ;{" "}
                  <a href="https://www.beehiiv.com/support/article/12258595483543-exporting-your-content-or-subscriber-data-from-beehiiv">
                    exports
                  </a>
                  .
                </li>
                <li>
                  <Link href="/docs">Caveat: the handbook</Link>.
                </li>
              </ul>
            </div>
          </details>
        </div>
      </section>
      <section className={styles.fit} aria-labelledby="fit-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className="eyebrow">A home that fits</p>
            <h2 id="fit-title">Choose what you want to own.</h2>
          </div>
        </div>
        <div className={styles.fitGrid}>
          <article className={styles.caveatFit}>
            <span className={styles.kicker}>The independent workspace</span>
            <h3>
              caveat<span aria-hidden="true">✳</span>
            </h3>
            <p>
              A focused publication you can shape yourself. Choose Caveat for
              control of the code, deployment, and connected services.
            </p>
            <p>
              Start with an example or your own brief. The copied prompt guides
              an external coding tool through creating a Caveat project and
              changing its branding and layout; copying it does not deploy a
              site or change your posts.
            </p>
            <Link href="/why-caveat">Meet Caveat</Link>
          </article>
          <article>
            <span className={styles.kicker}>The reader network</span>
            <h3>Substack</h3>
            <p>
              A hosted home with social discovery, a reader app, and paid
              subscriptions built into the platform.
            </p>
            <a href="https://substack.com/about">Explore Substack</a>
          </article>
          <article>
            <span className={styles.kicker}>The publishing business</span>
            <h3>Ghost</h3>
            <p>
              An established open-source platform with memberships, custom
              themes, and managed or self-hosted options.
            </p>
            <a href="https://ghost.org/">Explore Ghost</a>
          </article>
          <article>
            <span className={styles.kicker}>The growth toolkit</span>
            <h3>beehiiv</h3>
            <p>
              A hosted newsletter platform with recommendations, plus
              advertising and automation tools on paid plans.
            </p>
            <a href="https://www.beehiiv.com/pricing">Explore beehiiv</a>
          </article>
        </div>
        <aside className={styles.scope}>
          <h3>A small caveat.</h3>
          <p>
            This release is for one owner and one publication. Paid
            subscriptions, scheduled sends, and team collaboration are not
            included. You manage your hosting and service accounts.{" "}
            <Link href="/docs">Read the handbook</Link>.
          </p>
        </aside>
      </section>
      <ProductInvitation />
    </ProductShell>
  );
}
