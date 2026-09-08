import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalDB = globalThis as unknown as { caveatDB?: PrismaClient };
export function databaseUrl() {
  if (process.env.VERCEL_ENV === "preview") {
    const url = process.env.PREVIEW_DATABASE_URL;
    if (!url || url === process.env.DATABASE_URL)
      throw new Error("Preview requires a separate PREVIEW_DATABASE_URL.");
    return url;
  }
  return process.env.DATABASE_URL;
}
export function databaseConfigured() {
  return Boolean(databaseUrl());
}
export const db =
  globalDB.caveatDB ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl() || "postgresql://localhost:5432/caveat",
      max: 3,
      connectionTimeoutMillis: 10000,
    }),
  });
if (process.env.NODE_ENV !== "production") globalDB.caveatDB = db;
