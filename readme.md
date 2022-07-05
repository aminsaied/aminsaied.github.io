## Deployment

Manual deployment

```bash
GIT_USER=<GITHUB_USERNAME> USE_SSH=true DEPLOYMENT_BRANCH="gh_deploy" yarn deploy
```

## Setup

TODO: Make a setup page which details how the webpage is setup. Notes below.

TODO: Set up github action to deploy.
See https://docusaurus.io/docs/deployment#triggering-deployment-with-github-actions

TODO: Add KaTeX
See https://docusaurus.io/docs/markdown-features/math-equations#configuration

TODO: Migrate dsref docs
- new menu item vs shared sidebar?

TODO: Add search index

TODO: Doc tiles
https://docusaurus.io/docs/next/sidebar/items#category-doc-link
https://github.com/facebook/docusaurus/pull/6780
https://docusaurus.io/feature-requests/p/allow-customizing-category-description-in-generated-index-cards

TODO: Set up git-lfs for adding pdfs to the repo
https://git-lfs.github.com/
NOTE: WSL set up may differ...

```bash
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs
cd some-git-repository/
git lfs install
git lfs track "*.pdf"
git add .gitattributes
```