import { AbstractSection } from "./components/AbstractSection";
import { CitationSection } from "./components/CitationSection";
import { InterpretationSection } from "./components/InterpretationSection";
import { OverviewSection } from "./components/OverviewSection";
import { PaperHero } from "./components/PaperHero";
import { ResultsSection } from "./components/ResultsSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { StructuredData } from "./components/StructuredData";
import { StudySection } from "./components/StudySection";
import { paperMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata = paperMetadata;

export default function Home() {
  return (
    <>
      <StructuredData />

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <SiteNav />
      <PaperHero />

      <main id="main-content">
        <OverviewSection />
        <AbstractSection />
        <ResultsSection />
        <StudySection />
        <InterpretationSection />
        <CitationSection />
      </main>

      <SiteFooter />
    </>
  );
}
