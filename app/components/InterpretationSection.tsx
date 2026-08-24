import { responsibleInterpretation } from "@/content/study";

export function InterpretationSection() {
  return (
    <section
      className="paper-section ethics-section"
      aria-labelledby="ethics-title"
    >
      <div className="content-reading ethics-note">
        <h2 id="ethics-title">{responsibleInterpretation.heading}</h2>
        <p>
          <strong>{responsibleInterpretation.emphasis}</strong>{" "}
          {responsibleInterpretation.body}
        </p>
      </div>
    </section>
  );
}
