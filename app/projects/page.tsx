import type { Metadata } from 'next';
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
    <main className={styles.main}>
      <h1>Projects</h1>
      <section className={styles.section}>
        <h2>Public</h2>
        {publicRepos.map((repo) => (
          <article key={repo.full_name} className={styles.card}>
            <h3><a href={repo.html_url} className={styles.repoName}>{repo.full_name}</a></h3>
            <p>{repo.description}</p>
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
            {screenshots.map((src) => (
              <img key={src} src={src} alt={`${title} screenshot`} />
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}
