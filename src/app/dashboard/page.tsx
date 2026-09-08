import Link from "next/link";
import {
  ArrowUpRight,
  Feather,
  Mail,
  FileText,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { ownerPage } from "@/lib/http";
import { DateLabel } from "@/components/ui";
import { NewPost } from "@/components/new-post";
export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { publication } = await ownerPage();
  const { filter } = await searchParams;
  const posts = await db.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { delivery: true },
  });
  const visible = posts.filter((p) =>
    filter === "drafts"
      ? !p.publishedAt
      : filter === "published"
        ? !!p.publishedAt
        : true,
  );
  return (
    <div className="dashboard-page">
      <header className="page-top">
        <span className="eyebrow">Your writing desk</span>
        <Link href="/" target="_blank" className="quiet">
          View publication <ArrowUpRight size={14} />
        </Link>
      </header>
      <div className="page-heading">
        <div>
          <h1>Room for your ideas.</h1>
          <p className="muted">
            A first thought, a finished essay. It all starts here.
          </p>
        </div>
        <NewPost />
      </div>
      <section className="writing-note">
        <div className="note-symbol">
          <Feather size={28} />
        </div>
        <div>
          <span className="eyebrow">Your next letter</span>
          <h2>Something worth sharing.</h2>
          <p>Find a quiet moment. Start with a sentence.</p>
        </div>
        <NewPost label="Start writing" />
      </section>
      {!publication.sendingReady && (
        <Link className="setup-nudge" href="/dashboard/settings#email">
          <Mail size={18} />
          <span>
            <strong>Ready when you are.</strong> Connect email to turn your
            readers into subscribers.
          </span>
          <ArrowRight size={18} />
        </Link>
      )}
      <div className="list-toolbar">
        <nav className="tabs" aria-label="Filter posts">
          {[
            ["", "All posts", posts.length],
            ["drafts", "Drafts", posts.filter((p) => !p.publishedAt).length],
            [
              "published",
              "Published",
              posts.filter((p) => p.publishedAt).length,
            ],
          ].map(([value, label, count]) => (
            <Link
              key={String(value)}
              className={(filter || "") === value ? "selected" : ""}
              href={value ? `?filter=${value}` : "/dashboard"}
            >
              {label}
              <span>{count}</span>
            </Link>
          ))}
        </nav>
        <a className="quiet" href="/api/export/posts">
          Export posts
        </a>
      </div>
      <div className="post-list">
        {visible.length ? (
          visible.map((p) => (
            <Link
              href={`/dashboard/posts/${p.id}`}
              key={p.id}
              className="post-row"
            >
              <span className="post-icon">
                <FileText size={20} />
              </span>
              <div className="post-info">
                <h3>{p.title || "Untitled draft"}</h3>
                <p>
                  <DateLabel date={p.updatedAt} /> · {publication.author}
                </p>
              </div>
              <span className={p.publishedAt ? "badge published" : "badge"}>
                {p.publishedAt ? "Published" : "Draft"}
              </span>
              {p.delivery && (
                <span className="quiet delivery-badge">
                  Email: {p.delivery.state}
                </span>
              )}
              <ArrowUpRight size={18} />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <FileText size={28} />
            <h3>
              {filter ? "Nothing here yet." : "Your first post belongs here."}
            </h3>
            <p>
              {filter
                ? "Your posts will appear here as you write and publish."
                : "Write something small. You can always come back to it."}
            </p>
          </div>
        )}
      </div>
      <footer className="desk-footer">
        <span>Your writing. Your readers. Your space.</span>
        <span>
          Caveat <span aria-hidden="true">✳</span>
        </span>
      </footer>
    </div>
  );
}
