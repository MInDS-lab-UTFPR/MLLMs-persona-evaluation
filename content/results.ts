export const resultsIntro =
  "Agreement with human labels holds up on coarse polarity and falls away as " +
  "the sentiment scale gets finer. Removing the persona does not cost " +
  "anything: on every task variant the no-persona model matches or exceeds " +
  "the persona-conditioned pool.";

export const agreementCaption =
  "Macro F1 against human ground truth, agreement subsets at σ = 3";

export type AgreementRow = {
  granularity: string;
  task: string;
  images: number;
  persona: string;
  noPersona: string;
  highlight?: boolean;
};

export const agreementRows: readonly AgreementRow[] = [
  {
    granularity: "Binary",
    task: "Polarity (negative vs. rest)",
    images: 50,
    persona: "0.807",
    noPersona: "0.862",
  },
  {
    granularity: "Binary",
    task: "Polarity (positive vs. rest)",
    images: 50,
    persona: "0.797",
    noPersona: "0.836",
  },
  {
    granularity: "Three-class",
    task: "Negative / neutral / positive",
    images: 45,
    persona: "0.588",
    noPersona: "0.665",
  },
  {
    granularity: "Ordinal",
    task: "Five-point sentiment scale",
    images: 36,
    persona: "0.309",
    noPersona: "0.433",
    highlight: true,
  },
];

export type Finding = {
  claim: string;
  detail: string;
};

export const findings: readonly Finding[] = [
  {
    claim: "Behavior within a persona is stable.",
    detail:
      "Across the 1,200 image × profile groups, a median 98% of the 50 agents " +
      "sharing a profile pick the same label; the mean modal ratio is 0.871 " +
      "[0.860, 0.881].",
  },
  {
    claim: "Behavior across personas is not distinct.",
    detail:
      "Economic status is the only dimension with a clear shift — low-income " +
      "profiles skew negative, high-income profiles positive — while gender " +
      "and political orientation produce overlapping distributions.",
  },
  {
    claim: "Agents avoid the middle of the scale.",
    detail:
      "Negative and Positive absorb 77.4% of the 59,708 annotations, while " +
      "the human ground truth spreads almost evenly over all five levels.",
  },
  {
    claim: "Errors are adjacent, not opposite.",
    detail:
      "Quadratic Cohen κ stays near 0.79 on the five-point task: the ordering " +
      "is right even where the exact level is wrong.",
  },
];
