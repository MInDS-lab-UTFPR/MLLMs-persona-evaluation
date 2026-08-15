import type { Metadata } from "next";
import "./globals.css";

const fullTitle =
  "Stable Behavior, Limited Variation: Persona Validity in LLM Agents for Urban Sentiment Perception";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://minds-lab-utfpr.github.io/MLLMs-persona-evaluation/",
  ),
  title: fullTitle,
  description:
    "A research project on whether persona prompting produces meaningful behavioral diversity in multimodal LLM agents annotating urban scenes.",
  applicationName: "Persona Validity in LLM Agents for Urban Sentiment Perception",
  authors: [
    { name: "Neemias B da Silva" },
    { name: "Rodrigo Minetto" },
    { name: "Daniel Silver" },
    { name: "Thiago H Silva" },
  ],
  keywords: [
    "persona prompting",
    "multimodal LLM",
    "urban perception",
    "sentiment annotation",
    "LLM agents",
  ],
  /* The icon comes from app/icon.png rather than a metadata entry: only the
     file convention runs through the asset pipeline, and so only it picks up
     `basePath`. A relative metadata href would break on the exported 404 page,
     which resolves it from its own nested directory. */
  /* Large image previews and untruncated snippets in search results. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
