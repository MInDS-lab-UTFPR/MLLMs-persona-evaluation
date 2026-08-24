import { titleFocus } from "@/content/paper";

const sections = [
  { href: "#abstract", label: "Abstract" },
  { href: "#results", label: "Results" },
  { href: "#method", label: "Method" },
  { href: "#cite", label: "BibTeX" },
];

export function SiteNav() {
  return (
    <nav className="academic-nav" aria-label="Page navigation">
      <a className="nav-title" href="#top">
        {titleFocus}
      </a>
      <div className="nav-sections">
        {sections.map(({ href, label }) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
