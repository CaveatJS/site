import { notFound } from "next/navigation";
import { getPosts } from "@/lib/posts.mjs";
import { site } from "@/site.config";
import Studio from "./studio";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};
export default async function StudioPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Studio
      initialPosts={await getPosts({ includeDrafts: true })}
      publicationName={site.name}
      defaultAuthor={site.author}
    />
  );
}
