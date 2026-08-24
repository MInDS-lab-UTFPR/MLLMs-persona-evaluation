import fs from "node:fs";
import path from "node:path";

import { decodeHtml, escapeRegExp } from "./text.mjs";

const NON_FETCHED_SCHEMES = /^(?:data|blob|javascript|mailto|tel):/i;

export function createReferenceChecker({ artifact, baseUrl }) {
  const errors = [];
  const warnings = [];
  const checkedTargets = new Map();
  const checkedAnchors = new Set();

  function checkFragment(raw, sourceFile) {
    const anchor = decodeURIComponent(raw.slice(1));
    const html = artifact.readText(sourceFile);
    if (anchor && !new RegExp(`\\bid=["']${escapeRegExp(anchor)}["']`).test(html)) {
      errors.push(`${sourceFile}: missing fragment target ${raw}`);
    }
    checkedAnchors.add(`${sourceFile}${raw}`);
  }

  function check(rawReference, sourceFile, sourceUrl, kind = "asset") {
    const raw = decodeHtml(rawReference.trim());
    if (!raw || NON_FETCHED_SCHEMES.test(raw)) return;

    if (raw.startsWith("#")) {
      if (kind === "link") checkFragment(raw, sourceFile);
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
      relativeUrlPath = decodeURIComponent(
        resolved.pathname.slice(baseUrl.pathname.length),
      );
    } catch (error) {
      errors.push(
        `${sourceFile}: invalid percent encoding in ${resolved.href} (${error.message})`,
      );
      return;
    }

    if (!relativeUrlPath || relativeUrlPath.endsWith("/")) {
      relativeUrlPath += "index.html";
    }

    const normalized = path.posix.normalize(relativeUrlPath);
    if (
      normalized === ".." ||
      normalized.startsWith("../") ||
      path.posix.isAbsolute(normalized)
    ) {
      errors.push(`${sourceFile}: asset escapes artifact root: ${raw}`);
      return;
    }

    const absolute = artifact.absolutePathOf(normalized);
    if (
      absolute !== artifact.root &&
      !absolute.startsWith(`${artifact.root}${path.sep}`)
    ) {
      errors.push(`${sourceFile}: asset escapes artifact root: ${raw}`);
      return;
    }

    if (!artifact.existsWithExactCase(normalized) || !fs.statSync(absolute).isFile()) {
      errors.push(`${sourceFile}: missing ${kind} ${normalized} (from ${raw})`);
      return;
    }
    if (fs.statSync(absolute).size === 0) {
      errors.push(`${sourceFile}: empty ${kind} ${normalized} (from ${raw})`);
      return;
    }

    const sources = checkedTargets.get(normalized) ?? new Set();
    sources.add(sourceFile);
    checkedTargets.set(normalized, sources);
  }

  return {
    check,
    errors,
    warnings,
    checkedTargets,
    checkedAnchors,
    baseUrl,
    urlFor: (relativePath) => new URL(relativePath, baseUrl),
  };
}
