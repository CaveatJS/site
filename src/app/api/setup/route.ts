import { endpoint, checkOrigin, body, rateLimit } from "@/lib/http";
import { createOwner, setupSchema } from "@/lib/setup";
export const POST = endpoint(async (request) => {
  checkOrigin(request);
  await rateLimit(request, "setup", 5);
  await createOwner(await body(request, setupSchema));
  return Response.json({ ok: true });
});
