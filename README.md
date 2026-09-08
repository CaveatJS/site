# Caveat

A runnable, open-source publication starter. Your website is the publication; RSS is included, and email can be added later.

![Caveat journal homepage with a featured essay, recent writing, and RSS links](https://raw.githubusercontent.com/CaveatJS/site/main/docs/screenshots/publication.png)

[Explore the editor and reading experience](#screenshots).

## Start writing

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) for your publication, or [localhost:3000/studio](http://localhost:3000/studio) for the editor. The terminal prints the port if 3000 is already in use.

In the editor, create a post, enter a title and some writing, then choose **Save draft** or **Publish to website**. Format headings, emphasis, lists, and links directly in the writing area; the page stays editable as you work. Publication here means updating your local website; deploy again to update a hosted copy.

## What's included

- A responsive publication homepage, article pages, and about page.
- A local browser editor with in-place rich-text formatting, draft/published status, and multiple author credits.
- Posts saved as portable `.md` files in `content/posts`. They survive restarts and can be edited directly in your favourite editor.
- An RSS feed at `/rss.xml`, with drafts excluded from public pages and the feed.
- Sample essays and a private draft to help you get started.

Edit `site.config.ts` to change the publication name, author, description, and about text. Edit `app/globals.css` for colours, typography, and layout. Replace or remove the sample Markdown files when you're ready.

## Build and deploy

```sh
npm run build
npm start
```

Set `SITE_URL` to your public domain before building so RSS and canonical links point to the right place. `.env.example` shows the setting. Deploy this project to a host supporting Next.js, such as Vercel, with `npm run build` as the build command.

The editor and its write API are **development-only** and are unavailable in production. The development server binds to your computer's loopback interface. Public production pages contain the posts included at build time. Edit locally, then commit and redeploy to publish changes online.

This first release does not include a hosted editor, subscriber database, email delivery, or authentication. It requires no database or email credentials to run. Keep drafts out of a public Git repository if their source text is confidential; excluding drafts from the website does not hide the repository's files.

## Repository layout

- `site` (this repository): the complete starter application.
- [caveat-create](https://github.com/CaveatJS/caveat-create): the npm CLI that installs a pinned version of this application and its dependencies.

## Checks

```sh
npm test
npm run build
```

## Screenshots

Captured from the local Markdown starter with its bundled sample posts.

### Write and manage posts

Keep drafts and published essays together. Format your writing directly on the page, with headings, emphasis, lists, links, and undo. Edit author credits, publication date, and post URL in the browser.

![Caveat rich-text editor with formatted headings, a quotation, and the Hugeicons formatting toolbar](https://raw.githubusercontent.com/CaveatJS/site/main/docs/screenshots/editor.png)

### Give every essay a home

A dedicated reading page brings together the title, description, author, date, reading time, and article text.

![Caveat article page with its title, author, reading time, and essay typography](https://raw.githubusercontent.com/CaveatJS/site/main/docs/screenshots/article.png)

## Newsletter designs

Open /examples to preview eight newsletter designs and 104 reading fonts. In the local editor, choose **Newsletter designs**, preview a font, then choose **Use this design**. This changes your publication layout, palette, and reading font, including the editor; existing writing stays in place. The selection is saved to content/appearance.json and is included when you deploy the project. Public deployments allow previews but cannot write to your local project.

The font picker includes the full 100-family library, Radley, Radio Canada Big, and two system stacks (Palatino and Modern). Your seven favourites appear first, with search and category buttons for the complete library. Downloadable fonts are self-hosted, with licences in public/fonts.
