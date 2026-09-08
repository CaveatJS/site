import {
  readdir,
  readFile,
  mkdir,
  writeFile,
  rename,
  rm,
} from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";

const contentDirectory = join(process.cwd(), "content", "posts");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePost(input) {
  if (!input || typeof input !== "object")
    throw new Error("A post is required.");
  if (
    typeof input.slug !== "string" ||
    input.slug.length > 100 ||
    !validSlug.test(input.slug)
  ) {
    throw new Error(
      "Use lowercase letters, numbers, and hyphens for the post URL.",
    );
  }
  for (const [key, limit] of [
    ["title", 200],
    ["description", 600],
    ["body", 100000],
  ]) {
    if (
      typeof input[key] !== "string" ||
      input[key].length > limit ||
      (key === "title" && !input[key].trim())
    ) {
      throw new Error(`Check the ${key} field (maximum ${limit} characters).`);
    }
  }
  if (
    !Array.isArray(input.authors) ||
    !input.authors.length ||
    input.authors.length > 10 ||
    input.authors.some(
      (author) =>
        typeof author !== "string" || !author.trim() || author.length > 100,
    )
  ) {
    throw new Error("Add at least one author (maximum 10).");
  }
  if (
    typeof input.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
    Number.isNaN(Date.parse(input.date)) ||
    new Date(input.date).toISOString().slice(0, 10) !== input.date
  ) {
    throw new Error("Choose a valid publication date.");
  }
  if (typeof input.published !== "boolean")
    throw new Error("Choose draft or published status.");
  return {
    slug: input.slug,
    title: input.title.trim(),
    description: input.description.trim(),
    authors: input.authors.map((author) => author.trim()),
    date: input.date,
    published: input.published,
    body: input.body,
  };
}

export async function getPosts({
  includeDrafts = false,
  directory = contentDirectory,
} = {}) {
  let files;
  // The content glob is explicitly included in next.config.ts for deployment.
  try {
    files = await readdir(/* turbopackIgnore: true */ directory);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const { data, content } = matter(
          await readFile(
            /* turbopackIgnore: true */ join(
              /* turbopackIgnore: true */ directory,
              file,
            ),
            "utf8",
          ),
        );
        return validatePost({
          ...data,
          slug: file.slice(0, -3),
          body: content,
        });
      }),
  );
  return posts
    .filter((post) => includeDrafts || post.published)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}

export async function savePost(
  input,
  { create = false, directory = contentDirectory } = {},
) {
  const post = validatePost(input);
  await mkdir(directory, { recursive: true });
  const { slug, body, ...metadata } = post;
  const destination = join(directory, `${slug}.md`);
  const content = matter.stringify(body, metadata);
  if (create) {
    await writeFile(destination, content, { flag: "wx" });
  } else {
    // Require the existing file; a mistyped URL cannot silently create a new article.
    await readFile(destination);
    const temporary = join(directory, `.${slug}-${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, content, { flag: "wx" });
      await rename(temporary, destination);
    } finally {
      await rm(temporary, { force: true });
    }
  }
  return post;
}

export function readTime(body) {
  return `${Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220))} min read`;
}
