export const escapeXml = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );

export function renderFeed(site, posts) {
  const url = site.url.replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(site.name)}</title><link>${escapeXml(url)}</link>
<description>${escapeXml(site.description)}</description>
<atom:link href="${escapeXml(url)}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
  .filter((post) => post.published)
  .map(
    (post) => `<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(url)}/posts/${post.slug}</link>
<guid isPermaLink="true">${escapeXml(url)}/posts/${post.slug}</guid>
<description>${escapeXml(post.description)}</description>
<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
</item>`,
  )
  .join("\n")}
</channel></rss>`;
}
