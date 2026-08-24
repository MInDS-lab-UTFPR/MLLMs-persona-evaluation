#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { experimentalDesignSvg } from "./figures/experimental-design.mjs";
import { profileSentimentHeatmapSvg } from "./figures/profile-sentiment-heatmap.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "public", "paper");

const profileSentiment = JSON.parse(
  await readFile(resolve(here, "data", "profile-sentiment.json"), "utf8"),
);

const figures = {
  "figure-1-experimental-design.svg": experimentalDesignSvg(),
  "profile-sentiment-heatmap.svg": profileSentimentHeatmapSvg(profileSentiment),
};

await mkdir(outDir, { recursive: true });
for (const [name, svg] of Object.entries(figures)) {
  await writeFile(resolve(outDir, name), svg);
}

console.log(`Wrote ${Object.keys(figures).join(" and ")} to ${outDir}`);
