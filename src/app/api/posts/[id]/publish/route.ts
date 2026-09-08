import { z } from "zod";
import { db } from "@/lib/db";
import {
  endpoint,
  requireOwner,
  checkOrigin,
  body,
  HttpError,
} from "@/lib/http";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return endpoint(async (req) => {
    checkOrigin(req);
    await requireOwner();
    const { revision } = await body(
      req,
      z.object({ revision: z.number().int() }),
    );
    const post = await db.post.findUnique({ where: { id } });
    if (!post?.title.trim())
      throw new HttpError(400, "Give your post a title before publishing.");
    if (post.revision !== revision)
      throw new HttpError(409, "Save your latest changes before publishing.");
    const slug = post.publishedAt
      ? post.slug
      : `${
          post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 70) || "post"
        }-${post.id.slice(-6)}`;
    const changed = await db.post.updateMany({
      where: { id, revision },
      data: {
        slug,
        publishedAt: post.publishedAt || new Date(),
        publishedTitle: post.title,
        publishedContent: post.content as object,
      },
    });
    if (!changed.count)
      throw new HttpError(409, "The post changed. Save and publish again.");
    return Response.json({ url: `/p/${slug}` });
  })(request);
}
