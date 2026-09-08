import "dotenv/config";
import { defineConfig } from "prisma/config";
const preview = process.env.VERCEL_ENV === "preview";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: preview
      ? process.env.PREVIEW_DIRECT_URL ||
        process.env.PREVIEW_DATABASE_URL ||
        "postgresql://missing-preview-database/disabled"
      : process.env.DIRECT_URL ||
        process.env.DATABASE_URL ||
        "postgresql://localhost:5432/caveat",
  },
});
