export function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function boldMarkup(text) {
  return escapeText(text).replace(
    /\*\*(.+?)\*\*/g,
    (_, bold) => `<tspan font-weight="700">${bold}</tspan>`,
  );
}

export function textLines(lines, cx, cy) {
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
      return `      <tspan ${attrs}>${boldMarkup(line.text)}</tspan>`;
    })
    .join("\n");
}
