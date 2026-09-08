import { z } from "zod";
import { publicationFontIds } from "@/lib/publication-fonts";
import { db } from "@/lib/db";
import { seal, unseal } from "@/lib/crypto";
import { MailProvider, checkSender, ProviderError } from "@/lib/resend";
import {
  endpoint,
  requireOwner,
  checkOrigin,
  body,
  HttpError,
} from "@/lib/http";
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[^<>\r\n]+$/, "Use a plain publication name."),
  description: z.string().max(400),
  author: z.string().trim().min(1).max(80),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z.enum(publicationFontIds),
  senderEmail: z.union([z.email(), z.literal("")]).optional(),
  apiKey: z.string().max(250).optional(),
});
export const PATCH = endpoint(async (request) => {
  checkOrigin(request);
  const { publication } = await requireOwner();
  const { apiKey, senderEmail, ...identity } = await body(request, schema);
  if (apiKey || (senderEmail && senderEmail !== publication.senderEmail)) {
    const active = await db.delivery.count({
      where: { state: { in: ["preparing", "ready", "sending", "uncertain"] } },
    });
    if (active)
      throw new HttpError(
        409,
        "Resolve pending deliveries before changing your email connection.",
      );
  }
  const data: Record<string, unknown> = { ...identity };
  let message = "Changes saved.";
  if (apiKey || senderEmail) {
    const key =
      apiKey || (publication.resendKey ? unseal(publication.resendKey) : "");
    const sender = senderEmail || publication.senderEmail;
    if (!key || !sender)
      throw new HttpError(
        400,
        "Enter your Resend API key and sending email address.",
      );
    const mail = new MailProvider(key);
    try {
      const verified = await checkSender(mail, sender);
      let segmentId = apiKey ? null : publication.segmentId;
      if (!segmentId) {
        const name = `Caveat ${publication.ownerId}`;
        const segments = await mail.all<{ id: string; name: string }>(
          "/segments",
        );
        segmentId =
          segments.find((s) => s.name === name)?.id ||
          (await mail.request<{ id: string }>("/segments", "POST", { name }))
            .id;
      }
      Object.assign(data, {
        resendKey: seal(key),
        senderEmail: sender,
        segmentId,
        sendingReady: verified,
      });
      message = verified
        ? "Email connected. You can now collect subscribers and send newsletters."
        : "Connection saved. Verify your sending domain in Resend, then check the connection again.";
    } catch (error) {
      if (error instanceof ProviderError)
        throw new HttpError(
          400,
          "Resend could not validate this connection. Check that your API key has full access, then try again.",
        );
      throw error;
    }
  }
  await db.publication.update({ where: { id: 1 }, data });
  return Response.json({ message });
});
