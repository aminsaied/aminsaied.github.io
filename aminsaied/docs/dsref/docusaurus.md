---
title: Docusaurus
---

[Docusaurus](https://docusaurus.io/) is a static-site genertor. We use it to
generate this website.

It has heaps of features. Below we document the steps that were taken to set
up this webpage using Docusaurus.

## Git LFS

We set up Git LFS for adding PDFs to the repo.

```bash
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs
cd <your-repo>/
git lfs install
git lfs track "*.pdf"
git add .gitattributes
```

You'll end up with a .gitattributes file in your repo that looks like this:

```text title=".gitattributes"
*.pdf filter=lfs diff=lfs merge=lfs -text
```

## LaTeX Support

First install `remark-math` and `rehype-katex` plugins:

```bash
yarn add remark-math@3 rehype-katex@5 hast-util-is-element@1.1.0
```

and then update your `docusaurus.config.js` file as follows:

```js title="docusaurus.config.js"
// highlight-start
const math = require('remark-math');
const katex = require('rehype-katex');
// highlight-end

module.exports = {
  title: 'Docusaurus',
  tagline: 'Build optimized websites quickly, focus on your content',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          // highlight-start
          remarkPlugins: [math],
          rehypePlugins: [katex],
          // highlight-end
        },
      },
    ],
  ],
  // highlight-start
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  // highlight-end
};
```

Here's the [PR](https://github.com/aminsaied/aminsaied.github.io/pull/2) adding it
to this site.