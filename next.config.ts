import type { NextConfig } from "next";
const config: NextConfig = {
  distDir: process.env.CAVEAT_TEST_MODE === "1" ? ".next-test" : ".next",
  turbopack: { root: process.cwd() },
  experimental: {
    turbopackFileSystemCacheForDev:
      process.env.CAVEAT_TEST_MODE !== "1" &&
      process.env.CAVEAT_DISABLE_DEV_CACHE !== "1",
  },
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
