import { LinkArrow } from "@/components/link-arrow";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "@/components/product-shell";
import { submitExampleUrl } from "@/lib/example-contributions";

export const metadata: Metadata = {
  title: "Getting started",
  description:
    "A short guide to setting up Caveat, writing your first post, choosing fonts, connecting email, and recovering your account.",
};
const sections = [
  ["getting-started", "Get started"],
  ["setup-key", "Find your setup key"],
  ["writing", "Write and publish"],
  ["appearance", "Make it yours"],
  ["custom-design", "Custom designs"],
  ["contribute-examples", "Share an example"],
  ["components", "Newsletter components"],
  ["email", "Connect email"],
  ["your-data", "Keep your data"],
  ["help", "Get unstuck"],
] as const;

export default function Docs() {
  return (
    <ProductShell current="docs">
      <section className="product-hero docs-hero">
        <p className="eyebrow">The small handbook</p>
        <h1>
          From a blank page
          <br />
          <em>to your first letter.</em>
        </h1>
        <p>
          Just what you need to get comfortable. You can write and publish to
          the web before connecting email.
        </p>
      </section>
      <div className="docs-layout">
        <aside className="docs-toc">
          <p className="eyebrow">In this guide</p>
          <nav aria-label="Documentation sections">
            {sections.map(([id, title]) => (
              <a key={id} href={`#${id}`}>
                {title}
              </a>
            ))}
          </nav>
          <a
            className="docs-source"
            href="https://github.com/CaveatJS/site#readme"
          >
            Developer README <LinkArrow />
          </a>
        </aside>
        <div className="docs-content">
          <section id="getting-started">
            <h2>Get started.</h2>
            <p>
              Start at <Link href="/create">Create your newsletter</Link> to
              choose an example or write your own design brief. Copy the prompt
              into your AI coding tool and review the result. For the standard
              theme, choose <strong>Deploy default Caveat</strong> on that page.
            </p>
            <ol>
              <li>
                Connect your Git account and add Prisma Postgres during
                deployment.
              </li>
              <li>
                Set two different private values, at least 32 characters each,
                for <code>BETTER_AUTH_SECRET</code> and{" "}
                <code>CAVEAT_SETUP_KEY</code>. Save them in your password
                manager.
              </li>
              <li>
                Open your deployed website. Enter your setup key, name, email,
                and a password of at least 12 characters.
              </li>
              <li>
                Give your publication a name, description, and author. Start
                writing.
              </li>
            </ol>
            <p>
              Your Vercel web address works immediately. A custom domain and
              email sending can come later.
            </p>
            <details>
              <summary>
                Run a downloaded Caveat project on your computer
              </summary>
              <div>
                <p>
                  Install Node.js 22.12 or newer. In your project folder, run:
                </p>
                <pre>
                  <code>{"npm install\nnpm run dev"}</code>
                </pre>
                <p>
                  Open <a href="http://localhost:3000">localhost:3000</a>.
                  Caveat starts a local database and saves your private
                  installation keys in <code>.env</code>. This local site is
                  only for your computer; deploy it to share it publicly.
                </p>
              </div>
            </details>
          </section>
          <section id="setup-key">
            <h2>Find your setup key.</h2>
            <p>
              The setup key proves you own this installation. You use it once to
              create the owner account. After that, sign in with your email and
              password.
            </p>
            <dl className="docs-definitions">
              <div>
                <dt>Running locally</dt>
                <dd>
                  Open the <code>.env</code> file in your Caveat project. Copy
                  the value after <code>CAVEAT_SETUP_KEY=</code>, leaving out
                  any surrounding quotes.
                </dd>
              </div>
              <div>
                <dt>Deployed on Vercel</dt>
                <dd>
                  Open your project’s{" "}
                  <strong>Settings → Environment Variables</strong> and find{" "}
                  <code>CAVEAT_SETUP_KEY</code>. Use the value you saved during
                  deployment. If you change it, redeploy before using it.
                </dd>
              </div>
            </dl>
            <p className="docs-callout">
              The setup key is private. Do not put it in a public post or share
              it with readers. Once an owner exists, the key cannot create
              another account.
            </p>
          </section>
          <section id="writing">
            <h2>Write and publish.</h2>
            <p>
              Open <strong>Posts → New post</strong>. Add a title and write in
              the editor. Use the toolbar for headings, lists, links, and
              emphasis. Wait for <strong>All changes saved</strong> before
              closing the page.
            </p>
            <dl className="docs-definitions">
              <div>
                <dt>Edit in place</dt>
                <dd>
                  Your writing is formatted as you type, using your chosen
                  reading style. Click straight into a heading or paragraph to
                  edit it.
                </dd>
              </div>
              <div>
                <dt>Publish to website</dt>
                <dd>
                  Make the saved version public on your site and RSS feed. This
                  does not send an email.
                </dd>
              </div>
              <div>
                <dt>Send newsletter</dt>
                <dd>
                  Preview the saved draft as an email, send yourself a test, and
                  confirm the recipient count before sending.
                </dd>
              </div>
            </dl>
            <p>
              Edits to a published post stay private until you publish again.
              Website publishing and newsletter sending are separate decisions.
            </p>
          </section>
          <section id="appearance">
            <h2>Make it yours.</h2>
            <p>
              In <strong>Settings</strong>, change your publication name,
              description, author, and accent colour. Under{" "}
              <strong>Reading typeface</strong>, try a font in the live preview
              and choose <strong>Save changes</strong> to apply it to the
              website.
            </p>
            <p>
              Browse 100 Google Fonts, including Lora, Inter, Newsreader, and DM
              Sans, or keep one of the two original styles. Start with
              Recommended, search by name, or filter by category. Preview a
              typeface and select Use, then save your settings. The choice also
              appears in the editor as you write.
            </p>
            <p>
              Email uses a familiar reading font for compatibility with inboxes.
              Your website font selection does not change email typography.
            </p>
            <details>
              <summary>Add a custom domain</summary>
              <div>
                <p>
                  In Vercel, open <strong>Settings → Domains</strong>, add your
                  domain, and follow the DNS instructions. Set{" "}
                  <code>BETTER_AUTH_URL</code> to the full HTTPS address, then
                  redeploy.
                </p>
              </div>
            </details>
          </section>
          <section id="custom-design">
            <h2>Your styles are editable.</h2>
            <p>
              Fonts and the accent colour are available in Settings. For a
              different visual style, edit <code>src/themes/custom.css</code>.
              For a different layout, edit the React components in your own
              project.
            </p>
            <p>
              Choose from six <Link href="/examples">example blogs</Link>, then
              select <strong>Use this design</strong> to personalise a prompt.
              You can also{" "}
              <Link href="/create?example=custom#design-brief">
                write your own design brief
              </Link>
              . Add your publication name, author, and the changes you want.
              Choose whether you are starting a new site or editing an existing
              one.
            </p>
            <p>
              The prompt asks your AI coding tool to initialise Caveat with{" "}
              <code>npm create caveat@latest</code> when needed, then change the
              public layout, fonts, colours, and branding. It keeps your posts,
              subscribers, sign-in, and email sending intact. Copying it does
              not run AI or deploy a site: paste it into your coding tool and
              review the local result first.
            </p>
            <details>
              <summary>Where to change the design</summary>
              <div>
                <dl className="docs-definitions">
                  <div>
                    <dt>Colours & spacing</dt>
                    <dd>
                      <code>src/themes/custom.css</code> loads after the
                      defaults. Scope rules to <code>.publication-site</code>.
                      Use the example CSS tokens to change background, text,
                      surfaces, borders, and content width.
                    </dd>
                  </div>
                  <div>
                    <dt>Header & footer</dt>
                    <dd>
                      Edit <code>src/components/publication.tsx</code>.
                    </dd>
                  </div>
                  <div>
                    <dt>Home & stories</dt>
                    <dd>
                      Edit <code>src/app/page.tsx</code> and{" "}
                      <code>src/app/p/[slug]/page.tsx</code>. Keep the existing
                      database queries and published-content checks.
                    </dd>
                  </div>
                  <div>
                    <dt>Archive & about</dt>
                    <dd>
                      Edit <code>src/app/archive/page.tsx</code> and{" "}
                      <code>src/app/about/page.tsx</code> to complete the
                      design.
                    </dd>
                  </div>
                </dl>
                <p>
                  Custom CSS affects the public website. The editor’s private
                  preview uses the standard reading layout; check your site on a
                  separate development deployment for a full custom-theme
                  preview.
                </p>
              </div>
            </details>
            <details>
              <summary>Can I use other React components?</summary>
              <div>
                <p>
                  Yes, adapt the React code or use an integration prompt in your
                  project. Caveat currently uses plain CSS; some component
                  libraries expect Tailwind and shadcn, so translate their
                  styles or deliberately add those dependencies.
                </p>
                <p>
                  Keep the publication’s data loading, subscription form, and
                  owner protections connected. Prompts run in your coding tool;
                  Caveat does not include a built-in AI design editor.
                </p>
              </div>
            </details>
          </section>
          <section id="contribute-examples">
            <h2>Share a design with other writers.</h2>
            <p>
              <a href={submitExampleUrl} target="_blank" rel="noreferrer">
                Submit an example on GitHub <LinkArrow />
              </a>{" "}
              with a name, design description, screenshots or a preview link,
              your creator credit, and any asset licences. An idea is welcome
              before the code is ready.
            </p>
            <p>
              For a working contribution, fork the Caveat repository and add an
              entry to <code>src/lib/examples.ts</code> with a unique slug, your{" "}
              <code>credit</code>, a font, a palette, and three fictional
              stories. The gallery, create-page chooser, prompt, homepage, and
              story routes all use that entry.
            </p>
            <p>
              Add scoped layout rules to{" "}
              <code>src/app/examples/examples.css</code>. Check desktop, mobile,
              keyboard navigation, and the build, then open a pull request with
              screenshots. See <code>CONTRIBUTING.md</code> in the project for
              the full workflow.
            </p>
            <p>
              Community submissions are reviewed before joining the gallery.
              Approved examples ship with Caveat and credit their creators.
            </p>
          </section>
          <section id="components">
            <h2>Add a component to your letter.</h2>
            <ol>
              <li>In a post, place the cursor where you want the block.</li>
              <li>
                Choose <strong>Insert component</strong> in the editor toolbar.
              </li>
              <li>
                Pick a callout, pull quote, button, link card, or divider. Edit
                its fields and choose <strong>Insert into draft</strong>.
              </li>
              <li>
                Wait for <strong>All changes saved</strong>. Review the
                formatted draft or email as usual.
              </li>
            </ol>
            <p>
              To change an existing block, click it, then choose{" "}
              <strong>Edit component</strong>. A selected block can be removed
              with Backspace or Delete. Undo works too.
            </p>
            <p>
              Components are stored with the draft and exported with the post.
              They render to static HTML for both your website and email. A
              button opens a link; an interactive React widget does not run in
              an inbox.
            </p>
            <p>
              Browse previews in the{" "}
              <Link href="/components">component library</Link>. The first five
              blocks are by Caveat; community contributions are welcome.
            </p>
            <details>
              <summary>Contribute a community component</summary>
              <div>
                <p>
                  Propose it through the{" "}
                  <a href="https://github.com/CaveatJS/site/issues/new">
                    project repository
                  </a>
                  , or submit a pull request following{" "}
                  <code>CONTRIBUTING.md</code>. Include author credit, a
                  licence, editable fields, and previews of web and email
                  output.
                </p>
                <p>
                  Definitions live in{" "}
                  <code>src/lib/newsletter-components.ts</code>. A shared Tiptap
                  node and static renderer keep the editor, public pages,
                  exports, and emails consistent. Contributions are reviewed and
                  included in an application release; components are not
                  installed from remote scripts.
                </p>
              </div>
            </details>
          </section>
          <section id="email">
            <h2>Connect email when you are ready.</h2>
            <ol>
              <li>
                Create a <a href="https://resend.com">Resend account</a> and
                verify the domain you will send from.
              </li>
              <li>
                In Caveat, open{" "}
                <strong>Settings → Letters to your readers</strong>.
              </li>
              <li>
                Enter a Resend API key with full access and your sending
                address, such as <code>letters@yourdomain.com</code>.
              </li>
              <li>
                Save changes. If verification is still pending, finish it in
                Resend, then save again to check.
              </li>
            </ol>
            <p>
              Once email is connected, readers can subscribe on your website.
              Open <strong>Subscribers</strong> to see your list. Resend handles
              subscriber contacts, delivery, and unsubscribe links.
            </p>
            <p>
              Before sending, use <strong>Send me a test</strong> to check the
              email in your own inbox. A test goes only to your sign-in email
              address.
            </p>
            <p className="docs-callout">
              If a send result is uncertain, use <strong>Check status</strong>{" "}
              and inspect the existing broadcast in Resend. Do not create a
              duplicate to retry. This release supports one newsletter send per
              post.
            </p>
          </section>
          <section id="your-data">
            <h2>Keep your data.</h2>
            <p>
              Export your posts as JSON from <strong>Posts</strong> and your
              subscriber list as CSV from <strong>Subscribers</strong>.
              Subscriber export requires a working Resend connection.
            </p>
            <p>
              Posts and settings live in your Prisma database; contacts live in
              your Resend account. Redeploying against the same database
              preserves your writing. Keep backups through your database
              provider as well as your exports.
            </p>
            <details>
              <summary>For developers: deployments and previews</summary>
              <div>
                <p>
                  Production deployments apply the checked-in Prisma migrations.
                  Give previews a separate <code>PREVIEW_DATABASE_URL</code> and
                  their own private keys. Never point a preview at your
                  production database.
                </p>
                <p>
                  Use Prisma Studio for maintenance. Daily writing and
                  publication settings belong in the Caveat dashboard. See the{" "}
                  <a href="https://github.com/CaveatJS/site#readme">README</a>{" "}
                  for environment variables, migrations, and development
                  commands.
                </p>
              </div>
            </details>
          </section>
          <section id="help">
            <h2>A few ways to get unstuck.</h2>
            <details>
              <summary>I forgot my password</summary>
              <div>
                <p>
                  Use <Link href="/forgot-password">Forgot your password?</Link>{" "}
                  on the sign-in screen. Reset emails work once Resend is
                  connected and your sending domain is verified.
                </p>
                <p>
                  Without working email, someone with deployment access can use
                  the owner recovery command described in the{" "}
                  <a href="https://github.com/CaveatJS/site#recover-owner-access">
                    README
                  </a>
                  . The setup key does not reset a password.
                </p>
              </div>
            </details>
            <details>
              <summary>The setup key does not match</summary>
              <div>
                <p>
                  Check that you copied the whole value for this installation.
                  Local and Vercel installations can have different keys. If you
                  changed an environment variable, restart the local server or
                  redeploy on Vercel.
                </p>
              </div>
            </details>
            <details>
              <summary>I cannot send a newsletter yet</summary>
              <div>
                <p>
                  Check that Settings shows <strong>Email connected</strong>.
                  Confirm your Resend key has full access and that the exact
                  domain in your sending address is verified. You can keep
                  writing and publishing to the website while setting up email.
                </p>
              </div>
            </details>
            <details>
              <summary>
                Can I charge readers, schedule posts, or invite a co-author?
              </summary>
              <div>
                <p>
                  This release supports one owner and one publication. Paid
                  subscriptions, scheduling, and collaboration are not included.
                  The <Link href="/compare">comparison page</Link> can help if
                  you need a different set of features.
                </p>
              </div>
            </details>
            <p className="docs-end">
              Found something that needs fixing?{" "}
              <a href="https://github.com/CaveatJS/site/issues">
                Open an issue on GitHub <LinkArrow />
              </a>
            </p>
          </section>
        </div>
      </div>
    </ProductShell>
  );
}
