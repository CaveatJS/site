"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import { NodeSelection } from "@tiptap/pm/state";
import { NewsletterComponent } from "@/lib/newsletter-component-extension";
import { ComponentPicker } from "./component-picker";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  ListViewIcon,
  QuoteUpIcon,
  Link01Icon,
  UndoIcon,
} from "@hugeicons/core-free-icons";

export function RichTextEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: { openOnClick: false } }),
      Image,
      NewsletterComponent,
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      handleClickOn(view, _pos, node, nodePos, event) {
        if (node.type.name !== "newsletterComponent") return false;
        event.preventDefault();
        view.dispatch(
          view.state.tr.setSelection(
            NodeSelection.create(view.state.doc, nodePos),
          ),
        );
        return true;
      },
      attributes: {
        class: "prose rich-writing",
        role: "textbox",
        "aria-label": "Your writing",
        "aria-multiline": "true",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getMarkdown()),
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            list: editor.isActive("bulletList"),
            quote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
            heading:
              [1, 2, 3, 4, 5, 6].find((level) =>
                editor.isActive("heading", { level }),
              ) || 0,
            undo: editor.can().undo(),
          }
        : null,
  });

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);
  // The parent mounts a fresh editor when selecting a post, keeping undo history
  // inside that post. Saving does not replace the document or move the cursor.

  function editLink() {
    if (!editor) return;
    const url = window.prompt(
      "Link address (https://…). Leave empty to remove the link.",
      editor.getAttributes("link").href || "",
    );
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      const parsed = new URL(url.trim());
      if (!["http:", "https:", "mailto:"].includes(parsed.protocol))
        throw new Error();
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: parsed.href })
        .run();
    } catch {
      window.alert("Use a full https://, http://, or mailto: address.");
    }
  }
  const tools = [
    {
      label: "Bold",
      icon: TextBoldIcon,
      active: state?.bold,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: TextItalicIcon,
      active: state?.italic,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Bullet list",
      icon: ListViewIcon,
      active: state?.list,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Quote",
      icon: QuoteUpIcon,
      active: state?.quote,
      run: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    { label: "Link", icon: Link01Icon, active: state?.link, run: editLink },
  ];
  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="group" aria-label="Text formatting">
        <div
          className="text-style-buttons"
          role="group"
          aria-label="Text style"
        >
          {([0, 1, 2, 3, 4, 5, 6] as const).map((level) => (
            <button
              key={level}
              type="button"
              aria-label={level ? "Heading " + level : "Paragraph"}
              aria-pressed={(state?.heading || 0) === level}
              disabled={disabled || !editor}
              onClick={() => {
                if (level) editor?.chain().focus().setHeading({ level }).run();
                else editor?.chain().focus().setParagraph().run();
              }}
            >
              {level ? "H" + level : "Text"}
            </button>
          ))}
        </div>
        <span className="rich-divider" aria-hidden="true" />
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={tool.active || false}
            disabled={disabled || !editor}
            onMouseDown={(event) => event.preventDefault()}
            onClick={tool.run}
          >
            <HugeiconsIcon
              icon={tool.icon}
              size={18}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </button>
        ))}
        <span className="rich-divider" aria-hidden="true" />
        <button
          type="button"
          title="Undo"
          aria-label="Undo"
          disabled={disabled || !state?.undo}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <HugeiconsIcon
            icon={UndoIcon}
            size={18}
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </button>
      </div>
      {editor && (
        <div
          className="component-toolbar"
          role="group"
          aria-label="Publication components"
        >
          <ComponentPicker editor={editor} disabled={disabled} />
        </div>
      )}
      <EditorContent editor={editor} />
      {!editor && (
        <p className="rich-loading" role="status">
          Opening your writing…
        </p>
      )}
    </div>
  );
}
