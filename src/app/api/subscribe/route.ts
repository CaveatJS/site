import { z } from "zod";
import { db } from "@/lib/db";
import { mailFor, ProviderError, type Contact } from "@/lib/resend";
import { endpoint, checkOrigin, body, rateLimit, HttpError } from "@/lib/http";
export const POST = endpoint(async (request) => {
  checkOrigin(request);
  await rateLimit(request, "subscribe", 5);
  const { email, website } = await body(
    request,
    z.object({
      email: z.email().transform((s) => s.toLowerCase()),
      website: z.string().optional(),
    }),
  );
  if (website) return Response.json({ ok: true });
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication) throw new HttpError(404, "Publication not found.");
  const mail = mailFor(publication);
  let contact: Contact | undefined;
  try {
    contact = await mail.request<Contact>(
      `/contacts/${encodeURIComponent(email)}`,
    );
  } catch (error) {
    if (!(error instanceof ProviderError && error.status === 404)) throw error;
  }
  // Never reactivate a contact who previously unsubscribed.
  if (!contact) {
    const created = await mail.request<{ id: string }>("/contacts", "POST", {
      email,
    });
    contact = {
      ...created,
      email,
      unsubscribed: false,
      created_at: new Date().toISOString(),
    };
  }
  if (!contact.unsubscribed)
    await mail.request(
      `/contacts/${contact.id}/segments/${publication.segmentId}`,
      "POST",
      {},
    );
  return Response.json({ ok: true });
});
