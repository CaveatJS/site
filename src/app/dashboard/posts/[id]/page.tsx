import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ownerPage } from "@/lib/http";
import { PostEditor } from "@/components/post-editor";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { publication } = await ownerPage();
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { id },
    include: { delivery: true },
  });
  if (!post) notFound();
  return (
    <PostEditor
      font={publication.font}
      initial={{
        id: post.id,
        title: post.title,
        content: post.content as object,
        revision: post.revision,
        published: !!post.publishedAt,
        delivery: post.delivery?.state || null,
      }}
    />
  );
}
