import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicationFrame } from "@/components/publication";
import { DateLabel } from "@/components/ui";
import { renderContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [publication, post] = await Promise.all([
    db.publication.findUnique({ where: { id: 1 } }),
    db.post.findUnique({ where: { slug } }),
  ]);
  if (!publication || !post?.publishedAt) notFound();
  return (
    <PublicationFrame publication={publication}>
      <article className="reading">
        <p className="eyebrow">
          <DateLabel date={post.publishedAt} />
        </p>
        <h1>{post.publishedTitle}</h1>
        <p className="byline">By {publication.author}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: renderContent(post.publishedContent),
          }}
        />
      </article>
    </PublicationFrame>
  );
}
