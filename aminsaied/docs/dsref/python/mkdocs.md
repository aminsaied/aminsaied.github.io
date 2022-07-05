---
title: MkDocs
description: MkDocs is a static site generator.
---

[Mkdocs](https://www.mkdocs.org/). It's a super simple static site generator.

## Basics
```python
mkdocs serve  \\ local copy
mkdocs build  \\ builds site
```

## Github Pages
The `mkdocs build` command will generate a `site` directory with a bunch of `.html` pages that comprise your static website. However, by default github pages sites will look for the html in a special branch called `gh-pages`. You could manually create this branch and copy the html files over, but thankfully mkdocs has a command that automates this!

```python
mkdocs gh-deploy
```

## LaTeX
To get latex working in your project

```python
pip install https://github.com/mitya57/python-markdown-math/archive/master.zip
```
Then in `<your-project>/config.yaml` add the following
```yaml
extra_javascript:
    - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML

markdown_extensions:
    - mdx_math
```

## Material theme

To get material working in your project

```python
pip install mkdocs-material
```

Then in `<your-project>/config.yaml` add the following
```yaml
theme:
  name: 'material'
```

## PyMdown Extensions

[Official docs](https://facelessuser.github.io/pymdown-extensions/). Install with:
```bash
$ pip install pymdown-extensions
```

Then in `<your-project>/config.yaml` add `pymdownx.<extension>` to `markdown_extensions`. For example, to add the [Tabbed](https://facelessuser.github.io/pymdown-extensions/extensions/tabbed/) extension do:
```yaml
markdown_extensions:
    - pymdownx.tabbed
```

Examples of how to specify and use each extension [here](https://squidfunk.github.io/mkdocs-material/extensions/pymdown/).