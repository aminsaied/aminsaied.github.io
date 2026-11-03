# Amin Saied's website

A personal website built with Docusaurus 3, React, and Markdown/MDX. The site
has four sections: Home, Blog, Experience, and Publications. The homepage has
an introduction, the three most recent blog posts, and pointers to the other
sections; the full career timeline is at `/experience`. The website project
is in `aminsaied/`.

## Local setup

Use Node 22 (see `.nvmrc`) and Yarn Classic 1.22.22. The package supports Node
20 or newer. Presentation PDFs use Git LFS; make sure your checkout contains
the actual PDFs, not LFS pointer files.

From the repository root:

```sh
yarn --cwd aminsaied install --frozen-lockfile
yarn --cwd aminsaied start
```

Open `http://127.0.0.1:3000`. Changes to content and styles reload automatically.
The development server binds only to the loopback interface.

`yarn start` enables **preview mode**, without a visible banner. The blog lists
the public Lean and composition-factors articles. The unlisted layout sample
at `/blog/preview/verifiable-rewards` is available by direct URL in preview
mode, but never appears in production pages or feeds.
Preview builds have `noindex` metadata. The start command uses Docusaurus's
`SIMULATE_PRODUCTION_VISIBILITY=true` setting so unlisted posts also stay out
of the development server's listings.

## Build and check

Run these commands from the repository root:

```sh
# Production build and output checks (excludes preview articles).
yarn --cwd aminsaied check:production

# Preview build and output checks (also builds the unlisted layout sample).
yarn --cwd aminsaied check:preview

# Serve the most recently built output.
yarn --cwd aminsaied serve --host 127.0.0.1 --port 3000 --no-open
```

Both build modes write to `aminsaied/build/`; the last build replaces the
previous output. To build without the additional output checks, use `build`
or `build:preview`.

The checks cover the main routes, work ordering, publication math, the current
blog selection, the six unlisted talk URLs and their real PDF assets, the public
Lean article and its diagrams, the composition-factors article and its exact data,
locally bundled KaTeX fonts, and exclusion of preview articles from production
pages and feeds. Docusaurus also rejects broken internal links during the build.

## Editing content

| Content | Location |
| --- | --- |
| Introduction and homepage layout | `aminsaied/src/pages/index.js` |
| Work highlights, most recent first | `aminsaied/src/data/work.js` |
| Experience page and timeline styles | `aminsaied/src/pages/experience.js`, `aminsaied/src/pages/experience.module.css` |
| Selected publications | `aminsaied/src/pages/publications.mdx` |
| Blog posts | `aminsaied/blog/` |
| Lean proof walkthrough and constraint diagram | `aminsaied/src/components/LeanArticle/` |
| Preview-only drafts and sample articles | `aminsaied/blog/preview/` |
| Composition-factor figures and generated data | `aminsaied/src/components/CompositionFactors/` |
| Blog index layout | `aminsaied/src/theme/BlogListPage/index.js` |
| Shared blog and recent-post summaries | `aminsaied/src/components/PostSummary/index.js` |
| Shared typography, colors, and article styles | `aminsaied/src/css/custom.css` |
| Homepage styles | `aminsaied/src/pages/index.module.css` |
| Navigation and plugins | `aminsaied/docusaurus.config.js` |

The current portrait is reused from `static/img/logo.svg`.

### Technical writing

Add a dated Markdown or MDX file under `blog/`, with a title, description,
author, and tags in YAML front matter. Define new tags in `blog/tags.yml`.
Use an explicit `slug` when you want a stable URL independent of the filename.
Use `<!-- truncate -->` in Markdown or `{/* truncate */}` in MDX to end the
excerpt.

The homepage's Recent section automatically shows up to three posts, newest
first, using the blog metadata provided by Docusaurus. The `recent-blog-posts`
plugin in `docusaurus.config.js` sends only summary metadata to the homepage,
not article bodies or interactive figures. Unlisted posts and drafts are
excluded. Content under `blog/preview/` is excluded from production.

Set `unlisted: true` in front matter to retain an article's direct URL without
including it in public listings, feeds, or the sitemap. The six old talks and
the layout sample use this setting; their source files and assets are retained.

Inline math uses `$...$`; display math uses a `$$` block. `remark-math` and
`rehype-katex` are enabled for both blog posts and standalone MDX pages.
KaTeX CSS and fonts are bundled locally, without a CDN dependency. The
preview article demonstrates inline equations, aligned equations, cases,
syntax-highlighted code, and tables.

