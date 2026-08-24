import { CitationBlock } from "./CitationBlock";
import { citationIntro } from "@/content/citation";

export function CitationSection() {
  return (
    <section className="paper-section citation-section" id="cite">
      <div className="content-wide">
        <div className="section-intro">
          <h2>Citation</h2>
          <p>{citationIntro}</p>
        </div>
        <CitationBlock />
      </div>
    </section>
  );
}
