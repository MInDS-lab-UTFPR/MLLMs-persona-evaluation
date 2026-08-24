/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import { agreementCaption, agreementRows } from "@/content/results";

export function AgreementTable() {
  return (
    <div
      className="model-comparison"
      role="region"
      aria-label="Agreement with human labels by task granularity"
      tabIndex={0}
    >
      <table>
        <caption>{agreementCaption}</caption>
        <thead>
          <tr>
            <th scope="col">Task granularity</th>
            <th scope="col">Persona agents</th>
            <th scope="col">No persona</th>
          </tr>
        </thead>
        <tbody>
          {agreementRows.map((row) => (
            <tr key={row.task} className={row.highlight ? "highlight-row" : undefined}>
              <th scope="row">
                <span>{`${row.granularity} · ${row.images} images`}</span>
                {row.task}
              </th>
              <td>{row.persona}</td>
              <td>{row.noPersona}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
