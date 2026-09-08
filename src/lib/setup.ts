import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { db } from "./db";
import { equalSecret } from "./crypto";
import { HttpError } from "./http";
export const setupSchema = z.object({
  key: z.string().min(1),
  email: z.email().transform((s) => s.toLowerCase()),
  password: z.string().min(12).max(128),
  name: z.string().trim().min(1).max(80),
});
export async function createOwner(input: z.infer<typeof setupSchema>) {
  const key = process.env.CAVEAT_SETUP_KEY;
  if (!key || key.length < 32 || !equalSecret(input.key, key))
    throw new HttpError(403, "The setup key does not match.");
  const password = await hashPassword(input.password);
  const id = randomUUID();
  try {
    await db.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id,
          name: input.name,
          email: input.email,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: id,
              providerId: "credential",
              password,
            },
          },
        },
      });
      // The singleton primary key is the final authority, even across concurrent requests.
      await tx.publication.create({
        data: { id: 1, ownerId: id, author: input.name },
      });
    });
  } catch (error) {
    if (await db.publication.count())
      throw new HttpError(
        409,
        "This publication already has an owner. Sign in instead.",
      );
    throw error;
  }
}
