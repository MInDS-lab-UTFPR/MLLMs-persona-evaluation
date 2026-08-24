import assert from "node:assert/strict";
import test from "node:test";

import { assertExported, readExported } from "./helpers/exported-site.mjs";

test("ships both figures the page references", async () => {
  for (const figure of [
    "paper/figure-1-experimental-design.svg",
    "paper/profile-sentiment-heatmap.svg",
  ]) {
    await assertExported(figure);
  }
});

test("ships every cell of the profile heatmap", async () => {
  const heatmap = await readExported("paper/profile-sentiment-heatmap.svg");
  assert.equal(heatmap.match(/±0\.\d\d</g)?.length, 120);
});
