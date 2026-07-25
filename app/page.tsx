import type { Metadata } from 'next';
import { getResume } from '../lib/resume';
import styles from './page.module.css';

// Issue #3/#4: description/OG text is sourced from the same resume.summary
// field the page itself renders - never a hand-written duplicate that could
// silently drift from the real resume content (constitution Law 3).
export async function generateMetadata(): Promise<Metadata> {
  const resume = getResume();
  return {
    title: 'Home · Christopher Mann',
    description: resume.summary,
    openGraph: {
      title: 'Christopher Mann - Portfolio',
      description: resume.summary,
      type: 'website',
    },
  };
}

// v2 direction (docs/design-direction.md): two registers, plain first.
// h1 is the name; the tagline is the street-level register; resume.summary is
// the technical register underneath. Both live in the canonical resume data
// (Law 3 - the resume stays the single source of truth for content, including
// the plain register), not as page copy that could drift.
export default async function HomePage() {
  const resume = getResume();
  return (
    <main id="main" className={styles.main}>
      <h1>{resume.name}</h1>
      <p className={styles.tagline}>{resume.tagline}</p>
      <p className={styles.summary}>{resume.summary}</p>
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Find me</h2>
        <ul className={styles.links}>
          <li>
            <a href={`mailto:${resume.contact.email}`} className={styles.mono}>
              {resume.contact.email}
            </a>
          </li>
          {resume.contact.links.map((link) => (
            <li key={link}>
              <a href={link} className={styles.linkItem}>
                {link.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">The toolkit</h2>
        <ul className={styles.skills}>
          {resume.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
