import assert from "node:assert/strict";
import test from "node:test";

import { readPage, readStructuredData } from "./helpers/exported-site.mjs";

async function nodesByType() {
  const nodes = await readPage().then(readStructuredData);
  return new Map(nodes.map((node) => [node["@type"], node]));
}

test("describes the article for crawlers with the abstract a reader sees", async () => {
  const article = (await nodesByType()).get("ScholarlyArticle");
  assert.ok(article, "expected a ScholarlyArticle node");

  assert.equal(article.author.length, 4);
  assert.match(article.abstract, /^Large Language Models \(LLMs\) are increasingly used/);
  assert.match(article.abstract, /limited annotation value in this setting\.$/);
});

test("describes the released annotations as a citable dataset", async () => {
  const byType = await nodesByType();
  const article = byType.get("ScholarlyArticle");
  const dataset = byType.get("Dataset");
  assert.ok(dataset, "expected a Dataset node");

  assert.equal(dataset.name, "UrbanPersona-60K");
  assert.equal(dataset.url, "https://huggingface.co/datasets/Neemias/UrbanPersona-60K");
  assert.match(dataset.license, /creativecommons\.org\/licenses\/by\/4\.0/);
  assert.ok(dataset.description.length >= 50, "dataset needs a usable description");

  assert.equal(dataset.citation["@id"], article["@id"]);
  assert.equal(article.isBasedOn["@id"], dataset["@id"]);
});
