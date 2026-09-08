# Caveat

A quiet place to write, publish, and send a newsletter. One publication, one owner, and infrastructure you own.

Built with Next.js, Prisma Postgres, Prisma ORM, Better Auth, Tiptap, and Resend.

## Run locally

Use Node.js **22.12 or newer**.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The dev command creates a persistent **local Prisma Postgres** database automatically, applies the checked-in migrations, and saves two private secrets in `.env`. Copy `CAVEAT_SETUP_KEY` from that file into the first-run form. Create your owner account, name your publication, and start writing. No cloud account or email configuration is needed to write and publish locally.

Local database files are stored by Prisma under its platform-specific application data directory. The name derives from this project's absolute directory, so projects do not share a database. Keep the project in the same location to retain the same development database. Test databases are disposable and separate.

If you supply `DATABASE_URL` in `.env`, local development uses that database and applies migrations to it. Use a development database, never a production connection. The app supports ordinary PostgreSQL connection strings as well as Prisma Postgres. With this driver, use the `postgres://` or `postgresql://` URL, not an Accelerate URL.

## What is included

- Owner-only setup and email/password sign-in; public registration is disabled.
- Posts, Subscribers, and Settings. Tiptap editor with autosave and conflict detection.
- Separate draft and published snapshots. Editing a published post never silently changes the live article.
- Public homepage, posts, archive, about page, RSS, and optional subscription form.
- 100 Google Fonts and two original reading styles, with search, category filters, recommended choices, and a live preview. Licensed WOFF2 files are checked into `public/fonts` and served locally; only families used on the page are downloaded by readers. Maintainers can refresh the assets with `npm run fonts:sync`.
- Resend connection checks, test emails, newsletter previews, recipient confirmation, and delivery status reconciliation.
- JSON post export and CSV subscriber export.
- npm initializer and an online installation page at `/create`, using the same application template.
- Public product pages at `/why-caveat` and `/compare`, plus a short handbook at `/docs`. The comparison links to official provider information; review it when updating the application.
- Six fictional example blogs and eighteen sample stories at `/examples`, with copyable design prompts and React/CSS starters. `/create` lets people choose a design first or write an original brief, then copy a prompt for an AI coding tool. These are static design references and never seed the owner's database. Community examples can be proposed through GitHub; see `CONTRIBUTING.md`.
- A component library at `/components` and an editor picker for callouts, quotes, buttons, link cards, and dividers. Blocks save as structured content and render to sanitised HTML for web and email. Community submissions follow [CONTRIBUTING.md](CONTRIBUTING.md).

## Custom designs

Styles are editable. Use Settings for fonts and accent colour; edit `src/themes/custom.css` for public-site overrides, or change the public React pages and `src/components/publication.tsx` for a new layout. The example pages provide prompts for external coding assistants and a map of the relevant files. Caveat uses plain CSS, so React components that depend on Tailwind/shadcn need adaptation or their dependencies installed. No AI service runs inside Caveat.

## Deploy to Vercel

1. Publish this application folder as the root of a Git repository you control, then import it into Vercel.
2. Add **Prisma Postgres** through the Vercel Storage / Marketplace integration and connect it to this project. The integration supplies `DATABASE_URL`. Use a persistent database owned by your account, not an unclaimed temporary database.
3. Set `BETTER_AUTH_SECRET` and `CAVEAT_SETUP_KEY` to **different** random strings of at least 32 characters. You can generate each with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Store the setup key in your password manager.
4. `BETTER_AUTH_URL` is the full HTTPS URL of your publication. If omitted on Vercel, the production project domain is used. For a custom domain, set this explicitly and redeploy.
5. Deploy. `vercel.json` runs `prisma generate`, `prisma migrate deploy`, then `next build`. An optional `DIRECT_URL` can supply a direct migration connection while application traffic uses a pooled `DATABASE_URL`.
6. Open the deployed website and complete the owner setup. The setup key does not reopen registration after the owner exists.

The `/create` page enables its online deployment button once `CAVEAT_TEMPLATE_REPOSITORY` contains the public HTTPS repository URL of this template. The button requests Prisma Postgres using the same integration parameters as Prisma's Vercel starter. It still requires the user's Vercel/Git account approvals and private environment values. No deployment API token is collected by Caveat.

### Preview isolation

