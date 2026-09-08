import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamplePublication } from "@/components/example-publication";
import { getExample, publicationExamples } from "@/lib/examples";

export function generateStaticParams() {
  return publicationExamples.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const example = getExample((await params).slug);
  return {
    title: example ? `${example.name} — example blog` : "Example not found",
    description: example?.description,
  };
}
export default async function Example({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const example = getExample((await params).slug);
  if (!example) notFound();
  return <ExamplePublication example={example} />;
}
