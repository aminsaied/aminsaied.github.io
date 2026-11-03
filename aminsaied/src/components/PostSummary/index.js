import React from 'react';
import Link from '@docusaurus/Link';

const dateFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function PostSummary({post, heading: Heading = 'h2'}) {
  return (
    <article className="post-summary">
      <time dateTime={post.date}>
        {dateFormat.format(new Date(post.date))}
      </time>
      <div>
        <Heading className="post-summary-title">
          <Link to={post.permalink}>{post.title}</Link>
        </Heading>
        <p>{post.description}</p>
        <div className="post-topics">
          {post.tags.map((tag) => (
            <Link key={tag.permalink} to={tag.permalink}>{tag.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
