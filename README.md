# Persona Validity in LLM Agents for Urban Sentiment Perception

Project website for **“Stable Behavior, Limited Variation: Persona Validity in
LLM Agents for Urban Sentiment Perception,”** IEEE DCOSS-IoT-UrbCom 2026.

- Website: <https://minds-lab-utfpr.github.io/MLLMs-persona-evaluation/>
- Paper: <https://arxiv.org/abs/2604.28048>
- PDF: <https://arxiv.org/pdf/2604.28048>
- DOI: <https://doi.org/10.48550/arXiv.2604.28048>
- Code: <https://github.com/neemiasbsilva/mllm-persona-evaluation>
- Dataset: <https://huggingface.co/datasets/Neemias/UrbanPersona-60K> (CC BY 4.0)

## Project layout

| Path | What lives there |
| --- | --- |
| `app/page.tsx` | The order of the sections, and nothing else |
| `app/components/` | One component per section, plus the pieces they share |
| `app/styles/` | One stylesheet per section, imported by `app/globals.css` |
| `content/` | The paper's own words and numbers, free of markup |
| `lib/` | Page metadata and JSON-LD, both derived from `content/` |
| `scripts/figures/` | The SVG builders behind `npm run figures` |
| `scripts/pages-verify/` | The static-export checker behind `npm run verify:pages` |
| `tests/` | One test file per property of the export |

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by Next.js. A plain `npm run build` writes a static
export to `out/` with no base path, which is what the local server and the tests
read.

## Tests

```bash
npm test
```

Builds the export and checks the rendered HTML: title and author metadata, the
citation identifiers, the JSON-LD article and dataset, the link-preview card,
the released resource links, and both figures with all 120 heatmap cells.

## Citation

Ready-to-import citation files are available as
[`public/citation.bib`](public/citation.bib),
[`public/citation.ris`](public/citation.ris), and [`CITATION.cff`](CITATION.cff).

```bibtex
@inproceedings{urbcom26-neemias,
  title={Stable Behavior, Limited Variation: Persona Validity in LLM Agents for Urban Sentiment Perception},
  author={Neemias B da Silva and Rodrigo Minetto and Daniel Silver and Thiago H Silva},
  year={2026},
  booktitle={Proc. of IEEE DCOSS-IoT-UrbCom},
  address={Reykjavik, Iceland}
}
```
