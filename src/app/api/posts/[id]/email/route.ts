import { z } from "zod";
import { db } from "@/lib/db";
import {
  endpoint,
  requireOwner,
  checkOrigin,
  body,
  HttpError,
  rateLimit,
} from "@/lib/http";
import {
  prepareEmail,
  sendNewsletter,
  reconcileDelivery,
} from "@/lib/delivery";
import { mailFor } from "@/lib/resend";
import { emailHtml } from "@/lib/content";
import { baseUrl } from "@/lib/config";
export const maxDuration = 60;
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return endpoint(async (req) => {
    const { publication } = await requireOwner();
    if (new URL(req.url).searchParams.has("status")) {
      const delivery = await reconcileDelivery(id, mailFor(publication, false));
      return Response.json({ state: delivery?.state, error: delivery?.error });
    }
    return Response.json(await prepareEmail(id, publication));
  })(request);
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return endpoint(async (req) => {
    checkOrigin(req);
    const { publication, session } = await requireOwner();
    await rateLimit(req, "send", 10);
    const input = await body(
      req,
      z.discriminatedUnion("action", [
        z.object({ action: z.literal("test") }),
        z.object({ action: z.literal("send"), confirmation: z.string() }),
      ]),
    );
    if (input.action === "test") {
      const post = await db.post.findUnique({ where: { id } });
      if (!post) throw new HttpError(404, "Post not found.");
      await mailFor(publication).request("/emails", "POST", {
        from: `${publication.name} <${publication.senderEmail}>`,
        to: session.user.email,
        subject: `[Test] ${post.title}`,
        html: emailHtml(
          publication.name,
          post.title,
          post.content,
          baseUrl(),
          false,
        ),
      });
      return Response.json({
        message: "Test email sent to your sign-in email.",
      });
    }
    const delivery = await sendNewsletter(id, input.confirmation, publication);
    return Response.json({ state: delivery?.state, error: delivery?.error });
  })(request);
}
