import { canUseStudio } from "@/lib/studio-access.mjs";
import { parseAppearance } from "@/lib/newsletter-designs";
import { saveAppearance } from "@/lib/appearance";
import { revalidatePath } from "next/cache";
export async function PUT(request: Request) {
  if (!canUseStudio(request)) return new Response("Not found", { status: 404 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json({ error: "Send a JSON design." }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json(
      { error: "Choose a design and font." },
      { status: 400 },
    );
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 2048) {
      await reader.cancel();
      return Response.json(
        { error: "Design data is too large." },
        { status: 413 },
      );
    }
    chunks.push(value);
  }
  let appearance;
  try {
    appearance = parseAppearance(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
  } catch {
    return Response.json({ error: "Invalid design data." }, { status: 400 });
  }
  if (!appearance)
    return Response.json(
      { error: "Choose an available design and font." },
      { status: 400 },
    );
  try {
    await saveAppearance(appearance);
    revalidatePath("/", "layout");
    return Response.json(appearance);
  } catch {
    return Response.json(
      { error: "Could not save the design. Please try again." },
      { status: 500 },
    );
  }
}
