import {
  abstract,
  affiliationsById,
  arxivId,
  authors,
  dataset,
  keywords,
  links,
  paperTitle,
  publicationDate,
  siteUrl,
  socialCardUrl,
} from "@/content/paper";

export type JsonLdNode = Record<string, unknown> & { "@id": string };

const articleId = `${siteUrl}#article`;

const people = authors.map(({ name, affiliationIds }) => ({
  "@type": "Person",
  name,
  affiliation: affiliationIds.map((id) => ({
    "@type": "Organization",
    name: affiliationsById[id].name,
  })),
}));

const article: JsonLdNode = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "@id": articleId,
  headline: paperTitle,
  name: paperTitle,
  abstract,
  description: abstract,
  author: people,
  datePublished: publicationDate,
  identifier: [`arXiv:${arxivId}`, links.doi],
  url: siteUrl,
  mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl },
  image: socialCardUrl,
  publisher: { "@type": "Organization", name: "arXiv" },
  inLanguage: "en",
  sameAs: [links.abstract, links.doi, links.code],
  isAccessibleForFree: true,
  isBasedOn: { "@id": dataset.url },
  keywords,
};

const annotations: JsonLdNode = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": dataset.url,
  name: dataset.name,
  description: dataset.description,
  url: dataset.url,
  identifier: dataset.url,
  license: dataset.licenseUrl,
  creator: people,
  citation: { "@id": articleId },
  includedInDataCatalog: {
    "@type": "DataCatalog",
    name: dataset.host,
    url: "https://huggingface.co/datasets",
  },
  measurementTechnique: "Persona-conditioned annotation with a multimodal LLM",
  variableMeasured: "Urban scene sentiment on a five-point scale",
  isAccessibleForFree: true,
  inLanguage: "en",
  keywords,
};

export const structuredData: readonly JsonLdNode[] = [article, annotations];
