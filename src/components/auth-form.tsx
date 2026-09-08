"use client";
import { LinkArrow } from "@/components/link-arrow";
import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { Message } from "./ui";
export const authClient = createAuthClient();
export function AuthForm({
  mode,
  resetToken,
}: {
  mode: "setup" | "login" | "forgot" | "reset";
  resetToken?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Record<string, string>;
    try {
      if (mode === "setup") {
        const response = await fetch("/api/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        const login = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        if (login.error) {
          window.location.href = "/login";
          return;
        }
        window.location.href = "/dashboard/settings?welcome=1";
        return;
      }
      if (mode === "login") {
        const result = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        if (result.error)
          throw new Error(result.error.message || "Could not sign in.");
        window.location.href = "/dashboard";
        return;
      }
      if (mode === "forgot") {
        const result = await authClient.requestPasswordReset({
          email: data.email,
          redirectTo: window.location.origin + "/reset-password",
        });
        if (result.error)
          throw new Error(result.error.message || "Could not request a reset.");
        setMessage(
          "If this is the owner email and email delivery is connected, a reset link is on its way.",
        );
      } else {
        if (!resetToken)
          throw new Error(
            "This reset link is missing its token. Request a new one.",
          );
        const result = await authClient.resetPassword({
          newPassword: data.password,
          token: resetToken,
        });
        if (result.error)
          throw new Error(
            result.error.message || "This link has expired. Request a new one.",
          );
        window.location.href = "/login";
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="stack" onSubmit={submit}>
      {mode === "setup" && (
        <>
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength={80} />
          </label>
          <label>
            Private setup key
            <input name="key" type="password" autoComplete="off" required />
            <small>
              Copy CAVEAT_SETUP_KEY from your .env file or Vercel project
              settings.
            </small>
          </label>
          <Link className="quiet" href="/docs#setup-key" target="_blank">
            Where to find your setup key <LinkArrow />
          </Link>
        </>
      )}
      {mode !== "reset" && (
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
      )}
      {(mode === "setup" || mode === "login" || mode === "reset") && (
        <label>
          Password
          <input
            aria-label="Password"
            name="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={mode === "login" ? 1 : 12}
            maxLength={128}
            required
          />
          {mode !== "login" && <small>At least 12 characters.</small>}
        </label>
      )}
      {message && (
        <Message error={!message.startsWith("If this")}>{message}</Message>
      )}
      <button className="button primary wide" disabled={busy}>
        {busy
          ? "One moment…"
          : mode === "setup"
            ? "Create my publication"
            : mode === "login"
              ? "Sign in"
              : mode === "forgot"
                ? "Send reset link"
                : "Save new password"}
      </button>
      {mode === "login" && (
        <Link className="quiet centered" href="/forgot-password">
          Forgot your password?
        </Link>
      )}
      {(mode === "forgot" || mode === "reset") && (
        <Link href="/login">Back to sign in</Link>
      )}
    </form>
  );
}
