const RD_YL_GN = [
  [165, 0, 38],
  [215, 48, 39],
  [244, 109, 67],
  [253, 174, 97],
  [254, 224, 139],
  [255, 255, 191],
  [217, 239, 139],
  [166, 217, 106],
  [102, 189, 99],
  [26, 152, 80],
  [0, 104, 55],
];

const SEABORN_DARK_TEXT_THRESHOLD = 0.408;

export function rdYlGn(t) {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (RD_YL_GN.length - 1);
  const lower = Math.min(Math.floor(scaled), RD_YL_GN.length - 2);
  const frac = scaled - lower;
  return RD_YL_GN[lower].map((channel, index) =>
    Math.round(channel + (RD_YL_GN[lower + 1][index] - channel) * frac),
  );
}

export function toHex([r, g, b]) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function relativeLuminance([r, g, b]) {
  const linear = [r, g, b]
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function readableInkOn(rgb) {
  return relativeLuminance(rgb) > SEABORN_DARK_TEXT_THRESHOLD
    ? "#262626"
    : "#ffffff";
}
