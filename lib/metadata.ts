import type { Metadata } from "next";

import {
  arxivId,
  authors,
  doi,
  headlineFinding,
  keywords,
  links,
  paperSummary,
  paperTitle,
  publicationDate,
  siteSummary,
  siteUrl,
  socialCardAlt,
  socialCardUrl,
  titleFocus,
  venue,
} from "@/content/paper";

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: paperTitle,
  description: siteSummary,
  applicationName: titleFocus,
  authors: authors.map(({ name }) => ({ name })),
  keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const paperMetadata: Metadata = {
  title: paperTitle,
  description: paperSummary,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: paperTitle,
    description: headlineFinding,
    url: siteUrl,
    type: "article",
    siteName: titleFocus,
    locale: "en_US",
    publishedTime: publicationDate,
    images: [
      {
        url: socialCardUrl,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: socialCardAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: paperTitle,
    description: headlineFinding,
    images: [socialCardUrl],
  },
  other: {
    citation_title: paperTitle,
    citation_author: authors.map(({ name }) => name),
    citation_date: publicationDate.replaceAll("-", "/"),
    citation_conference_title: venue.proceedings,
    citation_doi: doi,
    citation_pdf_url: links.pdf,
    citation_arxiv_id: arxivId,
    citation_abstract_html_url: siteUrl,
    citation_language: "en",
    citation_keywords: keywords.join("; "),
  },
};
