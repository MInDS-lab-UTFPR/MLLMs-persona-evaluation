#!/usr/bin/env node
/**
 * Emits the two page figures as hand-authored SVG into public/paper/.
 *
 *   figure-1-experimental-design.svg  — the three-phase pipeline, transcribed
 *       from the paper's TikZ source (mopal palette, dashed ablation branch).
 *   profile-sentiment-heatmap.svg     — RQ1a, redrawn from the same numbers the
 *       notebook plots: scripts/data/profile-sentiment.json, recomputed from
 *       outputs/annotations_baseline.jsonl with the notebook's Wilson interval.
 *
 * Text is emitted as <text>, not glyph outlines, so the files stay small and
 * remain searchable. Both use a system font stack: the SVGs are referenced with
 * <img>, which cannot pull a webfont in.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "public", "paper");

const SANS =
  "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* xcolor black!80 / black!55 / black!45, matching the TikZ styles. */
const INK = "#333333";
const INK_DASH = "#737373";
const INK_ARROW_DASH = "#8c8c8c";

/* \definecolor{mopal…} from the paper preamble. */
const MOPAL1 = "#feeac9";
const MOPAL2 = "#ffcdc9";
const MOPAL4 = "#fd7979";
const MOPAL1_35 = "#fff8ec"; // mopal1!35 over white

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ── Figure 1: experimental design ───────────────────────────────────────────

/* TikZ places nodes on a centimetre grid; 100 user units per centimetre keeps
   the transcribed coordinates readable and the box proportions exact. */
const U = 100;
const X0 = 1.75;
const Y0 = 3.2;
const tx = (x) => Math.round((x + X0) * U);
const ty = (y) => Math.round((Y0 - y) * U);

const BOX_W = 3.0 * U; // minimum width 30mm
const BOX_H = 1.4 * U; // minimum height 14mm
const OVAL_RX = 1.4 * U; // minimum width 28mm
const OVAL_RY = 0.6 * U; // minimum height 12mm

/* `**…**` marks the \textbf runs the TikZ labels carry inside a smaller line. */
function markup(text) {
  return esc(text).replace(
    /\*\*(.+?)\*\*/g,
    (_, bold) => `<tspan font-weight="700">${bold}</tspan>`,
  );
}

/* Each line carries its own baseline offset from the node centre, so a node can
   mix a two-line bold title with a tighter block of small print. */
