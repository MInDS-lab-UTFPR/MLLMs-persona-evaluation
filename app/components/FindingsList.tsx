import { findings } from "@/content/results";

export function FindingsList() {
  return (
    <ul className="result-list">
      {findings.map(({ claim, detail }) => (
        <li key={claim}>
          <strong>{claim}</strong> {detail}
        </li>
      ))}
    </ul>
  );
}
