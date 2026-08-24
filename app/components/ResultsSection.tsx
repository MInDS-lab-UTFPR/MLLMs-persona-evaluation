import { AgreementTable } from "./AgreementTable";
import { FindingsList } from "./FindingsList";
import { PaperFigureBlock } from "./PaperFigureBlock";
import { profileSentimentFigure } from "@/content/figures";
import { resultsIntro } from "@/content/results";

export function ResultsSection() {
  return (
    <section className="paper-section results-section" id="results">
      <div className="content-wide">
        <div className="section-intro">
          <h2>Key Results</h2>
          <p>{resultsIntro}</p>
        </div>

        <AgreementTable />
        <FindingsList />
        <PaperFigureBlock
          figure={profileSentimentFigure}
          className="heatmap-figure"
        />
      </div>
    </section>
  );
}
