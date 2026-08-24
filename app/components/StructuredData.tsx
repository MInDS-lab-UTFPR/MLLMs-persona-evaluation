import { structuredData } from "@/lib/structured-data";

export function StructuredData() {
  return (
    <>
      {structuredData.map((node) => (
        <script
          key={node["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
