import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {workHighlights} from '../data/work';
import styles from './index.module.css';

export default function Home() {
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
              I&apos;m a Member of Technical Staff on the MAI Post-training
              team at Microsoft. My current focus is using Lean to build
              scalable, verifiable RL datasets. Before machine learning,
              I was a mathematician.
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

        <section className={styles.work} aria-labelledby="work-heading">
          <div className={styles.sectionHeading}>
            <h2 id="work-heading">Work &amp; experience</h2>
            <p>A few chapters, most recent first.</p>
          </div>
          <ol className={styles.timeline}>
            {workHighlights.map((work) => (
              <li key={work.id} className={styles.role}>
                <div className={styles.period}>
                  <span>{work.dates}</span>
                  {work.current && <span className={styles.current}>Current</span>}
                </div>
                <div>
                  <h3>{work.role}</h3>
                  <p className={styles.team}>{work.team}</p>
                  <p className={styles.description}>{work.description}</p>
                  {work.pendingDetails && (
                    <p className="draft-note">{work.pendingDetails}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className={`draft-note ${styles.earlier}`}>
            Earlier roles and selected projects will be added here.
          </p>
        </section>

        <nav className={styles.explore} aria-label="Explore writing and research">
          <Link to="/blog">
            <span className="eyebrow">Notes &amp; ideas</span>
            <span className={styles.exploreTitle}>The blog <span aria-hidden="true">&#8594;</span></span>
            <span>Technical writing, worked examples, and talks.</span>
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
