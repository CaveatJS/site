import { db } from "@/lib/db";
import { endpoint, requireOwner } from "@/lib/http";
export const GET = endpoint(async () => {
  const { publication } = await requireOwner();
  const posts = await db.post.findMany({ orderBy: { createdAt: "asc" } });
  return Response.json(
    {
      version: 1,
      publication: {
        name: publication.name,
        description: publication.description,
        author: publication.author,
      },
      posts,
    },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="caveat-posts.json"',
        "Cache-Control": "no-store",
      },
    },
  );
});
