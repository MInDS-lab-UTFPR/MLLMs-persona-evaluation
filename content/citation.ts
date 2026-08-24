import { authors, paperTitle, publicationDate, venue } from "./paper";

export const citationIntro =
  "If this work informs your research, please cite the UrbCom paper.";

export const bibtexKey = "urbcom26-neemias";

export const bibtex = `@inproceedings{${bibtexKey},
  title={${paperTitle}},
  author={${authors.map((author) => author.name).join(" and ")}},
  year={${publicationDate.slice(0, 4)}},
  booktitle={${venue.proceedings}},
  address={${venue.location}}
}`;

export const citationDownloads = {
  bibtex: "citation.bib",
  ris: "citation.ris",
};
