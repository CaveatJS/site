import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getPosts, savePost, validatePost } from "../lib/posts.mjs";
import { canUseStudio } from "../lib/studio-access.mjs";
import { renderFeed } from "../lib/feed.mjs";

const draft = {
  slug: "a-draft",
  title: "A draft",
  description: "A description",
  authors: ["Jonas", "Sarah"],
  date: "2026-09-08",
  published: false,
  body: "# Hello\n\nSome **writing**.",
};

test("posts persist, drafts stay out of public queries, and existing posts cannot be overwritten by create", async () => {
  const directory = await mkdtemp(join(tmpdir(), "caveat-post-test-"));
  try {
    await savePost(draft, { directory, create: true });
    assert.equal((await getPosts({ directory })).length, 0);
    const saved = (await getPosts({ directory, includeDrafts: true }))[0];
    assert.deepEqual(saved.authors, ["Jonas", "Sarah"]);
    assert.match(saved.body, /Some \*\*writing\*\*/);
    await assert.rejects(
      savePost({ ...draft, title: "Overwrite" }, { directory, create: true }),
      { code: "EEXIST" },
    );
    await savePost({ ...draft, published: true }, { directory });
    assert.equal((await getPosts({ directory }))[0].title, "A draft");
    assert.match(
      await readFile(join(directory, "a-draft.md"), "utf8"),
      /published: true/,
    );
    await savePost(draft, { directory });
    assert.deepEqual(await getPosts({ directory }), []);
    await assert.rejects(
      savePost({ ...draft, slug: "missing" }, { directory }),
      { code: "ENOENT" },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("invalid paths, dates, authors, and content are rejected", () => {
  for (const slug of [
    "../escape",
    "/absolute",
    "post.md",
    "",
    "Uppercase",
    "a".repeat(101),
  ])
    assert.throws(() => validatePost({ ...draft, slug }));
  for (const date of ["2026-02-30", "bad", "2026-13-01"])
    assert.throws(() => validatePost({ ...draft, date }));
  assert.throws(() => validatePost({ ...draft, authors: [""] }));
  assert.throws(() => validatePost({ ...draft, title: "" }));
  assert.throws(() => validatePost({ ...draft, body: "a".repeat(100001) }));
});

test("studio writes require development mode and a matching loopback origin", () => {
  const request = (host, origin, method = "POST") =>
    new Request("http://localhost/api/studio/posts", {
      method,
      headers: { host, ...(origin ? { origin } : {}) },
    });
  assert.equal(
    canUseStudio(
      request("localhost:3210", "http://localhost:3210"),
      "development",
    ),
    true,
  );
  assert.equal(
    canUseStudio(
      request("localhost:3210", "http://localhost:3210"),
      "production",
    ),
    false,
  );
  assert.equal(
    canUseStudio(
      request("localhost:3210", "https://attacker.example"),
      "development",
    ),
    false,
  );
  assert.equal(
    canUseStudio(
      request("attacker.example", "http://attacker.example"),
      "development",
    ),
    false,
  );
  assert.equal(
    canUseStudio(request("localhost:3210", null), "development"),
    false,
  );
  assert.equal(
    canUseStudio(request("localhost:3210", null, "GET"), "development"),
    true,
  );
});

test("RSS excludes drafts and escapes publication and post text", () => {
  const feed = renderFeed(
    { name: "A & B", description: "<hello>", url: "https://example.com" },
    [
      draft,
      { ...draft, slug: "public", title: "<Public & safe>", published: true },
    ],
  );
  assert.ok(!feed.includes("/posts/a-draft"));
  assert.ok(feed.includes("&lt;Public &amp; safe&gt;"));
  assert.ok(feed.includes("https://example.com/posts/public"));
});
