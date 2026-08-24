import { abstract } from "@/content/paper";

export function AbstractSection() {
  return (
    <section className="paper-section abstract-section" id="abstract">
      <div className="content-reading">
        <h2>Abstract</h2>
        <p>{abstract}</p>
      </div>
    </section>
  );
}
