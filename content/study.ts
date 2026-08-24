export type StudyCount = {
  value: string;
  label: string;
};

export const studyScale: readonly StudyCount[] = [
  { value: "59,708", label: "persona-conditioned annotations" },
  { value: "1,200", label: "agents, 50 per profile" },
  { value: "24", label: "persona profiles" },
  { value: "50", label: "PerceptSent urban scenes" },
];

export const methodSummary =
  "The 24 profiles are the full factorial of gender (2), economic status " +
  "(2), political orientation (2), and personality (3), with 50 agents " +
  "drawn per profile and every dimension perfectly balanced. Each agent " +
  "annotates all 50 images with Qwen3-VL-8B, returning a five-point " +
  "sentiment label, perception tags, a caption, and a justification. " +
  "Convergence is measured as the within-group modal ratio over the 50 " +
  "agents in each image × profile cell. Agreement with humans is evaluated " +
  "against 12 PerceptSent subsets filtered at three annotator-agreement " +
  "thresholds, with point estimates from a 60% annotation resample per " +
  "image and 95% intervals from an image-level bootstrap. The same model " +
  "and images are rerun without persona conditioning, in reasoning-enabled " +
  "and reasoning-disabled variants, as the ablation.";

export const datasetRelease = {
  lead: "Every annotation behind these results is released as",
  trail:
    "on Hugging Face: the 59,708 persona-conditioned labels with their " +
    "perception tags, captions, and justifications, the no-persona ablation " +
    "runs, and the 1,200 persona seed profiles, under CC BY 4.0.",
};

export const responsibleInterpretation = {
  heading: "Responsible Interpretation",
  emphasis:
    "These results describe how one model behaves under persona prompts; " +
    "they are not estimates of how real demographic groups perceive cities.",
  body:
    "The profiles are controlled prompting conditions built from four " +
    "attribute labels, not complete identities, and synthetic personas can " +
    "reproduce stereotypical associations. The negative finding is about " +
    "label-based persona prompting specifically — a richer persona " +
    "representation, a different model, or a different task may behave " +
    "differently. Substituting agents for human annotators would require " +
    "demographically matched human data to justify.",
};
