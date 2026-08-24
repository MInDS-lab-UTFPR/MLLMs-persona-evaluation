import { rdYlGn, readableInkOn, toHex } from "./color-scale.mjs";
import { SANS_STACK } from "./palette.mjs";
import { escapeText } from "./svg.mjs";

const LABEL_W = 372;
const CELL_W = 116;
const CELL_H = 52;
const GRID_X = LABEL_W;
const GRID_Y = 96;
const BAR_W = 26;
const BAR_GAP = 74;

const GRID_LINE = "#ffffff";
const BAR_BORDER = "#dadce0";
const ROW_LABEL_INK = "#3c4043";
const AXIS_INK = "#202124";
const TICK_INK = "#5f6368";

export function profileSentimentHeatmapSvg(data) {
  const gridW = CELL_W * data.sentiments.length;
  const gridH = CELL_H * data.rows.length;
  const BAR_X = GRID_X + gridW + BAR_GAP;
  const width = BAR_X + BAR_W + 200;
  const height = GRID_Y + gridH + 92;

  const cells = [];
  data.rows.forEach((row, r) => {
    row.p.forEach((p, c) => {
      const rgb = rdYlGn(p);
      const text = readableInkOn(rgb);
      const x = GRID_X + c * CELL_W;
      const y = GRID_Y + r * CELL_H;
      cells.push(
        `    <rect x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" fill="${toHex(rgb)}" />` +
          `\n    <text x="${x + CELL_W / 2}" y="${y + CELL_H / 2 - 3}" fill="${text}" font-size="16">` +
          `${p.toFixed(2)}</text>` +
          `\n    <text x="${x + CELL_W / 2}" y="${y + CELL_H / 2 + 15}" fill="${text}" font-size="13" opacity="0.92">` +
          `±${row.half[c].toFixed(2)}</text>`,
      );
    });
  });

  const rowLabels = data.rows
    .map((row, r) => {
      const y = GRID_Y + r * CELL_H + CELL_H / 2 + 5;
      return (
        `    <text x="${LABEL_W - 16}" y="${y}" text-anchor="end" font-size="15" fill="${ROW_LABEL_INK}">` +
        `${escapeText(row.label.replace(/ \| /g, "  ·  "))}</text>`
      );
    })
    .join("\n");

  const colLabels = data.sentiments
    .map((sentiment, c) => {
      const x = GRID_X + c * CELL_W + CELL_W / 2;
      const parts = sentiment.replace(/^Slightly/, "Slightly|").split("|");
      const y = GRID_Y + gridH + 30;
      return parts
        .map(
          (part, index) =>
            `    <text x="${x}" y="${y + index * 19}" font-size="16" font-weight="600" fill="${AXIS_INK}">${escapeText(part)}</text>`,
        )
        .join("\n");
    })
    .join("\n");

  const barStops = Array.from({ length: 21 }, (_, index) => {
    const t = index / 20;
    return `      <stop offset="${(t * 100).toFixed(0)}%" stop-color="${toHex(rdYlGn(1 - t))}" />`;
  }).join("\n");

  const barTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]
    .map((tick) => {
      const y = GRID_Y + (1 - tick) * gridH;
      return (
        `    <line x1="${BAR_X + BAR_W}" y1="${y}" x2="${BAR_X + BAR_W + 7}" y2="${y}" stroke="${TICK_INK}" stroke-width="1.2" />` +
        `\n    <text x="${BAR_X + BAR_W + 13}" y="${y + 5}" text-anchor="start" font-size="14" fill="${TICK_INK}">${tick.toFixed(1)}</text>`
      );
    })
    .join("\n");

  const rowRules = Array.from({ length: data.rows.length + 1 }, (_, r) => {
    const y = GRID_Y + r * CELL_H;
    return `    <line x1="${GRID_X}" y1="${y}" x2="${GRID_X + gridW}" y2="${y}" />`;
  }).join("\n");

  const columnRules = Array.from(
    { length: data.sentiments.length + 1 },
    (_, c) => {
      const x = GRID_X + c * CELL_W;
      return `    <line x1="${x}" y1="${GRID_Y}" x2="${x}" y2="${GRID_Y + gridH}" />`;
    },
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
     role="img" aria-labelledby="heatmap-title heatmap-description">
<title id="heatmap-title">Predicted sentiment by persona profile</title>
<desc id="heatmap-description">A 24 by 5 heatmap. Rows are persona profiles ordered by their combined Negative and Slightly Negative share; columns are the five predicted sentiment labels. Every profile puts roughly 0.40 to 0.47 of its annotations on Negative and 0.21 to 0.45 on Positive, while the three intermediate labels stay near or below 0.16. Low income profiles fill the top of the ordering and High income profiles the bottom, so economic status separates the profiles more than gender, political orientation, or personality. Cell values are proportions with the half-width of a 95 percent Wilson interval.</desc>
<g font-family="${SANS_STACK}" text-anchor="middle">
  <rect width="${width}" height="${height}" fill="#ffffff" />

  <g shape-rendering="crispEdges">
${cells.join("\n")}
  </g>
  <g stroke="${GRID_LINE}" stroke-width="1.6" shape-rendering="crispEdges">
${rowRules}
${columnRules}
  </g>

${rowLabels}

${colLabels}
  <text x="${GRID_X + gridW / 2}" y="${height - 12}" font-size="17" font-weight="600" fill="${AXIS_INK}">Predicted sentiment</text>

  <text x="${LABEL_W - 16}" y="${GRID_Y - 42}" text-anchor="end" font-size="17" font-weight="600" fill="${AXIS_INK}">Persona profile</text>
  <text x="${LABEL_W - 16}" y="${GRID_Y - 20}" text-anchor="end" font-size="14" fill="${TICK_INK}">gender · economic · political · personality</text>

  <defs>
    <linearGradient id="rdylgn" x1="0" y1="0" x2="0" y2="1">
${barStops}
    </linearGradient>
  </defs>
  <rect x="${BAR_X}" y="${GRID_Y}" width="${BAR_W}" height="${gridH}" fill="url(#rdylgn)" stroke="${BAR_BORDER}" stroke-width="1" />
${barTicks}
  <text transform="translate(${BAR_X + BAR_W + 78}, ${GRID_Y + gridH / 2}) rotate(90)" font-size="15" fill="${ROW_LABEL_INK}">Proportion of profile's annotations</text>
</g>
</svg>
`;
}
