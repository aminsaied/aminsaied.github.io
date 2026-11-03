import React from 'react';
import Layout from '@theme/Layout';
import {workHighlights} from '../data/work';
import styles from './experience.module.css';

export default function Experience() {
  return (
    <Layout
      title="Experience"
      description="Work and experience in machine learning, AI safety, experimentation, and mathematics.">
      <main className={styles.experience}>
        <header className="page-heading">
          <p className="eyebrow">Work &amp; study</p>
          <h1 id="work-heading">Work &amp; experience</h1>
          <p>A few chapters, most recent first.</p>
        </header>
        <ol className={styles.timeline} aria-labelledby="work-heading">
          {workHighlights.map((work) => (
            <li key={work.id} className={styles.role}>
              <div className={styles.period}>
                <span>{work.dates}</span>
                {work.current && <span className={styles.current}>Current</span>}
              </div>
              <div>
                <h2>{work.role}</h2>
                <p className={styles.team}>{work.team}</p>
                {work.description && (
                  <p className={styles.description}>{work.description}</p>
                )}
                {work.pendingDetails && (
                  <p className="draft-note">{work.pendingDetails}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </main>
    </Layout>
  );
}
