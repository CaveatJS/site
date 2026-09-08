import { getPosts, savePost } from "@/lib/posts.mjs";
import { canUseStudio } from "@/lib/studio-access.mjs";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!canUseStudio(request)) return new Response("Not found", { status: 404 });
  return Response.json(await getPosts({ includeDrafts: true }), {
    headers: { "Cache-Control": "no-store" },
  });
}

async function write(request: Request, create: boolean) {
  if (!canUseStudio(request)) return new Response("Not found", { status: 404 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json({ error: "Send a JSON post." }, { status: 415 });
  // Bound the body before parsing it, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "A post is required." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 500000) {
      await reader.cancel();
      return Response.json(
        { error: "This post is too large." },
        { status: 413 },
      );
    }
    chunks.push(value);
  }
  try {
    const post = await savePost(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
      { create },
    );
    revalidatePath("/");
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath("/rss.xml");
    return Response.json(post, { status: create ? 201 : 200 });
  } catch (error) {
    const failure = error as Error & { code?: string };
    if (failure.code === "EEXIST")
      return Response.json(
        { error: "That post URL is already in use. Choose another." },
        { status: 409 },
      );
    if (failure.code === "ENOENT")
      return Response.json(
        { error: "The post no longer exists. Reload the editor." },
        { status: 404 },
      );
    if (failure.code) {
      console.error(failure);
      return Response.json(
        { error: "Could not save the file. Check the terminal and try again." },
        { status: 500 },
      );
    }
    return Response.json(
      {
        error:
          failure instanceof SyntaxError
            ? "The post data is invalid."
            : failure.message,
      },
      { status: 400 },
    );
  }
}
export const POST = (request: Request) => write(request, true);
export const PUT = (request: Request) => write(request, false);
