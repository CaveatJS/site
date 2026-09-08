# Contributing to Caveat

## Add an example publication

The examples gallery welcomes new designs. Start with a GitHub issue if you have an idea, screenshots, or a working preview. Use the **Example publication** issue form, or the **Submit an example on GitHub** button on `/examples`. Include the intended audience, layout, fonts, palette, your author credit, and asset licences. An issue is a proposal; it does not publish a design to the gallery.

To contribute a working example:

1. Fork the repository and run `npm install` followed by `npm run dev` with Node.js 22.12 or newer.
2. Add one `PublicationExample` entry in `src/lib/examples.ts`. Use a unique lowercase, hyphenated `slug`, your name in `credit`, a fictional publication name and author, a design description, a supported font ID, six palette values, and three short fictional stories. Each story needs its own slug, title, category, excerpt, and paragraphs.
3. The gallery, design chooser, copied prompts, example homepage, and story routes use this entry automatically. There is no separate route registration or database seed.
4. Add your layout rules to `src/app/examples/examples.css`, scoped to `.example-your-slug`. Extend `src/components/example-publication.tsx` only if the design needs new markup. Keep other designs intact. Font IDs come from `src/lib/google-fonts.json` and `src/lib/publication-fonts.ts`.
5. Check the full example, story pages, gallery thumbnail, and create-page selection at desktop and mobile widths. Keep links keyboard accessible. Use licensed assets and include their attribution; no private posts, subscriber data, tracking scripts, or remote executable templates.
6. Run `npm run typecheck`, `npm test`, and `npm run build`. Open a pull request with screenshots, a short explanation, and the checks you ran.

Accepted example code is contributed under the repository's MIT licence. Keep third-party asset licences alongside those assets. Maintainers review the design, accessibility, rendering, and licences before merging. Approved designs ship with the application, with creator credit in the gallery and example footer.

The examples are design references with fictional content. Choosing one prepares an AI coding prompt that asks for a new Caveat project or changes to an existing project's public React/CSS. It does not clone the fictional stories into a publication or automatically deploy the design. A custom brief can request typography, colours, layout, and branding; the generated prompt keeps existing posts, subscribers, authentication, and email sending intact.

## Contributing newsletter components

The starter catalogue at `/components` is maintained in source control. It currently contains five Caveat-authored blocks. Community submissions begin as issues or pull requests; there is no remote package installation or runtime marketplace.

Include a name, author credit, purpose, compatible licence, editable fields, and example content. Prefer a useful, readable block that degrades gracefully in email over a complex layout.

- `src/lib/newsletter-components.ts` defines the catalogue, validated attributes, and static DOM output. Every rendered URL must pass the URL validator. Do not add raw HTML or executable code attributes.
- `src/lib/newsletter-component-extension.ts` registers the shared Tiptap node. Preserve existing names and attributes: saved posts must remain readable after an upgrade.
- `src/components/component-picker.tsx` provides insertion and field editing. Add any new fields to the typed field map and validation.
- `src/lib/content.ts` is the sanitised renderer used by public pages, RSS, and email. Only add the smallest tag/attribute/style allowlist needed by a reviewed component.
- `tests/components.test.ts` covers rendering and untrusted data. Check insert, edit, undo, delete, autosave, reopening, private preview, published output, and post export for new node types.

Supply desktop and mobile previews. Send a test through your own verified email connection and report which inboxes you checked. Browser HTML checks alone are not proof of rendering in every email client. Use no subscriber data in fixtures.

Run `npm run typecheck`, `npm test`, and `npm run build`. Contributions are reviewed and shipped with the app so owners can inspect the source before upgrading.

## Custom publication designs

The application is editable React and CSS. Put scoped public-site overrides in `src/themes/custom.css`. The examples at `/examples` include colour starters and prompts; complete example layouts live in `src/components/example-publication.tsx` and `src/app/examples/examples.css`.

Keep the existing Prisma queries, owner checks, published snapshots, subscription forms, and email-send confirmation flow when changing public layouts. Do not copy fictional example stories into an owner's database.
