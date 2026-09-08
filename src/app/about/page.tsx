import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicationFrame } from "@/components/publication";
export const dynamic = "force-dynamic";
export default async function About() {
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication) notFound();
  return (
    <PublicationFrame publication={publication}>
      <article className="reading">
        <p className="eyebrow">About this publication</p>
        <h1>{publication.name}</h1>
        <p className="prose">{publication.description}</p>
        <p className="byline">Written by {publication.author}.</p>
      </article>
    </PublicationFrame>
  );
}
