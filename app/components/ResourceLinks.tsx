import { resourceLinks } from "@/content/paper";

export function ResourceLinks() {
  return (
    <div className="paper-actions" aria-label="Paper resources">
      {resourceLinks.map(({ badge, label, href }) => {
        const staysOnPage = href.startsWith("#");
        return (
          <a
            key={href}
            href={href}
            target={staysOnPage ? undefined : "_blank"}
            rel={staysOnPage ? undefined : "noreferrer"}
          >
            <b>{badge}</b>
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
