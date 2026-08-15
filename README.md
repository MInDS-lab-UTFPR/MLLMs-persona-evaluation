# Persona Validity in LLM Agents for Urban Sentiment Perception

Project website for **“Stable Behavior, Limited Variation: Persona Validity in
LLM Agents for Urban Sentiment Perception,”** IEEE DCOSS-IoT-UrbCom 2026.

- Website: <https://minds-lab-utfpr.github.io/MLLMs-persona-evaluation/>
- Paper: <https://arxiv.org/abs/2604.28048>
- PDF: <https://arxiv.org/pdf/2604.28048>
- DOI: <https://doi.org/10.48550/arXiv.2604.28048>
- Code and data: <https://github.com/neemiasbsilva/mllm-persona-evaluation>

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by Next.js. A plain `npm run build` writes a static
export to `out/` with no base path, which is what the local server and the tests
read.

## GitHub Pages build

`GITHUB_PAGES=true` adds the project base path (`/MLLMs-persona-evaluation`) and
trailing slashes, so the export can be served from a project Pages site:

```bash
GITHUB_PAGES=true npm run build
npm run verify:pages
```

`verify:pages` walks the export and fails if any referenced asset is missing,
empty, or cased differently than the file on disk.

Deployment is automated by [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).
In the GitHub repository, select **Settings → Pages → Source → GitHub Actions**,
then push to `main` or run the workflow manually.

If this directory does not yet have the remote configured:

```bash
git remote add origin git@github.com:MInDS-lab-UTFPR/MLLMs-persona-evaluation.git
git branch -M main
git push -u origin main
```

## Figures

Both figures are generated, not hand-edited:

```bash
npm run figures
```

[`scripts/build-figures.mjs`](scripts/build-figures.mjs) writes
`public/paper/figure-1-experimental-design.svg` and
`public/paper/profile-sentiment-heatmap.svg`. The design figure is a
transcription of the paper's TikZ source, keeping its coordinates, `mopal`
palette, and dashed ablation branch. The heatmap redraws
`fig_rq1a_profile_sentiment_heatmap` from
[`scripts/data/profile-sentiment.json`](scripts/data/profile-sentiment.json),
which was recomputed from `outputs/annotations_baseline.jsonl` in the analysis
repository using the same Wilson interval and row ordering as
`src/utils/convergence.py`. Both emit real `<text>` rather than glyph outlines,
so they stay small and searchable.

## Tests

```bash
npm test
```

Builds the export and checks the rendered HTML: title and author metadata, the
citation identifiers, the JSON-LD abstract matching the one a reader sees, and
the presence of both figures with all 120 heatmap cells.

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
