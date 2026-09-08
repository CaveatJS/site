import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startPrismaDevServer } from "@prisma/dev";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
let server: Awaited<ReturnType<typeof startPrismaDevServer>>;
let db: typeof import("../src/lib/db").db;
let createOwner: typeof import("../src/lib/setup").createOwner;
let delivery: typeof import("../src/lib/delivery");
const originalFetch = globalThis.fetch;
const setupKey = "test-setup-key-that-is-at-least-32-characters";
before(async () => {
  server = await startPrismaDevServer({
    name: "caveat-unit-tests",
    persistenceMode: "stateless",
  });
  process.env.DATABASE_URL = server.database.prismaORMConnectionString;
  process.env.DIRECT_URL = process.env.DATABASE_URL;
  process.env.CAVEAT_SETUP_KEY = setupKey;
  process.env.BETTER_AUTH_SECRET =
    "test-auth-secret-that-is-at-least-32-characters";
  await promisify(execFile)(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: process.env },
  );
  db = (await import("../src/lib/db")).db;
  createOwner = (await import("../src/lib/setup")).createOwner;
  delivery = await import("../src/lib/delivery");
});
after(async () => {
  globalThis.fetch = originalFetch;
  await db?.$disconnect();
  await server?.close();
});

test("setup rejects the wrong key and atomically creates only one owner", async () => {
  await assert.rejects(() =>
    createOwner({
      key: "wrong",
      email: "x@example.com",
      password: "long-test-password",
      name: "X",
    }),
  );
  const results = await Promise.allSettled(
    ["a", "b"].map((name) =>
      createOwner({
        key: setupKey,
        email: `${name}@example.com`,
        password: "long-test-password",
        name,
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(await db.user.count(), 1);
  assert.equal(await db.account.count(), 1);
  assert.equal(await db.publication.count(), 1);
  await assert.rejects(() =>
    createOwner({
      key: setupKey,
      email: "c@example.com",
      password: "long-test-password",
      name: "C",
    }),
  );
});
test("email retries cannot create or send a second broadcast; uncertain sends reconcile", async () => {
  const { seal } = await import("../src/lib/crypto");
  const publication = await db.publication.update({
    where: { id: 1 },
    data: {
      resendKey: seal("re_test"),
      senderEmail: "letters@example.com",
      segmentId: "segment",
      sendingReady: true,
    },
  });
  let creates = 0,
    sends = 0;
  let sent = false;
  let uncertain = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    if (url.hostname !== "api.resend.com") return originalFetch(input, init);
    const path = url.pathname;
    if (path.endsWith("/contacts"))
      return Response.json({
        data: [
          { id: "contact", email: "reader@example.com", unsubscribed: false },
        ],
        has_more: false,
      });
    if (path === "/broadcasts" && init?.method === "POST") {
      creates++;
      return Response.json({ id: `broadcast-${creates}` });
    }
    if (path.endsWith("/send")) {
      sends++;
      sent = true;
      if (uncertain) throw new TypeError("Connection lost after acceptance");
      return Response.json({ id: "broadcast" });
    }
    if (path.startsWith("/broadcasts/"))
      return Response.json({
        id: "broadcast",
        status: sent ? "sent" : "draft",
        sent_at: sent ? new Date().toISOString() : null,
      });
    throw new Error("Unexpected provider path " + path);
  };
  const post = await db.post.create({
    data: { slug: "test-send", title: "A letter" },
  });
  const review = await delivery.prepareEmail(post.id, publication);
  await delivery.sendNewsletter(post.id, review.confirmation, publication);
  await delivery.sendNewsletter(post.id, review.confirmation, publication);
  assert.equal(creates, 1);
  assert.equal(sends, 1);
  assert.equal(
    (await db.delivery.findUnique({ where: { postId: post.id } }))?.state,
    "sent",
  );
  const second = await db.post.create({
    data: { slug: "uncertain", title: "Another letter" },
  });
  uncertain = true;
  const next = await delivery.prepareEmail(second.id, publication);
  const result = await delivery.sendNewsletter(
    second.id,
    next.confirmation,
    publication,
  );
  assert.equal(result?.state, "uncertain");
  await delivery.sendNewsletter(second.id, next.confirmation, publication);
  assert.equal(sends, 2);
  assert.equal(
    (await db.delivery.findUnique({ where: { postId: second.id } }))?.state,
    "sent",
  );
});
test("a changed draft invalidates the send confirmation", async () => {
  const publication = (await db.publication.findUnique({ where: { id: 1 } }))!;
  const post = await db.post.create({
    data: { slug: "changed", title: "Before" },
  });
  const review = await delivery.prepareEmail(post.id, publication);
  await db.post.update({
    where: { id: post.id },
    data: { title: "After", revision: { increment: 1 } },
  });
  await assert.rejects(() =>
    delivery.sendNewsletter(post.id, review.confirmation, publication),
  );
});

test("password reset revokes sessions and consumes its token", async () => {
  let resetMessage = "";
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    if (url.hostname !== "api.resend.com") return originalFetch(input, init);
    assert.equal(url.pathname, "/emails");
    resetMessage = String(init?.body);
    return Response.json({ id: "test-email" });
  };
  const { getAuth } = await import("../src/lib/auth");
  const auth = getAuth();
  const owner = (await db.user.findFirst())!;
  await auth.api.signInEmail({ body: { email: owner.email, password: "long-test-password" } });
  assert.equal(await db.session.count(), 1);
  await auth.api.requestPasswordReset({ body: { email: owner.email, redirectTo: "http://localhost:3000/reset-password" } });
  assert.ok(resetMessage.includes("Reset your Caveat password"));
  const verification = await db.verification.findFirst({ where: { identifier: { startsWith: "reset-password:" } } });
  assert.ok(verification);
  const token = verification.identifier.slice("reset-password:".length);
  await auth.api.resetPassword({ body: { token, newPassword: "a-new-long-password-123" } });
  assert.equal(await db.session.count(), 0);
  await assert.rejects(() => auth.api.resetPassword({ body: { token, newPassword: "another-long-password" } }));
  await assert.rejects(() => auth.api.signInEmail({ body: { email: owner.email, password: "long-test-password" } }));
  await auth.api.signInEmail({ body: { email: owner.email, password: "a-new-long-password-123" } });
  assert.equal(await db.session.count(), 1);
});
