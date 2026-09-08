import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ownerPage } from "@/lib/http";
import { renderContent } from "@/lib/content";
import {
  getPublicationFont,
  publicationFontStyle,
} from "@/lib/publication-fonts";
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { publication } = await ownerPage();
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div className="preview-page">
      <p className="badge">Private draft preview</p>
      <article
        className={`reading ${getPublicationFont(publication.font).kind === "sans" ? "sans-reading" : ""}`}
        style={publicationFontStyle(publication.font)}
      >
        <p className="eyebrow">{publication.name}</p>
        <h1>{post.title || "Untitled draft"}</h1>
        <p className="byline">{publication.author}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />
      </article>
    </div>
  );
}
