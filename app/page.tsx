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

export default async function HomePage() {
  const resume = getResume();
  return (
    <main className={styles.main}>
      <h1>{resume.contact.email}</h1>
      <p>{resume.summary}</p>
      <ul className={styles.links}>
        {resume.contact.links.map((link) => (
          <li key={link}>
            <a href={link}>{link}</a>
          </li>
        ))}
      </ul>
      <ul className={styles.skills}>
        {resume.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </main>
  );
}
