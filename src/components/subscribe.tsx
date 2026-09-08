"use client";
import { useState } from "react";
export function Subscribe() {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="subscribe-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        const data = Object.fromEntries(new FormData(event.currentTarget));
        try {
          const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          setState(
            response.ok
              ? "Thank you. New subscribers will receive the next letter."
              : result.error,
          );
        } catch {
          setState("Could not subscribe. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="sr-only" htmlFor="subscriber-email">
        Your email address
      </label>
      <input
        id="subscriber-email"
        name="email"
        type="email"
        placeholder="Your email address"
        required
      />
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="button primary" disabled={busy}>
        {busy ? "Subscribing…" : "Subscribe"}
      </button>
      {state && <p role="status">{state}</p>}
    </form>
  );
}
