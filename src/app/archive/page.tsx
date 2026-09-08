import { LinkArrow } from "@/components/link-arrow";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicationFrame } from "@/components/publication";
import { DateLabel } from "@/components/ui";
export const dynamic = "force-dynamic";
export default async function Archive() {
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication) notFound();
  const posts = await db.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <PublicationFrame publication={publication}>
      <section className="archive-page">
        <p className="eyebrow">The collection</p>
        <h1>All the letters.</h1>
        {posts.length ? (
          posts.map((p) => (
            <Link className="archive-row" href={`/p/${p.slug}`} key={p.id}>
              <DateLabel date={p.publishedAt!} />
              <h2>{p.publishedTitle}</h2>
              <span>
                <LinkArrow />
              </span>
            </Link>
          ))
        ) : (
          <p>The first post will appear here when it is published.</p>
        )}
      </section>
    </PublicationFrame>
  );
}
