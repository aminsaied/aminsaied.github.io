import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import PostSummary from '@site/src/components/PostSummary';
import styles from './index.module.css';

export default function Home() {
  const {posts} = usePluginData('recent-blog-posts', 'default', {failfast: true});

  return (
    <Layout
      title="Home"
      description="Amin Saied. Machine learning, reinforcement learning with verifiable rewards, and mathematics.">
      <main className={styles.home}>
        <section className={styles.intro} aria-labelledby="intro-heading">
          <div>
            <p className="eyebrow">Machine learning &amp; mathematics</p>
            <h1 id="intro-heading" className={styles.name}>Amin Saied</h1>
            <p className={styles.lead}>
              I work on reinforcement learning with verifiable rewards.
            </p>
            <p className={styles.bio}>
              I&apos;m a Member of Technical Staff on the Post-training
              team at Microsoft AI. These days I work on the MAI-Code model
              family where my focus is on applications to mathematics and science.
              I enjoy using Lean to build scalable, verifiable RL datasets.
              Before machine learning, I was a mathematician.
            </p>
            <div className={styles.socials} aria-label="Elsewhere on the web">
              <a href="https://github.com/aminsaied">
                GitHub <span aria-hidden="true">&#8599;</span>
              </a>
              <a href="https://www.linkedin.com/in/amin-saied/">
                LinkedIn <span aria-hidden="true">&#8599;</span>
              </a>
              <a href="https://scholar.google.com/citations?user=XuR_6iUAAAAJ">
                Google Scholar <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
          <figure className={styles.portrait}>
            <img
              src={useBaseUrl('/img/logo.svg')}
              alt="Portrait of Amin Saied"
              width="472"
              height="473"
              fetchPriority="high"
            />
            <figcaption>Currently at Microsoft AI</figcaption>
          </figure>
        </section>

        {posts.length > 0 && (
          <section aria-labelledby="recent-heading">
            <div className={styles.recentHeading}>
              <h2 id="recent-heading">Recent</h2>
              <Link to="/blog">All posts <span aria-hidden="true">&#8594;</span></Link>
            </div>
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.permalink}>
                  <PostSummary post={post} heading="h3" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className={styles.explore} aria-label="Explore the site">
          <Link to="/blog">
            <span className="eyebrow">Notes &amp; ideas</span>
            <span className={styles.exploreTitle}>The blog <span aria-hidden="true">&#8594;</span></span>
            <span>Technical writing and worked examples.</span>
          </Link>
          <Link to="/experience">
            <span className="eyebrow">Work &amp; study</span>
            <span className={styles.exploreTitle}>Experience <span aria-hidden="true">&#8594;</span></span>
            <span>Industry roles and doctoral research.</span>
          </Link>
          <Link to="/publications">
            <span className="eyebrow">Selected research</span>
            <span className={styles.exploreTitle}>Publications <span aria-hidden="true">&#8594;</span></span>
            <span>Work in machine learning and mathematics.</span>
          </Link>
        </nav>
      </main>
    </Layout>
  );
}
