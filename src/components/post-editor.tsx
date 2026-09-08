"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { NodeSelection } from "@tiptap/pm/state";
import { NewsletterComponent } from "@/lib/newsletter-component-extension";
import { ComponentPicker } from "./component-picker";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  Quote,
  Link2,
  Undo2,
  Globe,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
import { Message } from "./ui";
import {
  getPublicationFont,
  publicationFontStyle,
} from "@/lib/publication-fonts";
type Initial = {
  id: string;
  title: string;
  content: object;
  revision: number;
  published: boolean;
  delivery: string | null;
};
type Review = {
  subject: string;
  html: string;
  count: number;
  confirmation: string;
  state: string | null;
};
async function call(url: string, method = "GET", body?: unknown) {
  const response = await fetch(url, {
    method,
    ...(body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Please try again.");
  return result;
}
export function PostEditor({
  initial,
  font,
}: {
  initial: Initial;
  font: string;
}) {
  const [title, setTitle] = useState(initial.title);
  const [status, setStatus] = useState("All changes saved");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(initial.published);
  const [review, setReview] = useState<Review | null>(null);
  const [delivery, setDelivery] = useState(initial.delivery);
  const [epoch, setEpoch] = useState(0);
  const revision = useRef(initial.revision);
  const draft = useRef({ title: initial.title, content: initial.content });
  const dirty = useRef(false);
  const pending = useRef<Promise<void> | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const mark = useCallback(() => {
    dirty.current = true;
    setStatus("Unsaved changes");
    setEpoch((e) => e + 1);
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      NewsletterComponent,
    ],
    content: initial.content,
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        mousedown(view, event) {
          if (event.button !== 0 || !(event.target instanceof Element))
            return false;
          const block = event.target.closest("[data-caveat-component]");
          if (!block || !view.dom.contains(block)) return false;
          // Atomic blocks contain non-editable HTML. Select before the browser
          // moves its caret to a neighbouring paragraph on mouse-up.
          event.preventDefault();
          const position = view.posAtDOM(block, 0);
          view.focus();
          view.dispatch(
            view.state.tr.setSelection(
              NodeSelection.create(view.state.doc, position),
            ),
          );
          return true;
        },
        click(_view, event) {
          if (
            !(event.target instanceof Element) ||
            !event.target.closest("[data-caveat-component]")
          )
            return false;
          event.preventDefault();
          return true;
        },
      },
      attributes: {
        class: "prose editor-body",
        "aria-label": "Post body",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      draft.current.content = editor.getJSON();
      mark();
    },
  });
  const save = useCallback(async () => {
    if (pending.current) return pending.current;
    const work = async () => {
      while (dirty.current) {
        dirty.current = false;
        setStatus("Saving…");
        const snapshot = { ...draft.current, revision: revision.current };
        try {
          const result = await call(
            `/api/posts/${initial.id}`,
            "PATCH",
            snapshot,
          );
          revision.current = result.revision;
          setStatus("All changes saved");
          setError("");
        } catch (e) {
          dirty.current = true;
          setStatus("Changes not saved");
          throw e;
        }
      }
    };
    pending.current = work();
    try {
      await pending.current;
    } finally {
      pending.current = null;
    }
  }, [initial.id]);
  useEffect(() => {
    if (!epoch) return;
    const timer = setTimeout(() => {
      save().catch((e) => setError(e.message));
    }, 900);
    return () => clearTimeout(timer);
  }, [epoch, save]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty.current || pending.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  useEffect(() => {
    if (review) modal.current?.showModal();
  }, [review]);
  async function act(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await save();
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function button(
    label: string,
    Icon: typeof Bold,
    run: () => void,
    active = false,
  ) {
    return (
      <button
        type="button"
        className={active ? "tool active" : "tool"}
        title={label}
        aria-label={label}
        aria-pressed={active}
        onClick={run}
      >
        <Icon size={17} />
      </button>
    );
  }
  return (
    <div className="editor-page">
      <header className="editor-top">
        <Link href="/dashboard" className="quiet">
          <ArrowLeft size={16} /> All posts
        </Link>
        <span className="save-status" role="status">
          {status}
        </span>
      </header>
      <div className="editor-actions">
        <span className={published ? "badge published" : "badge"}>
          {published ? "Published · editing draft" : "Draft"}
        </span>
        <div>
          <button
            className="button"
            disabled={busy}
            onClick={() =>
              act(async () => {
                await call(`/api/posts/${initial.id}/publish`, "POST", {
                  revision: revision.current,
                });
                setPublished(true);
                setNotice("Published to your website. No email was sent.");
              })
            }
          >
            <Globe size={16} />
            {published ? "Update website" : "Publish to website"}
          </button>
          <button
            className="button primary"
            disabled={busy}
            onClick={() =>
              act(async () => {
                const data = await call(`/api/posts/${initial.id}/email`);
                setReview(data);
              })
            }
          >
            <Mail size={16} />
            {delivery ? "Email details" : "Send newsletter"}
          </button>
        </div>
      </div>
      {error && (
        <div className="editor-message">
          <Message error>{error}</Message>
          <button className="button small" onClick={() => act(async () => {})}>
            Retry saving
          </button>
        </div>
      )}
      {notice && (
        <div className="editor-message">
          <Message>{notice}</Message>
        </div>
      )}
      <section
        className={
          getPublicationFont(font).kind === "sans"
            ? "writing-paper sans-reading"
            : "writing-paper"
        }
        style={publicationFontStyle(font)}
      >
        <input
          className="title-input"
          aria-label="Post title"
          placeholder="A thought worth sharing…"
          value={title}
          maxLength={180}
          onChange={(e) => {
            setTitle(e.target.value);
            draft.current.title = e.target.value;
            mark();
          }}
        />
        <div className="editor-toolbar" aria-label="Formatting">
          {editor && (
            <>
              {button(
                "Bold",
                Bold,
                () => editor.chain().focus().toggleBold().run(),
                editor.isActive("bold"),
              )}
              {button(
                "Italic",
                Italic,
                () => editor.chain().focus().toggleItalic().run(),
                editor.isActive("italic"),
              )}
              <button
                className="tool"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                aria-label="Heading"
              >
                H₂
              </button>
              <span className="tool-divider" />
              {button("Bullet list", List, () =>
                editor.chain().focus().toggleBulletList().run(),
              )}
              {button("Quote", Quote, () =>
                editor.chain().focus().toggleBlockquote().run(),
              )}
              {button("Link", Link2, () => {
                const href = window.prompt("Link address (https://…)");
                if (href === null) return;
                if (!href) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                if (!/^https?:\/\//i.test(href)) {
                  setError("Use a full http:// or https:// link.");
                  return;
                }
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href })
                  .run();
              })}
              <span className="tool-divider" />
              {button("Undo", Undo2, () => editor.chain().focus().undo().run())}
              <span className="tool-divider" />
              <ComponentPicker editor={editor} />
            </>
          )}
        </div>
        <EditorContent editor={editor} />
        <p className="paper-footer">
          Take your time. Good writing has room to breathe.
        </p>
      </section>
      {review && (
        <dialog
          ref={modal}
          className="email-dialog"
          onCancel={() => setReview(null)}
          onClose={() => setReview(null)}
        >
          <div className="dialog-header">
            <div>
              <p className="eyebrow">A letter to your readers</p>
              <h2>Ready to send?</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Close email preview"
              onClick={() => modal.current?.close()}
            >
              <X />
            </button>
          </div>
          <p>
            <strong>{review.subject}</strong>
          </p>
          <p className="muted">
            {review.count} subscribed{" "}
            {review.count === 1 ? "reader" : "readers"} · Sending does not
            publish to your website.
          </p>
          <iframe title="Email preview" sandbox="" srcDoc={review.html} />
          {(delivery || review.state) && (
            <Message>
              Email status: {delivery || review.state}. For an unconfirmed send,
              check status or inspect the existing broadcast in Resend.
            </Message>
          )}
          <div className="dialog-actions">
            <button
              className="button"
              disabled={busy}
              onClick={() =>
                act(async () => {
                  const result = await call(
                    `/api/posts/${initial.id}/email`,
                    "POST",
                    { action: "test" },
                  );
                  setNotice(result.message);
                })
              }
            >
              Send me a test
            </button>
            {delivery || review.state ? (
              <button
                className="button primary"
                disabled={busy}
                onClick={() =>
                  act(async () => {
                    const result = await call(
                      `/api/posts/${initial.id}/email?status=1`,
                    );
                    setDelivery(result.state);
                    setNotice(result.error || `Email status: ${result.state}`);
                  })
                }
              >
                Check status
              </button>
            ) : (
              <button
                className="button primary"
                disabled={busy || review.count === 0}
                onClick={() =>
                  act(async () => {
                    const result = await call(
                      `/api/posts/${initial.id}/email`,
                      "POST",
                      { action: "send", confirmation: review.confirmation },
                    );
                    setDelivery(result.state);
                    setNotice(
                      result.error ||
                        "Resend accepted your newsletter for delivery.",
                    );
                  })
                }
              >
                {busy ? "Working…" : `Send to ${review.count} readers`}
              </button>
            )}
          </div>
          {notice && <Message>{notice}</Message>}
          {error && <Message error>{error}</Message>}
        </dialog>
      )}
    </div>
  );
}
