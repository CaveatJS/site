import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { Header, Footer, DateLabel } from "@/components/shell";
import { getPosts, readTime } from "@/lib/posts.mjs";

// New posts must be reachable immediately after publishing in the local editor.
// The lookup below still rejects drafts and unknown slugs.
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}
async function findPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await findPost((await params).slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
  };
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await findPost((await params).slug);
  if (!post) notFound();
  return (
    <div className="site-wrap">
      <Header />
      <main id="main" className="article-page">
        <Link className="back-link" href="/">
          ← Back to the journal
        </Link>
        <article>
          <header className="article-header">
            <div className="post-meta">
              <DateLabel date={post.date} />
              <span>{readTime(post.body)}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="article-deck">{post.description}</p>
            <p className="article-byline">By {post.authors.join(" & ")}</p>
          </header>
          <div className="prose">
            <Markdown>{post.body}</Markdown>
          </div>
          <div className="article-end">
            <span className="asterisk" aria-hidden="true">
              *
            </span>
            <Link href="/">Explore the journal →</Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
