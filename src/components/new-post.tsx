"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
export function NewPost({ label = "New post" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <button
        className="button primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const response = await fetch("/api/posts", { method: "POST" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            window.location.href = `/dashboard/posts/${result.id}`;
          } catch (e) {
            setError(e instanceof Error ? e.message : "Try again.");
            setBusy(false);
          }
        }}
      >
        <Plus size={17} />
        {busy ? "Opening your draft…" : label}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}
