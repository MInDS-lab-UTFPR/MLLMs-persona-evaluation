#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

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

const errors = [];
const warnings = [];
const checkedFiles = new Map();
const checkedAnchors = new Set();

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

const artifactFiles = walk(artifactRoot);
const relativeFiles = artifactFiles.map((file) => path.relative(artifactRoot, file));

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:0*39|x0*27);/gi, "'")
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function exactPathExists(relativePath) {
  const segments = relativePath.split("/").filter(Boolean);
  let current = artifactRoot;
  for (const segment of segments) {
    let entries;
    try {
      entries = fs.readdirSync(current);
    } catch {
      return false;
    }
    if (!entries.includes(segment)) return false;
    current = path.join(current, segment);
  }
  return fs.existsSync(current);
}

function pageUrlFor(relativeHtmlPath) {
  const normalized = relativeHtmlPath.split(path.sep).join("/");
  return new URL(normalized, baseUrl);
}

function checkReference(rawReference, sourceFile, sourceUrl, kind = "asset") {
  const raw = decodeHtml(rawReference.trim());
  if (!raw || /^(?:data|blob|javascript|mailto|tel):/i.test(raw)) return;

  if (raw.startsWith("#")) {
    if (kind === "link") {
      const anchor = decodeURIComponent(raw.slice(1));
      const html = fs.readFileSync(path.join(artifactRoot, sourceFile), "utf8");
      const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (anchor && !new RegExp(`\\bid=["']${escaped}["']`).test(html)) {
        errors.push(`${sourceFile}: missing fragment target ${raw}`);
      }
      checkedAnchors.add(`${sourceFile}${raw}`);
    }
    return;
  }

  let resolved;
  try {
    resolved = new URL(raw, sourceUrl);
  } catch (error) {
    errors.push(`${sourceFile}: invalid URL ${JSON.stringify(raw)} (${error.message})`);
    return;
  }

  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return;
  if (resolved.origin !== baseUrl.origin) return;

  if (!resolved.pathname.startsWith(baseUrl.pathname)) {
    warnings.push(
      `${sourceFile}: same-origin URL is outside the Pages project path: ${resolved.href}`,
    );
    return;
  }

  let relativeUrlPath;
  try {
    relativeUrlPath = decodeURIComponent(resolved.pathname.slice(baseUrl.pathname.length));
  } catch (error) {
    errors.push(`${sourceFile}: invalid percent encoding in ${resolved.href} (${error.message})`);
    return;
  }

  if (!relativeUrlPath || relativeUrlPath.endsWith("/")) {
    relativeUrlPath += "index.html";
  }

  const normalized = path.posix.normalize(relativeUrlPath);
  if (normalized === ".." || normalized.startsWith("../") || path.posix.isAbsolute(normalized)) {
    errors.push(`${sourceFile}: asset escapes artifact root: ${raw}`);
    return;
  }

  const absolute = path.resolve(artifactRoot, ...normalized.split("/"));
  if (absolute !== artifactRoot && !absolute.startsWith(`${artifactRoot}${path.sep}`)) {
    errors.push(`${sourceFile}: asset escapes artifact root: ${raw}`);
    return;
  }

  if (!exactPathExists(normalized) || !fs.statSync(absolute).isFile()) {
    errors.push(`${sourceFile}: missing ${kind} ${normalized} (from ${raw})`);
    return;
  }
  if (fs.statSync(absolute).size === 0) {
    errors.push(`${sourceFile}: empty ${kind} ${normalized} (from ${raw})`);
    return;
  }

  const sources = checkedFiles.get(normalized) ?? new Set();
  sources.add(sourceFile);
  checkedFiles.set(normalized, sources);
}

