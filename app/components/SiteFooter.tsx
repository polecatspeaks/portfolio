import { getResume } from '../../lib/resume';
import styles from './SiteFooter.module.css';

// Issue #16: site-wide footer - no page dead-ends at the bottom. Every link
// here comes from the canonical resume contact data (Law 3), same as the
// homepage "Find me" section, so the two can never drift apart.
export default function SiteFooter() {
  const resume = getResume();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <ul className={styles.links}>
          <li>
            <a href={`mailto:${resume.contact.email}`}>{resume.contact.email}</a>
          </li>
          {resume.contact.links.map((link) => (
            <li key={link}>
              <a href={link}>{link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>
            </li>
          ))}
        </ul>
        <p className={styles.signoff}>The porch light&rsquo;s on. Say hi.</p>
      </div>
    </footer>
  );
}
