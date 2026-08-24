import { ink, phaseFill, SANS_STACK } from "./palette.mjs";
import { textLines } from "./svg.mjs";

const UNITS_PER_CM = 100;
const ORIGIN_X = 1.75;
const ORIGIN_Y = 3.2;

const tx = (x) => Math.round((x + ORIGIN_X) * UNITS_PER_CM);
const ty = (y) => Math.round((ORIGIN_Y - y) * UNITS_PER_CM);

const BOX_W = 3.0 * UNITS_PER_CM;
const BOX_H = 1.4 * UNITS_PER_CM;
const OVAL_RX = 1.4 * UNITS_PER_CM;
const OVAL_RY = 0.6 * UNITS_PER_CM;

const box = (node, fill, stroke, dashed) =>
  `  <rect x="${node.cx - BOX_W / 2}" y="${node.cy - BOX_H / 2}" ` +
  `width="${BOX_W}" height="${BOX_H}" rx="17" ` +
  `fill="${fill}" stroke="${stroke}" stroke-width="2"` +
  (dashed ? ` stroke-dasharray="9 7"` : "") +
  ` />`;

const connector = (d, color, dashed) =>
  `  <path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" ` +
  `stroke-linejoin="round"` +
  (dashed ? ` stroke-dasharray="9 7"` : "") +
  ` marker-end="url(#${dashed ? "arrow-dash" : "arrow"})" />`;

const right = (node) => node.cx + BOX_W / 2;
const left = (node) => node.cx - BOX_W / 2;

export function experimentalDesignSvg() {
  const phase1 = { cx: tx(-0.1), cy: ty(0) };
  const annot = { cx: tx(3.6), cy: ty(1.5) };
  const ablat = { cx: tx(3.6), cy: ty(-1.5) };
  const evaluation = { cx: tx(7.6), cy: ty(0) };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 605" width="1100" height="605"
     role="img" aria-labelledby="design-title design-description">
<title id="design-title">Experimental design in three phases</title>
<desc id="design-description">Phase 1 builds 1,200 persona-driven agents from a balanced full factorial of 24 profiles with 50 agents each. A solid main branch sends them to Phase 2, persona annotation of 50 urban images with Qwen3-VL 8B and thinking enabled. A dashed ablation branch runs the same images with no persona, in thinking-enabled and thinking-disabled variants. Both branches feed Phase 3, a convergence and agreement analysis.</desc>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
          orient="auto-start-reverse" markerUnits="strokeWidth">
    <path d="M 0 0.6 L 10 5 L 0 9.4 L 2.4 5 Z" fill="${ink.solid}" />
  </marker>
  <marker id="arrow-dash" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
          orient="auto-start-reverse" markerUnits="strokeWidth">
    <path d="M 0 0.6 L 10 5 L 0 9.4 L 2.4 5 Z" fill="${ink.dashedArrow}" />
  </marker>
</defs>
<g font-family="${SANS_STACK}" text-anchor="middle">

  <g font-size="27" font-weight="700" fill="${ink.solid}">
    <text x="${tx(0)}" y="${ty(2.8)}">Phase 1: Persona Design</text>
    <text x="${tx(3.8)}" y="${ty(2.8)}">Phase 2: Annotation</text>
    <text x="${tx(7.6)}" y="${ty(2.8)}">Phase 3: Evaluation</text>
  </g>

${connector(`M ${right(phase1)} ${phase1.cy} V ${annot.cy} H ${left(annot) - 6}`, ink.solid, false)}
${connector(`M ${right(phase1)} ${phase1.cy} V ${ablat.cy} H ${left(ablat) - 6}`, ink.dashedArrow, true)}
${connector(`M ${right(annot)} ${annot.cy} H ${evaluation.cx} V ${evaluation.cy - OVAL_RY - 6}`, ink.solid, false)}
${connector(`M ${right(ablat)} ${ablat.cy} H ${evaluation.cx} V ${evaluation.cy + OVAL_RY + 6}`, ink.dashedArrow, true)}

${box(phase1, phaseFill.agents, ink.solid, false)}
  <text fill="${ink.solid}" font-weight="700">
${textLines(
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

${box(annot, phaseFill.personaAnnotation, ink.solid, false)}
  <text fill="${ink.solid}" font-weight="700">
${textLines(
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

${box(ablat, phaseFill.ablation, ink.dashed, true)}
  <text fill="${ink.dashed}" font-weight="700">
${textLines(
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

  <ellipse cx="${evaluation.cx}" cy="${evaluation.cy}" rx="${OVAL_RX}" ry="${OVAL_RY}"
           fill="${phaseFill.analysis}" stroke="${ink.solid}" stroke-width="2" />
  <text fill="#ffffff" font-weight="700" font-size="24">
${textLines(
  [
    { text: "Convergence &", dy: -22 },
    { text: "Agreement", dy: 4 },
    { text: "Analysis", dy: 30 },
  ],
  evaluation.cx,
  evaluation.cy,
)}
  </text>

  <g transform="translate(${evaluation.cx}, ${ty(-2.5)})">
    <line x1="-152" y1="-6" x2="-96" y2="-6" stroke="${ink.solid}" stroke-width="2.4" />
    <text x="-88" y="0" text-anchor="start" font-size="20" fill="${ink.solid}">main</text>
    <line x1="8" y1="-6" x2="58" y2="-6" stroke="${ink.dashedArrow}" stroke-width="2.4"
          stroke-dasharray="9 7" marker-end="url(#arrow-dash)" />
    <text x="82" y="0" text-anchor="start" font-size="20" fill="${ink.solid}">ablation</text>
  </g>
</g>
</svg>
`;
}
