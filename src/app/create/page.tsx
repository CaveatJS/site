import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "@/components/product-shell";
import { LinkArrow } from "@/components/link-arrow";
import { DesignStarter } from "@/components/design-starter";
import { getExample, publicationExamples } from "@/lib/examples";
import { submitExampleUrl } from "@/lib/example-contributions";

export const metadata: Metadata = {
  title: "Create your publication",
  description: `Choose one of ${publicationExamples.length} Caveat designs or write your own brief. Copy a personalised prompt to build your publication.`,
};

export default async function Create({
  searchParams,
}: {
  searchParams: Promise<{ example?: string }>;
}) {
  const requested = (await searchParams).example;
  const selected =
    requested === "custom" || (requested && getExample(requested))
      ? requested
      : undefined;
  const repo =
    process.env.CAVEAT_TEMPLATE_REPOSITORY ||
    "https://github.com/CaveatJS/site";
  const url = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repo)}&products=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522protocol%2522%253A%2522storage%2522%252C%2522productSlug%2522%253A%2522prisma-postgres%2522%252C%2522integrationSlug%2522%253A%2522prisma%2522%257D%255D&env=BETTER_AUTH_SECRET,CAVEAT_SETUP_KEY&envDescription=${encodeURIComponent("Generate a different random value of at least 32 characters for each private key. Save the setup key to create your owner account.")}`;
  return (
    <ProductShell current="create">
      <section className="product-hero create-design-hero">
        <p className="eyebrow">Your publication starts here</p>
        <h1>
          Start with a look.
          <br />
          <em>Make room for your words.</em>
        </h1>
        <p>
          Choose an example or describe your own idea. Personalise a prompt,
          then let your AI coding tool build your Caveat site.
        </p>
        <p className="create-design-note">
          {publicationExamples.length} design references. Your name, your
          writing, your direction.
        </p>
      </section>
      <DesignStarter key={selected || "choose"} initialExample={selected} />
      <section className="design-standard" id="deploy-default">
        <div>
          <p className="eyebrow">Standard Caveat setup</p>
          <h2>Ready to write with the default theme?</h2>
          <p>
            Deploy the standard Caveat template directly, then choose your font
            and accent colour in Settings. Example layouts and custom branding
            are built from the prompt in your project before you deploy.
          </p>
        </div>
        <div className="stack">
          <a className="button primary" href={url}>
            Deploy default Caveat <LinkArrow />
          </a>
          <Link className="product-text-link" href="/docs">
            Installation guide <LinkArrow direction="right" />
          </Link>
          <small>
            Uses your own Git and Vercel accounts, with Prisma Postgres for your
            publication.
          </small>
        </div>
      </section>
      <section className="design-community-note">
        <p>Made a design other writers could use?</p>
        <a
          className="product-text-link"
          href={submitExampleUrl}
          target="_blank"
          rel="noreferrer"
        >
          Submit an example on GitHub <LinkArrow />
        </a>
      </section>
    </ProductShell>
  );
}
