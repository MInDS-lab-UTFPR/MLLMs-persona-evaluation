import assert from "node:assert/strict";
import test from "node:test";

import { readPage } from "./helpers/exported-site.mjs";

test("exports the paper page as static HTML", async () => {
  const html = await readPage();

  assert.match(
    html,
    /<title>Stable Behavior, Limited Variation: Persona Validity in LLM Agents for Urban Sentiment Perception<\/title>/i,
  );
  assert.match(html, /Neemias B da Silva/);
  assert.match(html, /Thiago H Silva/);
  assert.match(html, /Federal University of Technology – Parana \(UTFPR\), Brazil/);
  assert.match(html, /Qwen3-VL-8B/);
  assert.match(html, /59,708/);
});
