import React from 'react';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import PostSummary from '@site/src/components/PostSummary';

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
            A place for technical notes and worked examples.
          </p>
        </header>
        <ul className="post-list">
          {items.map(({content: Post}) => (
            <li key={Post.metadata.permalink}>
              <PostSummary post={Post.metadata} />
            </li>
          ))}
        </ul>
        <BlogListPaginator metadata={metadata} />
      </main>
    </Layout>
  );
}
