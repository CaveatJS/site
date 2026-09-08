import { db } from "@/lib/db";
import { baseUrl } from "@/lib/config";
import { escapeHtml, renderContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function GET() {
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication) return new Response("Not found", { status: 404 });
  const posts = await db.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
  const url = baseUrl();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeHtml(publication.name)}</title><link>${escapeHtml(url)}</link><description>${escapeHtml(publication.description)}</description>${posts.map((p) => `<item><title>${escapeHtml(p.publishedTitle || "")}</title><link>${escapeHtml(`${url}/p/${p.slug}`)}</link><guid isPermaLink="false">${p.id}</guid><pubDate>${p.publishedAt!.toUTCString()}</pubDate><description>${escapeHtml(renderContent(p.publishedContent))}</description></item>`).join("")}</channel></rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
