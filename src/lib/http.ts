import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createHash } from "node:crypto";
import { db } from "./db";
import { getAuth } from "./auth";
import { baseUrl } from "./config";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function requireOwner() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) throw new HttpError(401, "Please sign in.");
  const publication = await db.publication.findUnique({ where: { id: 1 } });
  if (!publication || publication.ownerId !== session.user.id)
    throw new HttpError(403, "Only the publication owner can do this.");
  return { session, publication };
}
export async function ownerPage() {
  try {
    return await requireOwner();
  } catch (error) {
    if (error instanceof HttpError) redirect("/login");
    throw error;
  }
}
export function checkOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(baseUrl()).origin)
    throw new HttpError(403, "Open this form on your publication website.");
}
export async function body<T>(request: Request, schema: z.ZodType<T>) {
  if (Number(request.headers.get("content-length") || 0) > 260000)
    throw new HttpError(413, "This request is too large.");
  const text = await request.text();
  if (text.length > 260000)
    throw new HttpError(413, "This request is too large.");
  return schema.parse(JSON.parse(text));
}
export function endpoint(fn: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof HttpError)
        return Response.json(
          { error: error.message },
          { status: error.status },
        );
      if (error instanceof z.ZodError)
        return Response.json(
          { error: error.issues[0]?.message || "Check your entries." },
          { status: 400 },
        );
      if (error instanceof SyntaxError)
        return Response.json({ error: "Invalid request." }, { status: 400 });
      console.error(
        "Caveat operation failed:",
        error instanceof Error ? error.name : "Unknown error",
      );
      return Response.json(
        {
          error:
            "Could not complete this request. Check your connection and try again.",
        },
        { status: 500 },
      );
    }
  };
}
export async function rateLimit(request: Request, scope: string, maximum = 10) {
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for") || "unknown"
    : "local";
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  const now = Date.now();
  const result = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO rate_limits (id, key, count, "lastRequest") VALUES (${key}, ${key}, 1, ${now})
    ON CONFLICT (key) DO UPDATE SET count = CASE WHEN rate_limits."lastRequest" < ${now - 60000} THEN 1 ELSE rate_limits.count + 1 END,
    "lastRequest" = CASE WHEN rate_limits."lastRequest" < ${now - 60000} THEN ${now} ELSE rate_limits."lastRequest" END RETURNING count`;
  if (result[0].count > maximum)
    throw new HttpError(429, "Too many attempts. Please wait a minute.");
}
