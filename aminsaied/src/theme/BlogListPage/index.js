import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';

const dateFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function BlogListPage({metadata, items, ...props}) {
  return (
    <Layout title={metadata.blogTitle} description={metadata.blogDescription}>
      <BlogListPageStructuredData metadata={metadata} items={items} {...props} />
      <main className="blog-index-page">
        <header className="page-heading">
          <p className="eyebrow">Notes &amp; ideas</p>
          <h1>Blog</h1>
          <p>
            Writing about machine learning, verifiable rewards, and mathematics.
            A place for technical notes, worked examples, and the occasional talk.
          </p>
        </header>
        <ul className="post-list">
          {items.map(({content: Post}) => {
            const post = Post.metadata;
            return (
              <li key={post.permalink}>
                <article className="post-summary">
                  <time dateTime={post.date}>
                    {dateFormat.format(new Date(post.date))}
                  </time>
                  <div>
                    {post.frontMatter.preview && (
                      <span className="preview-label">
                        {post.frontMatter.editorial_draft ? 'Editorial draft' : 'Sample article / design preview'}
                      </span>
                    )}
                    <h2><Link to={post.permalink}>{post.title}</Link></h2>
                    <p>{post.description}</p>
                    <div className="post-topics">
                      {post.tags.map((tag) => (
                        <Link key={tag.permalink} to={tag.permalink}>{tag.label}</Link>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <BlogListPaginator metadata={metadata} />
      </main>
    </Layout>
  );
}