function parseAttributes(text) {
  const attributes = new Map();
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of text.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function checkSrcset(value, sourceFile, sourceUrl) {
  for (const candidate of value.split(",")) {
    const url = candidate.trim().split(/\s+/, 1)[0];
    if (url) checkReference(url, sourceFile, sourceUrl, "srcset asset");
  }
}

for (const absoluteHtmlPath of artifactFiles.filter((file) => file.endsWith(".html"))) {
  const relativeHtmlPath = path.relative(artifactRoot, absoluteHtmlPath).split(path.sep).join("/");
  const html = fs.readFileSync(absoluteHtmlPath, "utf8");
  const documentUrl = pageUrlFor(relativeHtmlPath);
  const tagPattern = /<(script|link|img|source|video|audio|iframe|object|embed|a|meta)\b([^>]*)>/gi;

  for (const match of html.matchAll(tagPattern)) {
    const tag = match[1].toLowerCase();
    const attributes = parseAttributes(match[2]);
    if (tag === "script" && attributes.has("src")) {
      checkReference(attributes.get("src"), relativeHtmlPath, documentUrl, "script");
    } else if (tag === "link" && attributes.has("href")) {
      checkReference(attributes.get("href"), relativeHtmlPath, documentUrl, "linked resource");
    } else if (tag === "object" && attributes.has("data")) {
      checkReference(attributes.get("data"), relativeHtmlPath, documentUrl, "object");
    } else if (tag === "a" && attributes.has("href")) {
      checkReference(attributes.get("href"), relativeHtmlPath, documentUrl, "link");
    } else if (tag === "meta" && attributes.has("content")) {
      const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
      if (key === "og:url" || key.endsWith(":image") || key.endsWith("_image")) {
        checkReference(attributes.get("content"), relativeHtmlPath, documentUrl, "metadata resource");
      }
    } else if (attributes.has("src")) {
      checkReference(attributes.get("src"), relativeHtmlPath, documentUrl, `${tag} source`);
    }

    if (attributes.has("poster")) {
      checkReference(attributes.get("poster"), relativeHtmlPath, documentUrl, "poster");
    }
    if (attributes.has("srcset")) {
      checkSrcset(attributes.get("srcset"), relativeHtmlPath, documentUrl);
    }
  }
}

for (const cssPath of artifactFiles.filter((file) => file.endsWith(".css"))) {
  const relativeCssPath = path.relative(artifactRoot, cssPath).split(path.sep).join("/");
  const css = fs.readFileSync(cssPath, "utf8");
  const cssUrl = new URL(relativeCssPath, baseUrl);
  for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\s*\)/gi)) {
    checkReference(match[1] ?? match[2] ?? match[3], relativeCssPath, cssUrl, "CSS resource");
  }
  for (const match of css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
    checkReference(match[1], relativeCssPath, cssUrl, "CSS import");
  }
}

for (const jsPath of artifactFiles.filter((file) => file.endsWith(".js"))) {
  const relativeJsPath = path.relative(artifactRoot, jsPath).split(path.sep).join("/");
  const js = fs.readFileSync(jsPath, "utf8");
  const jsUrl = new URL(relativeJsPath, baseUrl);
  const patterns = [
    /\b(?:import|export)\s*(?:[^"']*?\bfrom\s*)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\bnew\s+URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of js.matchAll(pattern)) {
      if (/^(?:\.|\/|https?:)/.test(match[1])) {
        checkReference(match[1], relativeJsPath, jsUrl, "JavaScript dependency");
      }
    }
  }
}

const escapedOrigin = baseUrl.origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sameOriginPattern = new RegExp(`${escapedOrigin}\\/[^\\s"'<>\\\\)]*`, "g");
for (const textPath of artifactFiles.filter((file) =>
  /\.(?:html|rsc|js|css|json|xml|txt)$/i.test(file),
)) {
  const relativeTextPath = path.relative(artifactRoot, textPath).split(path.sep).join("/");
  const text = fs.readFileSync(textPath, "utf8");
  const sourceUrl = new URL(relativeTextPath, baseUrl);
  for (const match of text.matchAll(sameOriginPattern)) {
    if (match[0].endsWith("/")) continue;
    checkReference(match[0], relativeTextPath, sourceUrl, "embedded same-site resource");
  }
}

const viteManifestPath = path.join(artifactRoot, ".vite", "manifest.json");
if (fs.existsSync(viteManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(viteManifestPath, "utf8"));
  const manifestKeys = new Set(Object.keys(manifest));
  for (const [key, entry] of Object.entries(manifest)) {
    for (const field of ["imports", "dynamicImports"]) {
      for (const importedKey of entry[field] ?? []) {
        if (!manifestKeys.has(importedKey)) {
          errors.push(`.vite/manifest.json: ${key}.${field} references missing key ${importedKey}`);
        }
      }
    }
    for (const file of [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])].filter(Boolean)) {
      checkReference(file, ".vite/manifest.json", baseUrl, "Vite manifest asset");
    }
  }
}

const basePathPrefix = baseUrl.pathname.replace(/\/$/, "");
const chunkPattern = new RegExp(
  `${basePathPrefix.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\/_next\\/static\\/[^"']+\\.js`,
);
if (!chunkPattern.test(indexHtml)) {
  errors.push(
    `index.html references no ${basePathPrefix}/_next/static script; the client bundle would never load.`,
  );
}
if (!relativeFiles.some((file) => file.startsWith(`_next${path.sep}static`))) {
  errors.push("Missing _next/static; the export produced no client assets.");
}

if (!relativeFiles.includes(".nojekyll")) {
  errors.push("Missing .nojekyll; GitHub Pages may process or omit underscore-prefixed _next files.");
}

for (const warning of [...new Set(warnings)].sort()) console.warn(`WARN ${warning}`);
for (const error of [...new Set(errors)].sort()) console.error(`ERROR ${error}`);

console.log(
  `Checked ${checkedFiles.size} unique local targets from ${artifactFiles.length} artifact files` +
    ` (${checkedAnchors.size} fragment links).`,
);

if (errors.length) process.exit(1);
console.log(`PASS: every discovered Pages asset exists with exact path casing under ${artifactRoot}`);
