import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { authSecret, baseUrl } from "./config";
import { unseal } from "./crypto";
import { Resend } from "resend";
function createConfiguredAuth() {
  return betterAuth({
    appName: "Caveat",
    baseURL: baseUrl(),
    secret: authSecret(),
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        const publication = await db.publication.findUnique({
          where: { id: 1 },
        });
        if (
          !publication?.sendingReady ||
          !publication.resendKey ||
          !publication.senderEmail ||
          publication.ownerId !== user.id
        )
          return;
        const result = await new Resend(
          unseal(publication.resendKey),
        ).emails.send({
          from: `${publication.name} <${publication.senderEmail}>`,
          to: user.email,
          subject: "Reset your Caveat password",
          text: `Reset your password: ${url}\nIf you did not request this, ignore this email.`,
        });
        if (result.error) throw new Error("Password reset delivery failed.");
      },
    },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 20 },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    trustedOrigins: [baseUrl()],
  });
}
let instance: ReturnType<typeof createConfiguredAuth> | undefined;
export function getAuth() {
  return (instance ??= createConfiguredAuth());
}
