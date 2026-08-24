import { AuthorByline } from "./AuthorByline";
import { ResourceLinks } from "./ResourceLinks";
import { arxivId, headlineFinding, titleFocus, titleLead, venue } from "@/content/paper";

export function PaperHero() {
  return (
    <header className="paper-hero" id="top">
      <div className="content-narrow">
        <p className="paper-status">{`${venue.name} · arXiv ${arxivId}`}</p>
        <h1>
          {`${titleLead}:`}
          <span>{` ${titleFocus}`}</span>
        </h1>
        <p className="paper-takeaway">{headlineFinding}</p>

        <AuthorByline />
        <ResourceLinks />
      </div>
    </header>
  );
}
