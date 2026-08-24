/* eslint-disable @next/next/no-img-element */

import type { PaperFigure } from "@/content/figures";

type PaperFigureBlockProps = {
  figure: PaperFigure;
  className: string;
};

export function PaperFigureBlock({ figure, className }: PaperFigureBlockProps) {
  return (
    <figure className={`paper-figure ${className}`}>
      <img
        src={figure.src}
        width={figure.width}
        height={figure.height}
        loading={figure.lazy ? "lazy" : undefined}
        alt={figure.alt}
      />
      <figcaption>
        <strong>{figure.captionTitle}</strong> {figure.caption}
      </figcaption>
    </figure>
  );
}
