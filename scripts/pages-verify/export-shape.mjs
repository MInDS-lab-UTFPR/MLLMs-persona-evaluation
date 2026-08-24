import path from "node:path";

import { escapeRegExp } from "./text.mjs";

export function checkExportShape({ artifact, baseUrl, indexHtml }) {
  const errors = [];
  const basePathPrefix = baseUrl.pathname.replace(/\/$/, "");
  const clientBundlePattern = new RegExp(
    `${escapeRegExp(basePathPrefix)}\\/_next\\/static\\/[^"']+\\.js`,
  );

  if (!clientBundlePattern.test(indexHtml)) {
    errors.push(
      `index.html references no ${basePathPrefix}/_next/static script; the client bundle would never load.`,
    );
  }

  if (!artifact.relativePaths.some((file) => file.startsWith(`_next${path.sep}static`))) {
    errors.push("Missing _next/static; the export produced no client assets.");
  }

  if (!artifact.relativePaths.includes(".nojekyll")) {
    errors.push(
      "Missing .nojekyll; GitHub Pages may process or omit underscore-prefixed _next files.",
    );
  }

  return errors;
}
