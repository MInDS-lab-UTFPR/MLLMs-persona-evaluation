"use client";

import { useState } from "react";

import { bibtex, citationDownloads } from "@/content/citation";

const COPIED_LABEL_MS = 2200;

export function CitationBlock() {
  const [copied, setCopied] = useState(false);

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_LABEL_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="citation-block">
      <div className="citation-toolbar">
        <span>BibTeX</span>
        <div>
          <a href={citationDownloads.bibtex} download>
            Download
          </a>
          <button type="button" onClick={copyCitation}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre aria-label="BibTeX citation">
        <code>{bibtex}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? "BibTeX citation copied to clipboard." : ""}
      </span>
    </div>
  );
}