Vercel previews deliberately **fail deployment** without `PREVIEW_DATABASE_URL`. Provision a separate database for previews; use `PREVIEW_DIRECT_URL` if a separate direct migration connection is needed. Do not give previews production database credentials, the production setup key, auth secret, or a live Resend API key. Scope these values to the appropriate Vercel environment. The runtime and migration configuration both select preview-specific connections and never fall back to production.

A fresh preview has its own owner setup. This release does not provision one database per branch automatically; use separate preview projects or databases when multiple branches must be isolated from each other.

## Connect email

In **Settings → Letters to your readers**, enter a Resend API key with full access and a sending email such as `letters@example.com`. Verify that email's exact domain in Resend, then save again to recheck the connection.

Caveat creates one Resend segment for this installation. Resend is the source of truth for subscriber contacts and unsubscribe state. Previously unsubscribed contacts are never silently reactivated by the subscribe form. The public subscribe form remains hidden until sending is configured.

The API key is encrypted at rest using `BETTER_AUTH_SECRET`; it is never returned to the browser. Keep this secret stable. If you rotate it, reconnect Resend with the API key afterwards.

**Publish to website** updates the web article only. **Send newsletter** reviews the saved draft and shows the current subscribed recipient count. **Send me a test** sends only to the owner's sign-in email. Broadcasts include Resend's recipient-specific unsubscribe link.

Caveat creates an unsent broadcast, stores its ID, and then attempts delivery once. A unique database record prevents concurrent sends of the same post. If a provider response is lost, use **Check status**. A draft or unknown provider status does not prove that delivery cannot still occur, so Caveat does not automatically resend uncertain operations. Inspect the existing broadcast in Resend before taking further action. One newsletter send per post is supported; create a new post for another issue.

Changes to content, publication settings, or the recipient count invalidate an old send confirmation. Confirmation is valid for ten minutes. Recipients may still unsubscribe between confirmation and delivery; Resend controls the final eligible audience.

Subscriber lists are paginated; this first release caps a complete dashboard/export scan at 10,000 contacts. Use Resend exports for larger lists. There is no scheduling, subscriber billing, or multi-author collaboration in this release.

## Recover owner access

If Resend is configured and verified, **Forgot your password?** sends a reset link. Without email delivery, someone with deployment/database access can recover the account:

1. Put the new password (12–128 characters) in a temporary private file. Do not pass passwords on the command line or commit the file.
2. Load the correct database connection and run:

```sh
npm run owner:recover -- /absolute/path/to/private-password-file
```

3. Delete that temporary file. Sign in with the new password.

The script changes the credential password atomically, revokes all sessions, and removes outstanding verification/reset tokens. It does not delete the owner or reopen setup. With the local dev server running and no explicit database connection, the script can use `.local/runtime.json`.

## Development and verification

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
npm audit
```

Tests use temporary local Prisma Postgres databases. Browser tests use installed Chrome on macOS or Playwright Chromium elsewhere (`npx playwright install chromium`). No test sends real emails: delivery tests substitute the Resend API and exercise the actual send-state logic and database constraints. Browser screenshots are written under `.local/screenshots`.

Core code lives in `src/lib`; HTTP operations are in `src/app/api`; the private workspace is in `src/app/dashboard`; public routes share `PublicationFrame`. The schema and checked-in SQL migrations live in `prisma`. Use Prisma Studio for maintenance, not as the publication editor.

Keep Prisma CLI/client/driver-adapter versions aligned. Dependency overrides patch audited transitive Prisma tooling dependencies; verify `npm audit`, migrations, and builds when updating them.

## Initializer and release

The initializer lives in the separate [CaveatJS/caveat-create](https://github.com/CaveatJS/caveat-create) repository. It downloads a pinned, tested commit of this application and installs its locked dependencies. There is no second implementation or unversioned template download.

After an application release, update the initializer revision, run its tests and a fresh installation, then publish its npm package. `npm create caveat@latest my-newsletter` installs the released application.

## Upgrading the alpha starter

This release replaces the development-only Markdown editor with a database-backed owner dashboard. Original sample Markdown files remain in `content/posts`; they are not automatically published or imported. Before updating an existing publication, export or retain its Markdown files and recreate the desired posts in the editor. `/studio` redirects to the new dashboard, and `/posts/:slug` redirects to `/p/:slug`; existing content must be imported with matching slugs for old article URLs to resolve. There is no automatic content migration in this release.

Local verification is not a live Vercel or Resend delivery verification. Those checks require a deployed Prisma Postgres database and a verified sending domain.
