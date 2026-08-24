import { PaperFigureBlock } from "./PaperFigureBlock";
import { experimentalDesignFigure } from "@/content/figures";

export function OverviewSection() {
  return (
    <section
      className="paper-section overview-section"
      aria-labelledby="overview-title"
    >
      <div className="content-wide">
        <h2 id="overview-title" className="visually-hidden">
          Overview
        </h2>
        <PaperFigureBlock
          figure={experimentalDesignFigure}
          className="overview-figure"
        />
      </div>
    </section>
  );
}
