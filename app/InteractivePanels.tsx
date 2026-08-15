"use client";

import { useState } from "react";

const bibtex = `@inproceedings{urbcom26-neemias,
  title={Stable Behavior, Limited Variation: Persona Validity in LLM Agents for Urban Sentiment Perception},
  author={Neemias B da Silva and Rodrigo Minetto and Daniel Silver and Thiago H Silva},
  year={2026},
  booktitle={Proc. of IEEE DCOSS-IoT-UrbCom},
  address={Reykjavik, Iceland}
}`;

export function CitationBlock() {
  const [copied, setCopied] = useState(false);

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="citation-block">
      <div className="citation-toolbar">
        <span>BibTeX</span>
        <div>
          <a href="citation.bib" download>
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
