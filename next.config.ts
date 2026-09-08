import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/*": ["./content/posts/**/*.md", "./content/appearance.json"],
  },
};

export default config;
