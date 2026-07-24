import { getResume } from '../../lib/resume';
import styles from './page.module.css';

export default async function ExperiencePage() {
  const resume = getResume();
  return (
    <main className={styles.main}>
      <h1>Experience</h1>
      {resume.workHistory.map((job) => (
        <section key={`${job.employer}-${job.start}`} className={styles.job}>
          <h2>{job.title} - {job.employer}</h2>
          <p className={styles.dates}>{job.start} - {job.end ?? 'Present'}</p>
          <ul>
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ))}
      <h2>Education</h2>
      {resume.education.map((ed) => (
        <p key={`${ed.institution}-${ed.year}`}>
          {ed.program}, {ed.institution} (<span className={styles.year}>{ed.year}</span>)
        </p>
      ))}
    </main>
  );
}
