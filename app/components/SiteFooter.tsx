import {
  arxivId,
  correspondenceEmail,
  dataset,
  links,
  titleLead,
  venue,
} from "@/content/paper";

export function SiteFooter() {
  return (
    <footer className="academic-footer">
      <div className="content-wide">
        <p>{`${titleLead} · ${venue.name} · arXiv:${arxivId}`}</p>
        <p>
          Code:{" "}
          <a href={links.code} target="_blank" rel="noreferrer">
            {links.codeName}
          </a>
          {" · "}
          Dataset:{" "}
          <a href={dataset.url} target="_blank" rel="noreferrer">
            {dataset.name}
          </a>
          {" · "}
          Correspondence:{" "}
          <a href={`mailto:${correspondenceEmail}`}>{correspondenceEmail}</a>
        </p>
      </div>
    </footer>
  );
}
