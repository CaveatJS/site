import { HttpError } from "./http";
import { unseal } from "./crypto";
import type { Publication } from "@/generated/prisma/client";
export class ProviderError extends Error {
  constructor(public status: number) {
    super(`Email provider returned ${status}`);
  }
}
export type Contact = {
  id: string;
  email: string;
  unsubscribed: boolean;
  created_at: string;
};
export type Broadcast = {
  id: string;
  name: string;
  status: string;
  sent_at: string | null;
};
export class MailProvider {
  private nextRequestAt = 0;
  constructor(private key: string) {}
  async request<T>(path: string, method = "GET", data?: unknown): Promise<T> {
    const wait = this.nextRequestAt - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    this.nextRequestAt = Date.now() + 550;
    const response = await fetch(`https://api.resend.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new ProviderError(response.status);
    return response.json() as Promise<T>;
  }
  async all<T extends { id: string }>(path: string): Promise<T[]> {
    const entries: T[] = [];
    let cursor = "";
    for (let page = 0; page < 100; page++) {
      if (page) await new Promise((resolve) => setTimeout(resolve, 550));
      const result = await this.request<{ data: T[]; has_more?: boolean }>(
        `${path}?limit=100${cursor ? `&after=${encodeURIComponent(cursor)}` : ""}`,
      );
      entries.push(...result.data);
      if (!result.has_more) return entries;
      const next = result.data.at(-1)?.id;
      if (!next || next === cursor) throw new Error("Invalid subscriber page.");
      cursor = next;
    }
    throw new HttpError(
      422,
      "This list is too large to load here. Export it from Resend.",
    );
  }
  contacts(segment: string) {
    return this.all<Contact>(
      `/segments/${encodeURIComponent(segment)}/contacts`,
    );
  }
}
export function mailFor(publication: Publication, requireReady = true) {
  if (
    !publication.resendKey ||
    !publication.segmentId ||
    !publication.senderEmail ||
    (requireReady && !publication.sendingReady)
  )
    throw new HttpError(400, "Connect and verify Resend in Settings first.");
  return new MailProvider(unseal(publication.resendKey));
}
export async function checkSender(mail: MailProvider, sender: string) {
  const domains = await mail.all<{ id: string; name: string; status: string }>(
    "/domains",
  );
  return domains.some(
    (d) =>
      d.name.toLowerCase() === sender.split("@")[1].toLowerCase() &&
      d.status === "verified",
  );
}
