export type PaperFigure = {
  src: string;
  width: number;
  height: number;
  alt: string;
  lazy?: boolean;
  captionTitle: string;
  caption: string;
};

export const experimentalDesignFigure: PaperFigure = {
  src: "paper/figure-1-experimental-design.svg",
  width: 1100,
  height: 605,
  alt:
    "Phase 1 builds 1,200 persona-driven agents from 24 profiles with 50 " +
    "agents each. A solid main branch sends them to Phase 2, persona " +
    "annotation of 50 urban images with Qwen3-VL 8B and thinking enabled. A " +
    "dashed ablation branch runs the same images with no persona in " +
    "thinking-enabled and thinking-disabled variants. Both branches feed " +
    "Phase 3, a convergence and agreement analysis.",
  captionTitle: "Experimental design.",
  caption:
    "A balanced full factorial of gender, economic status, political " +
    "orientation, and personality gives 24 persona profiles; 50 independent " +
    "agents per profile annotate the same 50 PerceptSent scenes. A no-persona " +
    "ablation runs the identical model and images without any persona " +
    "conditioning, so the contribution of the persona itself can be isolated.",
};

export const profileSentimentFigure: PaperFigure = {
  src: "paper/profile-sentiment-heatmap.svg",
  width: 1052,
  height: 1436,
  lazy: true,
  alt:
    "Heatmap of 24 persona profiles by five predicted sentiment labels. Every " +
    "profile places roughly 0.40 to 0.47 of its annotations on Negative and " +
    "0.21 to 0.45 on Positive, while the three intermediate labels stay at or " +
    "below 0.16. Low-income profiles occupy the top of the ordering and " +
    "high-income profiles the bottom.",
  captionTitle: "Predicted sentiment by persona profile.",
  caption:
    "Each row is one of the 24 profiles, ordered by its combined Negative and " +
    "Slightly Negative share; values are the proportion of that profile's " +
    "annotations, ± the half-width of a 95% Wilson interval. The columns at " +
    "the extremes carry nearly all the mass, and the split between the " +
    "low-income block at the top and the high-income block at the bottom is " +
    "the clearest persona effect in the study.",
};
