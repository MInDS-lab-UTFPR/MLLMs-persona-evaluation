import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

/* Project Pages serve the site from /<repo>/, so the export needs a base path:
   it prefixes the framework chunks and the metadata icon, which the generated
   404 page resolves from its own nested URL rather than from the site root.
   Figures stay relative to index.html and need no prefix. */
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
