import assert from "node:assert/strict";
import test from "node:test";

import { readPage } from "./helpers/exported-site.mjs";

const RESOURCES = [
  "https://arxiv.org/pdf/2604.28048",
  "https://arxiv.org/abs/2604.28048",
  "https://doi.org/10.48550/arXiv.2604.28048",
  "https://github.com/neemiasbsilva/mllm-persona-evaluation",
  "https://huggingface.co/datasets/MInDS-lab-UTFPR/UrbanPersona-60K",
];

test("links every resource the paper releases", async () => {
  const html = await readPage();

  for (const resource of RESOURCES) {
    assert.match(html, new RegExp(`href="${resource.replaceAll(".", "\\.")}"`), resource);
  }
});

test("names the dataset where a reader meets the numbers", async () => {
  const html = await readPage();
  const note = html.match(/<p class="dataset-note">(.+?)<\/p>/s);

  assert.ok(note, "expected a dataset note in the study section");
  assert.match(note[1], /UrbanPersona-60K/);
  assert.match(note[1], /huggingface\.co\/datasets\/Neemias\/UrbanPersona-60K/);
});
