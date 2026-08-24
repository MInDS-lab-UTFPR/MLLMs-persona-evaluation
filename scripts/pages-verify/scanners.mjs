import { escapeRegExp, parseAttributes } from "./text.mjs";

const TAGS_WITH_REFERENCES =
  /<(script|link|img|source|video|audio|iframe|object|embed|a|meta)\b([^>]*)>/gi;

const isMetadataUrlKey = (key) =>
  key === "og:url" || key.endsWith(":image") || key.endsWith("_image");

function checkSrcset(value, sourceFile, sourceUrl, checker) {
  for (const candidate of value.split(",")) {
    const url = candidate.trim().split(/\s+/, 1)[0];
    if (url) checker.check(url, sourceFile, sourceUrl, "srcset asset");
  }
}

export function scanHtml(artifact, checker) {
  for (const absolutePath of artifact.filesMatching(/\.html$/)) {
    const sourceFile = artifact.posixPathOf(absolutePath);
    const html = artifact.readText(sourceFile);
    const documentUrl = checker.urlFor(sourceFile);

    for (const match of html.matchAll(TAGS_WITH_REFERENCES)) {
      const tag = match[1].toLowerCase();
      const attributes = parseAttributes(match[2]);

      if (tag === "script" && attributes.has("src")) {
        checker.check(attributes.get("src"), sourceFile, documentUrl, "script");
      } else if (tag === "link" && attributes.has("href")) {
        checker.check(attributes.get("href"), sourceFile, documentUrl, "linked resource");
      } else if (tag === "object" && attributes.has("data")) {
        checker.check(attributes.get("data"), sourceFile, documentUrl, "object");
      } else if (tag === "a" && attributes.has("href")) {
        checker.check(attributes.get("href"), sourceFile, documentUrl, "link");
      } else if (tag === "meta" && attributes.has("content")) {
        const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
        if (isMetadataUrlKey(key)) {
          checker.check(attributes.get("content"), sourceFile, documentUrl, "metadata resource");
        }
      } else if (attributes.has("src")) {
        checker.check(attributes.get("src"), sourceFile, documentUrl, `${tag} source`);
      }

      if (attributes.has("poster")) {
        checker.check(attributes.get("poster"), sourceFile, documentUrl, "poster");
      }
      if (attributes.has("srcset")) {
        checkSrcset(attributes.get("srcset"), sourceFile, documentUrl, checker);
      }
    }
  }
}

export function scanCss(artifact, checker) {
  for (const absolutePath of artifact.filesMatching(/\.css$/)) {
    const sourceFile = artifact.posixPathOf(absolutePath);
    const css = artifact.readText(sourceFile);
    const cssUrl = checker.urlFor(sourceFile);

    for (const match of css.matchAll(
      /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\s*\)/gi,
    )) {
      checker.check(match[1] ?? match[2] ?? match[3], sourceFile, cssUrl, "CSS resource");
    }
    for (const match of css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
      checker.check(match[1], sourceFile, cssUrl, "CSS import");
    }
  }
}

const JS_DEPENDENCY_PATTERNS = [
  /\b(?:import|export)\s*(?:[^"']*?\bfrom\s*)?["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\bnew\s+URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g,
];

export function scanJs(artifact, checker) {
  for (const absolutePath of artifact.filesMatching(/\.js$/)) {
    const sourceFile = artifact.posixPathOf(absolutePath);
    const js = artifact.readText(sourceFile);
    const jsUrl = checker.urlFor(sourceFile);

    for (const pattern of JS_DEPENDENCY_PATTERNS) {
      for (const match of js.matchAll(pattern)) {
        if (/^(?:\.|\/|https?:)/.test(match[1])) {
          checker.check(match[1], sourceFile, jsUrl, "JavaScript dependency");
        }
      }
    }
  }
}

/* Absolute self-references baked into any shipped text file. Matches ending in
   a slash are skipped: the framework chunk embeds the asset prefix as a
   concatenation base, not as a resource. */
export function scanEmbeddedUrls(artifact, checker) {
  const sameOriginPattern = new RegExp(
    `${escapeRegExp(checker.baseUrl.origin)}\\/[^\\s"'<>\\\\)]*`,
    "g",
  );

  for (const absolutePath of artifact.filesMatching(
    /\.(?:html|rsc|js|css|json|xml|txt)$/i,
  )) {
    const sourceFile = artifact.posixPathOf(absolutePath);
    const text = artifact.readText(sourceFile);
    const sourceUrl = checker.urlFor(sourceFile);

    for (const match of text.matchAll(sameOriginPattern)) {
      if (match[0].endsWith("/")) continue;
      checker.check(match[0], sourceFile, sourceUrl, "embedded same-site resource");
    }
  }
}

export function scanViteManifest(artifact, checker) {
  const manifestPath = ".vite/manifest.json";
  if (!artifact.existsWithExactCase(manifestPath)) return;

  const manifest = JSON.parse(artifact.readText(manifestPath));
  const manifestKeys = new Set(Object.keys(manifest));

  for (const [key, entry] of Object.entries(manifest)) {
    for (const field of ["imports", "dynamicImports"]) {
      for (const importedKey of entry[field] ?? []) {
        if (!manifestKeys.has(importedKey)) {
          checker.errors.push(
            `${manifestPath}: ${key}.${field} references missing key ${importedKey}`,
          );
        }
      }
    }
    for (const file of [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])].filter(
      Boolean,
    )) {
      checker.check(file, manifestPath, checker.urlFor(""), "Vite manifest asset");
    }
  }
}
