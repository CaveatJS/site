export function baseUrl() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`;
  return (
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}
export function authSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Set BETTER_AUTH_SECRET to at least 32 random characters.");
  return secret;
}
