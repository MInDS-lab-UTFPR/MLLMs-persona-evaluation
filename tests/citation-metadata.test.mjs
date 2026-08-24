import assert from "node:assert/strict";
import test from "node:test";

import { readExported, readPage } from "./helpers/exported-site.mjs";

test("keeps the citation metadata pointing at the UrbCom paper", async () => {
  const html = await readPage();

  assert.match(html, /citation_arxiv_id" content="2604\.28048"/);
  assert.match(html, /10\.48550\/arXiv\.2604\.28048/);

  const bibtex = await readExported("citation.bib");
  assert.match(bibtex, /@inproceedings\{urbcom26-neemias,/);
  assert.match(bibtex, /Proc\. of IEEE DCOSS-IoT-UrbCom/);
});

test("renders the same BibTeX entry the download offers", async () => {
  const html = await readPage();
  const bibtex = await readExported("citation.bib");

  const entryKey = bibtex.match(/@inproceedings\{([^,]+),/)?.[1];
  assert.ok(entryKey, "expected a BibTeX entry key in citation.bib");
  assert.match(html, new RegExp(`@inproceedings\\{${entryKey},`));
});