function tspans(lines, cx, cy) {
  return lines
    .map((line) => {
      const attrs = [
        `x="${cx}"`,
        `y="${cy + line.dy}"`,
        line.size ? `font-size="${line.size}"` : "",
        line.weight ? `font-weight="${line.weight}"` : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `      <tspan ${attrs}>${markup(line.text)}</tspan>`;
    })
    .join("\n");
}

function designFigure() {
  const phase1 = { cx: tx(-0.1), cy: ty(0) };
  const annot = { cx: tx(3.6), cy: ty(1.5) };
  const ablat = { cx: tx(3.6), cy: ty(-1.5) };
  const evaluation = { cx: tx(7.6), cy: ty(0) };

  const box = (node, fill, stroke, dashed) =>
    `  <rect x="${node.cx - BOX_W / 2}" y="${node.cy - BOX_H / 2}" ` +
    `width="${BOX_W}" height="${BOX_H}" rx="17" ` +
    `fill="${fill}" stroke="${stroke}" stroke-width="2"` +
    (dashed ? ` stroke-dasharray="9 7"` : "") +
    ` />`;

  /* `|-` draws the vertical leg first, `-|` the horizontal leg first. */
  const connector = (d, color, dashed) =>
    `  <path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" ` +
    `stroke-linejoin="round"` +
    (dashed ? ` stroke-dasharray="9 7"` : "") +
    ` marker-end="url(#${dashed ? "arrow-dash" : "arrow"})" />`;

  const right = (node) => node.cx + BOX_W / 2;
  const left = (node) => node.cx - BOX_W / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 605" width="1100" height="605"
     role="img" aria-labelledby="design-title design-description">
<title id="design-title">Experimental design in three phases</title>
<desc id="design-description">Phase 1 builds 1,200 persona-driven agents from a balanced full factorial of 24 profiles with 50 agents each. A solid main branch sends them to Phase 2, persona annotation of 50 urban images with Qwen3-VL 8B and thinking enabled. A dashed ablation branch runs the same images with no persona, in thinking-enabled and thinking-disabled variants. Both branches feed Phase 3, a convergence and agreement analysis.</desc>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
          orient="auto-start-reverse" markerUnits="strokeWidth">
    <path d="M 0 0.6 L 10 5 L 0 9.4 L 2.4 5 Z" fill="${INK}" />
  </marker>
  <marker id="arrow-dash" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
          orient="auto-start-reverse" markerUnits="strokeWidth">
    <path d="M 0 0.6 L 10 5 L 0 9.4 L 2.4 5 Z" fill="${INK_ARROW_DASH}" />
  </marker>
</defs>
<g font-family="${SANS}" text-anchor="middle">

  <!-- Phase headings -->
  <g font-size="27" font-weight="700" fill="${INK}">
    <text x="${tx(0)}" y="${ty(2.8)}">Phase 1: Persona Design</text>
    <text x="${tx(3.8)}" y="${ty(2.8)}">Phase 2: Annotation</text>
    <text x="${tx(7.6)}" y="${ty(2.8)}">Phase 3: Evaluation</text>
  </g>

  <!-- Connectors, drawn under the nodes -->
${connector(`M ${right(phase1)} ${phase1.cy} V ${annot.cy} H ${left(annot) - 6}`, INK, false)}
${connector(`M ${right(phase1)} ${phase1.cy} V ${ablat.cy} H ${left(ablat) - 6}`, INK_ARROW_DASH, true)}
${connector(`M ${right(annot)} ${annot.cy} H ${evaluation.cx} V ${evaluation.cy - OVAL_RY - 6}`, INK, false)}
${connector(`M ${right(ablat)} ${ablat.cy} H ${evaluation.cx} V ${evaluation.cy + OVAL_RY + 6}`, INK_ARROW_DASH, true)}

  <!-- Phase 1 -->
${box(phase1, MOPAL1, INK, false)}
  <text fill="${INK}" font-weight="700">
${tspans(
  [
    { text: "1,200 Persona-Driven", size: 25, dy: -30 },
    { text: "Agents", size: 25, dy: -4 },
    { text: "24 profiles × 50 agents", size: 18, weight: 400, dy: 24 },
    { text: "Balanced full factorial", size: 18, weight: 400, dy: 48 },
  ],
  phase1.cx,
  phase1.cy,
)}
  </text>

  <!-- Phase 2, main branch -->
${box(annot, MOPAL2, INK, false)}
  <text fill="${INK}" font-weight="700">
${tspans(
  [
    { text: "Persona", size: 25, dy: -30 },
    { text: "Annotation", size: 25, dy: -4 },
    { text: "Qwen3-VL:8B **think=T**", size: 18, weight: 400, dy: 24 },
    { text: "50 urban images", size: 18, weight: 400, dy: 48 },
  ],
  annot.cx,
  annot.cy,
)}
  </text>

  <!-- Phase 2, ablation branch -->
${box(ablat, MOPAL1_35, INK_DASH, true)}
  <text fill="${INK_DASH}" font-weight="700">
${tspans(
  [
    { text: "No-Persona", size: 25, dy: -30 },
    { text: "Ablation", size: 25, dy: -4 },
    { text: "Qwen3-VL:8B", size: 18, weight: 400, dy: 24 },
    { text: "think=T / think=F", size: 18, weight: 400, dy: 48 },
  ],
  ablat.cx,
  ablat.cy,
)}
  </text>

  <!-- Phase 3 -->
  <ellipse cx="${evaluation.cx}" cy="${evaluation.cy}" rx="${OVAL_RX}" ry="${OVAL_RY}"
           fill="${MOPAL4}" stroke="${INK}" stroke-width="2" />
  <text fill="#ffffff" font-weight="700" font-size="24">
${tspans(
  [
    { text: "Convergence &", dy: -22 },
    { text: "Agreement", dy: 4 },
    { text: "Analysis", dy: 30 },
  ],
  evaluation.cx,
  evaluation.cy,
)}
  </text>

  <!-- Branch legend -->
  <g transform="translate(${evaluation.cx}, ${ty(-2.5)})">
    <line x1="-152" y1="-6" x2="-96" y2="-6" stroke="${INK}" stroke-width="2.4" />
    <text x="-88" y="0" text-anchor="start" font-size="20" fill="${INK}">main</text>
    <line x1="8" y1="-6" x2="58" y2="-6" stroke="${INK_ARROW_DASH}" stroke-width="2.4"
          stroke-dasharray="9 7" marker-end="url(#arrow-dash)" />
    <text x="82" y="0" text-anchor="start" font-size="20" fill="${INK}">ablation</text>
  </g>
</g>
</svg>
`;
}

// ── Figure 2: RQ1a profile × sentiment heatmap ──────────────────────────────

/* ColorBrewer RdYlGn, the 11 anchor colours matplotlib interpolates between. */
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

function rdYlGn(t) {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (RD_YL_GN.length - 1);
  const lower = Math.min(Math.floor(scaled), RD_YL_GN.length - 2);
  const frac = scaled - lower;
  const rgb = RD_YL_GN[lower].map((channel, index) =>
    Math.round(channel + (RD_YL_GN[lower + 1][index] - channel) * frac),
  );
  return rgb;
}

const hex = ([r, g, b]) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

/* seaborn picks the annotation colour from the cell's relative luminance,
   flipping to white below 0.408. Reproduced so contrast matches the paper. */
function relativeLuminance([r, g, b]) {
  const linear = [r, g, b]
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function heatmapFigure(data) {
  const LABEL_W = 372;
  const CELL_W = 116;
  const CELL_H = 52;
  const GRID_X = LABEL_W;
  const GRID_Y = 96;
  const gridW = CELL_W * data.sentiments.length;
  const gridH = CELL_H * data.rows.length;
  const BAR_X = GRID_X + gridW + 74;
  const BAR_W = 26;
  const width = BAR_X + BAR_W + 200;
  const height = GRID_Y + gridH + 92;

  const cells = [];
  data.rows.forEach((row, r) => {
    row.p.forEach((p, c) => {
      const rgb = rdYlGn(p);
      const text = relativeLuminance(rgb) > 0.408 ? "#262626" : "#ffffff";
      const x = GRID_X + c * CELL_W;
      const y = GRID_Y + r * CELL_H;
      cells.push(
        `    <rect x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" fill="${hex(rgb)}" />` +
          `\n    <text x="${x + CELL_W / 2}" y="${y + CELL_H / 2 - 3}" fill="${text}" font-size="16">` +
          `${p.toFixed(2)}</text>` +
          `\n    <text x="${x + CELL_W / 2}" y="${y + CELL_H / 2 + 15}" fill="${text}" font-size="13" opacity="0.92">` +
          `±${row.half[c].toFixed(2)}</text>`,
      );
    });
  });

  /* Row labels keep the notebook's "gender | economic | political | personality"
     order but split the pipe-separated fields so they stay readable at 15px. */
  const rowLabels = data.rows
    .map((row, r) => {
      const y = GRID_Y + r * CELL_H + CELL_H / 2 + 5;
      return (
        `    <text x="${LABEL_W - 16}" y="${y}" text-anchor="end" font-size="15" fill="#3c4043">` +
        `${esc(row.label.replace(/ \| /g, "  ·  "))}</text>`
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
            `    <text x="${x}" y="${y + index * 19}" font-size="16" font-weight="600" fill="#202124">${esc(part)}</text>`,
        )
        .join("\n");
    })
    .join("\n");

  const barStops = Array.from({ length: 21 }, (_, index) => {
    const t = index / 20;
    return `      <stop offset="${(t * 100).toFixed(0)}%" stop-color="${hex(rdYlGn(1 - t))}" />`;
  }).join("\n");

  const barTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]
    .map((tick) => {
      const y = GRID_Y + (1 - tick) * gridH;
      return (
        `    <line x1="${BAR_X + BAR_W}" y1="${y}" x2="${BAR_X + BAR_W + 7}" y2="${y}" stroke="#5f6368" stroke-width="1.2" />` +
        `\n    <text x="${BAR_X + BAR_W + 13}" y="${y + 5}" text-anchor="start" font-size="14" fill="#5f6368">${tick.toFixed(1)}</text>`
      );
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
     role="img" aria-labelledby="heatmap-title heatmap-description">
<title id="heatmap-title">Predicted sentiment by persona profile</title>
<desc id="heatmap-description">A 24 by 5 heatmap. Rows are persona profiles ordered by their combined Negative and Slightly Negative share; columns are the five predicted sentiment labels. Every profile puts roughly 0.40 to 0.47 of its annotations on Negative and 0.21 to 0.45 on Positive, while the three intermediate labels stay near or below 0.16. Low income profiles fill the top of the ordering and High income profiles the bottom, so economic status separates the profiles more than gender, political orientation, or personality. Cell values are proportions with the half-width of a 95 percent Wilson interval.</desc>
<g font-family="${SANS}" text-anchor="middle">
  <rect width="${width}" height="${height}" fill="#ffffff" />

  <!-- Cells -->
  <g shape-rendering="crispEdges">
${cells.join("\n")}
  </g>
  <!-- Seaborn's linewidths=0.5 white separators -->
  <g stroke="#ffffff" stroke-width="1.6" shape-rendering="crispEdges">
${Array.from({ length: data.rows.length + 1 }, (_, r) => {
  const y = GRID_Y + r * CELL_H;
  return `    <line x1="${GRID_X}" y1="${y}" x2="${GRID_X + gridW}" y2="${y}" />`;
}).join("\n")}
${Array.from({ length: data.sentiments.length + 1 }, (_, c) => {
  const x = GRID_X + c * CELL_W;
  return `    <line x1="${x}" y1="${GRID_Y}" x2="${x}" y2="${GRID_Y + gridH}" />`;
}).join("\n")}
  </g>

  <!-- Row labels -->
${rowLabels}

  <!-- Column labels -->
${colLabels}
  <text x="${GRID_X + gridW / 2}" y="${height - 12}" font-size="17" font-weight="600" fill="#202124">Predicted sentiment</text>

  <!-- Axis titles -->
  <text x="${LABEL_W - 16}" y="${GRID_Y - 42}" text-anchor="end" font-size="17" font-weight="600" fill="#202124">Persona profile</text>
  <text x="${LABEL_W - 16}" y="${GRID_Y - 20}" text-anchor="end" font-size="14" fill="#5f6368">gender · economic · political · personality</text>

  <!-- Colour bar -->
  <defs>
    <linearGradient id="rdylgn" x1="0" y1="0" x2="0" y2="1">
${barStops}
    </linearGradient>
  </defs>
  <rect x="${BAR_X}" y="${GRID_Y}" width="${BAR_W}" height="${gridH}" fill="url(#rdylgn)" stroke="#dadce0" stroke-width="1" />
${barTicks}
  <text transform="translate(${BAR_X + BAR_W + 78}, ${GRID_Y + gridH / 2}) rotate(90)" font-size="15" fill="#3c4043">Proportion of profile's annotations</text>
</g>
</svg>
`;
}

// ── Emit ────────────────────────────────────────────────────────────────────

const heatmapData = JSON.parse(
  readFileSync(resolve(here, "data", "profile-sentiment.json"), "utf8"),
);

await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, "figure-1-experimental-design.svg"), designFigure());
await writeFile(
  resolve(outDir, "profile-sentiment-heatmap.svg"),
  heatmapFigure(heatmapData),
);

console.log(
  `Wrote figure-1-experimental-design.svg and profile-sentiment-heatmap.svg to ${outDir}`,
);
