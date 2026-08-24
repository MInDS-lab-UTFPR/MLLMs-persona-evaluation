import { dataset } from "@/content/paper";
import { datasetRelease, methodSummary, studyScale } from "@/content/study";

export function StudySection() {
  return (
    <section className="paper-section method-section" id="method">
      <div className="content-wide">
        <h2>Study at a Glance</h2>
        <div className="study-numbers">
          {studyScale.map(({ value, label }) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="method-summary">{methodSummary}</p>
        <p className="dataset-note">
          {`${datasetRelease.lead} `}
          <a href={dataset.url} target="_blank" rel="noreferrer">
            {dataset.name}
          </a>
          {` ${datasetRelease.trail}`}
        </p>
      </div>
    </section>
  );
}
