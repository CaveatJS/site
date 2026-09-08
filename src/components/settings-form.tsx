"use client";
import { LinkArrow } from "@/components/link-arrow";
import { useState } from "react";
import { Message } from "./ui";
import { FontPicker } from "./font-picker";
type Settings = {
  name: string;
  description: string;
  author: string;
  accent: string;
  font: string;
  senderEmail: string | null;
  sendingReady: boolean;
  connected: boolean;
};
export function SettingsForm({
  initial,
  welcome,
}: {
  initial: Settings;
  welcome: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [fontId, setFontId] = useState(initial.font);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setError(false);
      setMessage(result.message);
      if (welcome) window.location.href = "/dashboard";
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="settings-form" onSubmit={save}>
      <section className="settings-section">
        <div>
          <h2>Make it yours.</h2>
          <p>The name and voice your readers will recognise.</p>
        </div>
        <div className="stack">
          <label>
            Publication name
            <input
              name="name"
              defaultValue={
                initial.name === "My publication" ? "" : initial.name
              }
              placeholder="e.g. Field Notes"
              required
              maxLength={80}
            />
          </label>
          <label>
            A short description
            <textarea
              name="description"
              defaultValue={initial.description}
              placeholder="What do you write about?"
              rows={3}
              maxLength={400}
            />
          </label>
          <label>
            Author name
            <input
              name="author"
              defaultValue={initial.author}
              required
              maxLength={80}
            />
          </label>
        </div>
      </section>
      {!welcome && (
        <>
          <section className="settings-section">
            <div>
              <h2>A little character.</h2>
              <p>A thoughtful default. A few personal touches.</p>
            </div>
            <div className="stack">
              <FontPicker value={fontId} onChange={setFontId} />
              <label>
                Accent colour
                <input
                  type="color"
                  name="accent"
                  defaultValue={initial.accent}
                />
              </label>
            </div>
          </section>
          <section className="settings-section" id="email">
            <div>
              <h2>Letters to your readers.</h2>
              <p>Connect Resend to collect subscribers and send newsletters.</p>
              <a
                href="https://resend.com/domains"
                target="_blank"
                rel="noreferrer"
              >
                Open Resend <LinkArrow />
              </a>
            </div>
            <div className="stack">
              <span
                className={initial.sendingReady ? "badge published" : "badge"}
              >
                {initial.sendingReady
                  ? "Email connected"
                  : initial.connected
                    ? "Domain verification needed"
                    : "Not connected yet"}
              </span>
              <label>
                Resend API key
                <input
                  name="apiKey"
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    initial.connected
                      ? "Saved securely — leave blank to keep"
                      : "re_…"
                  }
                />
                <small>
                  Create a key with full access in Resend. It stays on your
                  server.
                </small>
              </label>
              <label>
                Send from
                <input
                  aria-label="Send from"
                  name="senderEmail"
                  type="email"
                  defaultValue={initial.senderEmail || ""}
                  placeholder="letters@yourdomain.com"
                />
                <small>
                  Verify this address’s domain in Resend. Save again to check
                  verification.
                </small>
              </label>
            </div>
          </section>
          <section className="settings-section">
            <div>
              <h2>Your own address.</h2>
              <p>When you are ready, give your publication a custom domain.</p>
            </div>
            <div className="stack">
              <p>
                In your Vercel project, open <strong>Settings → Domains</strong>
                , add your domain, and follow the DNS instructions. Then set{" "}
                <code>BETTER_AUTH_URL</code> to its full HTTPS address and
                redeploy.
              </p>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                Open Vercel <LinkArrow />
              </a>
            </div>
          </section>
        </>
      )}
      {welcome && (
        <>
          <input type="hidden" name="accent" value={initial.accent} />
          <input type="hidden" name="font" value={initial.font} />
        </>
      )}
      <div className="settings-save">
        {message && <Message error={error}>{message}</Message>}
        <button className="button primary" disabled={busy}>
          {busy ? "Saving…" : welcome ? "Start writing" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
