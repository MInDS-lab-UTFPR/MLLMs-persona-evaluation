import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(githubPages
    ? {
        basePath: "/MLLMs-persona-evaluation",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