The article at `/blog/lean-formal-proofs` retains its original December 2,
2025 date. Its public scope ends with the formal-versus-informal reasoning
takeaways: do not append the source's Roadmap or subsequent sections.
Keep only public citations and reviewed diagrams, and do not restore private
project or model identifiers when updating it.

Keep the seven tactic examples visible in a two-column table, with a tactic
label beside its explanation and code block. Rows stack on narrow screens;
the content stays in the article's Markdown, inside `TacticRow` components.
The proof walkthrough in `src/components/LeanArticle/` uses fixed
example states, not a running Lean compiler. Its line buttons and Previous/Next
controls follow all eight proof lines, including both cases, the smaller-divisor
subproof, the recursive call, and the final "No goals" state. After the nested
`simp_all` finishes, the display resumes the outer proof with `k` and `hk`.
The panels stack on narrow screens. The constraint figure is an
inline, theme-aware SVG with equal scales on both axes; the solid green square
is the actual boundary, while the dashed diagonals are only guides.

### Composition-factors article

Edit the narrative in
`aminsaied/blog/2018-09-01-composition-factors.mdx`. The figures in
`src/components/CompositionFactors/` use a degree-14 table: rows index
target partitions (lambda), columns source partitions (mu), with increasing
degree followed by reverse lexicographic order. A static degree-5 matrix
introduces the baseline before the efficiency discussion. The interactive
atlas follows, starting at degree 14, with a slider back to degree 5; it shares
the selected pair with the stability explorer. An optional degree-boundary
overlay separates blocks of fixed source and target degree without changing
the canvas pixels or cell selection. It is off by default and hidden while
zoomed into a single block, preserving the setting when returning to the full
matrix. All controls are manual; the
figures support keyboard input, dark mode, and narrow screens, and the stability
figure has an expandable table of exact values.

The static matrix renders on the server using only `degree-five.json`, a small
subset of the full table. Every row and column has a Young-diagram label,
with lambda and mu naming the axes and the coefficient symbol in the top-left
corner. On narrow screens the matrix scrolls horizontally to keep the labels
legible. It does not trigger the interactive bundle.
An unnumbered static cartoon follows the first explanation of decomposition
puzzles, using Example 3.18 of the paper. It lists the ten Lie pieces through
degree 5 and tracks the selected pieces by colour and index. The degree check
precedes the assembly, showing a compatible pairing and a rejected swap.
The cartoon and later shape-analysis figure share their Young-diagram renderer,
Lie-piece catalogue, and assembly data through `shared.js`. These static data
do not import the full coefficient table.
The interactive figures initially render lightweight placeholders and load
together with the full data in the `composition-figures` chunk when a figure or
download control comes within 600 pixels of the viewport. Browsers without
IntersectionObserver load the figures on mount instead. Loading failures show
a reload action, and the stability anchor exists before its figure loads.
Keep full-dataset imports in `Figures.js`, not in the lightweight `index.js` or
`shared.js`, so blog and tag-page excerpts do not load the table. Build checks
enforce that the dataset occurs only in the on-demand chunk.

Regenerate the data with Python 3.9+ (standard library only):

```sh
python3 aminsaied/scripts/generate-composition-data.py
```

This also regenerates `degree-five.json`. To extract just that subset from the
existing full table, add `--baseline-only`. Build checks require the subset and
the rendered static figure to agree with the full table.

The exporter computes degree-truncated power-sum plethysm with exact arithmetic.
It is a reconstruction from the mathematical definition, not a port or timing
run of the original Sage puzzle algorithm. It checks character orthogonality,
integer nonnegative results, the equal-degree identity, and examples from the
pinned original source, including its entire degree-4 matrix. The generated
JSON includes a matrix checksum and is downloadable from the article. Historical
timings in the text are attributed to the paper, not to this exporter.

The article is published at `/blog/composition-factors`, retaining its
September 1, 2018 date. Its figures and data are checked in both production
and preview builds.

## Staging and deployment

Changes can be developed on `staging/redesign`. Its CI workflow builds and
checks both modes but **does not deploy**. Local branch creation does not
publish it to GitHub.

Only a push to `main` triggers the deployment workflow. That workflow checks
out LFS assets, builds the production site without preview articles, and
publishes `aminsaied/build/` to the `gh-pages` branch. GitHub Pages serves
that branch at `https://aminsaied.github.io/`.

The old DS Ref source files remain in `aminsaied/docs/` for reference, but
the docs plugin is disabled: those pages are not built or linked. Their old
URLs return the site's not-found page. Old talk URLs and slides remain
available by direct link, but the talks are no longer included in public blog
listings or feeds.
