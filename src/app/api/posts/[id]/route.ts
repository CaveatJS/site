import { z } from "zod";
import { db } from "@/lib/db";
import { contentSchema, renderContent } from "@/lib/content";
import {
  endpoint,
  requireOwner,
  checkOrigin,
  body,
  HttpError,
} from "@/lib/http";
const schema = z.object({
  title: z.string().max(180),
  content: contentSchema,
  revision: z.number().int().nonnegative(),
});
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return endpoint(async (req) => {
    checkOrigin(req);
    await requireOwner();
    const input = await body(req, schema);
    try {
      renderContent(input.content);
    } catch {
      throw new HttpError(400, "This post contains unsupported formatting.");
    }
    const changed = await db.post.updateMany({
      where: { id, revision: input.revision },
      data: {
        title: input.title,
        content: input.content as object,
        revision: { increment: 1 },
      },
    });
    if (!changed.count)
      throw new HttpError(
        409,
        "This post changed in another tab. Copy your changes, then reload.",
      );
    return Response.json({ revision: input.revision + 1 });
  })(request);
}
