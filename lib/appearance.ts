import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  defaultAppearance,
  parseAppearance,
  type Appearance,
} from "./newsletter-designs";
const path = join(process.cwd(), "content", "appearance.json");
export async function readAppearance(): Promise<Appearance> {
  try {
    return (
      parseAppearance(JSON.parse(await readFile(path, "utf8"))) ??
      defaultAppearance
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      return defaultAppearance;
    throw error;
  }
}
export async function saveAppearance(appearance: Appearance) {
  const temporary = path + "." + randomUUID() + ".tmp";
  try {
    await writeFile(temporary, JSON.stringify(appearance, null, 2) + "\n");
    await rename(temporary, path);
  } finally {
    await unlink(temporary).catch(() => {});
  }
}
