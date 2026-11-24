import type { Metadata } from 'next';
import { getResume } from '../../lib/resume';
import { OG_IMAGE } from '../../lib/seo';
import Reveal from '../components/Reveal';
import styles from './page.module.css';

// SEO pass: description is resume.seo.experienceDescription (resume data,
// Law 3), so it's computed rather than a static object.
export function generateMetadata(): Metadata {
  const resume = getResume();
  return {
    title: 'Experience · DevOps & MLOps',
    description: resume.seo.experienceDescription,
    alternates: { canonical: '/experience' },
    openGraph: {
      title: `Experience · DevOps & MLOps · ${resume.name}`,
      description: resume.seo.experienceDescription,
      type: 'website',
      url: '/experience',
      images: [OG_IMAGE],
      siteName: resume.name,
    },
  };
}

// v2.1 (issue #18): story-per-job. The plain-register headline leads, the
// corporate title and dates become metadata, the story carries the page, and
// the resume bullets survive intact behind a "receipts" disclosure - present
// for anyone who wants them, no longer doing the talking. All content comes
// from the canonical resume data (Law 3).
export default async function ExperiencePage() {
  const resume = getResume();
  return (
    <main id="main" className={styles.main}>
      <h1>Experience</h1>
      {resume.workHistory.map((job) => (
        <Reveal key={`${job.employer}-${job.start}`}>
          <section className={styles.job}>
            <h2>{job.headline}</h2>
            <p className={styles.meta}>
              {job.title} · {job.employer}
              {/* Older roles carry no dates in the source resume - render
                  nothing rather than an invented or dangling range. */}
              {job.start ? (
                <>
                  {' · '}
                  {/* en dash for the range, not hyphen-minus */}
                  {job.start}–{job.end || 'Present'}
                </>
              ) : null}
            </p>
            <p className={styles.story}>{job.story}</p>
            {job.bullets.length > 0 ? (
              <details className={styles.receipts}>
                <summary>The receipts, in resume-speak</summary>
                <ul>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </section>
        </Reveal>
      ))}
      {/* Empty-education fix (issue #18): no heading over a void. */}
      {resume.education.length > 0 ? (
        <>
          <h2>Education</h2>
          {resume.education.map((ed) => (
            <p key={`${ed.institution}-${ed.year}`} className={styles.education}>
              {ed.program}, {ed.institution} (<span className={styles.year}>{ed.year}</span>)
            </p>
          ))}
        </>
      ) : null}
    </main>
  );
}
