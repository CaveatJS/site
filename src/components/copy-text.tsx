"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyText({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState(false);
  return (
    <div className="copy-control">
      <button
        type="button"
        className="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setFallback(false);
            setStatus("Copied");
          } catch {
            setFallback(true);
            setStatus("Select the text below and copy it manually.");
          }
        }}
      >
        {status === "Copied" ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}{" "}
        {label}
      </button>
      <span className="copy-feedback" role="status">
        {status}
      </span>
      {fallback && (
        <textarea
          className="copy-fallback"
          aria-label="Text to copy"
          value={text}
          readOnly
          rows={6}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}
