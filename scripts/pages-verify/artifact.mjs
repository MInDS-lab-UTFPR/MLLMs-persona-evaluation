import fs from "node:fs";
import path from "node:path";

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

export function openArtifact(root) {
  const absolutePaths = walk(root);

  const absolutePathOf = (relativePath) =>
    path.resolve(root, ...relativePath.split("/").filter(Boolean));

  return {
    root,
    absolutePaths,
    relativePaths: absolutePaths.map((file) => path.relative(root, file)),

    absolutePathOf,

    filesMatching: (pattern) =>
      absolutePaths.filter((file) => pattern.test(file)),

    posixPathOf: (absolutePath) =>
      path.relative(root, absolutePath).split(path.sep).join("/"),

    readText: (relativePath) =>
      fs.readFileSync(absolutePathOf(relativePath), "utf8"),

    /* Pages is case-sensitive where macOS is not, so every segment is matched
       against the real directory listing rather than through fs.existsSync. */
    existsWithExactCase(relativePath) {
      const segments = relativePath.split("/").filter(Boolean);
      let current = root;
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
    },
  };
}
