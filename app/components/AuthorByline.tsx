import { affiliations, authors } from "@/content/paper";

export function AuthorByline() {
  return (
    <>
      <div className="paper-authors" aria-label="Authors">
        {authors.map(({ name, affiliationIds, email }) => (
          <span key={name}>
            {email ? <a href={`mailto:${email}`}>{name}</a> : name}
            <sup>{affiliationIds.join(",")}</sup>
          </span>
        ))}
      </div>
      <div className="paper-affiliations">
        {affiliations.map(({ id, name, country }) => (
          <span key={id}>
            <sup>{id}</sup>
            {` ${name}, ${country}`}
          </span>
        ))}
      </div>
    </>
  );
}
