import { getPosts } from "@/lib/posts.mjs";
import { renderFeed } from "@/lib/feed.mjs";
import { site } from "@/site.config";
export const dynamic = "force-static";
export async function GET() {
  return new Response(renderFeed(site, await getPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
