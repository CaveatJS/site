"use client";
import { Icon } from "@/components/icon";
import { ComponentBody } from "@/components/component-body";
import { useRef, useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
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
export function ComponentPicker({ editor, disabled }: { editor: Editor; disabled: boolean }) {
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
        className="insert-component" disabled={disabled}
        type="button"
        onClick={() => open(false)}
      >
        <Icon name="add" size={16} /> Insert component
      </button>
      {selected && <button className="insert-component" type="button" disabled={disabled} onClick={() => editor.chain().focus().deleteSelection().run()}>Remove component</button>}
      {selected && (
        <button
          className="insert-component" disabled={disabled}
          type="button"
          onClick={() => open(true)}
        >
          <Icon name="edit" size={16} /> Edit component
        </button>
      )}
      <dialog
        ref={dialog}
        className="component-dialog"
        aria-labelledby="component-dialog-title"
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow">For your publication</p>
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
            <span aria-hidden="true">×</span>
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

          </>
        ) : (
          <form className="component-fields" onSubmit={insert}>
            <div className="component-live-preview" aria-label="Component preview">
              <span className="component-preview-label">In your letter</span>
              {componentAttributesSchema.safeParse(value).success
                ? <ComponentBody value={value} />
                : <p>Add a valid destination to preview this component.</p>}
            </div>
            {definition?.fields.map((field) => (
              <div key={field}>
                <label htmlFor={`component-field-${field}`}>{fieldLabels[field]}</label>
                {field === "body" ? (
                  <textarea
                    id={`component-field-${field}`}
                    rows={4}
                    value={value[field]}
                    maxLength={fieldLimits[field]}
                    onChange={(event) =>
                      setValue({ ...value, [field]: event.target.value })
                    }
                  />
                ) : (
                  <input
                    id={`component-field-${field}`}
                    value={value[field]}
                    maxLength={fieldLimits[field]}
                    required={field === "url" || field === "label"}
                    placeholder={field === "url" ? "https://…" : undefined}
                    onChange={(event) =>
                      setValue({ ...value, [field]: event.target.value })
                    }
                  />
                )}
              </div>
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
                  <Icon name="back" size={16} /> All components
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
