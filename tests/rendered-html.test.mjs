import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outDir = new URL("../out/", import.meta.url);

async function page() {
  return readFile(new URL("index.html", outDir), "utf8");
}

test("exports the paper page as static HTML", async () => {
  const html = await page();

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

test("keeps the citation metadata pointing at the UrbCom paper", async () => {
  const html = await page();

  assert.match(html, /citation_arxiv_id" content="2604\.28048"/);
  assert.match(html, /10\.48550\/arXiv\.2604\.28048/);

  const bibtex = await readFile(new URL("citation.bib", outDir), "utf8");
  assert.match(bibtex, /@inproceedings\{urbcom26-neemias,/);
  assert.match(bibtex, /Proc\. of IEEE DCOSS-IoT-UrbCom/);
});

test("describes the article for crawlers with the abstract a reader sees", async () => {
  const html = await page();
  const structured = html.match(
    /<script type="application\/ld\+json">(.+?)<\/script>/s,
  );
  assert.ok(structured, "expected a JSON-LD block");

  const data = JSON.parse(
    structured[1]
      .replaceAll("&quot;", '"')
      .replaceAll("&#x27;", "'")
      .replaceAll("&amp;", "&"),
  );
  assert.equal(data["@type"], "ScholarlyArticle");
  assert.equal(data.author.length, 4);
  assert.match(data.abstract, /^Large Language Models \(LLMs\) are increasingly used/);
  assert.match(data.abstract, /limited annotation value in this setting\.$/);
});

test("previews the link with a raster card crawlers will actually render", async () => {
  const html = await page();

  /* An SVG here is the failure that matters: the page still builds and deploys,
     and the shared link silently comes out with no image. */
  const images = [...html.matchAll(/<meta property="og:image"[^>]*content="([^"]+)"/g)]
    .concat([...html.matchAll(/<meta name="twitter:image"[^>]*content="([^"]+)"/g)])
    .map((match) => match[1]);

  assert.ok(images.length >= 2, "expected og:image and twitter:image");
  for (const image of images) {
    assert.match(image, /^https:\/\/.+\.(?:png|jpg|jpeg)$/, `${image} is not a raster URL`);
  }

  await access(new URL("og.png", outDir));
  assert.match(html, /<meta property="og:image:width" content="1200"/);
  assert.match(html, /<meta property="og:image:height" content="630"/);
});

test("ships both figures the page references", async () => {
  for (const figure of [
    "paper/figure-1-experimental-design.svg",
    "paper/profile-sentiment-heatmap.svg",
  ]) {
    await access(new URL(figure, outDir));
  }

  const heatmap = await readFile(
    new URL("paper/profile-sentiment-heatmap.svg", outDir),
    "utf8",
  );
  /* 24 profiles x 5 sentiment labels, with the notebook's own numbers. */
  assert.equal(heatmap.match(/±0\.\d\d</g)?.length, 120);
});
