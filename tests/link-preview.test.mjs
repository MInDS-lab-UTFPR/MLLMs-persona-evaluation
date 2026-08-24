import assert from "node:assert/strict";
import test from "node:test";

import { assertExported, metaContents, readPage } from "./helpers/exported-site.mjs";

test("previews the link with a raster card crawlers will actually render", async () => {
  const html = await readPage();

  const images = [
    ...metaContents(html, /<meta property="og:image"[^>]*content="([^"]+)"/g),
    ...metaContents(html, /<meta name="twitter:image"[^>]*content="([^"]+)"/g),
  ];

  assert.ok(images.length >= 2, "expected og:image and twitter:image");
  for (const image of images) {
    assert.match(image, /^https:\/\/.+\.(?:png|jpg|jpeg)$/, `${image} is not a raster URL`);
  }

  await assertExported("og.png");
  assert.match(html, /<meta property="og:image:width" content="1200"/);
  assert.match(html, /<meta property="og:image:height" content="630"/);
});
