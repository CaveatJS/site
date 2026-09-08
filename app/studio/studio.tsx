"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

type Post = {
  slug: string;
  title: string;
  description: string;
  authors: string[];
  date: string;
  published: boolean;
  body: string;
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
    .replace(/-$/, "");

export default function Studio({
  initialPosts,
  publicationName,
  defaultAuthor,
}: {
  initialPosts: Post[];
  publicationName: string;
  defaultAuthor: string;
}) {
  const blank = (): Post => ({
    slug: "",
    title: "",
    description: "",
    authors: [defaultAuthor],
    date: new Date().toISOString().slice(0, 10),
    published: false,
    body: "",
  });
  const [posts, setPosts] = useState(initialPosts);
  const [post, setPost] = useState<Post>(
    initialPosts.find((p) => !p.published) || initialPosts[0] || blank(),
  );
  const [isNew, setIsNew] = useState(!initialPosts.length);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((current) => ({
      ...current,
      [key]: value,
      ...(key === "title" && isNew && !slugEdited
        ? { slug: slugify(String(value)) }
        : {}),
    }));
    setDirty(true);
    setMessage("");
    setError("");
  }

  function select(next: Post, create = false) {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setPost(next);
    setIsNew(create);
    setDirty(false);
    setMessage("");
    setError("");
    setSlugEdited(false);
    setPreview(false);
  }

  async function save(published: boolean) {
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/studio/posts", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, published }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not save. Try again.");
      setPost(result);
      setPosts((current) => [
        result,
        ...current.filter((p) => p.slug !== result.slug),
      ]);
      setIsNew(false);
      setDirty(false);
      setMessage(
        published
          ? "Published on your local website. Rebuild and deploy to update your live site."
          : "Draft saved. Only visible in this editor.",
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Could not save. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const publishedCount = posts.filter((p) => p.published).length;
  return (
    <div className="studio-shell">
      <aside className="studio-sidebar">
        <Link href="/" className="wordmark">
          {publicationName}
          <span aria-hidden="true">*</span>
        </Link>
        <div className="studio-caption">Your publication</div>
        <button
          className="button new-post"
          onClick={() => select(blank(), true)}
          disabled={saving}
        >
          + New post
        </button>
        <div className="sidebar-heading">
          <h2>All posts</h2>
          <span>{posts.length}</span>
        </div>
        <nav aria-label="Posts" className="post-navigation">
          {posts.map((item) => (
            <button
              key={item.slug}
              className={!isNew && post.slug === item.slug ? "selected" : ""}
              disabled={saving}
              onClick={() => select(item)}
            >
              <span>{item.title}</span>
              <small>
                <i
                  className={
                    item.published ? "status-dot published" : "status-dot"
                  }
                />
                {item.published ? "Published" : "Draft"}
              </small>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            {publishedCount} published · {posts.length - publishedCount} drafts
          </p>
          <Link
            href="/"
            onClick={(event) => {
              if (dirty && !window.confirm("Leave with unsaved changes?"))
                event.preventDefault();
            }}
          >
            ← View publication
          </Link>
        </div>
      </aside>
      <main id="main" className="studio-main">
        <header className="studio-toolbar">
          <div>
            <span className="editor-label">Editor</span>
            <span className="editor-status">
              {saving
                ? "Saving…"
                : dirty
                  ? "Unsaved changes"
                  : post.published
                    ? "Published"
                    : "Draft"}
            </span>
          </div>
          <div className="toolbar-actions">
            <button
              className="button ghost"
              onClick={() => setPreview(!preview)}
              aria-pressed={preview}
            >
              {preview ? "Write" : "Preview"}
            </button>
            {!post.published && (
              <button
                className="button secondary"
                disabled={saving}
                onClick={() => save(false)}
              >
                Save draft
              </button>
            )}
            <button
              className="button"
              disabled={saving}
              onClick={() => save(true)}
            >
              {post.published ? "Save changes" : "Publish to website"}
            </button>
          </div>
        </header>
        <div className="editor-notice">
          Local editor <span aria-hidden="true">·</span> Posts are saved to your
          project. Email is not connected.
        </div>
        <div className="save-feedback" aria-live="polite">
          {message && (
            <p className="success-message">
              {message}{" "}
              {post.published && (
                <a
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View post ↗
                </a>
              )}
            </p>
          )}
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
        </div>
        <div className="editor-canvas">
          {preview ? (
            <article className="editor-preview">
              <p className="eyebrow">Preview · {post.authors.join(" & ")}</p>
              <h1>{post.title || "Untitled post"}</h1>
              <p className="article-deck">{post.description}</p>
              <div className="prose">
                <Markdown>
                  {post.body || "Your writing will appear here."}
                </Markdown>
              </div>
            </article>
          ) : (
            <>
              <label className="sr-only" htmlFor="post-title">
                Title
              </label>
              <input
                id="post-title"
                className="title-input"
                placeholder="Give your idea a title"
                maxLength={200}
                value={post.title}
                onChange={(event) => update("title", event.target.value)}
                disabled={saving}
              />
              <label className="sr-only" htmlFor="post-description">
                Description
              </label>
              <textarea
                id="post-description"
                className="description-input"
                placeholder="A sentence to draw your reader in…"
                maxLength={600}
                value={post.description}
                onChange={(event) => update("description", event.target.value)}
                disabled={saving}
                rows={2}
              />
              <details className="post-details">
                <summary>
                  Post details <span>{post.authors.join(" & ")}</span>
                </summary>
                <div className="details-grid">
                  <label>
                    Authors{" "}
                    <input
                      value={post.authors.join(", ")}
                      onChange={(event) =>
                        update("authors", event.target.value.split(","))
                      }
                      disabled={saving}
                      placeholder="Separate names with commas"
                    />
                  </label>
                  <label>
                    Date{" "}
                    <input
                      type="date"
                      value={post.date}
                      onChange={(event) => update("date", event.target.value)}
                      disabled={saving}
                    />
                  </label>
                  <label className="slug-field">
                    Post URL{" "}
                    <div className="slug-input">
                      <span>/posts/</span>
                      <input
                        value={post.slug}
                        onChange={(event) => {
                          setSlugEdited(true);
                          update("slug", event.target.value);
                        }}
                        disabled={saving || !isNew}
                        placeholder="your-post-title"
                      />
                    </div>
                    <small>
                      {isNew
                        ? "Lowercase letters, numbers, and hyphens."
                        : "The URL stays fixed after the first save."}
                    </small>
                  </label>
                </div>
              </details>
              <div className="writing-label">
                <label htmlFor="post-body">Your writing</label>
                <span>Markdown · # heading · **bold** · [text](url)</span>
              </div>
              <textarea
                id="post-body"
                className="body-input"
                value={post.body}
                onChange={(event) => update("body", event.target.value)}
                disabled={saving}
                placeholder="Start with the thought you keep coming back to…"
                maxLength={100000}
                spellCheck
              />
              <div className="editor-bottom">
                <span>
                  {post.body.trim() ? post.body.trim().split(/\s+/).length : 0}{" "}
                  words
                </span>
                {post.published && (
                  <button
                    className="text-button"
                    disabled={saving}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Move this post to drafts? It will disappear from your local website.",
                        )
                      )
                        void save(false);
                    }}
                  >
                    Move to drafts
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
