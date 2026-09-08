import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { endpoint, requireOwner, checkOrigin } from "@/lib/http";
export const POST = endpoint(async (request) => {
  checkOrigin(request);
  await requireOwner();
  const post = await db.post.create({ data: { slug: randomUUID() } });
  return Response.json({ id: post.id });
});
