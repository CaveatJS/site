import { LinkArrow } from "@/components/link-arrow";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db, databaseConfigured } from "@/lib/db";
import { SetupScreen } from "@/components/setup-screen";
import { PublicationFrame } from "@/components/publication";
import { DateLabel } from "@/components/ui";
import { plainText } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Home() {
  if (!databaseConfigured()) return <SetupScreen configured={false} />;
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication) return <SetupScreen />;
  const posts = await db.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  return (
    <PublicationFrame publication={publication}>
      <section className="public-intro">
        <p className="eyebrow">Letters from {publication.author}</p>
        <h1>{publication.name}</h1>
        <p>
          {publication.description ||
            "A place for ideas, observations, and things worth sharing."}
        </p>
      </section>
      <section className="public-posts">
        <div className="section-line">
          <span>Latest writing</span>
          <Link href="/archive">
            All posts <LinkArrow />
          </Link>
        </div>
        {posts.length ? (
          posts.map((post, index) => (
            <Link
              href={`/p/${post.slug}`}
              className={index === 0 ? "public-post featured" : "public-post"}
              key={post.id}
            >
              <div>
                <DateLabel date={post.publishedAt!} />
                <h2>{post.publishedTitle}</h2>
                <p>
                  {plainText(post.publishedContent).slice(0, 190)}
                  {plainText(post.publishedContent).length > 190 ? "…" : ""}
                </p>
                <span className="read-link">
                  Read the letter <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="public-empty">
            The first letter is on its way. There is always something worth
            writing about.
          </p>
        )}
      </section>
    </PublicationFrame>
  );
}
