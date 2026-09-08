import { startPrismaDevServer } from "@prisma/dev";
import { spawn } from "node:child_process";
import {
  existsSync,
  appendFileSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { config } from "dotenv";
config({ quiet: true });
const test = process.env.CAVEAT_TEST_MODE === "1";
const port = process.env.PORT || "3000";
if (!test) {
  if (!existsSync(".env"))
    writeFileSync(
      ".env",
      "# Private local Caveat settings. Never commit this file.\n",
      { mode: 0o600 },
    );
  for (const key of ["BETTER_AUTH_SECRET", "CAVEAT_SETUP_KEY"]) {
    if (!process.env[key]) {
      const value = randomBytes(32).toString("hex");
      appendFileSync(".env", `${key}=${value}\n`);
      process.env[key] = value;
    }
  }
}
process.env.BETTER_AUTH_URL ||= `http://localhost:${port}`;
const local = !process.env.DATABASE_URL || test;
const server = local
  ? await startPrismaDevServer({
      name: `caveat-${createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12)}${test ? "-test" : ""}`,
      persistenceMode: test ? "stateless" : "stateful",
    })
  : null;
if (server) {
  process.env.DATABASE_URL = server.database.prismaORMConnectionString;
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}
function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [bin, ...args], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed: ${code}`)),
    );
  });
}
try {
  await run("node_modules/prisma/build/index.js", ["generate"]);
  await run("node_modules/prisma/build/index.js", ["migrate", "deploy"]);
  console.log(`\nCaveat is ready at http://localhost:${port}`);
  if (!test)
    console.log("Your private setup key is saved in .env as CAVEAT_SETUP_KEY.");
  mkdirSync(".local", { recursive: true });
  if (!test)
    writeFileSync(
      ".local/runtime.json",
      JSON.stringify({ databaseUrl: process.env.DATABASE_URL }),
      { mode: 0o600 },
    );
  const app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      port,
    ],
    { stdio: "inherit", env: process.env },
  );
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    app.kill("SIGTERM");
    await server?.close();
  };
  process.once("SIGINT", () => void close());
  process.once("SIGTERM", () => void close());
  app.on("exit", async (code) => {
    await close();
    process.exit(code || 0);
  });
} catch (error) {
  await server?.close();
  throw error;
}
