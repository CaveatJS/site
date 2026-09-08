import "dotenv/config";
import { readFileSync, existsSync } from "node:fs";
import { hashPassword } from "better-auth/crypto";
// Read a new password from a protected file, never an argument or terminal log.
const passwordFile = process.argv[2];
if (!passwordFile)
  throw new Error(
    "Usage: npm run owner:recover -- /path/to/private-password-file",
  );
const password = readFileSync(passwordFile, "utf8").trim();
if (password.length < 12 || password.length > 128)
  throw new Error("Use a password between 12 and 128 characters.");
if (!process.env.DATABASE_URL && existsSync(".local/runtime.json"))
  process.env.DATABASE_URL = JSON.parse(
    readFileSync(".local/runtime.json", "utf8"),
  ).databaseUrl;
const { db } = await import("../src/lib/db");
try {
  const owner = await db.publication.findUnique({ where: { id: 1 } });
  if (!owner) throw new Error("No owner exists. Use the initial setup screen.");
  const hashed = await hashPassword(password);
  await db.$transaction(async (tx) => {
    await tx.account.updateMany({
      where: { userId: owner.ownerId, providerId: "credential" },
      data: { password: hashed },
    });
    await tx.session.deleteMany({ where: { userId: owner.ownerId } });
    await tx.verification.deleteMany({});
  });
  console.log(
    "Owner password changed. Existing sessions and reset links have been revoked.",
  );
} finally {
  await db.$disconnect();
}
