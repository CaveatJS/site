import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamplePublication } from "@/components/example-publication";
import { getExample, publicationExamples } from "@/lib/examples";

export function generateStaticParams() {
  return publicationExamples.flatMap(({ slug, posts }) =>
    posts.map((post) => ({ slug, post: post.slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}): Promise<Metadata> {
  const { slug, post } = await params;
  const example = getExample(slug);
  const story = example?.posts.find((item) => item.slug === post);
  return {
    title: story ? `${story.title} — ${example?.name}` : "Story not found",
    description: story?.excerpt,
  };
}
export default async function ExampleStory({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}) {
  const { slug, post } = await params;
  const example = getExample(slug);
  const story = example?.posts.find((item) => item.slug === post);
  if (!example || !story) notFound();
  return <ExamplePublication example={example} post={story} />;
}
