"use client";
import { LinkArrow } from "@/components/link-arrow";
import { useRef, useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Plus, X, Pencil } from "lucide-react";
import Link from "next/link";
import {
  newsletterComponents,
  componentAttributesSchema,
  type ComponentAttributes,
} from "@/lib/newsletter-components";

const fieldLabels = {
  title: "Heading",
  body: "Text",
  url: "Destination link",
  label: "Button label",
  attribution: "Attribution",
};
const fieldLimits = {
  title: 120,
  body: 2000,
  url: 2048,
  label: 80,
  attribution: 160,
};
export function ComponentPicker({ editor }: { editor: Editor }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const range = useRef({ from: 0, to: 0 });
  const [value, setValue] = useState<ComponentAttributes | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const selected = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor.state.selection.toJSON().type === "node" &&
      editor.isActive("newsletterComponent"),
  });
  const definition = newsletterComponents.find(
    (item) => item.id === value?.kind,
  );
  function open(edit: boolean) {
    const { from, to } = editor.state.selection;
    range.current = { from, to };
    setEditing(edit);
    setError("");
    setValue(
      edit
        ? componentAttributesSchema.parse(
            editor.getAttributes("newsletterComponent"),
          )
        : null,
    );
    dialog.current?.showModal();
  }
  function insert(event: React.FormEvent) {
    event.preventDefault();
    const result = componentAttributesSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const block = { type: "newsletterComponent", attrs: result.data };
    dialog.current?.close();
    editor
      .chain()
      .focus()
      .insertContentAt(
        range.current,
        editing ? block : [block, { type: "paragraph" }],
      )
      .run();
  }
  return (
    <>
      <button
        className="tool insert-component"
        type="button"
        onClick={() => open(false)}
      >
        <Plus size={15} /> Insert component
      </button>
      {selected && (
        <button
          className="tool insert-component"
          type="button"
          onClick={() => open(true)}
        >
          <Pencil size={14} /> Edit component
        </button>
      )}
      <dialog
        ref={dialog}
        className="component-dialog"
        aria-labelledby="component-dialog-title"
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow">For your website & email</p>
            <h2 id="component-dialog-title">
              {editing
                ? "Edit your component."
                : value
                  ? `Add a ${definition?.name.toLowerCase()}.`
                  : "Give your letter a little more."}
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close component picker"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        {!value ? (
          <>
            <p className="component-help">
              Choose a block, make it yours, and keep writing.
            </p>
            <div className="component-choices">
              {newsletterComponents.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setValue({ ...item.defaults })}
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <small>By {item.author}</small>
                </button>
              ))}
            </div>
            <Link
              className="component-library-link"
              href="/components"
              target="_blank"
            >
              Browse the component library <LinkArrow />
            </Link>
          </>
        ) : (
          <form className="stack" onSubmit={insert}>
            {definition?.fields.map((field) => (
              <label key={field}>
                {fieldLabels[field]}
                {field === "body" ? (
                  <textarea
                    rows={4}
                    value={value[field]}
                    maxLength={fieldLimits[field]}
                    onChange={(event) =>
                      setValue({ ...value, [field]: event.target.value })
                    }
                  />
                ) : (
                  <input
                    value={value[field]}
                    maxLength={fieldLimits[field]}
                    required={field === "url" || field === "label"}
                    placeholder={field === "url" ? "https://…" : undefined}
                    onChange={(event) =>
                      setValue({ ...value, [field]: event.target.value })
                    }
                  />
                )}
              </label>
            ))}
            {value.kind === "divider" && (
              <p className="component-help">
                A simple line to separate two parts of your letter.
              </p>
            )}
            {error && (
              <p className="message error" role="alert">
                {error}
              </p>
            )}
            <div className="component-dialog-actions">
              {!editing && (
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    setValue(null);
                    setError("");
                  }}
                >
                  <LinkArrow direction="left" /> All components
                </button>
              )}
              <button className="button primary" type="submit">
                {editing ? "Save component" : "Insert into draft"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
