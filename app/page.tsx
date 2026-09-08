import Link from "next/link";
import { Header, Footer, DateLabel } from "@/components/shell";
import { getPosts, readTime } from "@/lib/posts.mjs";
import { site } from "@/site.config";

export default async function Home() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;
  return (
    <div className="site-wrap">
      <Header />
      <main id="main">
        <section className="journal-intro">
          <p className="eyebrow">The journal</p>
          <h1>{site.tagline}</h1>
          <p>{site.description}</p>
        </section>
        {featured ? (
          <section className="journal-grid" aria-label="Latest writing">
            <div className="writing-column">
              <article className="featured-post">
                <div className="post-meta">
                  <span className="label-dot">Latest essay</span>
                  <DateLabel date={featured.date} />
                </div>
                <Link href={`/posts/${featured.slug}`} className="article-link">
                  <h2>{featured.title}</h2>
                  <p>{featured.description}</p>
                  <span className="read-link">
                    Read the essay <span aria-hidden="true">↗</span>
                  </span>
                </Link>
                <div className="post-credit">
                  <span>{featured.authors.join(" & ")}</span>
                  <span>{readTime(featured.body)}</span>
                </div>
              </article>
              <div className="archive-heading">
                <h2>More from the journal</h2>
                <span>
                  {rest.length} {rest.length === 1 ? "essay" : "essays"}
                </span>
              </div>
              {rest.length ? (
                rest.map((post) => (
                  <article key={post.slug} className="post-row">
                    <div className="post-meta">
                      <DateLabel date={post.date} />
                      <span>{readTime(post.body)}</span>
                    </div>
                    <Link href={`/posts/${post.slug}`} className="article-link">
                      <h3>
                        {post.title}
                        <span aria-hidden="true">↗</span>
                      </h3>
                      <p>{post.description}</p>
                    </Link>
                    <p className="row-author">{post.authors.join(" & ")}</p>
                  </article>
                ))
              ) : (
                <p className="muted">More writing will appear here.</p>
              )}
            </div>
            <aside className="margin-note">
              <span className="asterisk" aria-hidden="true">
                *
              </span>
              <h2>A note in the margin</h2>
              <p>{site.about}</p>
              <Link href="/about">
                About this publication <span aria-hidden="true">↗</span>
              </Link>
              <div className="feed-note">
                <h3>Keep reading.</h3>
                <p>Follow new essays in your favourite feed reader.</p>
                <a href="/rss.xml">
                  Get the RSS feed <span aria-hidden="true">↗</span>
                </a>
              </div>
            </aside>
          </section>
        ) : (
          <section className="empty-state">
            <h2>A new page.</h2>
            <p>The first essay is on its way.</p>
            {process.env.NODE_ENV === "development" && (
              <Link className="button" href="/studio">
                Write your first post
              </Link>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
