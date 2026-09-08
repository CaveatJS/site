import { db } from "./db";
import { baseUrl } from "./config";
import { emailHtml } from "./content";
import { sign, verify } from "./crypto";
import { HttpError } from "./http";
import { MailProvider, mailFor, type Broadcast } from "./resend";
import type { Publication } from "@/generated/prisma/client";
type Confirmation = {
  id: string;
  revision: number;
  count: number;
  settings: string;
  expires: number;
};
export async function prepareEmail(id: string, publication: Publication) {
  const post = await db.post.findUnique({
    where: { id },
    include: { delivery: true },
  });
  if (!post) throw new HttpError(404, "Post not found.");
  if (!post.title.trim())
    throw new HttpError(400, "Give your post a title first.");
  const mail = mailFor(publication);
  const count = (await mail.contacts(publication.segmentId!)).filter(
    (c) => !c.unsubscribed,
  ).length;
  const html = emailHtml(publication.name, post.title, post.content, baseUrl());
  const confirmation = sign({
    id,
    revision: post.revision,
    count,
    settings: publication.updatedAt.toISOString(),
    expires: Date.now() + 10 * 60000,
  });
  return {
    subject: post.title,
    html,
    count,
    confirmation,
    state: post.delivery?.state || null,
  };
}
export async function reconcileDelivery(id: string, mail: MailProvider) {
  let record = await db.delivery.findUnique({ where: { postId: id } });
  if (!record) return null;
  if (!record.broadcastId) {
    const matches = (await mail.all<Broadcast>("/broadcasts")).filter(
      (b) => b.name === `caveat-${record!.id}`,
    );
    if (matches.length === 1)
      record = await db.delivery.update({
        where: { id: record.id },
        data: { broadcastId: matches[0].id },
      });
  }
  if (record.broadcastId) {
    const broadcast = await mail.request<Broadcast>(
      `/broadcasts/${record.broadcastId}`,
    );
    if (
      broadcast.sent_at ||
      ["sent", "sending", "queued", "scheduled"].includes(broadcast.status)
    ) {
      record = await db.delivery.update({
        where: { id: record.id },
        data: {
          state:
            broadcast.sent_at || broadcast.status === "sent"
              ? "sent"
              : "accepted",
          error: null,
        },
      });
    }
    // A draft after an uncertain send is not proof that a delayed request cannot still be accepted.
    // Never automatically re-send it. The owner can inspect this same broadcast in Resend.
  }
  return record;
}
export async function sendNewsletter(
  id: string,
  token: string,
  publication: Publication,
) {
  let confirmation: Confirmation;
  try {
    confirmation = verify<Confirmation>(token);
  } catch {
    throw new HttpError(400, "Preview this email again before sending.");
  }
  if (
    confirmation.id !== id ||
    confirmation.expires < Date.now() ||
    confirmation.settings !== publication.updatedAt.toISOString()
  )
    throw new HttpError(409, "This confirmation expired. Preview again.");
  const mail = mailFor(publication);
  const existing = await db.delivery.findUnique({ where: { postId: id } });
  if (existing) return reconcileDelivery(id, mail);
  const post = await db.post.findUnique({ where: { id } });
  if (!post || post.revision !== confirmation.revision)
    throw new HttpError(409, "The post changed. Preview it again.");
  const count = (await mail.contacts(publication.segmentId!)).filter(
    (c) => !c.unsubscribed,
  ).length;
  if (!count)
    throw new HttpError(400, "You do not have any subscribed readers yet.");
  if (count !== confirmation.count)
    throw new HttpError(
      409,
      "Your subscriber count changed. Preview again to confirm the new count.",
    );
  let record;
  try {
    record = await db.delivery.create({
      data: {
        postId: id,
        subject: post.title,
        html: emailHtml(publication.name, post.title, post.content, baseUrl()),
        recipientCount: count,
      },
    });
  } catch (error) {
    if (await db.delivery.findUnique({ where: { postId: id } }))
      throw new HttpError(
        409,
        "A send is already in progress. Check its status.",
      );
    throw error;
  }
  try {
    // Always create an unsent draft first; persist its ID before attempting any delivery.
    const draft = await mail.request<{ id: string }>("/broadcasts", "POST", {
      name: `caveat-${record.id}`,
      segment_id: publication.segmentId,
      from: `${publication.name} <${publication.senderEmail}>`,
      subject: record.subject,
      html: record.html,
    });
    await db.delivery.update({
      where: { id: record.id },
      data: { broadcastId: draft.id, state: "ready" },
    });
    const claim = await db.delivery.updateMany({
      where: { id: record.id, state: "ready" },
      data: { state: "sending" },
    });
    if (!claim.count) throw new Error("Send already claimed.");
    await mail.request(`/broadcasts/${draft.id}/send`, "POST", {});
    return await db.delivery.update({
      where: { id: record.id },
      data: { state: "accepted" },
    });
  } catch {
    return db.delivery.update({
      where: { id: record.id },
      data: {
        state: "uncertain",
        error:
          "Delivery is unconfirmed. Check status before taking action in Resend.",
      },
    });
  }
}
