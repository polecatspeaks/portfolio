import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getResume } from '../lib/resume';
import Reveal from './components/Reveal';
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

// v2.1 direction (docs/design-direction.md): two registers, plain first.
// The hero pairs the name/tagline with the owner-authorized portrait under a
// restrained lamplight glow (issue #13); the summary is demoted to "the formal
// version" (issue #14); the toolkit speaks plain language first with the
// jargon demoted underneath (issue #15). All copy lives in the canonical
// resume data (Law 3), not as page copy that could drift.
export default async function HomePage() {
  const resume = getResume();
  return (
    <main id="main" className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>{resume.name}</h1>
          <p className={styles.tagline}>{resume.tagline}</p>
        </div>
        <div className={styles.heroPortrait}>
          {/* Real pixel dimensions of public/portrait.jpg (1000x1499),
              owner-authorized from lawfulshenanigans.com. */}
          <Image
            src="/portrait.jpg"
            alt="Christopher Mann, black and white portrait"
            width={1000}
            height={1499}
            priority
            className={styles.portrait}
          />
        </div>
      </section>

      <Reveal>
        <section aria-labelledby="doors-heading" className={styles.doors}>
          <h2 id="doors-heading" className="sr-only">
            Where to next
          </h2>
          <Link href="/experience" className={styles.door}>
            <span className={styles.doorTitle}>The work history</span>
            <span className={styles.doorHint}>The long version, job by job.</span>
          </Link>
          <Link href="/projects" className={styles.door}>
            <span className={styles.doorTitle}>The projects</span>
            <span className={styles.doorHint}>The things I build when nobody assigns them.</span>
          </Link>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading">What I actually do</h2>
          <ul className={styles.capabilities}>
            {resume.capabilities.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className={styles.jargonLabel}>The same toolkit, in recruiter-speak:</p>
          <ul className={styles.skills}>
            {resume.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading">The formal version</h2>
          <p className={styles.summary}>{resume.summary}</p>
        </section>
      </Reveal>
    </main>
  );
}
