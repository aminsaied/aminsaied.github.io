// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';
import math from 'remark-math';
import katex from 'rehype-katex';

const isPreview = process.env.SITE_PREVIEW === 'true';
const mathOptions = {strict: 'error'};

/** @returns {import('@docusaurus/types').Plugin} */
function recentBlogPosts() {
  return {
    name: 'recent-blog-posts',
    allContentLoaded({allContent, actions}) {
      const {blogPosts} = /** @type {import('@docusaurus/plugin-content-blog').BlogContent} */ (
        allContent['docusaurus-plugin-content-blog'].default
      );
      const posts = blogPosts
        .filter(({metadata}) =>
          !metadata.unlisted && !metadata.frontMatter.unlisted && !metadata.frontMatter.draft,
        )
        .slice(0, 3)
        .map(({metadata: {title, permalink, date, description, tags}}) => ({
          title,
          permalink,
          date: date.toISOString(),
          description,
          tags: tags.map(({label, permalink: tagPermalink}) => ({label, permalink: tagPermalink})),
        }));
      actions.setGlobalData({posts});
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Amin Saied',
  tagline: 'Machine learning, verifiable rewards, and mathematics.',
  url: 'https://aminsaied.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/logo.svg',
  organizationName: 'aminsaied',
  projectName: 'aminsaied.github.io',
  trailingSlash: false,
  noIndex: isPreview,
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [recentBlogPosts],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Keep the old source notes in Git, but do not publish their routes.
        docs: false,
        blog: {
          blogTitle: 'Blog',
          blogDescription: 'Notes on machine learning, verifiable rewards, and mathematics.',
          blogSidebarCount: 0,
          postsPerPage: 10,
          showReadingTime: true,
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            ...(isPreview ? [] : ['**/preview/**']),
          ],
          remarkPlugins: [math],
          rehypePlugins: [[katex, mathOptions]],
          onInlineTags: 'throw',
          onUntruncatedBlogPosts: 'throw',
        },
        pages: {
          remarkPlugins: [math],
          rehypePlugins: [[katex, mathOptions]],
        },
        theme: {
          customCss: [
            require.resolve('katex/dist/katex.min.css'),
            require.resolve('./src/css/custom.css'),
          ],
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Amin Saied',
        items: [
          {to: '/', label: 'Home', position: 'right', activeBaseRegex: '^/$'},
          {to: '/blog', label: 'Blog', position: 'right'},
          {to: '/experience', label: 'Experience', position: 'right'},
          {to: '/publications', label: 'Publications', position: 'right'},
        ],
      },
      footer: {
        style: 'light',
        copyright: `&copy; ${new Date().getFullYear()} Amin Saied &middot; Built with care and Docusaurus.`,
      },
      prism: {
        theme: {
          ...prismThemes.github,
          plain: {
            ...prismThemes.github.plain,
            color: '#2e322f',
            backgroundColor: '#f3f0e8',
          },
        },
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'python'],
      },
    }),
};

export default config;
