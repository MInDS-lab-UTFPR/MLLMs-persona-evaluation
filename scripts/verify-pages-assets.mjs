#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { openArtifact } from "./pages-verify/artifact.mjs";
import { checkExportShape } from "./pages-verify/export-shape.mjs";
import { createReferenceChecker } from "./pages-verify/reference-checker.mjs";
import {
  scanCss,
  scanEmbeddedUrls,
  scanHtml,
  scanJs,
  scanViteManifest,
} from "./pages-verify/scanners.mjs";

const artifactRoot = path.resolve(process.argv[2] ?? "dist/client");
const indexPath = path.join(artifactRoot, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error(`Missing static entry point: ${indexPath}`);
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, "utf8");
if (!indexHtml.trim()) {
  console.error(`Static entry point is empty: ${indexPath}`);
  process.exit(1);
}

const canonicalMatch = indexHtml.match(
  /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i,
);
const configuredBase = process.argv[3] ?? canonicalMatch?.[1];

if (!configuredBase) {
  console.error("Pass the public base URL as argv[3], or emit a canonical link.");
  process.exit(1);
}

const baseUrl = new URL(configuredBase);
if (!baseUrl.pathname.endsWith("/")) baseUrl.pathname += "/";
baseUrl.search = "";
baseUrl.hash = "";

const artifact = openArtifact(artifactRoot);
const checker = createReferenceChecker({ artifact, baseUrl });

scanHtml(artifact, checker);
scanCss(artifact, checker);
scanJs(artifact, checker);
scanEmbeddedUrls(artifact, checker);
scanViteManifest(artifact, checker);

checker.errors.push(...checkExportShape({ artifact, baseUrl, indexHtml }));

for (const warning of [...new Set(checker.warnings)].sort()) console.warn(`WARN ${warning}`);
for (const error of [...new Set(checker.errors)].sort()) console.error(`ERROR ${error}`);

console.log(
  `Checked ${checker.checkedTargets.size} unique local targets from ${artifact.absolutePaths.length} artifact files` +
    ` (${checker.checkedAnchors.size} fragment links).`,
);

if (checker.errors.length) process.exit(1);
console.log(
  `PASS: every discovered Pages asset exists with exact path casing under ${artifactRoot}`,
);
