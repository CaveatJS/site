# Caveat

A runnable, open-source publication starter. Your website is the publication; RSS is included, and email can be added later.

## Start writing

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) for your publication, or [localhost:3000/studio](http://localhost:3000/studio) for the editor. The terminal prints the port if 3000 is already in use.

In the editor, create a post, enter a title and some writing, then choose **Save draft** or **Publish to website**. Preview renders your Markdown before you publish. Publication here means updating your local website; deploy again to update a hosted copy.

## What's included

- A responsive publication homepage, article pages, and about page.
- A local browser editor with Markdown preview, draft/published status, and multiple author credits.
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
