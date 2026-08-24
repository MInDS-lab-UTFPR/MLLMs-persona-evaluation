import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

export const exportDir = new URL("../../out/", import.meta.url);

export function readExported(relativePath) {
  return readFile(new URL(relativePath, exportDir), "utf8");
}

export function readPage() {
  return readExported("index.html");
}

export async function assertExported(relativePath) {
  await access(new URL(relativePath, exportDir));
}

export function metaContents(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

export function readStructuredData(html) {
  const blocks = metaContents(
    html,
    /<script type="application\/ld\+json">(.+?)<\/script>/gs,
  );
  assert.ok(blocks.length > 0, "expected at least one JSON-LD block");

  return blocks.map((block) =>
    JSON.parse(
      block
        .replaceAll("&quot;", '"')
        .replaceAll("&#x27;", "'")
        .replaceAll("&amp;", "&"),
    ),
  );
}
