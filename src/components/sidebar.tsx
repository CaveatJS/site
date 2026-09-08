"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileText,
  Users,
  SlidersHorizontal,
  ArrowUpRight,
  LogOut,
  Feather,
  BookOpen,
} from "lucide-react";
import { authClient } from "./auth-form";
export function Sidebar({ name, author }: { name: string; author: string }) {
  const path = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign-out failed");
      window.location.replace("/login");
    } catch {
      setSignOutError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }
  return (
    <aside className="sidebar">
      <Link className="logo" href="/dashboard">
        caveat<span aria-hidden="true">✳</span>
      </Link>
      <div className="publication-switch">
        <div className="publication-icon">
          <Feather size={19} />
        </div>
        <div>
          <strong>{name}</strong>
          <small>Your publication</small>
        </div>
      </div>
      <nav aria-label="Publication management">
        {[
          { href: "/dashboard", label: "Posts", Icon: FileText },
          { href: "/dashboard/subscribers", label: "Subscribers", Icon: Users },
          {
            href: "/dashboard/settings",
            label: "Settings",
            Icon: SlidersHorizontal,
          },
        ].map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={
              (
                href === "/dashboard"
                  ? path === "/dashboard" || path.startsWith("/dashboard/posts")
                  : path.startsWith(href)
              )
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <Link className="nav-item" href="/docs" target="_blank">
          <BookOpen size={16} />
          Getting started
        </Link>
        <Link className="nav-item" href="/" target="_blank">
          Visit your website
          <ArrowUpRight size={16} />
        </Link>
        <div className="owner">
          <span className="avatar">
            {author.slice(0, 1).toUpperCase() || "Y"}
          </span>
          <div>
            <strong>{author || "You"}</strong>
            <small>Publication owner</small>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Sign out"
            title={signingOut ? "Signing out…" : "Sign out"}
            aria-busy={signingOut}
            disabled={signingOut}
            onClick={signOut}
          >
            <LogOut size={17} />
          </button>
        </div>
        {signOutError && (
          <p className="message error" role="alert">
            {signOutError}
          </p>
        )}
      </div>
    </aside>
  );
}
