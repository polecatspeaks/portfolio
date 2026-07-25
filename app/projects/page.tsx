import type { Metadata } from 'next';
import Image from 'next/image';
import { getFeaturedRepos } from '../../lib/github.server';
import { getPrivateProjects } from '../../lib/private-projects.server';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Public and private project portfolio.',
  openGraph: {
    title: 'Projects · Christopher Mann',
    description: 'Public and private project portfolio.',
    type: 'website',
  },
};

// Explicit, not relied-upon-by-default: forces this route to be statically rendered
// at build time only (Next.js 14's documented `dynamic` route segment config). This
// is what actually makes spec §2's "no runtime database, no per-request GitHub
// fetch" claim true, rather than an assumption about Next's default caching
// behavior, which round-1 plan review flagged as version-dependent, not guaranteed.
export const dynamic = 'force-static';

export default async function ProjectsPage() {
  const [publicRepos, privateProjects] = await Promise.all([
    getFeaturedRepos(),
    getPrivateProjects(),
  ]);

  return (
    <main id="main" className={styles.main}>
      <h1>Projects</h1>
      <section className={styles.section}>
        <h2>Public</h2>
        {publicRepos.map((repo) => (
          <article key={repo.full_name} className={styles.card}>
            <h3><a href={repo.html_url} className={styles.repoName}>{repo.full_name}</a></h3>
            {/* GitHub descriptions can be empty - don't render a broken empty <p> */}
            {repo.description ? <p>{repo.description}</p> : null}
          </article>
        ))}
      </section>
      <section className={styles.section}>
        <h2>Selected private work</h2>
        {privateProjects.map(({ title, summary, screenshots, date }) => (
          <article key={title} className={styles.card}>
            <h3>{title}</h3>
            <p className={styles.date}>{date}</p>
            <p>{summary}</p>
            {/* width/height are the real pixel dimensions of public/screenshots/star-ui.png
                (the only screenshot that exists today), confirmed via the file's own PNG
                header, per next/image's documented responsive-image pattern (intrinsic
                width/height + CSS width:100%/height:auto in module.css). If a future
                screenshot with a different aspect ratio is added, this will need updating -
                not fabricated to fit an assumed generic ratio. */}
            {screenshots.map((src) => (
              <Image
                key={src}
                src={src}
                alt={`${title} screenshot`}
                width={1912}
                height={911}
                className={styles.screenshot}
              />
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}
