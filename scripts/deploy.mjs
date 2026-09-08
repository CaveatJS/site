import "dotenv/config";
import { spawnSync } from "node:child_process";
export function validateDeployment(env) {
  if (env.VERCEL_ENV === "preview") {
    if (
      !env.PREVIEW_DATABASE_URL ||
      env.PREVIEW_DATABASE_URL === env.DATABASE_URL
    )
      throw new Error("Preview blocked: set a separate PREVIEW_DATABASE_URL.");
    if (env.PREVIEW_DIRECT_URL && env.PREVIEW_DIRECT_URL === env.DIRECT_URL)
      throw new Error("Preview blocked: use a separate migration connection.");
  } else if (!env.DATABASE_URL)
    throw new Error(
      "Connect Prisma Postgres in Vercel Storage before deployment.",
    );
  for (const name of ["BETTER_AUTH_SECRET", "CAVEAT_SETUP_KEY"])
    if (!env[name] || env[name].length < 32)
      throw new Error(`Set ${name} to at least 32 random characters.`);
  if (env.BETTER_AUTH_SECRET === env.CAVEAT_SETUP_KEY)
    throw new Error("Use different values for the auth secret and setup key.");
}
if (process.argv[1]?.endsWith("/deploy.mjs")) {
  validateDeployment(process.env);
  for (const [bin, args] of [
    ["node_modules/prisma/build/index.js", ["generate"]],
    ["node_modules/prisma/build/index.js", ["migrate", "deploy"]],
    ["node_modules/next/dist/bin/next", ["build"]],
  ]) {
    const result = spawnSync(process.execPath, [bin, ...args], {
      stdio: "inherit",
      env: process.env,
    });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
