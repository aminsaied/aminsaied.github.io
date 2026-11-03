# Amin Saied's website

A personal website built with Docusaurus 3, React, and Markdown/MDX. The site
has three sections: Home, Blog, and Publications. The website project is in
`aminsaied/`.

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

`yarn start` enables **design preview mode**, including a visible preview
banner and the sample math article at `/blog/preview/verifiable-rewards`.
The sample is deliberately labeled as illustrative copy, not published work.
Preview builds have `noindex` metadata.

## Build and check

Run these commands from the repository root:

```sh
# Production build and output checks (excludes sample articles).
yarn --cwd aminsaied check:production

# Preview build and output checks (includes the math sample).
yarn --cwd aminsaied check:preview

# Serve the most recently built output.
yarn --cwd aminsaied serve --host 127.0.0.1 --port 3000 --no-open
```

Both build modes write to `aminsaied/build/`; the last build replaces the
previous output. To build without the additional output checks, use `build`
or `build:preview`.

The checks cover the main routes, work ordering, publication math, the six
existing blog URLs and their real PDF assets, the public Lean article and its
diagrams, locally bundled KaTeX fonts, and exclusion of preview articles from
production pages and feeds. Docusaurus
also rejects broken internal links during the build.

## Editing content

| Content | Location |
| --- | --- |
| Introduction and homepage layout | `aminsaied/src/pages/index.js` |
| Work highlights, most recent first | `aminsaied/src/data/work.js` |
| Selected publications | `aminsaied/src/pages/publications.mdx` |
| Blog posts | `aminsaied/blog/` |
| Local-only sample articles | `aminsaied/blog/preview/` |
| Blog index layout | `aminsaied/src/theme/BlogListPage/index.js` |
| Shared typography, colors, and article styles | `aminsaied/src/css/custom.css` |
| Homepage styles | `aminsaied/src/pages/index.module.css` |
| Navigation and plugins | `aminsaied/docusaurus.config.js` |

Career descriptions marked as unfinished are intentional placeholders.
Earlier roles and the final publication selection still need editorial review.
The current portrait is reused from `static/img/logo.svg`.

### Technical writing

Add a dated Markdown or MDX file under `blog/`, with a title, description,
author, and tags in YAML front matter. Define new tags in `blog/tags.yml`.
Use an explicit `slug` when you want a stable URL independent of the filename.
Use `<!-- truncate -->` in Markdown or `{/* truncate */}` in MDX to end the
excerpt.

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

## Staging and deployment

The redesign is developed on `staging/redesign`. Its CI workflow builds and
checks both modes but **does not deploy**. Local branch creation does not
publish it to GitHub.

Only a push to `main` triggers the deployment workflow. That workflow checks
out LFS assets, builds the production site without preview articles, and
publishes `aminsaied/build/` to the `gh-pages` branch. GitHub Pages serves
that branch at `https://aminsaied.github.io/`.

The old DS Ref source files remain in `aminsaied/docs/` for reference, but
the docs plugin is disabled: those pages are not built or linked. Their old
URLs return the site's not-found page. Existing blog URLs and slides remain
available.
