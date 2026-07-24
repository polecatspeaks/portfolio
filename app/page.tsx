import { getResume } from '../lib/resume';
import styles from './page.module.css';

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
